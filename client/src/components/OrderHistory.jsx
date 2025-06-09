import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!user?.id) {
                setError('User not logged in');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:9000/api/orders/${user.id}/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrderHistory(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order history');
                setLoading(false);
            }
        };
        fetchOrderHistory();
    }, [user]);

    // Filter orders based on search query
    const filteredOrders = orderHistory.filter(order => {
        const query = searchQuery.toLowerCase();
        // Convert idOrder to string before using toLowerCase
        const idStr = order.idOrder ? String(order.idOrder).toLowerCase() : '';
        const nameStr = order.name ? order.name.toLowerCase() : '';
        return (
            idStr.includes(query) ||
            nameStr.includes(query)
        );
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">Order History</h2>
            
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative inline-block">
                    <input
                        type="text"
                        placeholder="SEARCH ORDER"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-[285px] h-[45px] pl-4 pr-[50px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83] focus:border-[#4B2E83] text-sm"
                    />
                    <button className="absolute right-[3px] top-1/2 -translate-y-1/2 h-[39px] w-[39px] bg-[#4B9B7D] rounded-lg flex items-center justify-center text-white hover:bg-[#408a6d] transition-colors">
                        <SearchIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg">
                {loading ? (
                    <div>Loading order history...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : orderHistory.length === 0 ? (
                    <div>No order history found.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Order Date</th>
                                <th className="px-4 py-2">Total Amount</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Items</th>
                                <th className="px-5 py-3 text-sm font-medium text-gray-600 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.idOrder} className="border-b border-gray-100 hover:bg-white/60">
                                        <td className="px-4 py-2">{order.idOrder}</td>
                                        <td className="px-4 py-2">
                                            {order.order_date
                                                ? new Date(order.order_date).toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.Net_Amount
                                                ? Number(order.Net_Amount).toFixed(2)
                                                : '0.00'}
                                        </td>
                                        <td className="px-4 py-2">{order.order_status || order.Status || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            {Array.isArray(order.items) && order.items.length > 0
                                                ? order.items.map((item, idx) => (
                                                    <div key={idx}>
                                                        {item.product_name} x {item.Qty}
                                                    </div>
                                                ))
                                                : <span className="text-gray-400">No items</span>}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button className="flex items-center space-x-1 bg-[#5CAF90] text-white px-3 py-1.5 rounded-lg hover:bg-[#408a6d] transition-colors">
                                                <VisibilityIcon className="h-5 w-5" />
                                                <span className="text-sm">View Order</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;