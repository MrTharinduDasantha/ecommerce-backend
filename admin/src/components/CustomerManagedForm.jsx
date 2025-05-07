import React, { useState, useEffect } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEye, FaEdit, FaSearch, FaHistory } from "react-icons/fa";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as api from "../api/customer";

const CustomerManagedForm = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate(`/dashboard/customer/view-customer/${customerId}`);
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
              <input id="name" class="w-full px-3 py-2 border rounded-md" value="${customer.Full_Name || ""}" placeholder="Enter Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Customer Email:</label>
              <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" value="${customer.Email || ""}" placeholder="Enter Email" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phone" type="tel" class="w-full px-3 py-2 border rounded-md" value="${customer.Mobile_No || ""}" placeholder="Enter Phone Number" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Status:</label>
              <select id="status" class="w-full px-3 py-2 border rounded-md">
                <option value="Active" ${customer.Status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${customer.Status === "Inactive" ? "selected" : ""}>Inactive</option>
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
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#5CAF90]"></div>
          <h2 className="text-base font-bold text-[#1D372E]">Customer Details</h2>
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
                  <th className="py-2 px-3 font-semibold text-xs">ID</th>
                  <th className="py-2 px-3 font-semibold text-xs">Name</th>
                  <th className="py-2 px-3 font-semibold text-xs">Email</th>
                  <th className="py-2 px-3 font-semibold text-xs">Phone</th>
                  <th className="py-2 px-3 font-semibold text-xs">Status</th>
                  <th className="py-2 px-3 font-semibold text-xs">Created</th>
                  <th className="py-2 px-3 font-semibold text-xs">Updated</th>
                  <th className="py-2 px-3 font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.idCustomer}
                    className="border-b border-[#B7B7B7] bg-[#F7FDFF]"
                  >
                    <td className="py-2 px-3 text-xs">{customer.idCustomer}</td>
                    <td className="py-2 px-3 text-xs">{customer.Full_Name}</td>
                    <td className="py-2 px-3 text-xs">{customer.Email}</td>
                    <td className="py-2 px-3 text-xs">{customer.Mobile_No}</td>
                    <td className="py-2 px-3 text-xs">
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
                    <td className="py-2 px-3 text-xs">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {new Date(customer.updated_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleEdit(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Edit Customer"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleHistory(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="View History"
                        >
                          <FaHistory className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.idCustomer)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Delete Customer"
                        >
                          <RiDeleteBin5Fill className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="sm:hidden space-y-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.idCustomer}
                className="bg-[#F7FDFF] p-3 rounded-lg border border-[#B7B7B7]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <div className="font-medium text-[#1D372E] text-xs">
                      {customer.Full_Name}
                    </div>
                    <div className="text-xs text-gray-600">{customer.Email}</div>
                  </div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-black-300 ${
                      customer.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.Status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {customer.Mobile_No}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    Created: {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    Updated: {new Date(customer.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleViewDetails(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    title="View Details"
                  >
                    <FaEye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleEdit(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    title="Edit Customer"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleHistory(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    title="View History"
                  >
                    <FaHistory className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.idCustomer)}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    title="Delete Customer"
                  >
                    <RiDeleteBin5Fill className="w-3 h-3" />
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