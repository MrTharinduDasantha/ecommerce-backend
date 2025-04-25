CREATE TABLE Admin_Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES User(idUser)
);

-- Junction table to track which admins have read which messages
CREATE TABLE Admin_Notification_Status (
    notification_id INT NOT NULL,
    admin_id INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    PRIMARY KEY (notification_id, admin_id),
    FOREIGN KEY (notification_id) REFERENCES Admin_Notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES User(idUser)
); 