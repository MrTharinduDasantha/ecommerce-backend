import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [orderHistory] = useState([
        { id: '#01', name: 'Sarah', price: '07032219923', deliveryDate: '2025/01/7', orderDateTime: '2024-03-15 14:30', status: 'Completed' },
        { id: '#02', name: 'Jessica', price: '07032219923', deliveryDate: '2025/01/7', orderDateTime: '2024-03-15 15:45', status: 'Completed' },
        { id: '#03', name: 'Sam', price: '07032219923', deliveryDate: '2025/01/7', orderDateTime: '2024-03-15 16:20', status: 'Not Yet' },
        { id: '#04', name: 'John', price: '07032219923', deliveryDate: '2025/01/7', orderDateTime: '2024-03-15 17:15', status: 'Processing' },
    ]);

    // Filter orders based on search query
    const filteredOrders = orderHistory.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            order.id.toLowerCase().includes(query) ||
            order.name.toLowerCase().includes(query)
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
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-200">
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Tracking No</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Order Date & Time</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Order Name</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Price</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Delivery Date</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600">Order Status</th>
                            <th className="px-5 py-3 text-sm font-medium text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-white/60">
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.id}</td>
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.orderDateTime}</td>
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.name}</td>
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.price}</td>
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.deliveryDate}</td>
                                    <td className="px-5 py-4 text-sm text-gray-800">{order.status}</td>
                                    <td className="px-5 py-4">
                                        <button className="flex items-center space-x-1 bg-[#5CAF90] text-white px-3 py-1.5 rounded-lg hover:bg-[#408a6d] transition-colors">
                                            <VisibilityIcon className="h-5 w-5" />
                                            <span className="text-sm">View Order</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No orders found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistory; 