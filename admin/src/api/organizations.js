import axios from "axios";

const API_URL = "http://localhost:9000";

// Create an instance of axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Signup User (Send OTP)
export const signupUser = async (data) => {
  try {
    const response = await api.post("/api/admin/organizations/signup", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Verify OTP
export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/api/admin/organizations/verify-otp", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Save Organization
export const saveOrganization = async (data) => {
  try {
    const response = await api.post("/api/admin/organizations/save-organization", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};