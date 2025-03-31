import axios from "axios";

const API_URL = "http://localhost:9000"; // Your API base URL

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can optionally set the token here if you store it in localStorage
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const fetchCustomers = async () => {
  try {
    const response = await api.get("/api/customers");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/api/customers/${customerId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateCustomer = async (customerId, updatedCustomer) => {
  try {
    const response = await api.put(`/api/customers/${customerId}`, updatedCustomer);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
export const getCustomerHistory = async (customerId) => {
    try {
      const response = await api.get(`/api/customers/${customerId}/history`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };
  