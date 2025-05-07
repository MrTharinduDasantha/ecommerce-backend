import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard/dashboard-private");
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1D372E] via-[#5CAF90] to-[#1D372E] p-4">
      <div className="w-full max-w-[20rem] md:max-w-[26rem] p-8 space-y-4 md:space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-14 md:h-16 w-auto" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1D372E]">
            Admin Login
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
