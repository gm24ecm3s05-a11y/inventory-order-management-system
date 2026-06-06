from pydantic import BaseModel, EmailStr

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock: int

class ProductResponse(ProductCreate):
    id: int
    class Config:
        from_attributes = True

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None

class CustomerResponse(CustomerCreate):
    id: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_amount: float
    class Config:
        from_attributes = True