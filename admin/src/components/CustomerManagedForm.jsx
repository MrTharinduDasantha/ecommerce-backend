import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import * as api from '../api/auth'; // Adjusted API import for customers

const CustomerManagedForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]); // Renamed users to customers

  // Fetch data from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.fetchCustomers();
        console.log('API Response:', data); // Log the response
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        Swal.fire('Error', 'There was an issue fetching customers.', 'error');
      }
    };

    fetchCustomers(); // Corrected function name to fetchCustomers
  }, []);

  const handleDelete = (customerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This customer will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete the customer
        api.deleteCustomer(customerId)
          .then(() => {
            setCustomers(customers.filter((customer) => customer.idCustomer !== customerId)); // Remove deleted customer from state
            Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting customer:', error);
            Swal.fire('Error!', 'There was an issue deleting the customer.', 'error');
          });
      }
    });
  };

  const handleEdit = (customerId) => {
    const customer = customers.find((customer) => customer.idCustomer === customerId);
    if (!customer) return;
  
    Swal.fire({
      title: 'Edit Customer',
      html: `
        <input id="name" class="swal2-input" value="${customer.Full_Name}" placeholder="Enter Name">
        <input id="email" class="swal2-input" value="${customer.Email}" placeholder="Enter Email">
        <input id="phone" class="swal2-input" value="${customer.Mobile_No}" placeholder="Enter Phone Number">
        <select id="status" class="swal2-input">
          <option value="Active" ${customer.Status === 'Active' ? 'selected' : ''}>Active</option>
          <option value="Inactive" ${customer.Status === 'Inactive' ? 'selected' : ''}>Inactive</option>
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
        const updatedCustomer = result.value;
  
        // Send the updated data to backend
        api.updateCustomer(customerId, updatedCustomer)
          .then(() => {
            setCustomers(customers.map((customer) => 
              customer.idCustomer === customerId ? { ...customer, ...updatedCustomer } : customer
            ));
            Swal.fire('Updated!', 'The customer details have been updated.', 'success');
          })
          .catch((error) => {
            console.error('Error updating customer:', error);
            Swal.fire('Error!', 'There was an issue updating the customer.', 'error');
          });
      }
    });
  };

  // Updated search logic
  const filteredCustomers = customers.filter((customer) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
  
    return (
      (customer.idCustomer && customer.idCustomer.toString().includes(lowerSearchTerm)) || // Check if idCustomer exists before calling .includes
      (customer.Full_Name && customer.Full_Name.toLowerCase().includes(lowerSearchTerm)) || // Check if Full_Name exists before calling .toLowerCase
      (customer.Email && customer.Email.toLowerCase().includes(lowerSearchTerm)) || // Check if Email exists before calling .toLowerCase
      (customer.Mobile_No && customer.Mobile_No.includes(lowerSearchTerm)) // Check if Mobile_No exists before calling .includes
    );
  });
  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, Name, Email, or Phone..."
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
              <th className="p-3 text-left">Customer ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.idCustomer} className="border-b">
                <td className="p-3">{customer.idCustomer}</td>
                <td className="p-3">{customer.Full_Name}</td>
                <td className="p-3">{customer.Email}</td>
                <td className="p-3">{customer.Mobile_No}</td>
                <td className="p-3">{customer.Status}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(customer.idCustomer)}
                    className="text-yellow-500"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.idCustomer)}
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

export default CustomerManagedForm;
