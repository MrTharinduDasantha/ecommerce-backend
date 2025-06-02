import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../client/src/context/AuthContext';
import { getCustomerOrders } from '../api/order'; // Adjust the import path based on your project structure

const CurrentOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user from AuthContext

    // Fetch orders when component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            // Fix: Use user?.id instead of user?.customerId
            if (!user?.id) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getCustomerOrders(user.id); // Use user.id
                // Map API response to match table structure
                const formattedOrders = response.map(order => {
                    // Ensure Net_Amount is a number before calling toFixed
                    let netAmount = Number(order.Net_Amount);
                    if (isNaN(netAmount)) netAmount = 0;
                    return {
                        id: `#${order.idOrder}`,
                        name: order.Full_Name || 'Unknown', // From Delivery_Address.Full_Name
                        price: netAmount.toFixed(2), // Use Net_Amount safely
                        deliveryDate: order.Delivery_Date ? new Date(order.Delivery_Date).toLocaleDateString() : 'N/A', // Format Delivery_Date
                        orderDateTime: order.Date_Time ? new Date(order.Date_Time).toLocaleString() : 'N/A', // Format Date_Time
                        status: order.Status || 'Unknown' // Use Status
                    };
                });
                setOrders(formattedOrders);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders');
                setLoading(false);
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, [user]);

    // Filter orders based on search query
    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            order.id.toLowerCase().includes(query) ||
            order.name.toLowerCase().includes(query)
        );
    });

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle view order button click
    const handleViewOrder = (orderId) => {
        const numericId = orderId.replace('#', '');
        navigate(`/order-tracking/${numericId}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-5">
            <h2 className="text-sm sm:text-base md:text-xl font-medium text-gray-800 mb-2 sm:mb-3 md:mb-5">Current Orders</h2>
            
            {/* Search Bar */}
            <div className="relative mb-2 sm:mb-3 md:mb-5 inline-block">
                <input
                    type="text"
                    placeholder="SEARCH ORDER"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-[200px] sm:w-[250px] md:w-[285px] h-[35px] sm:h-[40px] md:h-[45px] pl-2 sm:pl-3 md:pl-4 pr-[40px] sm:pr-[45px] md:pr-[50px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83] focus:border-[#4B2E83] text-[10px] sm:text-xs md:text-sm"
                />
                <button className="absolute right-[2px] sm:right-[3px] top-1/2 -translate-y-1/2 h-[31px] sm:h-[35px] md:h-[39px] w-[31px] sm:w-[35px] md:w-[39px] bg-[#4B9B7D] rounded-lg flex items-center justify-center text-white hover:bg-[#408a6d] transition-colors">
                    <SearchIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto -mx-2 sm:-mx-3 md:-mx-5">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-gray-50">
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Tracking No</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Order Date & Time</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Order Name</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Price</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Delivery Date</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600">Order Status</th>
                            <th className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-3 text-[8px] sm:text-xs md:text-sm font-medium text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-2 sm:px-3 md:px-5 py-4 sm:py-5 md:py-6 text-center text-[8px] sm:text-xs md:text-sm text-gray-500">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="px-2 sm:px-3 md:px-5 py-4 sm:py-5 md:py-6 text-center text-[8px] sm:text-xs md:text-sm text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100">
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">{order.id}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">{order.orderDateTime}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">{order.name}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">${order.price}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">{order.deliveryDate}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4 text-[8px] sm:text-xs md:text-sm text-gray-800">{order.status}</td>
                                    <td className="px-2 sm:px-3 md:px-5 py-2 sm:py-2.5 md:py-4">
                                        <button 
                                            className="flex items-center space-x-0.5 sm:space-x-1 bg-[#5CAF90] text-white px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-[#408a6d] transition-colors"
                                            onClick={() => handleViewOrder(order.id)}
                                        >
                                            <VisibilityIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                                            <span className="text-[8px] sm:text-xs md:text-sm">View Order</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-2 sm:px-3 md:px-5 py-4 sm:py-5 md:py-6 text-center text-[8px] sm:text-xs md:text-sm text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CurrentOrders;