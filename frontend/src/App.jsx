import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://inventory-order-management-system-1-rftc.onrender.com";
// local साठी: const API = "http://127.0.0.1:8000";

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [order, setOrder] = useState({
    customer_id: "",
    product_id: "",
    quantity: "",
  });

  const loadData = async () => {
    try {
      setProducts((await axios.get(`${API}/products`)).data);
      setCustomers((await axios.get(`${API}/customers`)).data);
      setOrders((await axios.get(`${API}/orders`)).data);
    } catch (err) {
      alert("Backend connect होत नाही ❌");
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async () => {
    await axios.post(`${API}/products`, {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    });
    setProduct({ name: "", sku: "", price: "", stock: "" });
    loadData();
  };

  const addCustomer = async () => {
    await axios.post(`${API}/customers`, customer);
    setCustomer({ name: "", email: "", phone: "" });
    loadData();
  };

  const addOrder = async () => {
    await axios.post(`${API}/orders`, {
      customer_id: Number(order.customer_id),
      product_id: Number(order.product_id),
      quantity: Number(order.quantity),
    });
    setOrder({ customer_id: "", product_id: "", quantity: "" });
    loadData();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    loadData();
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`${API}/customers/${id}`);
    loadData();
  };

  const deleteOrder = async (id) => {
    await axios.delete(`${API}/orders/${id}`);
    loadData();
  };

  return (
    <div className="container">
      <h1>Inventory Order Management System</h1>

      <section>
        <h2>Add Product</h2>
        <input placeholder="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
        <input placeholder="SKU" value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} />
        <input placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
        <input placeholder="Stock" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
        <button onClick={addProduct}>Add Product</button>
      </section>

      <section>
        <h2>Add Customer</h2>
        <input placeholder="Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
        <input placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        <button onClick={addCustomer}>Add Customer</button>
      </section>

      <section>
        <h2>Add Order</h2>
        <input placeholder="Customer ID" value={order.customer_id} onChange={(e) => setOrder({ ...order, customer_id: e.target.value })} />
        <input placeholder="Product ID" value={order.product_id} onChange={(e) => setOrder({ ...order, product_id: e.target.value })} />
        <input placeholder="Quantity" value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} />
        <button onClick={addOrder}>Add Order</button>
      </section>

      <h2>Products</h2>
      {products.map((p) => (
        <div className="card" key={p.id}>
          {p.id}. {p.name} | SKU: {p.sku} | ₹{p.price} | Stock: {p.stock}
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}

      <h2>Customers</h2>
      {customers.map((c) => (
        <div className="card" key={c.id}>
          {c.id}. {c.name} | {c.email} | {c.phone}
          <button onClick={() => deleteCustomer(c.id)}>Delete</button>
        </div>
      ))}

      <h2>Orders</h2>
      {orders.map((o) => (
        <div className="card" key={o.id}>
          Order ID: {o.id} | Customer ID: {o.customer_id} | Product ID: {o.product_id} | Qty: {o.quantity} | Total: ₹{o.total_amount}
          <button onClick={() => deleteOrder(o.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;