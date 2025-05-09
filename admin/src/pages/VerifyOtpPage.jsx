import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import * as api from "../api/auth";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const VerifyOtpPage = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus the first input when the component mounts
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers to be entered
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  // Handle pasting full OTP at once
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    // Remove any spaces if pasted with formatting
    const cleanPasted = pastedData.replace(/\s+/g, "");
    // Validate if pasted input is exactly 6 digits long
    if (/^\d{6}$/.test(cleanPasted)) {
      const pastedOtp = cleanPasted.split("");
      setOtp(pastedOtp);
      // Focus the last input field after pasting
      if (inputRef.current[5]) {
        inputRef.current[5].focus();
      }
      // Prevent default paste behavior
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      await api.verifyOtp(email, otpValue);
      toast.success("OTP verified successfully");
      navigate(`/reset-password/${email}/${otpValue}`);
    } catch (error) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await api.requestPasswordReset(email);
      toast.success("New OTP sent to your email");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1D372E] via-[#5CAF90] to-[#1D372E] p-4">
      <div className="w-full max-w-[20rem] md:max-w-[26rem] p-8 space-y-4 md:space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-14 md:h-16 w-auto" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#1D372E]">
            Verify OTP
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={(el) => (inputRef.current[index] = el)}
                className="input input-bordered w-9 h-9 md:w-12 md:h-12 text-center text-lg md:text-xl bg-white border-[#1D372E] text-[#1D372E]"
              />
            ))}
          </div>

          <button
            type="submit"
            className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md w-full ${
              isLoading ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
            }`}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs md:text-sm text-[#5CAF90] hover:underline flex items-center cursor-pointer"
            >
              <FiArrowLeft className="mr-1" /> Back
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-xs md:text-sm text-[#5CAF90] hover:underline cursor-pointer"
              disabled={isLoading}
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
