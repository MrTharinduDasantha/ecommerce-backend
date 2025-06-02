import React, { useEffect, useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Map from "../assets/map.png";
import OrderDetails from "./OrderDetails";
import { AuthContext } from "../../../client/src/context/AuthContext";
import axios from "axios";

const OrderTracking = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user?.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // Fetch order details for this customer and order
        const response = await axios.get(
          `http://localhost:9000/api/orders/${user.id}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, user]);

  if (loading) {
    return <div className="p-6">Loading order details...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  // Calculate order totals
  const subtotal = order.items?.reduce(
    (sum, item) => sum + ((item.Rate || 0) * (item.Qty || 1)),
    0
  );
  const discount = 0; // Add discount logic if available
  const deliveryFee = order.order?.Delivery_Charges || 0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-full mx-auto">
        <h2 className="text-2xl font-semibold text-center">
          Order <span className="text-[#5CAF90]">Tracking</span>
        </h2>
        <div className="flex justify-center gap-2 mt-4">
          <input
            type="text"
            className="border border-[#E8E8E8] bg-gray-50 p-2 rounded-lg w-80 focus:outline-none text-center"
            placeholder="Search Using Tracking Code"
          />
          <button className="bg-[#5CAF90] text-white p-3 rounded-lg cursor-pointer">
            <FaSearch />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-1">
            <OrderDetails
              cartItems={order.items}
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
              orderInfo={{
                orderNo: order.order?.idOrder || id,
                deliveryDate: order.order?.Delivery_Date
                  ? new Date(order.order.Delivery_Date).toLocaleDateString()
                  : "N/A",
                address: order.order?.Address || "N/A",
              }}
            />
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
            <div className="flex items-center justify-center h-full text-gray-400">
              Order status tracking coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;