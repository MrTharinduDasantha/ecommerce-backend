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

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("productIds", JSON.stringify(eventData.productIds));
    formData.append("status", eventData.status);

    if (eventData.eventImage) {
      formData.append("eventImage", eventData.eventImage);
    }

    const response = await api.post("/api/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("productIds", JSON.stringify(eventData.productIds));
    formData.append("status", eventData.status);

    if (eventData.eventImage) {
      formData.append("eventImage", eventData.eventImage);
    }

    if (eventData.removeImage) {
      formData.append("removeImage", eventData.removeImage);
    }

    const response = await api.put(`/api/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
