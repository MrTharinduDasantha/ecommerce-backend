import React, { useState, useEffect, useContext, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { formatPrice } from "./FormatPrice";

const CurrentOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCurrentOrders = async () => {
      if (!user?.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:9000/api/orders/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch current orders");
        setLoading(false);
      }
    };
    fetchCurrentOrders();
  }, [user]);

  // Filter orders based on search query (by ID, date, status, or items)
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    // Match by Order ID (partial or full)
    const idStr = order.idOrder ? String(order.idOrder).toLowerCase() : "";
    if (idStr.includes(query)) return true;

    // Match by Order Date (date string or partial date)
    if (order.Date_Time) {
      const dateObj = new Date(order.Date_Time);
      const dateStr = dateObj.toLocaleDateString().toLowerCase();
      const dateTimeStr = dateObj.toLocaleString().toLowerCase();
      if (
        dateStr.includes(query) ||
        dateTimeStr.includes(query) ||
        order.Date_Time.toLowerCase().includes(query)
      )
        return true;
    }

    // Match by Status
    const statusStr = (order.Status || "").toLowerCase();
    if (statusStr.includes(query)) return true;

    // Match by Amount
    const amountStr = order.Total_Amount
      ? Number(order.Total_Amount).toFixed(2).toLowerCase()
      : "";
    if (amountStr.includes(query)) return true;

    // Match by Customer Name
    const nameStr = order.Full_Name ? order.Full_Name.toLowerCase() : "";
    if (nameStr.includes(query)) return true;

    // Match by Address
    const addressStr = order.Address ? order.Address.toLowerCase() : "";
    if (addressStr.includes(query)) return true;

    return false;
  });

  // Handle search input change
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // Handle view order button click
  const handleViewOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 relative">
      <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 mb-4">
        Current Orders
      </h2>

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
          className="absolute right-[10px] top-1/2 -translate-y-1/2 h-[35px] w-[35px] bg-[#4B9B7D] rounded-lg flex items-center justify-center text-white hover:bg-[#408a6d] transition-colors"
          onClick={() => setShowPopup(true)}
          tabIndex={-1}
        >
          <SearchIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
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
                        {order.Date_Time
                          ? new Date(order.Date_Time).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1">
                        {order.Total_Amount
                          ? formatPrice(order.Total_Amount)
                          : formatPrice(0)}
                      </td>
                      <td className="px-2 py-1">{order.Status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No orders found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Order No
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Order Date & Time
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Customer Name
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Address
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Total Amount
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-left">
                  Status
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.idOrder} className="border-b border-gray-100">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.idOrder}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.Date_Time
                        ? new Date(order.Date_Time).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.Full_Name || "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.Address ? order.Address : "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.Total_Amount
                        ? formatPrice(order.Total_Amount)
                        : formatPrice(0)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800">
                      {order.Status || "-"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <button
                        className="flex items-center space-x-0.5 sm:space-x-1 bg-[#5CAF90] text-white px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-[#408a6d] transition-colors"
                        onClick={() => handleViewOrder(order.idOrder)}
                      >
                        <VisibilityIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
                        <span className="text-[8px] sm:text-xs md:text-sm">
                          View Order
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-2 sm:px-4 py-4 sm:py-5 md:py-6 text-center text-[8px] sm:text-xs md:text-sm text-gray-500"
                  >
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

export default CurrentOrders;
