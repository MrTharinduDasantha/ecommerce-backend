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
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrderDetails(data);
      setSelectedStatus(data.order.Status);
      setLoading(false);
    } catch (err) {
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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
    <div className="bg-[#333] p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard/orders')} 
          className="flex items-center text-[#a3fe00] hover:text-white transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </button>
        <h1 className="text-2xl font-bold text-white">Order #{order.idOrder}</h1>
      </div>

      {statusUpdateSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Order status updated successfully
        </div>
      )}

      {statusError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {statusError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#444] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-white">Order Information</h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between text-white">
              <span className="font-medium">Date:</span>
              <span>{new Date(order.Date_Time).toLocaleString()}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                {order.Status}
              </span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Total Amount:</span>
              <span>${order.Total_Amount}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Delivery Charges:</span>
              <span>${order.Delivery_Charges}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Net Amount:</span>
              <span>${order.Net_Amount}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Payment Type:</span>
              <span>{order.Payment_Type}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Payment Status:</span>
              <span>{order.Payment_Stats}</span>
            </p>
          </div>
        </div>

        <div className="bg-[#444] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-white">Customer Information</h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between text-white">
              <span className="font-medium">Name:</span>
              <span>{order.Full_Name}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Email:</span>
              <span>{order.Email}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Address:</span>
              <span>{order.Address}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">City:</span>
              <span>{order.City}</span>
            </p>
            <p className="flex justify-between text-white">
              <span className="font-medium">Country:</span>
              <span>{order.Country}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#444] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Update Order Status</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                disabled={updatingStatus}
                className={`px-4 py-2 rounded capitalize ${
                  selectedStatus === status
                    ? 'bg-gray-100 text-[#2d2d2d] border-2 border-[#a3fe00]'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleStatusChange}
              disabled={updatingStatus || selectedStatus === order.Status}
              className={`px-6 py-2 rounded font-medium ${
                updatingStatus || selectedStatus === order.Status
                  ? 'bg-gray-600 text-white cursor-not-allowed'
                  : 'bg-[#a3fe00] text-[#2d2d2d] hover:bg-opacity-90'
              }`}
            >
              Update
            </button>
            
            {updatingStatus && (
              <span className="ml-3 text-white flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#a3fe00] mr-2"></div>
                Updating...
              </span>
            )}
            
            {selectedStatus !== order.Status && !updatingStatus && (
              <span className="ml-3 text-white">
                Change status from <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>{order.Status}</span> to <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStatus)}`}>{selectedStatus}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#444] p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-white">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="text-xs uppercase bg-[#555] text-white">
              <tr>
                <th scope="col" className="px-4 py-3">Product</th>
                <th scope="col" className="px-4 py-3">Variant</th>
                <th scope="col" className="px-4 py-3">Price</th>
                <th scope="col" className="px-4 py-3">Quantity</th>
                <th scope="col" className="px-4 py-3">Discount</th>
                <th scope="col" className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} className="border-b border-[#555] hover:bg-[#555] transition-colors">
                    <td className="px-4 py-3">{item.product_name}</td>
                    <td className="px-4 py-3">
                      {item.Colour && item.Size ? `${item.Colour}, ${item.Size}` : item.Colour || item.Size || 'N/A'}
                    </td>
                    <td className="px-4 py-3">${item.Rate}</td>
                    <td className="px-4 py-3">{item.Qty}</td>
                    <td className="px-4 py-3">
                      {item.Discount_Percentage > 0 ? (
                        <span>{item.Discount_Percentage}% (${item.Discount_Amount})</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">${item.Total_Amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 