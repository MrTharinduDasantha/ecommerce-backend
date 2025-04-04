// src/api/auth.js
import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://localhost:9000"; // Your API base URL

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up an interceptor to always use the latest token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await api.put(`/api/users/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const addUser = async (newUser) => {
  try {
    const response = await api.post("/api/users", newUser);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Authentication API Calls
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/users/login", { email, password });
    // Store the token received from the login response
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/api/admin/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// For status update
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/api/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUserPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/api/users/${userId}/password`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};
