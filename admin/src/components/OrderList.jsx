import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus, updatePaymentStatus } from "../api/orders";
import { FiEye } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
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

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o.idOrder === orderId);
    if (!order) return;
    
    const currentStatus = order.Status;
    
    if (currentStatus === newStatus) return;
    
    Swal.fire({
      title: 'Confirm Status Change',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to change the order status?</p>
          <div class="flex justify-between items-center mb-4 mx-auto max-w-xs">
            <div>
              <p class="font-semibold mb-1">From:</p>
              <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(currentStatus)} border border-gray-200">
                ${currentStatus}
              </span>
            </div>
            <div class="text-2xl">→</div>
            <div>
              <p class="font-semibold mb-1">To:</p>
              <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(newStatus)} border border-gray-200">
                ${newStatus}
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600">This action will update the status of Order #${orderId}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#5CAF90',
      cancelButtonColor: '#6B7280',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUpdatingStatus(orderId);
          await updateOrderStatus(orderId, newStatus);
          
          // Update the orders list locally
          setOrders(
            orders.map((order) =>
              order.idOrder === orderId ? { ...order, Status: newStatus } : order
            )
          );
          
          toast.success("Order status updated successfully");
          setUpdatingStatus(null);
        } catch (err) {
          console.error("Failed to update order status:", err);
          setError("Failed to update order status");
          toast.error("Failed to update order status");
          setUpdatingStatus(null);
        }
      }
    });
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    const order = orders.find(o => o.idOrder === orderId);
    if (!order) return;
    
    const currentPaymentStatus = order.Payment_Stats;
    
    if (currentPaymentStatus === newPaymentStatus) return;
    
    Swal.fire({
      title: 'Confirm Payment Status Change',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to change the payment status?</p>
          <div class="flex justify-between items-center mb-4 mx-auto max-w-xs">
            <div>
              <p class="font-semibold mb-1">From:</p>
              <span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(currentPaymentStatus)} border border-gray-200">
                ${currentPaymentStatus}
              </span>
            </div>
            <div class="text-2xl">→</div>
            <div>
              <p class="font-semibold mb-1">To:</p>
              <span class="px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(newPaymentStatus)} border border-gray-200">
                ${newPaymentStatus}
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600">This action will update the payment status of Order #${orderId}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#5CAF90',
      cancelButtonColor: '#6B7280',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUpdatingPaymentStatus(orderId);
          await updatePaymentStatus(
            orderId, 
            newPaymentStatus, 
            order.Full_Name, 
            order.Total_Amount
          );
          
          // Update the orders list locally
          setOrders(
            orders.map((o) =>
              o.idOrder === orderId ? { ...o, Payment_Stats: newPaymentStatus } : o
            )
          );
          
          toast.success("Payment status updated successfully");
          setUpdatingPaymentStatus(null);
        } catch (err) {
          console.error("Failed to update payment status:", err);
          toast.error("Failed to update payment status");
          setUpdatingPaymentStatus(null);
        }
      }
    });
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

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      (order.idOrder && order.idOrder.toString().includes(lowerSearchTerm)) ||
      (order.Full_Name && order.Full_Name.toLowerCase().includes(lowerSearchTerm)) ||
      (order.Status && order.Status.toLowerCase().includes(lowerSearchTerm))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CAF90]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-[#5CAF90] text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

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

        <div className="block w-full overflow-x-auto">
          <div className="hidden sm:block">
            <table className="table min-w-[700px] text-center border border-[#B7B7B7]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#B7B7B7]">
                  <th className="font-semibold p-3 w-[12%]">Tracking No</th>
                  <th className="font-semibold p-3 w-[12%]">Order Date</th>
                  <th className="font-semibold p-3 w-[16%]">Customer Name</th>
                  <th className="font-semibold p-3 w-[10%]">Price</th>
                  <th className="font-semibold p-3 w-[12%]">Delivery Date</th>
                  <th className="font-semibold p-3 w-[12%]">Order Status</th>
                  <th className="font-semibold p-3 w-[12%]">Payment Status</th>
                  <th className="font-semibold p-3 w-[5%]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.idOrder}
                      className="border-b border-[#B7B7B7] bg-[#F7FDFF]"
                    >
                      <td className="p-3">
                        <div className="flex items-center">
                          {order.product_image ? (
                            <img
                              src={order.product_image}
                              alt="Product"
                              className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/40?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 mr-2 sm:mr-3">
                              No IMG
                            </div>
                          )}
                          <span>#{order.idOrder}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {new Date(order.Date_Time).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {order.Full_Name}
                      </td>
                      <td className="p-3">Rs. {order.Total_Amount}</td>
                      <td className="p-3">
                        {order.Delivery_Date
                          ? new Date(order.Delivery_Date).toLocaleDateString()
                          : "Not set"}
                      </td>
                      <td className="p-3">
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
                      <td className="p-3">
                        {updatingPaymentStatus === order.idOrder ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#5CAF90] rounded-full"></div>
                            <span className="text-xs">Updating...</span>
                          </div>
                        ) : (
                          <select
                            value={order.Payment_Stats}
                            onChange={(e) =>
                              handlePaymentStatusChange(order.idOrder, e.target.value)
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
                      <td className="p-3">
                        <button
                          onClick={() => handleViewOrder(order.idOrder)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="View Order"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-5 text-center"
                    >
                      No orders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="sm:hidden">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.idOrder} className="bg-white p-4 border-b">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {order.product_image ? (
                        <img
                          src={order.product_image}
                          alt="Product"
                          className="w-10 h-10 mr-3 rounded object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/40?text=No+Image";
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
                    Amount: Rs. {order.Total_Amount}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Date: {new Date(order.Date_Time).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    Delivery: {order.Delivery_Date
                      ? new Date(order.Delivery_Date).toLocaleDateString()
                      : "Not set"}
                  </div>
                  
                  {/* Payment status and order status controls */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-xs text-gray-700 mb-1">Order Status:</div>
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
                        <option value="Awaiting Delivery">Awaiting Delivery</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <div>
                      <div className="text-xs text-gray-700 mb-1">Payment Status:</div>
                      <select
                        value={order.Payment_Stats}
                        onChange={(e) =>
                          handlePaymentStatusChange(order.idOrder, e.target.value)
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
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewOrder(order.idOrder)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="View Order"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-gray-500">
                No orders found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#5CAF90] text-white hover:bg-opacity-90"
              }`}
            >
              Previous
            </button>
            <span className="text-[#1D372E] text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#5CAF90] text-white hover:bg-opacity-90"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
