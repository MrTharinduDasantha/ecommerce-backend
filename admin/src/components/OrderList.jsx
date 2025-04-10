import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, updatePaymentStatus } from '../api/orders';
import { FiEye, FiSearch, FiFilter, FiCalendar, FiX } from 'react-icons/fi';
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentStatus: '',
    orderStatus: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  useEffect(() => {
    // Apply filters and search whenever orders, filters, or search query changes
    applyFiltersAndSearch();
  }, [orders, filters, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log('Fetching orders, page:', currentPage);
      
      const data = await getOrders(currentPage);
      console.log('Orders data received:', data);
      
      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error in OrderList.fetchOrders:', err);
      setError(err.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...orders];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        (order.idOrder && order.idOrder.toString().includes(query)) ||
        (order.Full_Name && order.Full_Name.toLowerCase().includes(query)) ||
        (order.Email && order.Email.toLowerCase().includes(query))
      );
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59); // Set to end of day
      
      result = result.filter(order => {
        const orderDate = new Date(order.Date_Time);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply payment status filter
    if (filters.paymentStatus) {
      result = result.filter(order => 
        order.Payment_Status === filters.paymentStatus || 
        (!order.Payment_Status && filters.paymentStatus === 'Not Paid')
      );
    }

    // Apply order status filter
    if (filters.orderStatus) {
      result = result.filter(order => order.Status === filters.orderStatus);
    }

    setFilteredOrders(result);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      paymentStatus: '',
      orderStatus: ''
    });
    setSearchQuery('');
    setFilteredOrders(orders);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersAndSearch();
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

    Swal.fire({
      title: "Update Order Status",
      text: `Are you sure you want to change the order status from "${order.Status}" to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUpdatingStatus(orderId);
          await updateOrderStatus(orderId, newStatus);
          
          // Update the orders list locally
          setOrders(orders.map(order => 
            order.idOrder === orderId 
              ? { ...order, Status: newStatus } 
              : order
          ));
          
          toast.success("Order status updated successfully");
          setUpdatingStatus(null);
        } catch (err) {
          console.error('Failed to update order status:', err);
          toast.error('Failed to update order status');
          setUpdatingStatus(null);
        }
      }
    });
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    const order = orders.find(o => o.idOrder === orderId);
    if (!order) return;

    Swal.fire({
      title: "Update Payment Status",
      text: `Are you sure you want to change the payment status from "${order.Payment_Status || 'Not Paid'}" to "${newPaymentStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUpdatingPaymentStatus(orderId);
          await updatePaymentStatus(orderId, newPaymentStatus);
          
          // Update the orders list locally
          setOrders(orders.map(order => 
            order.idOrder === orderId 
              ? { ...order, Payment_Status: newPaymentStatus } 
              : order
          ));
          
          toast.success("Payment status updated successfully");
          setUpdatingPaymentStatus(null);
        } catch (err) {
          console.error('Failed to update payment status:', err);
          toast.error('Failed to update payment status');
          setUpdatingPaymentStatus(null);
        }
      }
    });
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md">
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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-[#1D372E]">Manage Orders</h1>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, name or email..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md text-[#1D372E] border-[#5CAF90]"
                />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-[#5CAF90] text-white rounded-md hover:bg-opacity-90 flex items-center"
              >
                <FiSearch className="mr-1" /> Search
              </button>
            </form>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-[#1D372E] text-white rounded-md hover:bg-opacity-90 flex items-center justify-center"
          >
            <FiFilter className="mr-1" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#1D372E] mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="pl-10 pr-3 py-2 w-full border rounded-md text-[#1D372E] border-gray-300"
                    />
                  </div>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="pl-10 pr-3 py-2 w-full border rounded-md text-[#1D372E] border-gray-300"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#1D372E] mb-1">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  className="px-3 py-2 w-full border rounded-md text-[#1D372E] border-gray-300"
                >
                  <option value="">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Paid">Not Paid</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#1D372E] mb-1">Order Status</label>
                <select
                  name="orderStatus"
                  value={filters.orderStatus}
                  onChange={handleFilterChange}
                  className="px-3 py-2 w-full border rounded-md text-[#1D372E] border-gray-300"
                >
                  <option value="">All Order Statuses</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Order Packed">Order Packed</option>
                  <option value="Awaiting Delivery">Awaiting Delivery</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-[#1D372E] rounded-md hover:bg-gray-300 flex items-center"
              >
                <FiX className="mr-1" /> Reset Filters
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          {(searchQuery || filters.startDate || filters.endDate || filters.paymentStatus || filters.orderStatus) && (
            <button
              onClick={resetFilters}
              className="text-[#5CAF90] hover:underline flex items-center"
            >
              <FiX className="mr-1" /> Clear all filters
            </button>
          )}
        </div>
      </div>
      
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
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Payment Status</th>
              <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                    {updatingPaymentStatus === order.idOrder ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#5CAF90] rounded-full"></div>
                        <span className="text-xs sm:text-sm">Updating...</span>
                      </div>
                    ) : (
                      <select
                        value={order.Payment_Status || 'Not Paid'}
                        onChange={(e) => handlePaymentStatusChange(order.idOrder, e.target.value)}
                        className={`px-1 py-1 rounded text-xs font-medium bg-white border border-gray-300 cursor-pointer ${getPaymentStatusColor(order.Payment_Status)}`}
                      >
                        <option value="Paid" className="bg-white text-green-800">Paid</option>
                        <option value="Pending" className="bg-white text-yellow-800">Pending</option>
                        <option value="Not Paid" className="bg-white text-red-800">Not Paid</option>
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
                <td colSpan="8" className="px-3 py-2 sm:px-6 sm:py-4 text-center">No orders found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - only show if we have unfiltered orders */}
      {orders.length > 0 && totalPages > 1 && (
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