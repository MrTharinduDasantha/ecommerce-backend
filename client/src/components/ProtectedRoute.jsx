import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-[#5CAF90] border-gray-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect them to the /sign-in page, but save the current location they were
    // trying to go to so we can send them along after they log in.
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute; 