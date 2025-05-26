import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as api from "../api/customer";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const CustomerorderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.order) {
      setOrderDetails(location.state.order);
      setDeliveryAddress(location.state.deliveryAddress);
      setLoading(false);
    } else {
      const fetchOrderDetails = async () => {
        try {
          const orderData = await api.getOrderById(orderId);
          setOrderDetails(orderData);

          if (location.state?.customerId) {
            const customerHistory = await api.getCustomerHistory(
              location.state.customerId
            );
            if (customerHistory.deliveryAddresses.length > 0) {
              setDeliveryAddress(customerHistory.deliveryAddresses[0]);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Failed to load order details");
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId, location.state]);

  const handleBack = () => {
    if (location.state?.customerId) {
      navigate(
        `/dashboard/customer/view-customer/${location.state.customerId}`
      );
    } else {
      navigate("/dashboard/orders");
    }
  };

  const calculateNetAmount = () => {
    const totalAmount = parseFloat(orderDetails.Total_Amount) || 0;
    const deliveryCharges = parseFloat(orderDetails.Delivery_Charges) || 0;
    return (totalAmount + deliveryCharges).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#5CAF90]"></span>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="p-4 text-center text-gray-600 text-sm sm:text-base">
        No order details found.
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="p-4 sm:p-6">
          {/* Back Button with Heading */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="btn btn-circle btn-xs md:btn-sm bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
              title="Back to All Customers"
            >
              <FaArrowLeft className="w-2.5 h-2.5 md:w-3 md:h-3" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#5CAF90]"></div>
              <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
                Order Details
              </h2>
            </div>
          </div>

          {/* Order Info Card */}
          <div className="bg-[#F4F4F4] rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h4 className="font-bold text-[#1D372E] text-sm sm:text-base mb-4">
              Order #{orderDetails.idOrder || orderDetails.id}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h5 className="font-semibold text-[#1D372E] text-sm sm:text-base mb-3">
                  Order Information
                </h5>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Order ID:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.idOrder || orderDetails.id}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                        orderDetails.Status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {orderDetails.Status}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Date and Time:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Date_Time}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Delivery Type:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Delivery_Type}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Payment Type:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Payment_Type}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Payment Stats:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Payment_Stats}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Customer Note:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Customer_Note ||
                        "Customer Note not available"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Supplier Note:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {orderDetails.Supplier_Note ||
                        "Supplier Note not available"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">Amount:</span>
                    <span className="font-medium text-xs sm:text-sm">
                      Rs. {orderDetails.Total_Amount}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Delivery Charges:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      Rs. {orderDetails.Delivery_Charges}
                    </span>
                  </p>
                  <div className="h-px bg-black my-2"></div>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-32 text-sm">
                      Total Amount:
                    </span>
                    <span className="font-medium text-xs sm:text-sm bg-[#f9ddf2] text-black px-2 py-1 rounded">
                      Rs. {calculateNetAmount()}
                    </span>
                  </p>
                  <div className="h-px bg-black my-2"></div>
                  {orderDetails.Payment_Method && (
                    <p className="flex items-center">
                      <span className="text-gray-600 w-32 text-sm">
                        Payment Method:
                      </span>
                      <span className="font-medium text-xs sm:text-sm">
                        {orderDetails.Payment_Method}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {deliveryAddress && (
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                  <h5 className="font-semibold text-[#1D372E] text-sm sm:text-base mb-3">
                    Delivery Address
                  </h5>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center">
                      <span className="text-gray-600 w-24 text-sm">
                        Address:
                      </span>
                      <span className="font-medium text-xs sm:text-sm">
                        {deliveryAddress.Address}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-600 w-24 text-sm">City:</span>
                      <span className="font-medium text-xs sm:text-sm">
                        {deliveryAddress.City}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-600 w-24 text-sm">
                        Country:
                      </span>
                      <span className="font-medium text-xs sm:text-sm">
                        {deliveryAddress.Country}
                      </span>
                    </p>
                    {deliveryAddress.PostalCode && (
                      <p className="flex items-center">
                        <span className="text-gray-600 w-24 text-sm">
                          Postal Code:
                        </span>
                        <span className="font-medium text-xs sm:text-sm">
                          {deliveryAddress.PostalCode}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Section */}
            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold text-[#1D372E] text-sm sm:text-base mb-3">
                  Order Items
                </h5>
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {orderDetails.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            Rs. {item.price}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            Rs. {item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Additional Order Details */}
            {orderDetails.notes && (
              <div className="mt-6 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h5 className="font-semibold text-[#1D372E] text-sm sm:text-base mb-2">
                  Order Notes
                </h5>
                <p className="text-xs sm:text-sm text-gray-600">
                  {orderDetails.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerorderDetailsPage;