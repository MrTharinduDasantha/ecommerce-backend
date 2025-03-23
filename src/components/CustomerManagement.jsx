import React, { useState } from "react";
import Swal from "sweetalert2";

const CustomerManagement = () => {
  // Sample customer data
  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      firstName: "John", 
      fullName: "John Doe", 
      address: "123 Main St", 
      city: "New York", 
      country: "USA", 
      phoneNo: "123-456-7890", 
      status: "Active", 
      email: "john@example.com" 
    },
    { 
      id: 2, 
      firstName: "Jane", 
      fullName: "Jane Smith", 
      address: "456 Oak Ave", 
      city: "Los Angeles", 
      country: "USA", 
      phoneNo: "987-654-3210", 
      status: "Disabled", 
      email: "jane@example.com" 
    },
    { 
      id: 3, 
      firstName: "Michael", 
      fullName: "Michael Lee", 
      address: "789 Pine Rd", 
      city: "Chicago", 
      country: "USA", 
      phoneNo: "555-123-4567", 
      status: "Active", 
      email: "michael@example.com" 
    },
  ]);

  // Handle enable/disable toggle
  const toggleCustomerStatus = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId ? { ...customer, status: customer.status === "Active" ? "Disabled" : "Active" } : customer
      )
    );

    Swal.fire({
      title: "Status Updated!",
      text: `Customer ${customerId} status changed.`,
      icon: "success",
      confirmButtonColor: "#A3FE00",
    });
  };

  return (
    <div className="customer-management-container">
      <h1 className="customer-management-h1">Customer Management</h1>

      {/* Customer Table */}
      <table className="customer-management-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Full Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.firstName}</td>
              <td>{customer.fullName}</td>
              <td>{customer.address}</td>
              <td>{customer.city}</td>
              <td>{customer.country}</td>
              <td>{customer.phoneNo}</td>
              <td>{customer.status}</td>
              <td>{customer.email}</td>
              <td>
                <button 
                  className="customer-management-button" 
                  onClick={() => toggleCustomerStatus(customer.id)}
                >
                  {customer.status === "Active" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
