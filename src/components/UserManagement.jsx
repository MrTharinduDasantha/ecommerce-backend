import React, { useState } from "react";
import Swal from "sweetalert2";

const UserManagement = () => {
  // Sample user data with phone numbers
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", status: "Disabled" },
    { id: 3, name: "Michael Lee", email: "michael@example.com", phone: "555-123-4567", status: "Active" },
  ]);

  // Handle enable/disable toggle
  const toggleUserStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Disabled" : "Active" } : user
      )
    );

    Swal.fire({
      title: "Status Updated!",
      text: `User ${userId} status changed.`,
      icon: "success",
      confirmButtonColor: "#A3FE00",
    });
  };

  return (
    <div className="user-management-container">
      <h1 className="user-management-h1">User Management</h1>

      {/* User Table */}
      <table className="user-management-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
              <td>
                <button className="user-management-button" onClick={() => toggleUserStatus(user.id)}>
                  {user.status === "Active" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
