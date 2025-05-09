import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateDeliveryDate,
  getOrderHistory,
} from "../api/orders";
import { FaArrowLeft, FaEdit, FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [paymentStatusError, setPaymentStatusError] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [paymentStatusUpdateSuccess, setPaymentStatusUpdateSuccess] =
    useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deliveryDateModalOpen, setDeliveryDateModalOpen] = useState(false);
  const [newDeliveryDate, setNewDeliveryDate] = useState("");
  const [updatingDeliveryDate, setUpdatingDeliveryDate] = useState(false);

  useEffect(() => {
    if (orderId) {
      if (!isNaN(Number.parseInt(orderId, 10))) {
        fetchOrderDetails();
        fetchOrderHistory();
      } else {
        setError("Invalid order ID format. Order ID must be a number.");
        setLoading(false);
      }
    } else {
      setError("Order ID is required");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrderDetails(data);
      setSelectedStatus(data.order.Status);
      setSelectedPaymentStatus(data.order.Payment_Stats);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch order details");
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await getOrderHistory(orderId);
      setOrderHistory(data);
      setLoadingHistory(false);
    } catch (err) {
      console.error("Failed to fetch order history:", err);
      setLoadingHistory(false);
    }
  };

  const handleStatusChange = () => {
    if (!selectedStatus || selectedStatus === orderDetails.order.Status) {
      return;
    }
    setShowOrderStatusModal(true);
  };

  const handlePaymentStatusChange = () => {
    if (
      !selectedPaymentStatus ||
      selectedPaymentStatus === orderDetails.order.Payment_Stats
    ) {
      return;
    }
    setShowPaymentStatusModal(true);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handlePaymentStatusSelect = (status) => {
    setSelectedPaymentStatus(status);
  };

  // Define valid next status transitions for order status
  const getValidOrderStatusTransitions = (currentStatus) => {
    // Define status order for progression
    const orderStatusFlow = [
      "Order Confirmed",
      "Order Packed",
      "Awaiting Delivery",
      "Out for Delivery",
      "Delivered"
      // Removed "Cancelled" as it will be a separate button
    ];
    
    const currentIndex = orderStatusFlow.indexOf(currentStatus);
    
    // If current status is not found or is Cancelled, no transitions allowed
    if (currentIndex === -1 || currentStatus === "Cancelled") {
      return [currentStatus]; // Only allow selecting the current status
    }
    
    // Allow selecting the current status, one step forward, or one step backward
    const result = [currentStatus];
    
    // Add next status if not at the end
    if (currentIndex < orderStatusFlow.length - 1) {
      result.push(orderStatusFlow[currentIndex + 1]);
    }
    
    // Add previous status if not at the beginning
    if (currentIndex > 0) {
      result.push(orderStatusFlow[currentIndex - 1]);
    }
    
    return result;
  };

  // Define valid next status transitions for payment status
  const getValidPaymentStatusTransitions = (currentStatus) => {
    // Define status order for progression
    const paymentStatusFlow = [
      "pending",
      "paid",
      "failed", 
      "cancelled"
      // Removed "refunded" as it will be a separate button
    ];
    
    const currentIndex = paymentStatusFlow.indexOf(currentStatus);
    
    // If current status is not found, no transitions allowed
    if (currentIndex === -1) {
      return [currentStatus]; // Only allow selecting the current status
    }
    
    // Allow selecting the current status, one step forward, or one step backward
    const result = [currentStatus];
    
    // Add next status if not at the end
    if (currentIndex < paymentStatusFlow.length - 1) {
      result.push(paymentStatusFlow[currentIndex + 1]);
    }
    
    // Add previous status if not at the beginning
    if (currentIndex > 0) {
      result.push(paymentStatusFlow[currentIndex - 1]);
    }
    
    return result;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "Order Packed":
        return "bg-blue-100 text-blue-800";
      case "Awaiting Delivery":
        return "bg-indigo-100 text-indigo-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeliveryDateUpdate = async () => {
    if (!newDeliveryDate) {
      toast.error("Please select a delivery date");
      return;
    }
    
    try {
      setUpdatingDeliveryDate(true);
      await updateDeliveryDate(
        orderDetails.order.idOrder,
        newDeliveryDate,
        orderDetails.order.Full_Name,
        orderDetails.order.Total_Amount
      );
      setOrderDetails({ 
        ...orderDetails, 
        order: { ...orderDetails.order, Delivery_Date: newDeliveryDate } 
      });
      toast.success("Delivery date updated successfully");
      setDeliveryDateModalOpen(false);
    } catch (error) {
      console.error("Error updating delivery date:", error);
      toast.error(error.message || "Failed to update delivery date");
    } finally {
      setUpdatingDeliveryDate(false);
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

  if (error) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <button onClick={handleBack} className="btn btn-primary mt-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="alert alert-error">
            <span>Order not found</span>
          </div>
          <button onClick={handleBack} className="btn btn-primary mt-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  const { order, items } = orderDetails;

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="btn btn-circle btn-sm bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
          >
            <FaArrowLeft className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-xl font-bold text-[#1D372E]">Order Details</h2>
          </div>
        </div>

        {statusUpdateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm">
            Order status updated successfully
          </div>
        )}

        {statusError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {statusError}
          </div>
        )}

        {paymentStatusUpdateSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm">
            Payment status updated successfully
          </div>
        )}

        {paymentStatusError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {paymentStatusError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
              Order Information
            </h2>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Order ID:</span>
                <span>#{order.idOrder}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Date:</span>
                <span>{new Date(order.Date_Time).toLocaleString()}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.Status
                  )}`}
                >
                  {order.Status}
                </span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Total Amount:</span>
                <span>Rs. {order.Total_Amount}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Delivery Charges:</span>
                <span>Rs. {order.Delivery_Charges}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Net Amount:</span>
                <span>Rs. {order.Net_Amount}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Delivery Date:</span>
                <span className="flex items-center">
                  {deliveryDateModalOpen ? (
                    <div className="flex items-center">
                      <DatePicker
                        selected={newDeliveryDate ? new Date(newDeliveryDate) : null}
                        onChange={(date) => setNewDeliveryDate(date.toISOString().split('T')[0])}
                        className="input input-bordered input-sm w-40 mr-2 bg-white border-[#1D372E] text-[#1D372E]"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date"
                        minDate={new Date()}
                      />
                      {updatingDeliveryDate ? (
                        <div className="flex items-center">
                          <FaSpinner className="animate-spin text-[#5CAF90] mr-1" size={12} />
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            onClick={handleDeliveryDateUpdate}
                            className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 hover:bg-green-200 rounded-md"
                            disabled={updatingDeliveryDate}
                          >
                            ✓
                          </button>
                          <button 
                            onClick={() => setDeliveryDateModalOpen(false)}
                            className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded-md"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {order.Delivery_Date
                        ? new Date(order.Delivery_Date).toLocaleDateString()
                        : "Not set"}
                      <button
                        onClick={() => {
                          setNewDeliveryDate(order.Delivery_Date || "");
                          setDeliveryDateModalOpen(true);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={14} />
                      </button>
                    </>
                  )}
                </span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Payment Type:</span>
                <span>{order.Payment_Type}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Payment Status:</span>
                <span>{order.Payment_Stats}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
              Customer Information
            </h2>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Name:</span>
                <span>{order.Full_Name}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Email:</span>
                <span>{order.Email}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Address:</span>
                <span>{order.Address}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">City:</span>
                <span>{order.City}</span>
              </p>
              <p className="flex justify-between text-[#1D372E]">
                <span className="font-medium">Country:</span>
                <span>{order.Country}</span>
              </p>
            </div>
          </div>
        </div>

        {order.Customer_Note && (
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
              Customer Note
            </h2>
            <div className="text-xs sm:text-sm text-[#1D372E] bg-white p-3 rounded border border-gray-200">
              {order.Customer_Note}
            </div>
          </div>
        )}

        {/* Order & Payment Timeline */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
            Order & Payment Timeline
          </h2>
          {loadingHistory ? (
            <div className="flex justify-center items-center h-20">
              <span className="loading loading-spinner loading-md text-[#5CAF90]"></span>
            </div>
          ) : orderHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No history available for this order.
            </div>
          ) : (
            <div className="relative pb-2">
              {/* Timeline Events */}
              <div className="space-y-4">
                {orderHistory.map((event, index) => (
                  <div key={index} className="flex items-start ml-2">
                    <div className="relative z-10">
                      <div className="h-8 w-8 rounded-full bg-[#5CAF90] flex items-center justify-center shadow-md">
                        <span className="text-white text-xs">{orderHistory.length - index}</span>
                      </div>
                    </div>
                    <div className="ml-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-[#1D372E]">
                            {event.status_type === 'order_status' ? 'Order Status Changed' : 
                             event.status_type === 'payment_status' ? 'Payment Status Changed' : 
                             event.status_type === 'cancellation' ? 'Order Cancelled' : 'Status Changed'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.status_from ? (
                              <>
                                Changed from <span className="font-medium">{event.status_from}</span> to{" "}
                                <span className="font-medium">{event.status_to}</span>
                              </>
                            ) : (
                              <>
                                Status set to <span className="font-medium">{event.status_to}</span>
                              </>
                            )}
                          </p>
                          {event.reason && (
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">Reason:</span> {event.reason}
                            </p>
                          )}
                          {event.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {event.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
            Update Order Status
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {[
                  "Order Confirmed",
                  "Order Packed",
                  "Awaiting Delivery",
                  "Out for Delivery",
                  "Delivered",
                ].map((status) => {
                  // Determine if this status is a valid transition
                  const validTransitions = getValidOrderStatusTransitions(order.Status);
                  const isValidTransition = validTransitions.includes(status);
                  const isCurrent = status === order.Status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      disabled={updatingStatus || (!isValidTransition && !isCurrent)}
                      className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm capitalize ${
                        selectedStatus === status
                          ? "bg-gray-100 text-[#1D372E] border-2 border-[#5CAF90]"
                          : isValidTransition || isCurrent
                          ? "bg-white text-[#1D372E] border border-gray-300 hover:bg-gray-50"
                          : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
              {/* Separate Cancel/Revert Cancel Button */}
              {order.Status === "Cancelled" ? (
                <button
                  onClick={() => {
                    // Set to the last status before cancellation (getting from history)
                    const lastValidStatus = orderHistory.find(
                      history => history.status_type === 'order_status' && history.status_to === 'Cancelled'
                    )?.status_from || "Order Confirmed";
                    
                    setSelectedStatus(lastValidStatus);
                    setShowOrderStatusModal(true);
                  }}
                  disabled={updatingStatus}
                  className="px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm bg-green-500 text-white hover:bg-green-600"
                >
                  Revert Cancellation
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedStatus("Cancelled");
                    setShowOrderStatusModal(true);
                  }}
                  disabled={updatingStatus || order.Status === "Cancelled"}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm ${
                    selectedStatus === "Cancelled"
                      ? "bg-red-100 text-red-800 border-2 border-red-500"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Cancel Order
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <button
                onClick={handleStatusChange}
                disabled={updatingStatus || selectedStatus === order.Status}
                className={`px-4 py-1 sm:px-6 sm:py-2 rounded text-xs sm:text-sm font-medium mb-2 sm:mb-0 ${
                  updatingStatus || selectedStatus === order.Status
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#5CAF90] text-white hover:bg-opacity-90"
                }`}
              >
                Update
              </button>

              {updatingStatus && (
                <span className="ml-0 sm:ml-3 text-[#1D372E] flex items-center text-xs sm:text-sm">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-[#5CAF90] mr-2"></div>
                  Updating...
                </span>
              )}

              {selectedStatus !== order.Status && !updatingStatus && (
                <span className="ml-0 sm:ml-3 text-[#1D372E] text-xs sm:text-sm">
                  Status will be updated from{" "}
                  <span className="font-medium">{order.Status}</span> to{" "}
                  <span className="font-medium">{selectedStatus}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
            Update Payment Status
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {["pending", "paid", "failed", "cancelled"].map(
                  (status) => {
                    // Determine if this status is a valid transition
                    const validTransitions = getValidPaymentStatusTransitions(order.Payment_Stats);
                    const isValidTransition = validTransitions.includes(status);
                    const isCurrent = status === order.Payment_Stats;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => handlePaymentStatusSelect(status)}
                        disabled={updatingPaymentStatus || (!isValidTransition && !isCurrent)}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm capitalize ${
                          selectedPaymentStatus === status
                            ? "bg-gray-100 text-[#1D372E] border-2 border-[#5CAF90]"
                            : isValidTransition || isCurrent
                            ? "bg-white text-[#1D372E] border border-gray-300 hover:bg-gray-50"
                            : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  }
                )}
              </div>
              {/* Separate Refund/Revert Refund Button */}
              {order.Payment_Stats === "refunded" ? (
                <button
                  onClick={() => {
                    setSelectedPaymentStatus("paid");
                    setShowPaymentStatusModal(true);
                  }}
                  disabled={updatingPaymentStatus}
                  className="px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm bg-green-500 text-white hover:bg-green-600"
                >
                  Revert Refund
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedPaymentStatus("refunded");
                    setShowPaymentStatusModal(true);
                  }}
                  disabled={updatingPaymentStatus || order.Payment_Stats === "refunded"}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm ${
                    selectedPaymentStatus === "refunded"
                      ? "bg-red-100 text-red-800 border-2 border-red-500"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Refund Payment
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center">
              <button
                onClick={handlePaymentStatusChange}
                disabled={
                  updatingPaymentStatus ||
                  selectedPaymentStatus === order.Payment_Stats
                }
                className={`px-4 py-1 sm:px-6 sm:py-2 rounded text-xs sm:text-sm font-medium mb-2 sm:mb-0 ${
                  updatingPaymentStatus ||
                  selectedPaymentStatus === order.Payment_Stats
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#5CAF90] text-white hover:bg-opacity-90"
                }`}
              >
                Update
              </button>

              {updatingPaymentStatus && (
                <span className="ml-0 sm:ml-3 text-[#1D372E] flex items-center text-xs sm:text-sm">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-[#5CAF90] mr-2"></div>
                  Updating...
                </span>
              )}

              {selectedPaymentStatus !== order.Payment_Stats &&
                !updatingPaymentStatus && (
                  <span className="ml-0 sm:ml-3 text-[#1D372E] text-xs sm:text-sm">
                    Payment status will be updated from{" "}
                    <span className="font-medium">{order.Payment_Stats}</span>{" "}
                    to{" "}
                    <span className="font-medium">{selectedPaymentStatus}</span>
                  </span>
                )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="table min-w-[700px] text-center border border-[#B7B7B7]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#B7B7B7]">
                  <th className="font-semibold">Product</th>
                  <th className="font-semibold">Price</th>
                  <th className="font-semibold">Quantity</th>
                  <th className="font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {items.map((item) => (
                  <tr
                    key={item.idOrderItem}
                    className="border-b border-[#B7B7B7]"
                  >
                    <td>{item.product_name}</td>
                    <td>Rs. {item.Rate || 0}</td>
                    <td>{item.Qty || 0}</td>
                    <td>Rs. {item.Total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Modal */}
        {showOrderStatusModal && (
          <div className="modal modal-open">
            <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
              <h3 className="font-bold text-lg mb-4">Confirm Status Change</h3>
              <button
                onClick={() => setShowOrderStatusModal(false)}
                className="absolute right-6 top-7 text-lg text-[#1D372E]"
              >
                <IoClose className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="mb-2">
                  Are you sure you want to change the order status?
                </p>
                <div className="flex justify-between items-center mb-4 mx-auto max-w-xs">
                  <div>
                    <p className="font-semibold mb-1">From:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.Status
                      )} border border-gray-200`}
                    >
                      {order.Status}
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        selectedStatus
                      )} border border-gray-200`}
                    >
                      {selectedStatus}
                    </span>
                  </div>
                </div>
                
                {/* Reason Field */}
                <div className="mb-4 mt-4">
                  <label className="block text-left text-sm font-medium mb-1">
                    Reason for change (optional):
                  </label>
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="textarea textarea-bordered w-full h-20 text-sm text-[#1D372E] bg-white"
                    placeholder={selectedStatus === "Cancelled" ? "Please provide a reason for cancellation..." : "Add notes about this status change..."}
                  ></textarea>
                </div>
                
                <p className="text-sm text-gray-600">
                  This action will update the status of Order #{orderId}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowOrderStatusModal(false);
                    setStatusReason("");
                  }}
                  className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setUpdatingStatus(true);
                      await updateOrderStatus(
                        orderId,
                        selectedStatus,
                        order.Full_Name,
                        order.Total_Amount,
                        statusReason
                      );
                      await fetchOrderDetails();
                      await fetchOrderHistory();
                      setShowOrderStatusModal(false);
                      setStatusUpdateSuccess(true);
                      setStatusReason("");
                      toast.success("Order status updated");
                      setTimeout(() => setStatusUpdateSuccess(false), 3000);
                    } catch (err) {
                      setStatusError(
                        err.message || "Failed to update order status"
                      );
                      toast.error("Failed to update order status");
                    } finally {
                      setUpdatingStatus(false);
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingStatus ? "loading" : ""
                  }`}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Modal */}
        {showPaymentStatusModal && (
          <div className="modal modal-open">
            <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
              <h3 className="font-bold text-lg mb-4">
                Confirm Payment Status Change
              </h3>
              <button
                onClick={() => setShowPaymentStatusModal(false)}
                className="absolute right-6 top-7 text-lg text-[#1D372E]"
              >
                <IoClose className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="mb-2">
                  Are you sure you want to change the payment status?
                </p>
                <div className="flex justify-between items-center mb-4 mx-auto max-w-xs">
                  <div>
                    <p className="font-semibold mb-1">From:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                        order.Payment_Stats
                      )} border border-gray-200`}
                    >
                      {order.Payment_Stats}
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                        selectedPaymentStatus
                      )} border border-gray-200`}
                    >
                      {selectedPaymentStatus}
                    </span>
                  </div>
                </div>
                
                {/* Reason Field */}
                <div className="mb-4 mt-4">
                  <label className="block text-left text-sm font-medium mb-1">
                    Reason for change (optional):
                  </label>
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="textarea textarea-bordered w-full h-20 text-sm text-[#1D372E] bg-white"
                    placeholder={selectedPaymentStatus === "cancelled" || selectedPaymentStatus === "refunded" ? 
                      "Please provide a reason..." : 
                      "Add notes about this payment status change..."}
                  ></textarea>
                </div>
                
                <p className="text-sm text-gray-600">
                  This action will update the payment status of Order #{orderId}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowPaymentStatusModal(false);
                    setStatusReason("");
                  }}
                  className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setUpdatingPaymentStatus(true);
                      await updatePaymentStatus(
                        orderId,
                        selectedPaymentStatus,
                        order.Full_Name,
                        order.Total_Amount,
                        statusReason
                      );
                      await fetchOrderDetails();
                      await fetchOrderHistory();
                      setShowPaymentStatusModal(false);
                      setPaymentStatusUpdateSuccess(true);
                      setStatusReason("");
                      toast.success("Payment status updated");
                      setTimeout(
                        () => setPaymentStatusUpdateSuccess(false),
                        3000
                      );
                    } catch (err) {
                      setPaymentStatusError(
                        err.message || "Failed to update payment status"
                      );
                      toast.error("Failed to update payment status");
                    } finally {
                      setUpdatingPaymentStatus(false);
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingPaymentStatus ? "loading" : ""
                  }`}
                  disabled={updatingPaymentStatus}
                >
                  {updatingPaymentStatus ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
