import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { getNotifications } from "../api/notification";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      if (!user) return;

      setLoading(true);
      const notifications = await getNotifications();

      // Count unread notifications
      const count = notifications.filter(
        (notification) => !notification.is_read
      ).length;
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchUnreadCount();

      // Establish WebSocket connection
      socketRef.current = io("http://localhost:9000");

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      // Listen for new notifications and update unread count
      socketRef.current.on("newNotification", () => {
        setUnreadCount((prevCount) => prevCount + 1);
      });

      // Listen for delete notifications and update unread count
      socketRef.current.on("notificationDeleted", () => {
        setUnreadCount((prevCount) => prevCount - 1);
      });

      // Cleanup WebSocket connection on unmount or user change
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  // Function to update the unread count (can be called after marking as read/unread)
  const updateUnreadCount = () => {
    fetchUnreadCount();
  };

  const value = {
    unreadCount,
    loading,
    updateUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
