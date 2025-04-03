import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../api/orders';
import { FiArrowLeft } from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (orderId) {
      // Validate orderId is a number before fetching
      if (!isNaN(parseInt(orderId, 10))) {
        fetchOrderDetails();
      } else {
        setError('Invalid order ID format. Order ID must be a number.');
        setLoading(false);
      }
    } else {
      setError('Order ID is required');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching order details for ID: ${orderId}`);
      
      const data = await getOrderById(orderId);
      console.log('Order details received:', data);
      
      setOrderDetails(data);
      setSelectedStatus(data.order.Status);
      setLoading(false);
    } catch (err) {
      console.error('Error in OrderDetails.fetchOrderDetails:', err);
      setError(err.message || 'Failed to fetch order details');
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === orderDetails.order.Status) {
      return;
    }
    
    try {
      setUpdatingStatus(true);
      setStatusError(null);
      setStatusUpdateSuccess(false);
      
      await updateOrderStatus(orderId, selectedStatus);
      
      // Re-fetch the order details to get the updated status
      await fetchOrderDetails();
      
      setStatusUpdateSuccess(true);
      setUpdatingStatus(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setStatusError(err.message || 'Failed to update order status');
      setUpdatingStatus(false);
    }
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
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
          onClick={fetchOrderDetails} 
          className="mt-4 bg-[#a3fe00] text-[#2d2d2d] px-4 py-2 rounded hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">Order not found</p>
        <button 
          onClick={() => navigate('/dashboard/orders')} 
          className="mt-4 bg-[#a3fe00] text-[#2d2d2d] px-4 py-2 rounded hover:bg-opacity-90 flex items-center justify-center mx-auto"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>
      </div>
    );
  }

  const { order, items } = orderDetails;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <button 
          onClick={() => navigate('/dashboard/orders')} 
          className="flex items-center text-[#5CAF90] hover:text-[#1D372E] transition-colors mb-2 sm:mb-0"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1D372E]">Order #{order.idOrder}</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">Order Information</h2>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <p className="flex justify-between text-[#1D372E]">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.Date_Time).toLocaleString()}</span>
            </p>
            <p className="flex justify-between text-[#1D372E]">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                {order.Status}
              </span>
            </p>
            <p className="flex justify-between text-[#1D372E]">
              <span className="font-medium">Total Amount:</span>
              <span>${order.Total_Amount}</span>
            </p>
            <p className="flex justify-between text-[#1D372E]">
              <span className="font-medium">Delivery Charges:</span>
              <span>${order.Delivery_Charges}</span>
            </p>
            <p className="flex justify-between text-[#1D372E]">
              <span className="font-medium">Net Amount:</span>
              <span>${order.Net_Amount}</span>
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
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">Customer Information</h2>
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
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">Customer Note</h2>
          <div className="text-xs sm:text-sm text-[#1D372E] bg-white p-3 rounded border border-gray-200">
            {order.Customer_Note}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">Update Order Status</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {['Order Confirmed', 'Order Packed', 'Awaiting Delivery', 'Out for Delivery', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                disabled={updatingStatus}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm capitalize ${
                  selectedStatus === status
                    ? 'bg-gray-100 text-[#1D372E] border-2 border-[#5CAF90]'
                    : 'bg-white text-[#1D372E] border border-gray-300 hover:bg-gray-50'
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
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#5CAF90] text-white hover:bg-opacity-90'
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
                Status will be updated from <span className="font-medium">{order.Status}</span> to <span className="font-medium">{selectedStatus}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-[#1D372E]">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left text-[#1D372E]">
            <thead className="text-xs uppercase bg-[#5CAF90] text-white">
              <tr>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Product</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 hidden sm:table-cell">Price</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Quantity</th>
                <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.idOrderItem} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 sm:px-6 sm:py-4">
                    <div className="flex items-center">
                      {item.product_image ? (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name} 
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
                        <span className="block">{item.product_name}</span>
                        <span className="block text-xs text-gray-500 sm:hidden">${item.Rate || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 hidden sm:table-cell">${item.Rate || 0}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">{item.Qty || 0}</td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4">${item.Total || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 