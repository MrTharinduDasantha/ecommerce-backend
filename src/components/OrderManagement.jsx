import React, { useState } from "react";
import Swal from "sweetalert2";


const OrderManagement = () => {
  // Sample mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      user_id: 101,
      total_amount: 150.75,
      net_amount: 145.50,
      payment_type: "Credit Card",
      payment_status: "Paid",
      status: "Pending",
      customer_note: "Please deliver after 5 PM.",
      supplier_note: "Ensure safe packaging.",
      created_at: "2025-03-18",
      shipping_address: "123 Main St",
    },
    {
      id: 2,
      user_id: 102,
      total_amount: 95.50,
      net_amount: 90.00,
      payment_type: "PayPal",
      payment_status: "Paid",
      status: "Shipped",
      customer_note: "Leave at the doorstep.",
      supplier_note: "Fragile item, handle with care.",
      created_at: "2025-03-19",
      shipping_address: "456 Oak Ave",
    },
    {
      id: 3,
      user_id: 103,
      total_amount: 200.00,
      net_amount: 190.00,
      payment_type: "Debit Card",
      payment_status: "Paid",
      status: "Delivered",
      customer_note: "Gift wrap it.",
      supplier_note: "Item delivered on time.",
      created_at: "2025-03-17",
      shipping_address: "789 Pine Rd",
    },
  ]);

  // Filter state for filtering orders
  const [filter, setFilter] = useState({
    status: "All",
    date: "",
    customerId: "",
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  // Filter orders based on criteria (status, date, customerId)
  const filteredOrders = orders.filter((order) => {
    return (
      (filter.status === "All" || order.status === filter.status) &&
      (filter.date === "" || order.created_at.startsWith(filter.date)) &&
      (filter.customerId === "" || order.user_id.toString().includes(filter.customerId))
    );
  });

  // Handle status update with SweetAlert
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    Swal.fire({
      title: "Order Updated!",
      text: `Order ${orderId} is now ${newStatus}`,
      icon: "success",
      confirmButtonColor: "#A3FE00",
    });
  };

  return (
    <div className="ordre-management-container">
      <h1 className="ordre-management-h1">Order Management</h1>

      {/* Search Filters */}
      <div className="ordre-management-filter-container">
        <input
          type="text"
          name="customerId"
          value={filter.customerId}
          onChange={handleFilterChange}
          placeholder="🔍 Search by User ID"
        />

        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
        />

        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
        >
          <option value="All">📌 All Statuses</option>
          <option value="Pending">🟡 Pending</option>
          <option value="Shipped">🚚 Shipped</option>
          <option value="Delivered">✅ Delivered</option>
          <option value="Cancelled">❌ Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <table className="ordre-management-table">
        <thead>
          <tr>
          <th>Order ID</th>
            <th>User ID</th>
            <th>Total Amount</th>
            <th>Net Amount</th>
            <th>Payment Type</th>
            <th>Payment Status</th>
            <th>Status</th>
            <th>Customer Note</th>
            <th>Supplier Note</th>
            <th>Created At</th>
            <th>Shipping Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
           <tr key={order.id}>
           <td>{order.id}</td>
           <td>{order.user_id}</td>
           <td>${order.total_amount}</td>
           <td>${order.net_amount}</td>
           <td>{order.payment_type}</td>
           <td>{order.payment_status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{order.customer_note}</td>
              <td>{order.supplier_note}</td>
              <td>{order.created_at}</td>
              <td>{order.shipping_address}</td>
              <td>
                <button className="ordre-management-button"
                  onClick={() =>
                    Swal.fire({
                      title: "Return/Refund Request",
                      text: `Processing request for Order ${order.id}`,
                      icon: "info",
                      confirmButtonColor: "#A3FE00",
                    })
                  }
                >
                  Return/Refund
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
