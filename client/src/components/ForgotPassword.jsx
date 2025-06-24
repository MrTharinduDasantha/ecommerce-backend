import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError("This field is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // If email is valid, proceed with the API call
    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:9000/api/auth/customers/request-password-reset",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send reset link");
        }

        setMessage("A verification code has been sent to your email.");
        setOtpSent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error requesting password reset:", error);
        setEmailError(
          error.message || "Failed to send reset link. Please try again."
        );
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("Verification code is required");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(
        "http://localhost:9000/api/auth/customers/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify code");
      }

      // Navigate to reset password page with email and OTP
      navigate(
        `/reset-password?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.message || "Failed to verify code. Please try again.");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D372E]">
          Forgot Password
        </h2>

        {!otpSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <Mail className="text-[#5CAF90] w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                    emailError ? "border-red-500" : "border-[#5CAF90]"
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] disabled:opacity-70 transition-colors cursor-pointer"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="form-control">
              <p className="text-sm text-green-600 mb-4">{message}</p>
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">
                  Verification Code
                </span>
              </label>
              <input
                type="text"
                id="otp"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  otpError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
              {otpError && (
                <p className="text-red-500 text-sm mt-1">{otpError}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                The verification code has been sent to your email address. It
                will expire in 10 minutes.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] disabled:opacity-70 transition-colors cursor-pointer"
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Code"}
            </button>
            <div className="mt-2">
              <button
                type="button"
                className="w-full text-[#5CAF90] py-1 text-sm hover:underline cursor-pointer"
                onClick={() => {
                  setOtpSent(false);
                  setMessage("");
                  setOtp("");
                  setOtpError("");
                }}
              >
                Try a different email
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
            onClick={() => navigate("/sign-in")}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
