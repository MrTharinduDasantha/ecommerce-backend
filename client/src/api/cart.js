import axios from "axios";

// API base URL
const API_URL = "http://localhost:9000";

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from local storage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// -----------------------
// Cart Related API Calls
// -----------------------

// Get cart for a customer
export const getCart = async (customerId) => {
  try {
    const response = await api.get(`/api/carts/${customerId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add product to cart
export const addToCart = async (data) => {
  try {
    const response = await api.post("/api/carts/add", data);
     console.log(response,"rashel")
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update cart item quantity
export const updateCartItem = async (data) => {
  try {
    const response = await api.put("/api/carts/update", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Remove product from cart
export const removeFromCart = async (data) => {
  try {
    const response = await api.delete("/api/carts/remove", { data });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Clear cart
export const clearCart = async (data) => {
  try {
    const response = await api.delete("/api/carts/clear", { data });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add note to cart item
export const addNoteToCartItem = async (data) => {
  try {
    const response = await api.put("/api/carts/note", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Checkout
export const checkout = async (data) => {
  try {
    const response = await api.post("/api/carts/checkout", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
