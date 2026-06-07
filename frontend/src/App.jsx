import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://inventory-order-management-system-iu6l.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [product, setProduct] = useState({ name: "", sku: "", price: "", stock: "" });
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [order, setOrder] = useState({ customer_id: "", product_id: "", quantity: "" });

  const loadData = async () => {
    setProducts((await axios.get(`${API}/products`)).data);
    setCustomers((await axios.get(`${API}/customers`)).data);
    setOrders((await axios.get(`${API}/orders`)).data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/products`, {
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      stock: Number(product.stock),
    });
    setProduct({ name: "", sku: "", price: "", stock: "" });
    loadData();
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/customers`, customer);
    setCustomer({ name: "", email: "", phone: "" });
    loadData();
  };

  const addOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/orders`, {
        customer_id: Number(order.customer_id),
        product_id: Number(order.product_id),
        quantity: Number(order.quantity),
      });
      setOrder({ customer_id: "", product_id: "", quantity: "" });
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Order failed");
    }
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

  const addDemoCustomers = async () => {
    const demoCustomers = [
      { name: "Prathmesh Gawande", email: "prathmesh@example.com", phone: "9876543210" },
      { name: "Madhav Gawande", email: "madhav@example.com", phone: "9766733164" },
      { name: "Rohit Patil", email: "rohit@example.com", phone: "9988776655" },
      { name: "Sanket Shinde", email: "sanket@example.com", phone: "9123456789" },
      { name: "Akash Deshmukh", email: "akash@example.com", phone: "9012345678" },
    ];

    for (const customer of demoCustomers) {
      try {
        await axios.post(`${API}/customers`, customer);
      } catch (error) {
        console.log("Customer already exists");
      }
    }

    loadData();
  };

  return (
    <div className="container">
      <h1>📦 Inventory & Order Management System</h1>

      <button onClick={addDemoCustomers} className="demo-btn">
        Add 5 Demo Customers
      </button>

      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
          <input placeholder="SKU" value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} required />
          <input placeholder="Price" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
          <input placeholder="Stock" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} required />
          <button>Add Product</button>
        </form>
      </div>

      <div className="card">
        <h2>Add Customer</h2>
        <form onSubmit={addCustomer}>
          <input placeholder="Customer Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
          <input placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <button>Add Customer</button>
        </form>
      </div>

      <div className="card">
        <h2>Create Order</h2>
        <form onSubmit={addOrder}>
          <select value={order.customer_id} onChange={(e) => setOrder({ ...order, customer_id: e.target.value })} required>
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={order.product_id} onChange={(e) => setOrder({ ...order, product_id: e.target.value })} required>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - Stock {p.stock}</option>
            ))}
          </select>

          <input placeholder="Quantity" type="number" value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} required />
          <button>Create Order</button>
        </form>
      </div>

      <h2>Products</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>{p.sku}</td><td>{p.price}</td><td>{p.stock}</td>
              <td><button onClick={() => deleteProduct(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Customers</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td>
              <td><button onClick={() => deleteCustomer(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Orders</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Customer ID</th><th>Product ID</th><th>Quantity</th><th>Total</th><th>Action</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.customer_id}</td><td>{o.product_id}</td><td>{o.quantity}</td><td>{o.total_amount}</td>
              <td><button onClick={() => deleteOrder(o.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;