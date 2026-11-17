from decimal import Decimal

from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
        description="Nome do produto"
    )
    
    description: str | None = Field(
        default=None,
        max_length=500
    )
    
    price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2
    )
    
    quantity: int = Field(
        ge=0
    )
    
    category: str = Field(
        min_length=2,
        max_length=100
    )

class ProductResponse(ProductCreate):
    id: int
