import React, { useState, useEffect } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEye, FaEdit, FaSearch, FaHistory } from "react-icons/fa";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import * as api from "../api/customer"; // Adjust the import path as necessary

const CustomerManagedForm = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await api.fetchCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
      setLoading(false);
    }
  };

  const handleViewDetails = (customerId) => {
    console.log("Viewing details for customer ID:", customerId); // Debugging line
    navigate(`/dashboard/customer/view-customer/${customerId}`); // Navigate to detail view
  };

  const handleEdit = (customerId) => {
    const customer = customers.find((c) => c.idCustomer === customerId);
    if (!customer) return;

    Swal.fire({
      maxWidth: "100%",
      height: "100%",
      html: `
        <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
          <h4 class="pt-5 text-xl font-bold text-left">Edit Customer Information</h4>
          <button id="close-modal" class="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-xl text-gray-600">×</button>
          <div class="space-y-4 mt-6">
            <div>
              <label class="block text-sm font-medium text-left mb-2">Customer Name:</label>
              <input id="name" class="w-full px-3 py-2 border rounded-md" value="${
                customer.Full_Name || ""
              }" placeholder="Enter Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Customer Email:</label>
              <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" value="${
                customer.Email || ""
              }" placeholder="Enter Email" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phone" type="tel" class="w-full px-3 py-2 border rounded-md" value="${
                customer.Mobile_No || ""
              }" placeholder="Enter Phone Number" />
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
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#6B7280",
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const mobileNo = document.getElementById("phone").value;
        const status = document.getElementById("status").value;

        const errors = [];

        if (!name) {
          errors.push("Customer Name is required.");
        }
        if (!email) {
          errors.push("Customer Email is required.");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          errors.push("Enter a valid email address.");
        }
        if (!/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(mobileNo)) {
          errors.push("Enter a valid phone number.");
        }

        if (errors.length > 0) {
          Swal.showValidationMessage(errors.join(" "));
          return false;
        }

        return {
          full_name: name,
          email: email,
          mobile_no: mobileNo,
          status: status,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedCustomer = result.value;
        try {
          await api.updateCustomer(customerId, updatedCustomer);
          setCustomers((prevCustomers) =>
            prevCustomers.map((c) =>
              c.idCustomer === customerId ? { ...c, ...updatedCustomer } : c
            )
          );

          toast.success("Customer updated successfully");
        } catch (error) {
          console.error("Error updating customer:", error);
          toast.error("There was an issue updating the customer.");
        }
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

  const handleDelete = (customerId) => {
    const customer = customers.find((c) => c.idCustomer === customerId);
    if (!customer) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This customer will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteCustomer(customerId);
          setCustomers(customers.filter((c) => c.idCustomer !== customerId));
          toast.success("Customer deleted successfully");
        } catch (error) {
          console.error("Error deleting customer:", error);
          toast.error("There was an issue deleting the customer.");
        }
      }
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CAF90]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#5CAF90]"></div>
          <h2 className="text-base  font-bold text-[#1D372E]">Customer Details</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex w-full md:max-w-xl md:mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <FaSearch className="text-muted-foreground text-[#1D372E]" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, Name, Email, or Phone..."
              className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]">
              Search
            </button>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          <div className="hidden sm:block">
            <table className="table min-w-[700px] text-center border border-[#B7B7B7]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#B7B7B7]">
                  <th className="font-semibold p-3 w-[20%] text-sm">ID</th>
                  <th className="font-semibold p-3 w-[50%] text-sm">Name</th>
                  <th className="font-semibold p-3 w-[50%] text-sm">Email</th>
                  <th className="font-semibold p-3 w-[20%] text-sm">Phone</th>
                  <th className="font-semibold p-3 w-[20%] text-sm">Status</th>
                  <th className="font-semibold p-3 w-[20%] text-sm">Created</th>
                  <th className="font-semibold p-3 w-[20%] text-sm">Updated</th>
                  <th className="font-semibold p-3 w-[10%] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.idCustomer}
                    className="border-b border-[#B7B7B7] bg-[#F7FDFF]"
                  >
                    <td className="p-5 text-xs">{customer.idCustomer}</td>
                    <td className="p-5 text-xs">{customer.Full_Name}</td>
                    <td className="p-5 text-xs">{customer.Email}</td>
                    <td className="p-5 text-xs">{customer.Mobile_No}</td>
                    <td className="p-5 text-xs">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-black-300 ${
                          customer.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.Status}
                      </span>
                    </td>
                    <td className="p-5 text-xs">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-xs">
                      {new Date(customer.updated_at).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-xs">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleHistory(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                        >
                          <FaHistory />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                        >
                          <RiDeleteBin5Fill />
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
                    onClick={() => handleViewDetails(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    title="View Details"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleHistory(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                  >
                    <FaHistory className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                  >
                    <RiDeleteBin5Fill className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default CustomerManagedForm;
