import React, { createContext, useState } from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider to wrap the app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function to set user details in context and localStorage
  const login = (userId, fullName) => {
    setUser({ userId, fullName });
    localStorage.setItem('user', JSON.stringify({ userId, fullName }));
  };

  // Logout function to remove user details from context and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
