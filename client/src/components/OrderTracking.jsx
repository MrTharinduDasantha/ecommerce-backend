import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCustomerOrders, getOrderDetails, trackOrder } from "../api/order";
import Map from "../assets/map.png";
import OrderDetails from "./OrderDetails";
import { formatPrice } from "./FormatPrice";

const OrderTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get customer ID from user object
  const customerId = user?.id;

  // Fetch all orders for the user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (customerId) {
          console.log("Fetching orders for customer ID:", customerId);
          const ordersData = await getCustomerOrders(customerId);
          console.log("Orders response:", ordersData);
          
          // Handle both array or object response formats
          const ordersArray = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];
          
          setOrders(ordersArray);
          
          // If an ID is provided in the URL, select that order
          if (id && ordersArray.length > 0) {
            const order = ordersArray.find(order => order.idOrder.toString() === id);
            if (order) {
              setSelectedOrder(order);
            } else {
              // If order with ID not found, select the first order
              setSelectedOrder(ordersArray[0]);
            }
          } else if (ordersArray.length > 0) {
            // If no ID provided, select the first order
            setSelectedOrder(ordersArray[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, id]);

  // Fetch order details and tracking when selected order changes
  useEffect(() => {
    const fetchOrderDetailsAndTracking = async () => {
      if (selectedOrder && customerId) {
        try {
          setLoading(true);
          
          // Use idOrder for API calls
          const orderId = selectedOrder.idOrder;
          
          // Fetch order details
          const detailsResponse = await getOrderDetails(customerId, orderId);
          console.log("Order details:", detailsResponse);
          setOrderDetails(detailsResponse);
          
          // Fetch tracking information
          const trackingResponse = await trackOrder(customerId, orderId);
          console.log("Tracking info:", trackingResponse);
          setTrackingInfo(trackingResponse);
          
        } catch (err) {
          console.error("Error fetching order details:", err);
          setError("Failed to load order details. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrderDetailsAndTracking();
  }, [selectedOrder, customerId]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  if (!user) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Please sign in to view your orders</h2>
          <p className="mt-2 text-gray-600">You need to be logged in to track your orders.</p>
          <p className="mt-2 text-gray-500">User data: {JSON.stringify(user)}</p>
        </div>
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading your orders...</h2>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold">{error}</h2>
          <p className="mt-4">Debug info:</p>
          <p>User ID: {customerId || 'Not available'}</p>
          <p>User object: {JSON.stringify(user)}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No orders found</h2>
          <p className="mt-2 text-gray-600">You haven't placed any orders yet.</p>
          <p className="mt-2 text-gray-500">User ID: {customerId}</p>
        </div>
      </div>
    );
  }

  // Get tracking status from the tracking info
  const getOrderStatusItems = () => {
    // If we have tracking info, use it
    if (trackingInfo && trackingInfo.status_history) {
      return trackingInfo.status_history.map((item, index) => {
        const isActive = index === 0; // Most recent status is active
        const isCompleted = true; // All history items are completed

        return {
          id: item.id || index + 1,
          status: item.status_to || "Status Update",
          completed: isCompleted,
          active: isActive,
          date: item.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
        };
      });
    }

    // Fallback if no tracking info available
    return [
      {
        id: 1,
        status: "Order Confirmed",
        completed: true,
        active: false,
        date: selectedOrder?.created_at ? new Date(selectedOrder.created_at).toLocaleString() : "N/A",
      },
      {
        id: 2,
        status: "Processing",
        completed: selectedOrder?.Delivery_Status === "processing",
        active: selectedOrder?.Delivery_Status === "processing",
        date: "N/A",
      },
      {
        id: 3,
        status: "Shipped",
        completed: selectedOrder?.Delivery_Status === "shipped",
        active: selectedOrder?.Delivery_Status === "shipped",
        date: "N/A",
      },
      {
        id: 4,
        status: "Delivered",
        completed: selectedOrder?.Delivery_Status === "delivered",
        active: selectedOrder?.Delivery_Status === "delivered",
        date: "N/A",
      }
    ];
  };

  // Calculate order totals for the selected order
  const orderItems = orderDetails?.items || [];
  
  // Use the fields from the actual API response
  const subtotal = selectedOrder?.Total_Amount ? parseFloat(selectedOrder.Total_Amount) : 0;
  const discount = 0; // No discount field in the response
  const deliveryFee = selectedOrder?.Delivery_Charges ? parseFloat(selectedOrder.Delivery_Charges) : 0;
  const total = selectedOrder?.Net_Amount ? parseFloat(selectedOrder.Net_Amount) : subtotal + deliveryFee;

  // Current order status from tracking info or selected order
  const currentStatus = trackingInfo?.current_status || {
    delivery_date: selectedOrder?.Delivery_Date,
    delivery_status: selectedOrder?.Delivery_Status,
    payment_status: selectedOrder?.Payment_Stats
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-full mx-auto">
        <h2 className="text-2xl font-semibold text-center">
          Your <span className="text-[#5CAF90]">Orders</span>
        </h2>
        
        {orders.length > 1 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Select an order to track:</h3>
            <div className="flex flex-wrap gap-2">
              {orders.map((order) => (
                <button
                  key={order.idOrder}
                  onClick={() => handleOrderSelect(order)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedOrder?.idOrder === order.idOrder
                      ? "bg-[#5CAF90] text-white border-[#5CAF90]"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Order #{order.idOrder}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8]">
              <h3 className="text-lg font-semibold text-center mb-4">
                Order <span className="text-[#5CAF90]">Summary</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order #:</span>
                  <span className="font-medium">{selectedOrder?.idOrder || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedOrder?.Date_Time || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{selectedOrder?.Payment_Type || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-medium capitalize ${
                    selectedOrder?.Payment_Stats === "paid" ? "text-green-500" : "text-orange-500"
                  }`}>
                    {selectedOrder?.Payment_Stats || "N/A"}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Type:</span>
                  <span className="font-medium capitalize">{selectedOrder?.Delivery_Type || "N/A"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Status:</span>
                  <span className="font-medium capitalize">{selectedOrder?.Delivery_Status || "N/A"}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-green-500">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">{formatPrice(deliveryFee)}</span>
                  </div>
                  
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Delivery Address</h4>
                <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                  <p className="font-medium">{selectedOrder?.Full_Name || "N/A"}</p>
                  <p>{selectedOrder?.Address || "N/A"}</p>
                  <p>{selectedOrder?.City || "N/A"}, {selectedOrder?.Country || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Map (fixed height) */}
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] flex flex-col h-[500px]">
            <h3 className="text-lg font-semibold text-center mb-4">
              Delivery <span className="text-[#5CAF90]">Location</span>
            </h3>
            <div className="flex-grow border rounded-lg border-gray-200 overflow-hidden">
              <img
                src={Map}
                alt="Map"
                className="w-full h-full object-cover bg-white"
              />
            </div>
          </div>

          {/* Right Section - Tracking Status (fixed height) */}
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] flex flex-col h-[500px]">
            <h3 className="text-lg font-semibold text-center">
              Order <span className="text-[#5CAF90]">Status</span>
            </h3>

            {/* Status Timeline */}
            <div className="relative mt-4 flex-grow overflow-y-auto">
              {/* Vertical line */}
              <div className="absolute left-[14px] top-0 h-full w-0.5 bg-gray-300 "></div>

              {/* Status Items */}
              <ul className="space-y-4 pl-5">
                {getOrderStatusItems().map((item) => (
                  <li
                    key={item.id}
                    className="relative flex items-center gap-2"
                  >
                    {/* Status dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-4 flex-shrink-0
                        ${
                          item.active
                            ? "border-[#5CAF90] bg-white animate-pulse"
                            : item.completed
                            ? "bg-[#5CAF90] border-[#5CAF90]"
                            : "bg-white border-gray-300"
                        }`}
                    ></div>

                    {/* Status content */}
                    <div
                      className={`p-2 w-full transition-all duration-200 ${
                        item.active
                          ? "bg-[#5CAF90]/10 border border-[#5CAF90] rounded-md"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm font-medium ${
                            item.completed
                              ? "text-[#5CAF90]"
                              : item.active
                              ? "text-[#5CAF90]"
                              : "text-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.completed && (
                          <span className="text-xs text-gray-500">✓</span>
                        )}
                      </div>
                      {item.date && (
                        <p className="text-xs mt-0.5 text-gray-500">
                          {item.date}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Estimate */}
            <div className="mt-3 p-3 bg-gray-100 rounded-md border border-[#E8E8E8]">
              <div className="flex items-center">
                <div className="bg-[#5CAF90]/10 p-1.5 rounded-full mr-2">
                  <svg
                    className="w-4 h-4 text-[#5CAF90]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-xs text-gray-600">
                    {selectedOrder?.Delivery_Date 
                      ? new Date(selectedOrder.Delivery_Date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) 
                      : "Date not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;