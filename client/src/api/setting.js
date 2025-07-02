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

const API_BASE_URL = "http://localhost:9000/api";

// Fetch About Us settings (public API - no auth required)
export const fetchAboutUsSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings/about-us`);
    return response.data.aboutUsSetting;
  } catch (error) {
    console.error("Error fetching About Us settings:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch About Us settings");
  }
};
