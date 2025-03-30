import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D372E]">
      <div className="w-full max-w-96 p-8 space-y-6 bg-[#ffffff] rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold text-[#1D372E]">
          Admin Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
