import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  // Check both user context and token authentication
  const isAuthorized = user || isAuthenticated();
  
  return isAuthorized ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
