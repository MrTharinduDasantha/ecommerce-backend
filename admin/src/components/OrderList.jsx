import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api/orders';
import { FiEye } from 'react-icons/fi';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(currentPage);
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
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
    try {
      setUpdatingStatus(orderId);
      await updateOrderStatus(orderId, newStatus);
      
      // Update the orders list locally
      setOrders(orders.map(order => 
        order.idOrder === orderId 
          ? { ...order, Status: newStatus } 
          : order
      ));
      
      setUpdatingStatus(null);
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Order Packed':
        return 'bg-blue-100 text-blue-800';
      case 'Awaiting Delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a3fe00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={fetchOrders} 
          className="mt-4 bg-[#a3fe00] text-[#2d2d2d] px-4 py-2 rounded hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-[#1D372E]">Manage Orders</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[#1D372E]">
          <thead className="text-xs uppercase bg-[#5CAF90] text-white">
            <tr>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Tracking No</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 hidden sm:table-cell">Order Date & Time</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Order Name</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 hidden sm:table-cell">Price</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 hidden md:table-cell">Delivery Date</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Order Status</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.idOrder} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    <div className="flex items-center">
                      {order.product_image ? (
                        <img 
                          src={order.product_image} 
                          alt="Product" 
                          className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 rounded object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                          }} 
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 mr-2 sm:mr-3">
                          No IMG
                        </div>
                      )}
                      <div>
                        <span className="block">#{order.idOrder}</span>
                        <span className="block text-xs text-gray-500 sm:hidden">{new Date(order.Date_Time).toLocaleDateString()}</span>
                        <span className="block text-xs text-gray-500 sm:hidden">${order.Total_Amount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 hidden sm:table-cell">{new Date(order.Date_Time).toLocaleString()}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">{order.Full_Name}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 hidden sm:table-cell">${order.Total_Amount}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 hidden md:table-cell">{order.Delivery_Date ? new Date(order.Delivery_Date).toLocaleDateString() : 'Not set'}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    {updatingStatus === order.idOrder ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#5CAF90] rounded-full"></div>
                        <span className="text-xs sm:text-sm">Updating...</span>
                      </div>
                    ) : (
                      <select
                        value={order.Status}
                        onChange={(e) => handleStatusChange(order.idOrder, e.target.value)}
                        className={`px-1 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getStatusColor(order.Status)}`}
                      >
                        <option value="Order Confirmed" className="bg-white text-yellow-800">Order Confirmed</option>
                        <option value="Order Packed" className="bg-white text-blue-800">Order Packed</option>
                        <option value="Awaiting Delivery" className="bg-white text-indigo-800">Awaiting Delivery</option>
                        <option value="Out for Delivery" className="bg-white text-purple-800">Out for Delivery</option>
                        <option value="Delivered" className="bg-white text-green-800">Delivered</option>
                      </select>
                    )}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    <button
                      onClick={() => handleViewOrder(order.idOrder)}
                      className="text-[#5CAF90] hover:text-[#1D372E] mr-2"
                      title="View Order"
                    >
                      <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-3 py-2 sm:px-6 sm:py-4 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#5CAF90] text-white hover:bg-opacity-90'
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
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#5CAF90] text-white hover:bg-opacity-90'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList; 