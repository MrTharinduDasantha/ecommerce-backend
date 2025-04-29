import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as api from "../api/customer";
import toast from "react-hot-toast";
import { ArrowLeft } from 'lucide-react';

const CustomerorderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.order) {
      setOrderDetails(location.state.order);
      setDeliveryAddress(location.state.deliveryAddress);
      setLoading(false);
    } else {
      const fetchOrderDetails = async () => {
        try {
          const orderData = await api.getOrderById(orderId);
          setOrderDetails(orderData);

          if (location.state?.customerId) {
            const customerHistory = await api.getCustomerHistory(location.state.customerId);
            if (customerHistory.deliveryAddresses.length > 0) {
              setDeliveryAddress(customerHistory.deliveryAddresses[0]);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Failed to load order details");
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId, location.state]);

  const handleBack = () => {
    if (location.state?.customerId) {
      navigate(`/dashboard/customer/view-customer/${location.state.customerId}`);
    } else {
      navigate('/dashboard/orders');
    }
  };

  const calculateNetAmount = () => {
    const totalAmount = parseFloat(orderDetails.Total_Amount) || 0;
    const deliveryCharges = parseFloat(orderDetails.Delivery_Charges) || 0;
    return (totalAmount + deliveryCharges).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "#4B5563" }}>
        No order details found.
      </div>
    );
  }

  return (
    <div className="w-300 mx-auto p-6 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="p-4 md:p-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#5CAF90",
              transition: "color 0.3s",
              cursor: "pointer",
              background: "none",
              border: "none",
              marginBottom: "24px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#4a9277")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#5CAF90")}
          >
            <ArrowLeft style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Back to Customer Details</span>
          </button>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <div style={{ width: "4px", height: "24px", backgroundColor: "#5CAF90" }}></div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1D372E" }}>Order Details</h2>
          </div>

          {/* Order Info Card */}
          <div style={{ backgroundColor: "#F4F4F4", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px", marginBottom: "24px" }}>
            <h4 style={{ fontWeight: "700", color: "#1D372E", fontSize: "16px", marginBottom: "16px" }}>
              Order #{orderDetails.idOrder || orderDetails.id}
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", "@media (min-width: 768px)": { gridTemplateColumns: "1fr 1fr" } }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <h5 style={{ fontWeight: "600", color: "#1D372E", fontSize: "14px", marginBottom: "12px" }}>Order Information</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Order ID:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.idOrder || orderDetails.id}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Status:</span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          backgroundColor: orderDetails.Status === 'Delivered' ? "#DCFCE7" : "#FEF9C3",
                          color: orderDetails.Status === 'Delivered' ? "#166534" : "#713F12",
                        }}
                      >
                        {orderDetails.Status}
                      </span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Date and Time:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Date_Time}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Delivery Type:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Delivery_Type}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Payment Type:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Payment_Type}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Payment Stats:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Payment_Stats}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Customer_Note:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Customer_Note}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Supplier Note:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Supplier_Note}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Amount:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>${orderDetails.Total_Amount}</span>
                    </p>
                    <p style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Delivery Charges:</span>
                      <span style={{ fontWeight: "500", fontSize: "12px" }}>${orderDetails.Delivery_Charges}</span>
                    </p>
                    <div style={{ backgroundColor: "#000000", height: "2px", margin: "8px 0" ,width:"250px" }}></div>
                    <p style={{ display : "flex", alignItems: "center" }}>
                      <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Total Amount:</span>
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "12px",
                          backgroundColor: "#f9ddf2",
                          color: "black",
                          padding: "2px 6px",
                          borderRadius: "2px",
                        }}
                      >
                        ${calculateNetAmount()}
                      </span>
                    </p>
                    <div style={{ backgroundColor: "#000000", height: "2px", margin: "8px 0" ,width:"250px" }}></div>
                    {orderDetails.Payment_Method && (
                      <p style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ color: "#4B5563", width: "128px", fontSize: "14px" }}>Payment Method:</span>
                        <span style={{ fontWeight: "500", fontSize: "12px" }}>{orderDetails.Payment_Method}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {deliveryAddress && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    <h5 style={{ fontWeight: "600", color: "#1D372E", fontSize: "14px", marginBottom: "12px" }}>Delivery Address</h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <p style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ color: "#4B5563", width: "96px", fontSize: "14px" }}>Address:</span>
                        <span style={{ fontWeight: "500", fontSize: "12px" }}>{deliveryAddress.Address}</span>
                      </p>
                      <p style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ color: "#4B5563", width: "96px", fontSize: "14px" }}>City:</span>
                        <span style={{ fontWeight: "500", fontSize: "12px" }}>{deliveryAddress.City}</span>
                      </p>
                      <p style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ color: "#4B5563", width: "96px", fontSize: "14px" }}>Country:</span>
                        <span style={{ fontWeight: "500", fontSize: "12px" }}>{deliveryAddress.Country}</span>
                      </p>
                      {deliveryAddress.PostalCode && (
                        <p style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ color: "#4B5563", width: "96px", fontSize: "14px" }}>Postal Code:</span>
                          <span style={{ fontWeight: "500", fontSize: "12px" }}>{deliveryAddress.PostalCode}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Section */}
            {orderDetails.items && orderDetails.items.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h5 style={{ fontWeight: "600", color: "#1D372E", fontSize: "14px", marginBottom: "12px" }}>Order Items</h5>
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ backgroundColor: "#F9FAFB" }}>
                        <tr>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "left",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#6B7280",
                              textTransform: "uppercase",
                            }}
                          >
                            Product
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "left",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#6B7280",
                              textTransform: "uppercase",
                            }}
                          >
                            Quantity
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "left",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#6B7280",
                              textTransform: "uppercase",
                            }}
                          >
                            Price
                          </th>
                          <th
                            style={{
                              padding: "12px 24px",
                              textAlign: "left",
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#6B7280",
                              textTransform: "uppercase",
                            }}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "white" }}>
                        {orderDetails.items.map((item, index) => (
                          <tr key={index} style={{ borderTop: "1px solid #E5E7EB" }}>
                            <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6B7280" }}>
                              {item.product_name}
                            </td>
                            <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6B7280" }}>
                              {item.quantity}
                            </td>
                            <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6B7280" }}>
                              ${item.price}
                            </td>
                            <td style={{ padding: "16px 24px", whiteSpace: "nowrap", fontSize: "14px", color: "#6B7280" }}>
                              ${item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Order Details */}
            {orderDetails.notes && (
              <div style={{ marginTop: "24px", backgroundColor: "white", padding: "16px", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <h5 style={{ fontWeight: "600", color: "#1D372E", fontSize: "14px", marginBottom: "8px" }}>Order Notes</h5>
                <p style={{ fontSize: "12px", color: "#4B5563" }}>{orderDetails.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerorderDetailsPage;