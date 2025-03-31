import axios from 'axios';

const API_URL = 'http://localhost:9000/admin/orders';

// Get all orders with pagination
export const getOrders = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch order details' };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/status`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
}; 