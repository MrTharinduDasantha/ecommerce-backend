import React, { useState } from 'react';
import { FaUserPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual data from your backend
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      orders: 5,
      totalSpent: '$599.99',
      status: 'Active',
    },
  ]);

  // Function to show the SweetAlert2 popup form
  const handleAddCustomer = async () => {
    const { value } = await MySwal.fire({
      title: 'Add New Customer',
      html: `
        <input id="name" class="swal2-input" placeholder="Full Name">
        <input id="email" type="email" class="swal2-input" placeholder="Email">
        <input id="phone" class="swal2-input" placeholder="Phone Number">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Customer',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!name || !email || !phone) {
          Swal.showValidationMessage('All fields are required!');
          return false;
        }

        return { name, email, phone };
      },
    });

    if (value) {
      const newCustomer = {
        id: customers.length + 1,
        name: value.name,
        email: value.email,
        phone: value.phone,
        orders: 0,
        totalSpent: '$0.00',
        status: 'Active',
      };

      setCustomers([...customers, newCustomer]);
      Swal.fire('Success!', 'Customer added successfully!', 'success');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={handleAddCustomer} // Attach the function here
        >
          <FaUserPlus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.orders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
