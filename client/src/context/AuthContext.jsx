import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  // Retrieve user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user'); // Clear corrupted user data
      return null;
    }
  });

  useEffect(() => {
    // This effect now primarily ensures consistency if token exists but user doesn't (e.g., manual localStorage clear)
    // Or if we wanted to add token verification logic here
    if (token && !user) {
      // If there's a token but no user object, it's an inconsistent state.
      // Ideally, we'd verify the token with the backend and fetch user data.
      // For now, if user data was cleared but token exists, we might clear the token too or try to re-fetch user.
      // Given the current setup, user data is saved at login. If it's gone, logout might be safest.
      console.warn("Token found but no user data. Consider logging out or re-fetching user.");
      // For simplicity, we'll rely on login to set both, and logout to clear both.
    } else if (!token && user) {
      // If no token but user object exists, clear user.
      setUser(null);
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    setToken(newToken);
    setUser(userData); // Set user data in state
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user data
    setToken(null);
    setUser(null);
    // Optionally navigate to sign-in page here or let components handle it
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token && !!user }}>
      {children}
    </AuthContext.Provider>
  );
}; 