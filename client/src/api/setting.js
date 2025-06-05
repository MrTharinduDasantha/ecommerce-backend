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
