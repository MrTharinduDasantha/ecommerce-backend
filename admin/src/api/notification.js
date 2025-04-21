import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

// Get all notifications
export const getNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${API_URL}/admin/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch notifications');
    throw error;
  }
};

// Get notification by ID
export const getNotificationById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.get(`${API_URL}/admin/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error fetching notification:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch notification');
    throw error;
  }
};

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.post(
      `${API_URL}/admin/notifications`,
      notificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    toast.error(error.response?.data?.message || 'Failed to create notification');
    throw error;
  }
};

// Update a notification
export const updateNotification = async (id, notificationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      `${API_URL}/admin/notifications/${id}`,
      notificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    toast.error(error.response?.data?.message || 'Failed to update notification');
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.delete(`${API_URL}/admin/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    toast.error(error.response?.data?.message || 'Failed to delete notification');
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      `${API_URL}/admin/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    toast.error(error.response?.data?.message || 'Failed to mark notification as read');
    throw error;
  }
};

// Mark notification as unread
export const markAsUnread = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await axios.put(
      `${API_URL}/admin/notifications/${id}/unread`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error marking notification as unread:', error);
    toast.error(error.response?.data?.message || 'Failed to mark notification as unread');
    throw error;
  }
}; 