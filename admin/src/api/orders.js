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

// Update order status with reason
export const updateOrderStatus = async (orderId, status, customerName, orderTotal, reason = '') => {
  try {
    const token = getToken();
    console.log('Using token for updateOrderStatus:', token);
    
    const response = await axios.put(`${API_URL}/${orderId}/status`, 
      { status, customerName, orderTotal, reason },
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

// Update payment status
export const updatePaymentStatus = async (orderId, paymentStatus, customerName, orderTotal, reason = '') => {
  try {
    const token = getToken();
    
    const response = await axios.put(`${API_URL}/${orderId}/payment-status`, 
      { paymentStatus, customerName, orderTotal, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error.response?.data || { message: 'Failed to update payment status' };
  }
};

// Update delivery date
export const updateDeliveryDate = async (orderId, deliveryDate, customerName, orderTotal) => {
  try {
    const token = getToken();
    
    const response = await axios.put(`${API_URL}/${orderId}/delivery-date`, 
      { deliveryDate, customerName, orderTotal },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating delivery date:', error);
    throw error.response?.data || { message: 'Failed to update delivery date' };
  }
};

// Get order counts by status
export const getOrderCountByStatus = async () => {
  try {
    const token = getToken();
    console.log('Using token for getOrderCountByStatus:', token);
    
    const response = await axios.get(`${API_URL}/status/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching order counts by status:', error);
    throw error.response?.data || { message: 'Failed to fetch order counts by status' };
  }
};

export const getPendingDeliveryCount = async () => {
  try {
    const token = getToken();
    console.log('Using token for getPendingDeliveryCount:', token);
    
    const response = await axios.get(`${API_URL}/delivery/pending/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching pending delivery count:', error);
    throw error.response?.data || { message: 'Failed to fetch pending delivery count' };
  }
};


// Get Total Revenue
export const getTotalRevenue = async () => {
  try {
    const token = getToken();
    console.log('Using token for getTotalRevenue:', token);

    const response = await axios.get(`${API_URL}/total-revenue`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error.response?.data || { message: 'Failed to fetch total revenue' };
  }
};

// Get Monthly Total Revenue
export const getMonthlyTotalRevenue = async () => {
  try {
    const token = getToken();
    console.log('Using token for getMonthlyTotalRevenue:', token);

    const response = await axios.get(`${API_URL}/monthly-revenue`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching monthly total revenue:', error);
    throw error.response?.data || { message: 'Failed to fetch monthly total revenue' };
  }
};

// Get order history
export const getOrderHistory = async (orderId) => {
  try {
    const token = getToken();
    console.log(`Fetching history for order ID: ${orderId}`);
    
    const response = await axios.get(`${API_URL}/${orderId}/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error.response?.data || { message: 'Failed to fetch order history' };
  }
};

