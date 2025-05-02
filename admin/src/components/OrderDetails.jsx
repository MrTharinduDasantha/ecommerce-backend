import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../api/orders";
import { FaArrowLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

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

  useEffect(() => {
    if (orderId) {
      if (!isNaN(Number.parseInt(orderId, 10))) {
        fetchOrderDetails();
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
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBack = () => {
    navigate(-1);
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

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">
            Update Order Status
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                "Order Confirmed",
                "Order Packed",
                "Awaiting Delivery",
                "Out for Delivery",
                "Delivered",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  disabled={updatingStatus}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm capitalize ${
                    selectedStatus === status
                      ? "bg-gray-100 text-[#1D372E] border-2 border-[#5CAF90]"
                      : "bg-white text-[#1D372E] border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
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
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {["pending", "paid", "failed", "cancelled", "refunded"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handlePaymentStatusSelect(status)}
                    disabled={updatingPaymentStatus}
                    className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm capitalize ${
                      selectedPaymentStatus === status
                        ? "bg-gray-100 text-[#1D372E] border-2 border-[#5CAF90]"
                        : "bg-white text-[#1D372E] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                  </button>
                )
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
                <p className="text-sm text-gray-600">
                  This action will update the status of Order #{orderId}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => setShowOrderStatusModal(false)}
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
                        order.Total_Amount
                      );
                      await fetchOrderDetails();
                      setShowOrderStatusModal(false);
                      setStatusUpdateSuccess(true);
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
                <p className="text-sm text-gray-600">
                  This action will update the payment status of Order #{orderId}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => setShowPaymentStatusModal(false)}
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
                        order.Total_Amount
                      );
                      await fetchOrderDetails();
                      setShowPaymentStatusModal(false);
                      setPaymentStatusUpdateSuccess(true);
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
