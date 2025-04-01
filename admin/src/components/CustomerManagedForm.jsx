import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrashAlt, FaHistory } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import * as api from '../api/customer'; // Adjusted API import for customers

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
      confirmButtonColor: '#5CAF90', // Set custom color for the confirm button
      cancelButtonColor: '#5CAF90',  // Set custom color for the cancel button
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
      width: '600px',
      height: 'auto',
      html: `
      <div style="position: relative; max-height: 400px; overflow-y: auto;">
  <h3 style="padding-top: 20px; font-size: 20px; font-weight: bold; text-align: left;">
    Edit Customer Information
  </h3>

  <!-- Close Icon -->
  <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; cursor: pointer; font-size: 18px; color: #333;">
    &times;
  </button>

  <label for="name" style=" margin-top: 20px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Customer Name:</label>
  <input id="name" class="swal2-input" value="${customer.Full_Name || ''}" placeholder="Enter Name" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="email" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Customer Email:</label>
  <input id="email" class="swal2-input" value="${customer.Email || ''}" placeholder="Enter Email" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="phone" style="margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Phone Number:</label>
  <input id="phone" class="swal2-input" value="${customer.Mobile_No || ''}" placeholder="Enter Phone Number" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="address" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Customer Address:</label>
  <input id="address" class="swal2-input" value="${customer.Address || ''}" placeholder="Enter Address" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="city" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">City:</label>
  <input id="city" class="swal2-input" value="${customer.City || ''}" placeholder="Enter City" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="country" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Country:</label>
  <input id="country" class="swal2-input" value="${customer.Country || ''}" placeholder="Enter Country" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="password" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">New Password (Leave Blank if Unchanged):</label>
  <input id="password" type="password" class="swal2-input" placeholder="Enter New Password" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

  <label for="status" style=" margin-top: 10px; display: block; font-size: 16px;  text-align: left; font-medium; margin-bottom: 8px;">Change Status:</label>
  <select id="status" class="swal2-input" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;">
    <option value="Active" ${customer.Status === 'Active' ? 'selected' : ''}>Active</option>
    <option value="Inactive" ${customer.Status === 'Inactive' ? 'selected' : ''}>Inactive</option>
  </select>
</div>

      `,
      focusConfirm: false,
      showCancelButton: false, // Removed cancel button
      confirmButtonText: 'Update', // Changed the button text to Update
      confirmButtonColor: '#5CAF90', // Set color for the update button
      preConfirm: () => {
        const full_name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobile_no = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;
        const password = document.getElementById('password').value;
        const status = document.getElementById('status').value;

        return { 
          full_name, 
          email, 
          mobile_no, 
          address, 
          city, 
          country, 
          status, 
          password: password || undefined  // Send password only if it's updated
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCustomer = result.value;

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

    // Close modal when clicking the close icon
    document.getElementById('close-modal')?.addEventListener('click', () => {
      Swal.close();
    });
  };

  const handleHistory = async (customerId) => {
    try {
      const history = await api.getCustomerHistory(customerId);
  
      // Display order and delivery details in SweetAlert2 modal
      let orderHtml = '<h3 style="font-size: 20px; font-weight: bold; text-align: left; margin-top: 20px; margin-bottom: 10px;">Order History</h3>';
      history.orders.forEach(order => {
        orderHtml += `<p style="margin-bottom: 8px; font-weight: semibold; text-align: left; ">Order ID: ${order.idOrder}<br/>Status: ${order.Delivery_Status}<br/>Total Amount: ${order.Total_Amount}</p>`;
      });
  
      let deliveryHtml = '<h3 style="font-size: 20px; font-weight: bold; text-align: left; margin-top: 20px; margin-bottom: 10px;">Delivery Address</h3>';
      history.deliveryAddresses.forEach(address => {
        deliveryHtml += `<p style="margin-bottom: 8px; text-align: left;">Address: ${address.Address}, ${address.City}, ${address.Country}<br/>Phone: ${address.Mobile_No}</p>`;
      });
  
      Swal.fire({
        title: 'Customer History',
        html: orderHtml + deliveryHtml,
        width: '600px',
        confirmButtonText: 'Close',
        confirmButtonColor: '#5CAF90', // Custom color for the Close button
      });
    } catch (error) {
      console.error('Error fetching customer history:', error);
      Swal.fire('Error!', 'There was an issue fetching the customer history.', 'error');
    }
  };
  
  // Updated search logic
  const filteredCustomers = customers.filter((customer) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      (customer.idCustomer && customer.idCustomer.toString().includes(lowerSearchTerm)) ||
      (customer.Full_Name && customer.Full_Name.toLowerCase().includes(lowerSearchTerm)) ||
      (customer.Email && customer.Email.toLowerCase().includes(lowerSearchTerm)) ||
      (customer.Mobile_No && customer.Mobile_No.includes(lowerSearchTerm))
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
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Updated At</th>
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
                <td className="p-3">{new Date(customer.created_at).toLocaleString()}</td>
                <td className="p-3">{new Date(customer.updated_at).toLocaleString()}</td>
                <td className="p-3">
              
                  <button
                    onClick={() => handleEdit(customer.idCustomer)}
                    className="text-yellow-500 hover:underline "
                  >
                    <FaEdit /> 
                  </button>
                  <button
                    onClick={() => handleHistory(customer.idCustomer)}
                    className="text-blue-500 hover:underline mx-3"
                  >
                    <FaHistory /> 
                  </button>
                  <button
                    onClick={() => handleDelete(customer.idCustomer)}
                    className="text-red-500 hover:underline"
                  >
                    <FaTrashAlt /> 
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
