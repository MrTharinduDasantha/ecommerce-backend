import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import * as api from "../api/auth";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const ResetPasswordPage = () => {
  const { email, otp } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      await api.resetPassword(email, otp, password);
      toast.success("Password reset successful");
      navigate("/", { state: { passwordReset: true } });
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1D372E] via-[#5CAF90] to-[#1D372E] p-4">
      <div className="w-full max-w-[26rem] p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D372E]">Reset Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] font-medium">
                New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiLock className="text-[#5CAF90]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pl-10 pr-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <IoMdEyeOff className="text-[#5CAF90]" />
                ) : (
                  <IoMdEye className="text-[#5CAF90]" />
                )}
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] font-medium">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiLock className="text-[#5CAF90]" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full pl-10 pr-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? (
                  <IoMdEyeOff className="text-[#5CAF90]" />
                ) : (
                  <IoMdEye className="text-[#5CAF90]" />
                )}
              </button>
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-[#5CAF90] hover:underline flex items-center justify-center mx-auto cursor-pointer"
            >
              <FiArrowLeft className="mr-1" />
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
