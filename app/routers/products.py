
import json
import os

import redis

from fastapi import APIRouter, HTTPException, Response, status

from app.database.connection import get_db
from app.schemas.product import ProductCreate, ProductResponse

# CONFIGURACAO REDIS

cache = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379,
    decode_responses=True
)

# CRIACAO DO ROUTER

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# CADASTRAR PRODUTO

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_product(product: ProductCreate):

    with get_db() as conn:

        result = conn.execute(
            """
            INSERT INTO products
                (name, description, price, quantity, category)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, name, description, price, quantity, category
            """,
            (
                product.name,
                product.description,
                product.price,
                product.quantity,
                product.category
            )
        )

        created = result.fetchone()

    cache.delete("products")

    return {
        "id": created[0],
        "name": created[1],
        "description": created[2],
        "price": created[3],
        "quantity": created[4],
        "category": created[5]
    }

# LISTAR PRODUTOS

@router.get("/", response_model=list[ProductResponse])
def list_products():

    cached = cache.get("products")

    if cached:
        return json.loads(cached)

    with get_db() as conn:

        rows = conn.execute(
            """
            SELECT id, name, description,
                   price::text, quantity, category
            FROM products
            ORDER BY id
            """
        ).fetchall()

    products = [
        {
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": row[3],
            "quantity": row[4],
            "category": row[5]
        }
        for row in rows
    ]

    cache.setex(
        "products",
        30,
        json.dumps(products)
    )

    return products

# CONSULTAR PRODUTO POR ID

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int):

    with get_db() as conn:

        product = conn.execute(
            """
            SELECT id, name, description,
                   price::text, quantity, category
            FROM products
            WHERE id = %s
            """,
            (product_id,)
        ).fetchone()

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Produto nao encontrado"
        )

    return {
        "id": product[0],
        "name": product[1],
        "description": product[2],
        "price": product[3],
        "quantity": product[4],
        "category": product[5]
    }

# ATUALIZAR PRODUTO

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductCreate):

    with get_db() as conn:

        result = conn.execute(
            """
            UPDATE products
            SET name = %s,
                description = %s,
                price = %s,
                quantity = %s,
                category = %s
            WHERE id = %s
            RETURNING id, name, description,
                      price::text, quantity, category
            """,
            (
                product.name,
                product.description,
                product.price,
                product.quantity,
                product.category,
                product_id
            )
        )

        updated = result.fetchone()

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Produto nao encontrado"
        )

    cache.delete("products")

    return {
        "id": updated[0],
        "name": updated[1],
        "description": updated[2],
        "price": updated[3],
        "quantity": updated[4],
        "category": updated[5]
    }

# EXCLUIR PRODUTO

@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_product(product_id: int):

    with get_db() as conn:

        result = conn.execute(
            """
            DELETE FROM products
            WHERE id = %s
            RETURNING id
            """,
            (product_id,)
        )

        deleted = result.fetchone()

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Produto nao encontrado"
        )

    cache.delete("products")

    return Response(status_code=status.HTTP_204_NO_CONTENT)