import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:9000/admin/orders';

// Get all orders with pagination
export const getOrders = async (page = 1, limit = 10) => {
  try {
    const token = getToken();
    console.log('Using token for getOrders:', token);
    
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    const token = getToken();
    console.log(`Fetching order ID: ${orderId}`);
    console.log(`API endpoint: ${API_URL}/${orderId}`);
    console.log('Using token:', token.substring(0, 20) + '...');
    
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('API response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    throw error.response?.data || { message: 'Failed to fetch order details' };
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status, customerName, orderTotal) => {
  try {
    const token = getToken();
    console.log('Using token for updateOrderStatus:', token);
    
    const response = await axios.put(`${API_URL}/${orderId}/status`, 
      { status, customerName, orderTotal },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};