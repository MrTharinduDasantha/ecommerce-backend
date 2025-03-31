// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider to wrap the app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount if token exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function to set user details in context and localStorage
  const login = (userId, fullName, email, phoneNo, status) => {
    const userData = { userId, fullName, email, phoneNo, status };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function to remove user details from context and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
