import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api/customer";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const CustomerDetails = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState({ orders: [], deliveryAddresses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const customerData = await api.getCustomerById(customerId);
        setCustomer(customerData);

        const customerHistoryData = await api.getCustomerHistory(customerId);
        setHistory(customerHistoryData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        toast.error("Failed to load customer details");
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CAF90]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4 text-center text-gray-600">No customer found.</div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard/customer-managed-form")}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5CAF90] text-white hover:bg-[#4a9277] transition-colors cursor-pointer"
              aria-label="Back to customers"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {/* Heading */}
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#5CAF90]"></div>
              <h2 className="text-xl font-bold text-[#1D372E]">
                Customer Details
              </h2>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h4 className="font-bold text-[#1D372E] text-lg mb-4">
              {customer.Full_Name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="w-24">Email:</span>
                  <span className="font-medium">{customer.Email}</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Phone:</span>
                  <span className="font-medium">{customer.Mobile_No}</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      customer.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.Status}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className=" w-24">Address:</span>
                  <span className="font-medium">{customer.Address}</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">City:</span>
                  <span className="font-medium">{customer.City}</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Country:</span>
                  <span className="font-medium">{customer.Country}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h4 className="font-bold text-[#1D372E] text-lg mb-4">
              Orders Details
            </h4>
            {history.orders.length > 0 ? (
              <div className="grid gap-4">
                {history.orders.map((order) => (
                  <div
                    key={order.idOrder || order.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">Order ID:</span>
                        <span className="font-medium">
                          {order.idOrder || order.id}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">Amount:</span>
                        <span className="font-medium">
                          ${order.Total_Amount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            order.Delivery_Status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.Delivery_Status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No orders found for this customer.
              </p>
            )}
          </div>

          {/* Delivery Addresses Section */}
          {history.deliveryAddresses.length > 0 ? (
            <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 md:p-6">
              <h4 className="font-bold text-[#1D372E] text-lg mb-4">
                Delivery Addresses
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {history.deliveryAddresses.map((address) => (
                  <div
                    key={address.id || address.AddressID}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <span className="w-20">Address:</span>
                        <span className="font-medium">{address.Address}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-20">City:</span>
                        <span className="font-medium">{address.City}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="w-20">Country:</span>
                        <span className="font-medium">{address.Country}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No delivery addresses found for this customer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
