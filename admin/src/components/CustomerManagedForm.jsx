import React, { useState, useEffect } from "react";
import { Search, Edit, Trash2, History } from "lucide-react";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import * as api from "../api/customer";

const CustomerManagedForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.fetchCustomers();
        setCustomers(data);
    
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("There was an issue fetching customers.");
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = (customerId) => {
    Swal.fire({
      maxWidth: "100%",
      height: "100%",
      title: "Are you sure?",
      text: "This customer will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#5CAF90",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .deleteCustomer(customerId)
          .then(() => {
            setCustomers(
              customers.filter((customer) => customer.idCustomer !== customerId)
            );
            toast.success("Customer deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting customer:", error);
            toast.error("There was an issue deleting the customer.");
          });
      }
    });
  };

  const handleEdit = (customerId) => {
    const customer = customers.find(
      (customer) => customer.idCustomer === customerId
    );
    if (!customer) return;

    Swal.fire({
      maxWidth: "100%",
      height: "100%",
      html: `
      <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
        <h3 class="pt-5 text-xl font-bold text-left">Edit Customer Information</h3>
        <button id="close-modal" class="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-xl text-gray-600">
          &times;
        </button>
        <div class="space-y-4 mt-6">
          <div>
            <label class="block text-sm font-medium text-left mb-2">Customer Name:</label>
            <input id="name" class="w-full px-3 py-2 border rounded-md" value="${
              customer.Full_Name || ""
            }" placeholder="Enter Name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">Customer Email:</label>
            <input id="email" class="w-full px-3 py-2 border rounded-md" value="${
              customer.Email || ""
            }" placeholder="Enter Email" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
            <input id="phone" class="w-full px-3 py-2 border rounded-md" value="${
              customer.Mobile_No || ""
            }" placeholder="Enter Phone Number" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">Customer Address:</label>
            <input id="address" class="w-full px-3 py-2 border rounded-md" value="${
              customer.Address || ""
            }" placeholder="Enter Address" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">City:</label>
            <input id="city" class="w-full px-3 py-2 border rounded-md" value="${
              customer.City || ""
            }" placeholder="Enter City" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">Country:</label>
            <input id="country" class="w-full px-3 py-2 border rounded-md" value="${
              customer.Country || ""
            }" placeholder="Enter Country" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">New Password:</label>
            <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter New Password" />
          </div>
          <div>
            <label class="block text-sm font-medium text-left mb-2">Status:</label>
            <select id="status" class="w-full px-3 py-2 border rounded-md">
              <option value="Active" ${
                customer.Status === "Active" ? "selected" : ""
              }>Active</option>
              <option value="Inactive" ${
                customer.Status === "Inactive" ? "selected" : ""
              }>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      `,
      focusConfirm: false,
      showCancelButton: false,
      confirmButtonText: "Update",
      confirmButtonColor: "#5CAF90",
      preConfirm: () => {
        return {
          full_name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          mobile_no: document.getElementById("phone").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          country: document.getElementById("country").value,
          status: document.getElementById("status").value,
          password: document.getElementById("password").value || undefined,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCustomer = result.value;

        api
          .updateCustomer(customerId, updatedCustomer)
          .then(() => {
            setCustomers(
              customers.map((customer) =>
                customer.idCustomer === customerId
                  ? { ...customer, ...updatedCustomer }
                  : customer
              )
            );
            toast.success("Customer updated successfully");
          })
          .catch((error) => {
            console.error("Error updating customer:", error);
            toast.error("There was an issue updating the customer.");
          });
      }
    });

    document.getElementById("close-modal")?.addEventListener("click", () => {
      Swal.close();
    });
  };

  const handleHistory = async (customerId) => {
    try {
      const history = await api.getCustomerHistory(customerId);

      const orderHtml = `
        <div class="max-h-[70vh] overflow-y-auto px-4">
          <h3 class="text-xl font-bold text-left mt-5 mb-3">Order History</h3>
          <div class="space-y-4">
            ${history.orders
              .map(
                (order) => `
              <div class="p-4 border rounded-lg">
                <p class="font-semibold text-left">Order ID: ${order.idOrder}</p>
                <p class="text-left">Status: ${order.Delivery_Status}</p>
                <p class="text-left">Total Amount: ${order.Total_Amount}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <h3 class="text-xl font-bold text-left mt-6 mb-3">Delivery Addresses</h3>
          <div class="space-y-4 mb-4">
            ${history.deliveryAddresses
              .map(
                (address) => `
              <div class="p-4 border rounded-lg">
                <p class="text-left">Address: ${address.Address}, ${address.City}, ${address.Country}</p>
                <p class="text-left">Phone: ${address.Mobile_No}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      Swal.fire({
        title: "Customer History",
        html: orderHtml,
        maxWidth: "100%",
        height: "100%",
        confirmButtonText: "Close",
        confirmButtonColor: "#5CAF90",
      });
    } catch (error) {
      console.error("Error fetching customer history:", error);
      toast.error("There was an issue fetching the customer history.");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (customer.idCustomer &&
        customer.idCustomer.toString().includes(lowerSearchTerm)) ||
      (customer.Full_Name &&
        customer.Full_Name.toLowerCase().includes(lowerSearchTerm)) ||
      (customer.Email &&
        customer.Email.toLowerCase().includes(lowerSearchTerm)) ||
      (customer.Mobile_No && customer.Mobile_No.includes(lowerSearchTerm))
    );
  });

  return (
    <div className="p-4">
   
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-5 ml-5">
        <h2 className="text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">Customers Details</h2>
      </div>
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        <div className="block w-full overflow-x-auto">
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    ID
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Name
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Email
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Phone
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Created
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Updated
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.idCustomer} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap text-black">
                      {customer.idCustomer}
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
                      {customer.Full_Name}
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">{customer.Email}</td>
                    <td className="p-3 whitespace-nowrap text-black">
                      {customer.Mobile_No}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.Status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
                      {new Date(customer.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(customer.idCustomer)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHistory(customer.idCustomer)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.idCustomer)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="sm:hidden">
            {filteredCustomers.map((customer) => (
              <div key={customer.idCustomer} className="bg-white p-4 border-b">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.Full_Name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {customer.idCustomer}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.Status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {customer.Email}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {customer.Mobile_No}
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  Created: {new Date(customer.created_at).toLocaleDateString()}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEdit(customer.idCustomer)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleHistory(customer.idCustomer)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.idCustomer)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagedForm;
