import axios from "axios"
import { getToken } from "../utils/auth"

// Fetch customer orders by customer ID
export const getCustomerOrders = async customerId => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    const token = getToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(`Fetching orders for customer ID: ${customerId} with token: ${token.substring(0, 15)}...`);
    
    const response = await axios.get(
      `http://localhost:9000/api/orders/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error.response?.data?.message || "Failed to fetch orders")
  }
}

// Get order details by customer ID and order ID
export const getOrderDetails = async (customerId, orderId) => {
  try {
    if (!customerId || !orderId) {
      throw new Error("Customer ID and Order ID are required");
    }

    const token = getToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(`Fetching order details for customer: ${customerId}, order: ${orderId}`);
    
    const response = await axios.get(
      `http://localhost:9000/api/orders/${customerId}/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching order details:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error.response?.data?.message || "Failed to fetch order details")
  }
}

// Track order status by customer ID and order ID
export const trackOrder = async (customerId, orderId) => {
  try {
    if (!customerId || !orderId) {
      throw new Error("Customer ID and Order ID are required");
    }

    const token = getToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(`Tracking order for customer: ${customerId}, order: ${orderId}`);
    
    const response = await axios.get(
      `http://localhost:9000/api/orders/${customerId}/${orderId}/track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error tracking order:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error.response?.data?.message || "Failed to track order")
  }
}

// Create order
export const createOrder = async orderData => {
  try {
    if (!orderData || !orderData.customer_id) {
      throw new Error("Order data with customer ID is required");
    }

    const token = getToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(`Creating order for customer: ${orderData.customer_id}`);
    
    const res = await axios.post(
      "http://localhost:9000/api/orders",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  } catch (error) {
    console.error("Error creating order: ", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw new Error(error.response?.data?.message || "Failed to create order")
  }
}
