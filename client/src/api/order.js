import axios from "axios"
import { getToken } from "../utils/auth"

// Fetch customer orders by customer ID
export const getCustomerOrders = async customerId => {
  try {
    const token = getToken()
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
    console.error("Error fetching customer orders:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch orders")
  }
}

// Create order
export const createOrder = async orderData => {
  try {
    const token = getToken()
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
    console.error("Error creating order: ", error)
    throw new Error(error.response?.data?.message || "Failed to create order")
  }
}
