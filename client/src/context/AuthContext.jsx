import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Set default authorization header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user data from the customer endpoint
          const response = await axios.get(
            "http://localhost:9000/api/auth/customers/me"
          );
          setUser(response.data);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:9000/api/auth/customers/login",
        {
          email,
          password,
        }
      );
      console.log(response);
      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
const googleLogin = async(idToken) => {
  const response = await axios.post("http://localhost:9000/api/auth/customers/google-login",
    {
      token:idToken,
    }
  );
  const {token,user:userData} = response.data;
  localStorage.setItem("token",token);
  axios.defaults.headers.common["Authorization"] `Bearer ${token}`;
  setUser(userdata);
  setError(null);
}
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:9000/api/auth/register",
        userData
      );

      const { token, user: newUser } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(newUser);
      setError(null);
      return newUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    googleLogin,
    logout,
    register,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
