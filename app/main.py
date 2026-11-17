import os
import json
from contextlib import asynccontextmanager

import redis

from fastapi import FastAPI
from pydantic import BaseModel

from app.database.connection import get_db
from app.routers.products import router as products_router


# CONFIGURACOES REDIS

REDIS_HOST = os.getenv("REDIS_HOST", "redis")

cache = redis.Redis(
    host=REDIS_HOST,
    port=6379,
    decode_responses=True
)




# INICIALIZACAO


@asynccontextmanager
async def lifespan(app: FastAPI):

    with get_db() as conn:

        # TABELA ANTIGA DE ITENS
        conn.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL
            )
        """)

        # NOVA TABELA DE PRODUTOS
        conn.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description VARCHAR(500),
                price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
                quantity INTEGER NOT NULL CHECK (quantity >= 0),
                category VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

    yield



app = FastAPI(
    title="Python Docker Lab",
    description="API com Python, Redis e PostgreSQL",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(products_router)

# MODELO DE DADOS

class Item(BaseModel):
    name: str


# ROTA PRINCIPAL

@app.get("/")
def root():
    return {
        "message": "Python + Redis + PostgreSQL funcionando!"
    }


# HEALTHCHECK

@app.get("/health")
def health():

    cache.ping()

    with get_db() as conn:
        conn.execute("SELECT 1")

    return {
        "status": "healthy"
    }


# CADASTRAR ITEM

@app.post("/items")
def create_item(item: Item):

    with get_db() as conn:
        result = conn.execute(
            """
            INSERT INTO items (name)
            VALUES (%s)
            RETURNING id, name
            """,
            (item.name,)
        )

        created = result.fetchone()

    cache.delete("items")

    return {
        "id": created[0],
        "name": created[1]
    }


# LISTAR ITENS

@app.get("/items")
def list_items():

    cached = cache.get("items")

    if cached:
        return {
            "source": "redis",
            "items": json.loads(cached)
        }

    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, name
            FROM items
            ORDER BY id
            """
        ).fetchall()

    items = [
        {
            "id": row[0],
            "name": row[1]
        }
        for row in rows
    ]

    cache.setex(
        "items",
        30,
        json.dumps(items)
    )

    return {
        "source": "postgresql",
        "items": items
    }