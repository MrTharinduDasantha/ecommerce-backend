// src/components/Users.js
import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import * as api from '../api/auth';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.fetchUsers();
        console.log('API Response:', data); // Log the response
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Swal.fire('Error', 'There was an issue fetching users.', 'error');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the user
        api.deleteUser(userId)
          .then(() => {
            setUsers(users.filter((user) => user.idUser !== userId)); // Remove deleted user from state
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
            Swal.fire('Error!', 'There was an issue deleting the user.', 'error');
          });
      }
    });
  };

  const handleEdit = (userId) => {
    const user = users.find((user) => user.idUser === userId);
    if (!user) return;
  
    Swal.fire({
      title: 'Edit User',
      html: `
        <input id="name" class="swal2-input" value="${user.Full_Name}" placeholder="Enter Name">
        <input id="email" class="swal2-input" value="${user.Email}" placeholder="Enter Email">
        <input id="phone" class="swal2-input" value="${user.Phone_No}" placeholder="Enter Phone Number">
        <select id="status" class="swal2-input">
          <option value="Active" ${user.Status === 'Active' ? 'selected' : ''}>Active</option>
          <option value="Inactive" ${user.Status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const status = document.getElementById('status').value;
  
        // Validate inputs
        if (!name || !email || !phone) {
          Swal.showValidationMessage('All fields are required');
        }
  
        return { full_name: name, email, phone_no: phone, status };  // Ensure data is correctly structured
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = result.value;
  
        // Send the updated data to backend
        api.updateUser(userId, updatedUser)
          .then(() => {
            setUsers(users.map((user) => 
              user.idUser === userId ? { ...user, ...updatedUser } : user
            ));
            Swal.fire('Updated!', 'The user details have been updated.', 'success');
          })
          .catch((error) => {
            console.error('Error updating user:', error);
            Swal.fire('Error!', 'There was an issue updating the user.', 'error');
          });
      }
    });
  };
  

  const handleAddUser = () => {
    Swal.fire({
      title: 'Add New User',
      html: `
        <input id="name" class="swal2-input" placeholder="Enter Name">
        <input id="email" class="swal2-input" placeholder="Enter Email">
        <input id="password" type="password" class="swal2-input" placeholder="Enter Password">
        <input id="phone" class="swal2-input" placeholder="Enter Phone Number">
        <select id="status" class="swal2-input">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const status = document.getElementById('status').value;
  
        // Validate inputs
        if (!name || !email || !password || !phone) {
          Swal.showValidationMessage('All fields are required');
          return false; // Prevent form submission if validation fails
        }
  
        return { full_name: name, email, password, phone_no: phone, status };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newUser = result.value;
  
        // Make sure the URL is correct (e.g., localhost:9000)
        api.addUser(newUser)
          .then((response) => {
            console.log(response); // Check the response in the console
            setUsers([...users, { id: response.id, ...newUser }]); // Update the state with the new user
            Swal.fire('User Added', 'The user has been successfully added!', 'success');
          })
          .catch((error) => {
            console.error('Error adding user:', error.response || error); // Log the error to understand what went wrong
            Swal.fire('Error', 'There was an issue adding the user', 'error');
          });
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Users</h2>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaUserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.Full_Name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <tr key={user.idUser} className="border-b">
                  <td className="p-3">{user.Full_Name}</td>
                  <td className="p-3">{user.Email}</td>
                  <td className="p-3">{user.Phone_No}</td>
                  <td className="p-3">{user.Status}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(user.idUser)}
                      className="text-yellow-500"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.idUser)}
                      className="text-red-500"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
