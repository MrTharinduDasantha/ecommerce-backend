// Authentication utilities

// Get the auth token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Set the auth token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove the auth token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};