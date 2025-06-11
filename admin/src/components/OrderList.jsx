import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../api/orders";
import { FaEye, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import Pagination from "./common/Pagination";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);
  const [orderStatusChangeData, setOrderStatusChangeData] = useState(null);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [paymentStatusChangeData, setPaymentStatusChangeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    if (showOrderStatusModal || showPaymentStatusModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showOrderStatusModal, showPaymentStatusModal]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching orders, page:", currentPage);

      const data = await getOrders(currentPage);
      console.log("Orders data received:", data);

      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error in OrderList.fetchOrders:", err);
      setError(err.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const order = orders.find((o) => o.idOrder === orderId);
    if (!order || order.Status === newStatus) return;
    setOrderStatusChangeData({ orderId, newStatus });
    setShowOrderStatusModal(true);
  };

  const handlePaymentStatusChange = (orderId, newPaymentStatus) => {
    const order = orders.find((o) => o.idOrder === orderId);
    if (!order || order.Payment_Stats === newPaymentStatus) return;
    setPaymentStatusChangeData({ orderId, newPaymentStatus });
    setShowPaymentStatusModal(true);
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

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (order.idOrder && order.idOrder.toString().includes(lowerSearchTerm)) ||
      (order.Full_Name &&
        order.Full_Name.toLowerCase().includes(lowerSearchTerm)) ||
      (order.Status && order.Status.toLowerCase().includes(lowerSearchTerm))
    );
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-xl font-bold text-[#1D372E]">Manage Orders</h2>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex w-full md:max-w-xl md:mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <FaSearch className="text-muted-foreground text-[#1D372E]" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Status..."
              className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]">
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 bg-[#5CAF90] text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E] mt-4">
            <span>No orders found.</span>
          </div>
        ) : (
          <div className="block w-full overflow-x-auto">
            <div className="hidden sm:block">
              <table className="table min-w-[700px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold p-3 w-[10%]">Tracking No</th>
                    <th className="font-semibold p-3 w-[10%]">Order Date</th>
                    <th className="font-semibold p-3 w-[15%]">Customer Name</th>
                    <th className="font-semibold p-3 w-[10%]">Order Amount</th>
                    <th className="font-semibold p-3 w-[10%]">Delivery Amount</th>
                    <th className="font-semibold p-3 w-[10%]">Total Amount</th>
                    <th className="font-semibold p-3 w-[10%]">Delivery Date</th>
                    <th className="font-semibold p-3 w-[10%]">Order Status</th>
                    <th className="font-semibold p-3 w-[10%]">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.idOrder}
                      className="border-b border-[#1D372E] cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewOrder(order.idOrder)}
                    >
                      <td className="p-3">#{order.idOrder}</td>
                      <td className="p-3">
                        {new Date(order.Date_Time).toLocaleDateString()}
                      </td>
                      <td className="p-3">{order.Full_Name}</td>
                      <td className="p-3">Rs. {order.Total_Amount}</td>
                      <td className="p-3">Rs. {order.Delivery_Charges}</td>
                      <td className="p-3">Rs. {order.Net_Amount}</td>
                      <td className="p-3">
                        {order.Delivery_Date
                          ? new Date(order.Delivery_Date).toLocaleDateString()
                          : "Not set"}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        {updatingStatus === order.idOrder ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#5CAF90] rounded-full"></div>
                            <span className="text-xs">Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={order.Status}
                            onChange={(e) =>
                              handleStatusChange(order.idOrder, e.target.value)
                            }
                            className={`px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getStatusColor(
                              order.Status
                            )}`}
                          >
                            <option
                              value="Order Confirmed"
                              className="bg-white text-yellow-800"
                            >
                              Order Confirmed
                            </option>
                            <option
                              value="Order Packed"
                              className="bg-white text-blue-800"
                            >
                              Order Packed
                            </option>
                            <option
                              value="Awaiting Delivery"
                              className="bg-white text-indigo-800"
                            >
                              Awaiting Delivery
                            </option>
                            <option
                              value="Out for Delivery"
                              className="bg-white text-purple-800"
                            >
                              Out for Delivery
                            </option>
                            <option
                              value="Delivered"
                              className="bg-white text-green-800"
                            >
                              Delivered
                            </option>
                          </select>
                        )}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        {updatingPaymentStatus === order.idOrder ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#5CAF90] rounded-full"></div>
                            <span className="text-xs">Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={order.Payment_Stats}
                            onChange={(e) =>
                              handlePaymentStatusChange(
                                order.idOrder,
                                e.target.value
                              )
                            }
                            className={`px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getPaymentStatusColor(
                              order.Payment_Stats
                            )}`}
                          >
                            <option
                              value="pending"
                              className="bg-white text-yellow-800"
                            >
                              Pending
                            </option>
                            <option
                              value="paid"
                              className="bg-white text-green-800"
                            >
                              Paid
                            </option>
                            <option
                              value="failed"
                              className="bg-white text-red-800"
                            >
                              Failed
                            </option>
                            <option
                              value="cancelled"
                              className="bg-white text-gray-800"
                            >
                              Cancelled
                            </option>
                            <option
                              value="refunded"
                              className="bg-white text-purple-800"
                            >
                              Refunded
                            </option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden">
              {filteredOrders.map((order) => (
                <div 
                  key={order.idOrder} 
                  className="bg-white p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewOrder(order.idOrder)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {order.product_image ? (
                        <img
                          src={order.product_image}
                          alt="Product"
                          className="w-10 h-10 mr-3 rounded object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/40?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 mr-3">
                          No IMG
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.idOrder}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.Full_Name}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.Status
                      )}`}
                    >
                      {order.Status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Product Amount: Rs. {order.Total_Amount}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Delivery: Rs. {order.Delivery_Charges}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Total Amount: Rs. {order.Net_Amount}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Date: {new Date(order.Date_Time).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Delivery:{" "}
                    {order.Delivery_Date
                      ? new Date(order.Delivery_Date).toLocaleDateString()
                      : "Not set"}
                  </div>

                  {/* Payment status and order status controls */}
                  <div className="grid grid-cols-2 gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <div className="text-xs text-gray-700 mb-1">
                        Order Status:
                      </div>
                      <select
                        value={order.Status}
                        onChange={(e) =>
                          handleStatusChange(order.idOrder, e.target.value)
                        }
                        className={`w-full px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getStatusColor(
                          order.Status
                        )}`}
                      >
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Order Packed">Order Packed</option>
                        <option value="Awaiting Delivery">
                          Awaiting Delivery
                        </option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-gray-700 mb-1">
                        Payment Status:
                      </div>
                      <select
                        value={order.Payment_Stats}
                        onChange={(e) =>
                          handlePaymentStatusChange(
                            order.idOrder,
                            e.target.value
                          )
                        }
                        className={`w-full px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getPaymentStatusColor(
                          order.Payment_Stats
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Order Status Modal */}
        {showOrderStatusModal && orderStatusChangeData && (
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
                        orders.find(
                          (o) => o.idOrder === orderStatusChangeData.orderId
                        ).Status
                      )} border border-gray-200`}
                    >
                      {
                        orders.find(
                          (o) => o.idOrder === orderStatusChangeData.orderId
                        ).Status
                      }
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        orderStatusChangeData.newStatus
                      )} border border-gray-200`}
                    >
                      {orderStatusChangeData.newStatus}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This action will update the status of Order #
                  {orderStatusChangeData.orderId}
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
                    const order = orders.find(
                      (o) => o.idOrder === orderStatusChangeData.orderId
                    );
                    try {
                      setUpdatingStatus(orderStatusChangeData.orderId);
                      await updateOrderStatus(
                        orderStatusChangeData.orderId,
                        orderStatusChangeData.newStatus,
                        order.Full_Name,
                        order.Total_Amount
                      );
                      setOrders(
                        orders.map((o) =>
                          o.idOrder === orderStatusChangeData.orderId
                            ? { ...o, Status: orderStatusChangeData.newStatus }
                            : o
                        )
                      );
                      toast.success("Order status updated");
                      setShowOrderStatusModal(false);
                    } catch (err) {
                      console.error("Failed to update order status:", err);
                      toast.error("Failed to update order status");
                    } finally {
                      setUpdatingStatus(null);
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingStatus === orderStatusChangeData.orderId
                      ? "loading"
                      : ""
                  }`}
                  disabled={updatingStatus === orderStatusChangeData.orderId}
                >
                  {updatingStatus === orderStatusChangeData.orderId
                    ? "Updating..."
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Status Modal */}
        {showPaymentStatusModal && paymentStatusChangeData && (
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
                        orders.find(
                          (o) => o.idOrder === paymentStatusChangeData.orderId
                        ).Payment_Stats
                      )} border border-gray-200`}
                    >
                      {
                        orders.find(
                          (o) => o.idOrder === paymentStatusChangeData.orderId
                        ).Payment_Stats
                      }
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                        paymentStatusChangeData.newPaymentStatus
                      )} border border-gray-200`}
                    >
                      {paymentStatusChangeData.newPaymentStatus}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This action will update the payment status of Order #
                  {paymentStatusChangeData.orderId}
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
                    const order = orders.find(
                      (o) => o.idOrder === paymentStatusChangeData.orderId
                    );
                    try {
                      setUpdatingPaymentStatus(paymentStatusChangeData.orderId);
                      await updatePaymentStatus(
                        paymentStatusChangeData.orderId,
                        paymentStatusChangeData.newPaymentStatus,
                        order.Full_Name,
                        order.Total_Amount
                      );
                      setOrders(
                        orders.map((o) =>
                          o.idOrder === paymentStatusChangeData.orderId
                            ? {
                                ...o,
                                Payment_Stats:
                                  paymentStatusChangeData.newPaymentStatus,
                              }
                            : o
                        )
                      );
                      toast.success("Payment status updated");
                      setShowPaymentStatusModal(false);
                    } catch (err) {
                      console.error("Failed to update payment status:", err);
                      toast.error("Failed to update payment status");
                    } finally {
                      setUpdatingPaymentStatus(null);
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingPaymentStatus === paymentStatusChangeData.orderId
                      ? "loading"
                      : ""
                  }`}
                  disabled={
                    updatingPaymentStatus === paymentStatusChangeData.orderId
                  }
                >
                  {updatingPaymentStatus === paymentStatusChangeData.orderId
                    ? "Updating..."
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
