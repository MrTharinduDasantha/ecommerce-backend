const AdminNotification = require('../../models/AdminNotification');

// Get all notifications with read status for current admin
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await AdminNotification.getNotificationsForAdmin(userId);
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await AdminNotification.getNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification',
      error: error.message
    });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const userId = req.user.userId;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }
    
    const notificationId = await AdminNotification.createNotification(title, message, userId);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { id: notificationId }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;
    const userId = req.user.userId;
    
    // Check if notification exists and belongs to current user
    const notification = await AdminNotification.getNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    if (notification.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own notifications'
      });
    }
    
    const updated = await AdminNotification.updateNotification(id, title, message);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update notification'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Check if notification exists and belongs to current user
    const notification = await AdminNotification.getNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    if (notification.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own notifications'
      });
    }
    
    const deleted = await AdminNotification.deleteNotification(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const updated = await AdminNotification.markAsRead(id, userId);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark notification as unread
const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const updated = await AdminNotification.markAsUnread(id, userId);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to mark notification as unread'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as unread'
    });
  } catch (error) {
    console.error('Error marking notification as unread:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as unread',
      error: error.message
    });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAsUnread
}; 