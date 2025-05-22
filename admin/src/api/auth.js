import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://localhost:9000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
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
    const response = await api.get("/api/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, updatedUser);
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

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/admin/users/login", { email, password });
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

export const updateUserStatus = async (userId, status) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateUserPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}/password`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for user ${userId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post("/api/admin/users/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/api/admin/users/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post("/api/admin/users/reset-password", {
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

export const logAdminAction = async (action, deviceInfo, newUserInfo) => {
  try {
    const response = await api.post("/api/admin/users/logs", {
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

export const fetchAdminLogs = async () => {
  try {
    const response = await api.get("/api/admin/users/logs");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteAllLogs = async () => {
  try {
    const response = await api.delete("/api/admin/users/logs");
    return response.data;
  } catch (error) {
    console.error("Error deleting all logs:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteLog = async (logId) => {
  try {
    const response = await api.delete(`/api/admin/users/logs/${logId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting log ${logId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};