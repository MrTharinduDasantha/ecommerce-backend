import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatPrice } from './FormatPrice';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef(null);

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

    // Filter orders based on search query (by ID, date, or items)
    const filteredOrders = orderHistory.filter(order => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        // Match by Order ID (partial or full)
        const idStr = order.idOrder ? String(order.idOrder).toLowerCase() : '';
        if (idStr.includes(query)) return true;

        // Match by Order Date (date string or partial date)
        if (order.order_date) {
            const dateObj = new Date(order.order_date);
            const dateStr = dateObj.toLocaleDateString().toLowerCase();
            const dateTimeStr = dateObj.toLocaleString().toLowerCase();
            // Allow search by YYYY-MM-DD or DD/MM/YYYY or MM/DD/YYYY or any substring
            if (
                dateStr.includes(query) ||
                dateTimeStr.includes(query) ||
                order.order_date.toLowerCase().includes(query)
            ) return true;
        }

        // Match by Items (product name or quantity)
        if (Array.isArray(order.items)) {
            const itemsMatch = order.items.some(item =>
                (item.product_name && item.product_name.toLowerCase().includes(query)) ||
                (item.Qty && String(item.Qty).toLowerCase().includes(query))
            );
            if (itemsMatch) return true;
        }

        // Match by Status
        const statusStr = (order.order_status || order.Status || '').toLowerCase();
        if (statusStr.includes(query)) return true;

        // Match by Amount
        const amountStr = order.Net_Amount ? Number(order.Net_Amount).toFixed(2).toLowerCase() : '';
        if (amountStr.includes(query)) return true;

        return false;
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowPopup(true);
    };

    // Close popup when clicking outside
    useEffect(() => {
        if (!showPopup) return;
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPopup]);

    return (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 relative">
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 mb-4">Order History</h2>
            
            {/* Search Bar */}
            <div className="relative mb-4 inline-block w-full sm:w-auto">
                <input
                    type="text"
                    placeholder="SEARCH ORDER"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full sm:w-[285px] h-[40px] sm:h-[45px] pl-4 pr-12 border border-gray-300 rounded-lg text-sm"
                    onFocus={() => setShowPopup(true)}
                />
                <button
                    className="absolute right-[3px] top-1/2 -translate-y-1/2 h-[39px] w-[39px] bg-[#4B9B7D] rounded-lg flex items-center justify-center text-white hover:bg-[#408a6d] transition-colors"
                    onClick={() => setShowPopup(true)}
                    tabIndex={-1}
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
                {/* Popup for search results */}
                {showPopup && searchQuery && (
                    <div
                        ref={popupRef}
                        className="absolute left-0 z-50 mt-2 w-[350px] max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : filteredOrders.length > 0 ? (
                            <table className="min-w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-2 py-1">Order ID</th>
                                        <th className="px-2 py-1">Order Date</th>
                                        <th className="px-2 py-1">Amount</th>
                                        <th className="px-2 py-1">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.slice(0, 8).map((order) => (
                                        <tr
                                            key={order.idOrder}
                                            className="hover:bg-[#f4f4f4] cursor-pointer"
                                            onClick={() => {
                                                setSearchQuery(order.idOrder.toString());
                                                setShowPopup(false);
                                            }}
                                        >
                                            <td className="px-2 py-1">{order.idOrder}</td>
                                            <td className="px-2 py-1">
                                                {order.order_date
                                                    ? new Date(order.order_date).toLocaleString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-2 py-1">
                                                {order.Net_Amount
                                                    ? formatPrice(order.Net_Amount)
                                                    : formatPrice(0)}
                                            </td>
                                            <td className="px-2 py-1">{order.order_status || order.Status || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-4 text-center text-gray-500">No orders found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-left">Order ID</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-left">Order Date</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-left">Total Amount</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-left">Status</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-left">Items</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.idOrder} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                            {order.idOrder}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                            {order.order_date
                                                ? new Date(order.order_date).toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                            {order.Net_Amount
                                                ? formatPrice(order.Net_Amount)
                                                : formatPrice(0)}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-gray-800 whitespace-nowrap">
                                            {order.order_status || order.Status || 'N/A'}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs md:text-sm text-gray-800">
                                            <div className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px]">
                                                {Array.isArray(order.items) && order.items.length > 0
                                                    ? order.items.map((item, idx) => (
                                                        <div key={idx} className="truncate">
                                                            {item.product_name} x {item.Qty}
                                                        </div>
                                                    ))
                                                    : <span className="text-gray-400">No items</span>}
                                            </div>
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                            <button className="inline-flex items-center space-x-1 bg-[#5CAF90] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-[#408a6d] transition-colors text-[10px] sm:text-xs md:text-sm">
                                                <VisibilityIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                                                <span>View Order</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-2 sm:px-4 py-4 text-center text-[10px] sm:text-xs md:text-sm text-gray-500">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;