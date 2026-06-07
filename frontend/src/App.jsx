import { useState } from "react";
import "./App.css";

function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [product, setProduct] = useState({ name: "", sku: "", price: "", stock: "" });
  const [order, setOrder] = useState({ customer_id: "", product_id: "", quantity: "" });

  const addCustomer = (e) => {
    e.preventDefault();
    setCustomers([...customers, { id: Date.now(), ...customer }]);
    setCustomer({ name: "", email: "", phone: "" });
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    setOrders(orders.filter((o) => o.customer_id !== id));
  };

  const addProduct = (e) => {
    e.preventDefault();
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: product.name,
        sku: product.sku,
        price: Number(product.price),
        stock: Number(product.stock),
      },
    ]);
    setProduct({ name: "", sku: "", price: "", stock: "" });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setOrders(orders.filter((o) => o.product_id !== id));
  };

  const addOrder = (e) => {
    e.preventDefault();

    const selectedProduct = products.find((p) => p.id === Number(order.product_id));
    if (!selectedProduct) return;

    const qty = Number(order.quantity);
    if (qty > selectedProduct.stock) return;

    setOrders([
      ...orders,
      {
        id: Date.now(),
        customer_id: Number(order.customer_id),
        product_id: Number(order.product_id),
        quantity: qty,
        total_amount: selectedProduct.price * qty,
      },
    ]);

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id ? { ...p, stock: p.stock - qty } : p
      )
    );

    setOrder({ customer_id: "", product_id: "", quantity: "" });
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <div className="container">
      <h1>📦 Inventory & Order Management System</h1>

      <div className="card">
        <h2>Add Customer</h2>
        <form onSubmit={addCustomer}>
          <input placeholder="Customer Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
          <input placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
          <input placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          <button type="submit">Add Customer</button>
        </form>
      </div>

      <h2>Customers</h2>
      <table>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td><button onClick={() => deleteCustomer(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={addProduct}>
          <input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
          <input placeholder="SKU" value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} required />
          <input placeholder="Price" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
          <input placeholder="Stock" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} required />
          <button type="submit">Add Product</button>
        </form>
      </div>

      <h2>Products</h2>
      <table>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td><button onClick={() => deleteProduct(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card">
        <h2>Create Order</h2>
        <form onSubmit={addOrder}>
          <select value={order.customer_id} onChange={(e) => setOrder({ ...order, customer_id: e.target.value })} required>
            <option value="">Select Customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={order.product_id} onChange={(e) => setOrder({ ...order, product_id: e.target.value })} required>
            <option value="">Select Product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} - Stock {p.stock}</option>)}
          </select>

          <input placeholder="Quantity" type="number" value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} required />
          <button type="submit">Create Order</button>
        </form>
      </div>

      <h2>Orders</h2>
      <table>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.customer_id}</td>
              <td>{o.product_id}</td>
              <td>{o.quantity}</td>
              <td>{o.total_amount}</td>
              <td><button onClick={() => deleteOrder(o.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;