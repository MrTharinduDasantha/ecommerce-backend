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

// ------------------------
// Event Related Api Calls
// ------------------------

// Get all events
export const getEvents = async () => {
  try {
    const response = await api.get("/api/events/all");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single event
export const getEvent = async (id) => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get products for a specific event
export const getEventProducts = async (eventId) => {
  try {
    const response = await api.get(`/api/events/${eventId}/products`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
