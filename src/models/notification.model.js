const db = require('../config/database');
const { getOrgMail } = require('../utils/organization');

// Get all notifications
const getAllNotifications = async () => {
  const orgMail = getOrgMail();
  const [notifications] = await db.query(`
    SELECT an.*, u.Full_Name as creator_name, u.Email as creator_email
    FROM Admin_Notifications an
    JOIN User u ON an.created_by = u.idUser
    WHERE an.orgmail = ?
    ORDER BY an.created_at DESC
  `, [orgMail]);
  return notifications;
};

// Get notification by ID
const getNotificationById = async (id) => {
  const orgMail = getOrgMail();
  const [notifications] = await db.query(`
    SELECT an.*, u.Full_Name as creator_name, u.Email as creator_email
    FROM Admin_Notifications an
    JOIN User u ON an.created_by = u.idUser
    WHERE an.id = ? AND an.orgmail = ?
  `, [id, orgMail]);
  
  return notifications[0];
};

// Create a new notification
const createNotification = async (title, message, userId) => {
  const orgMail = getOrgMail();
  const [result] = await db.query(`
    INSERT INTO Admin_Notifications (title, message, created_by, orgmail)
    VALUES (?, ?, ?, ?)
  `, [title, message, userId, orgMail]);
  
  // Get all admin users to insert read status records
  const [admins] = await db.query(`
    SELECT idUser FROM User WHERE Status = 'admin' AND orgmail = ?
  `, [orgMail]);
  
  // Insert read status records for all admins (except creator who is marked as read)
  for (const admin of admins) {
    await db.query(`
      INSERT INTO Admin_Notification_Status (notification_id, admin_id, is_read, read_at, orgmail)
      VALUES (?, ?, ?, ?, ?)
    `, [
      result.insertId, 
      admin.idUser, 
      admin.idUser === userId ? 1 : 0, 
      admin.idUser === userId ? new Date() : null,
      orgMail
    ]);
  }
  
  return result.insertId;
};

// Update a notification
const updateNotification = async (id, title, message) => {
  const orgMail = getOrgMail();
  const [result] = await db.query(`
    UPDATE Admin_Notifications 
    SET title = ?, message = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND orgmail = ?
  `, [title, message, id, orgMail]);
  
  return result.affectedRows > 0;
};

// Delete a notification
const deleteNotification = async (id) => {
  const orgMail = getOrgMail();
  const [result] = await db.query(`
    DELETE FROM Admin_Notifications 
    WHERE id = ? AND orgmail = ?
  `, [id, orgMail]);
  
  return result.affectedRows > 0;
};

// Get notifications with read status for a specific admin
const getNotificationsForAdmin = async (adminId) => {
  const orgMail = getOrgMail();
  const [notifications] = await db.query(`
    SELECT 
      an.*, 
      u.Full_Name as creator_name,
      u.Email as creator_email,
      IFNULL(ans.is_read, 0) as is_read,
      ans.read_at
    FROM Admin_Notifications an
    JOIN User u ON an.created_by = u.idUser
    LEFT JOIN Admin_Notification_Status ans ON an.id = ans.notification_id AND ans.admin_id = ? AND ans.orgmail = ?
    WHERE an.orgmail = ?
    ORDER BY an.created_at DESC
  `, [adminId, orgMail, orgMail]);
  
  return notifications;
};

// Mark notification as read
const markAsRead = async (notificationId, adminId) => {
  const orgMail = getOrgMail();
  const [result] = await db.query(`
    INSERT INTO Admin_Notification_Status (notification_id, admin_id, is_read, read_at, orgmail)
    VALUES (?, ?, 1, NOW(), ?)
    ON DUPLICATE KEY UPDATE is_read = 1, read_at = NOW()
  `, [notificationId, adminId, orgMail]);
  
  return result.affectedRows > 0;
};

// Mark notification as unread
const markAsUnread = async (notificationId, adminId) => {
  const orgMail = getOrgMail();
  const [result] = await db.query(`
    UPDATE Admin_Notification_Status
    SET is_read = 0, read_at = NULL
    WHERE notification_id = ? AND admin_id = ? AND orgmail = ?
  `, [notificationId, adminId, orgMail]);
  
  return result.affectedRows > 0;
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsForAdmin,
  markAsRead,
  markAsUnread
}; 