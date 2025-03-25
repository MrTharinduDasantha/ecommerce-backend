import axios from "axios";

const API_URL = "http://localhost:9000";

// Function to call the admin login API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`{API_URL}/admin/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response && error.response.data
      ? error.response.data
      : error.message;
  }
};
