import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://your-backend-url.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [product, setProduct] = useState({ name: "", sku: "", price: "", stock: "" });
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [order, setOrder] = useState({ customer_id: "", product_id: "", quantity: "" });

  const loadData = async () => {
    try {
      const productsRes = await axios.get(`${API}/products`);
      const customersRes = await axios.get(`${API}/customers`);
      const ordersRes = await axios.get(`${API}/orders`);

      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.log("Backend Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCustomer = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/customers`, customer);
      setCustomer({ name: "", email: "", phone: "" });
      loadData();
    } catch (err) {
      console.log("Customer Add Error:", err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API}/customers/${id}`);
      loadData();
    } catch (err) {
      console.log("Customer Delete Error:", err);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/products`, {
        name: product.name,
        sku: product.sku,
        price: Number(product.price),
        stock: Number(product.stock),
      });

      setProduct({ name: "", sku: "", price: "", stock: "" });
      loadData();
    } catch (err) {
      console.log("Product Add Error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`);
      loadData();
    } catch (err) {
      console.log("Product Delete Error:", err);
    }
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
      console.log("Order Add Error:", err);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API}/orders/${id}`);
      loadData();
    } catch (err) {
      console.log("Order Delete Error:", err);
    }
  };

  return (
    <div className="container">
      <h1>📦 Inventory & Order Management System</h1>

      <div className="card">
        <h2>Add Customer</h2>
        <form onSubmit={addCustomer}>
          <input
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            required
          />

          <input
            placeholder="Email"
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            required
          />

          <input
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          />

          <button type="submit">Add Customer</button>
        </form>
      </div>

      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button onClick={() => deleteCustomer(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />

          <input
            placeholder="SKU"
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value })}
            required
          />

          <input
            placeholder="Price"
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />

          <input
            placeholder="Stock"
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            required
          />

          <button type="submit">Add Product</button>
        </form>
      </div>

      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card">
        <h2>Create Order</h2>
        <form onSubmit={addOrder}>
          <select
            value={order.customer_id}
            onChange={(e) => setOrder({ ...order, customer_id: e.target.value })}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={order.product_id}
            onChange={(e) => setOrder({ ...order, product_id: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - Stock {p.stock}
              </option>
            ))}
          </select>

          <input
            placeholder="Quantity"
            type="number"
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
            required
          />

          <button type="submit">Create Order</button>
        </form>
      </div>

      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer_id}</td>
              <td>{o.product_id}</td>
              <td>{o.quantity}</td>
              <td>{o.total_amount}</td>
              <td>
                <button onClick={() => deleteOrder(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;