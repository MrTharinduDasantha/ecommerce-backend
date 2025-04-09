import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import * as api from "../api/auth";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsLoading(true);
      await api.requestPasswordReset(email);
      toast.success("OTP sent to your email");
      navigate(`/verify-otp/${email}`);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D372E] to-[#2a4f43] p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D372E]">Forgot Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your email to receive a verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] font-medium">
                Email
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiMail className="text-[#5CAF90]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary bg-[#5CAF90] border-none text-white w-full ${
              isLoading ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
            }`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Sending OTP...
              </>
            ) : (
              "Send Verification Code"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-[#5CAF90] hover:underline flex items-center justify-center mx-auto cursor-pointer"
            >
              <FiArrowLeft className="mr-1" /> Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
