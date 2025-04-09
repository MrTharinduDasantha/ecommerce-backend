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
    const response = await api.post("/api/admin/users", newUser);
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

// Password reset API calls
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/api/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/api/users/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post("/api/users/reset-password", {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchAdminLogs = async () => {
  try {
    const response = await api.get("/api/users/logs");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const logAdminAction = async (action, deviceInfo, newUserInfo) => {
  try {
    const response = await api.post("/api/admin/logs", {
      action,
      device_info: deviceInfo,
      new_user_info: newUserInfo,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging admin action:", error);
    throw error.response ? error.response.data : error.message;
  }
};
