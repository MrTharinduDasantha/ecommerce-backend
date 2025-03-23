import React, { useState, useEffect } from "react";
import './style.css';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulated notifications (Replace with API call)
    const simulatedNotifications = [
      { id: 1, message: "New order received!", type: "order", time: "2 mins ago" },
      { id: 2, message: "Stock running low on Product X!", type: "stock", time: "10 mins ago" },
      { id: 3, message: "System update scheduled for tonight.", type: "system", time: "1 hour ago" },
    ];
    setNotifications(simulatedNotifications);
  }, []);

  return (
    <div className="notifications-container">
      <h1 className="notifications-h1">Notifications</h1>
      <ul className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li key={notif.id} className={`notification-item ${notif.type}`}>
              <span className="notifications-message">{notif.message}</span>
              <span className="notifications-time">{notif.time}</span>
            </li>
          ))
        ) : (
          <p className="no-notifications">No new notifications.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
