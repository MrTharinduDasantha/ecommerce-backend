const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/admin/notification.controller');
const authMiddleware = require('../../middleware/authMiddleware');

// Debug route - No auth required
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Notification routes are working!' });
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notifications for current admin
router.get('/', notificationController.getNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Create a new notification
router.post('/', notificationController.createNotification);

// Update a notification (only creator can update)
router.put('/:id', notificationController.updateNotification);

// Delete a notification (only creator can delete)
router.delete('/:id', notificationController.deleteNotification);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark notification as unread
router.put('/:id/unread', notificationController.markAsUnread);

module.exports = router; 