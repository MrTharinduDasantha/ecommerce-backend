import React, { useState, useEffect } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEye, FaEdit, FaSearch, FaHistory } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as api from "../api/customer";

const CustomerManagedForm = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    mobile_no: "",
    status: "Active",
  });
  const [history, setHistory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await api.fetchCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = customers.filter((customer) => {
      return (
        customer.idCustomer?.toString().includes(lowerSearchTerm) ||
        customer.Full_Name?.toLowerCase().includes(lowerSearchTerm) ||
        customer.Email?.toLowerCase().includes(lowerSearchTerm) ||
        customer.Mobile_No?.includes(lowerSearchTerm)
      );
    });
    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  useEffect(() => {
    if (showHistoryModal && selectedCustomer) {
      const fetchHistory = async () => {
        try {
          const data = await api.getCustomerHistory(
            selectedCustomer.idCustomer
          );
          setHistory(data);
        } catch (error) {
          console.error("Error fetching history:", error);
          toast.error("Failed to load history");
        }
      };
      fetchHistory();
    }
  }, [showHistoryModal, selectedCustomer]);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      full_name: customer.Full_Name,
      email: customer.Email,
      mobile_no: customer.Mobile_No,
      status: customer.Status,
    });
    setShowEditModal(true);
  };

  const handleHistory = (customer) => {
    setSelectedCustomer(customer);
    setHistory(null); // Reset history before fetching
    setShowHistoryModal(true);
  };

  const handleDelete = (customerId) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.full_name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!editForm.mobile_no.trim() || !/^\d{10}$/.test(editForm.mobile_no)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    try {
      await api.updateCustomer(selectedCustomer.idCustomer, editForm);
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) =>
          c.idCustomer === selectedCustomer.idCustomer
            ? { ...c, ...editForm }
            : c
        )
      );
      toast.success("Customer updated successfully");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteCustomer(customerToDelete);
      setCustomers(customers.filter((c) => c.idCustomer !== customerToDelete));
      toast.success("Customer deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  if (loading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#5CAF90]"></div>
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            Customer Details
          </h2>
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
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
            >
              Search
            </button>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="alert bg-[#1D372E] border-[#1D372E]">
              <span>No customers found.</span>
            </div>
          ) : (
            <>
              <div className="hidden sm:block">
                <table className="table min-w-[700px] text-center border border-[#1D372E]">
                  <thead className="bg-[#EAFFF7] text-[#1D372E]">
                    <tr className="border-b border-[#1D372E]">
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        ID
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Name
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Email
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Phone
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Status
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Created
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Updated
                      </th>
                      <th className="py-2 px-3 font-semibold text-xs lg:text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1D372E]">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.idCustomer}
                        className="border-b border-[#1D372E]"
                      >
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {customer.idCustomer}
                        </td>
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {customer.Full_Name}
                        </td>
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {customer.Email}
                        </td>
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {customer.Mobile_No}
                        </td>
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
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          {new Date(customer.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 text-xs lg:text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/customer/view-customer/${customer.idCustomer}`
                                )
                              }
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                              title="View Details"
                            >
                              <FaEye className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleEdit(customer)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                              title="Edit Customer"
                            >
                              <FaEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleHistory(customer)}
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
                        <div className="text-xs text-gray-600">
                          {customer.Email}
                        </div>
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
                        Created:{" "}
                        {new Date(customer.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        Updated:{" "}
                        {new Date(customer.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/customer/view-customer/${customer.idCustomer}`
                          )
                        }
                        className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                        title="View Details"
                      >
                        <FaEye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                        title="Edit Customer"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleHistory(customer)}
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
            </>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              Edit Customer
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-6 top-7 text-lg"
            >
              <IoClose className="w-5 h-5" />
            </button>
            <form onSubmit={handleEditSubmit}>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, full_name: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  value={editForm.mobile_no}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobile_no: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Status
                  </span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="select select-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md hover:bg-[#4a9a7d]"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg max-h-[90vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              Customer History
            </h3>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>
            {history ? (
              <div>
                <h4 className="font-semibold mb-2">Order History</h4>
                {history.orders.map((order) => (
                  <div
                    key={order.idOrder}
                    className="border border-[#1D372E] p-2 rounded-lg mb-2"
                  >
                    <p>Order ID: {order.idOrder}</p>
                    <p>Status: {order.Delivery_Status}</p>
                    <p>Total Amount: {order.Total_Amount}</p>
                  </div>
                ))}
                <h4 className="font-semibold mt-4 mb-2">Delivery Addresses</h4>
                {history.deliveryAddresses.map((address, index) => (
                  <div
                    key={index}
                    className="border border-[#1D372E] p-2 rounded-lg mb-2"
                  >
                    <p>
                      Address: {address.Address}, {address.City},{" "}
                      {address.Country}
                    </p>
                    <p>Phone: {address.Mobile_No}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div>Loading history...</div>
            )}
            <div className="modal-action">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md hover:bg-[#4a9a7d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E]">
            <h3 className="font-bold text-lg mb-4">Delete Customer</h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <p className="mb-6">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>

            <div className="modal-action">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-sm bg-[#5CAF90] border-[#5CAF90]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagedForm;
