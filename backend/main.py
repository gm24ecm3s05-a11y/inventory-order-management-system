from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, SessionLocal
import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "API Running"}

@app.post("/products", response_model=schemas.ProductResponse)
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    if db.query(models.Product).filter(models.Product.sku == product.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")

    item = models.Product(**product.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.get("/products", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(item)
    db.commit()
    return {"message": "Product deleted"}

@app.post("/customers", response_model=schemas.CustomerResponse)
def add_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    if db.query(models.Customer).filter(models.Customer.email == customer.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    item = models.Customer(**customer.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@app.get("/customers", response_model=list[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(item)
    db.commit()
    return {"message": "Customer deleted"}

@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if product.stock < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    total = product.price * order.quantity
    product.stock -= order.quantity

    new_order = models.Order(
        customer_id=order.customer_id, 
        product_id=order.product_id,
        quantity=order.quantity,
        total_amount=total
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/orders", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()

@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Order not found")

    db.delete(item)
    db.commit()
    return {"message": "Order deleted"} 