import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api/customer";
import toast from "react-hot-toast";
import { ArrowLeft, Eye } from "lucide-react";

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

  const handleEyeClick = (order) => {
    // Navigate to the CustomerorderDetailsPage with order ID
    navigate(`/dashboard/customer/order-details/${order.idOrder || order.id}`, {
      state: {
        order: order,
        deliveryAddress:
          history.deliveryAddresses.length > 0
            ? history.deliveryAddresses[0]
            : null,
        customerId: customerId,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4 text-center text-gray-600">No customer found.</div>
    );
  }

  return (
    <div className="w-310 mx-auto p-6 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="p-4 md:p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard/customer-managed-form")}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5CAF90] text-white hover:bg-[#4a9277] transition-colors cursor-pointer"
            aria-label="Back to Customer page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-6 mt-3">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-base font-bold text-[#1D372E]">
              Customer Details
            </h2>
          </div>

          {/* Customer Info Card */}
          <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 md:p-6 mb-6 w-285">
            <div className="bg-white rounded-lg p-4 shadow-sm w-270">
              <h4 className="font-bold text-[#1D372E] text-sm mb-4">
                {customer.Full_Name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-[#1D372E]">
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">Email:</span>
                    <span className="font-medium text-xs">
                      {customer.Email}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">Phone:</span>
                    <span className="font-medium text-xs">
                      {customer.Mobile_No}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.Status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.Status}
                    </span>
                  </p>
                </div>
                <div className="space-y-2 text-[#1D372E]">
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">Address:</span>
                    <span className="font-medium text-xs">
                      {customer.Address}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">City:</span>
                    <span className="font-medium text-xs">{customer.City}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 text-sm">Country:</span>
                    <span className="font-medium text-xs">
                      {customer.Country}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Orders Section */}
          <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 md:p-6 mb-6 w-285">
            <h4 className="font-bold text-[#1D372E] text-base mb-4">
              Orders Details
            </h4>
            {history.orders.length > 0 ? (
              <div className="grid gap-4">
                {history.orders.map((order) => (
                  <div
                    key={order.idOrder || order.id}
                    className="bg-white rounded-lg p-4 shadow-sm w-270"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[#1D372E]">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2 text-sm">
                          Order ID:
                        </span>
                        <span className="font-medium text-xs">
                          {order.idOrder || order.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2 text-sm">
                          Amount:
                        </span>
                        <span className="font-medium text-xs">
                          ${order.Total_Amount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2 text-sm">
                          Status:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.Status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.Status}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2 text-sm">
                          Date And Time:
                        </span>
                        <span className="font-medium text-xs">
                          {order.Date_Time}
                        </span>
                      </div>
                      {history.deliveryAddresses.length > 0 && (
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2 text-sm">
                            Delivery Address:
                          </span>
                          <span className="font-medium text-xs">
                            {history.deliveryAddresses[0].Address},{" "}
                            {history.deliveryAddresses[0].City},{" "}
                            {history.deliveryAddresses[0].Country}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <button
                          onClick={() => handleEyeClick(order)}
                          className="text-[#5CAF90] hover:text-[#4a9277] ml-4"
                          title="View Order Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4 text-lg">
                No orders found for this customer.
              </p>
            )}
          </div>

          {/* Delivery Addresses Section */}
          {history.deliveryAddresses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* You can expand this section later if needed */}
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
