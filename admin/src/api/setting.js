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

// -----------------------------------------
// Header Footers Setting Related Api Calls
// -----------------------------------------

// Fetch header footer setting
export const fetchHeaderFooterSetting = async () => {
  try {
    const response = await api.get("/api/settings/header-footer");
    return response.data.headerFooterSetting;
  } catch (error) {
    throw error.response.data;
  }
};

// Update header footer setting
export const updateHeaderFooterSetting = async (formData) => {
  try {
    const response = await api.put("/api/settings/header-footer", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.updatedHeaderFooterSetting;
  } catch (error) {
    throw error.response.data;
  }
};
