import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        const response = await fetch("http://localhost:9000/api/auth/customers/request-password-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to send reset link");
        }

        setMessage("A verification code has been sent to your email.");
        setOtpSent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error requesting password reset:", error);
        setEmailError(error.message || "Failed to send reset link. Please try again.");
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
      const response = await fetch("http://localhost:9000/api/auth/customers/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify code");
      }

      // Navigate to reset password page with email and OTP
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.message || "Failed to verify code. Please try again.");
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-full p-36 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <p className="text-sm text-green-600 mb-4">{message}</p>
              <label className="block text-sm font-medium mb-2" htmlFor="otp">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  otpError ? "border-red-500" : "border-gray-300"
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
                The verification code has been sent to your email address. 
                It will expire in 10 minutes.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              disabled={verifying}
            >
              {verifying ? "Verifying..." : "Verify Code"}
            </button>
            <div className="mt-4">
              <button
                type="button"
                className="w-full text-blue-500 py-2 text-sm hover:underline"
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
          <a
            href="sign-in"
            className="text-sm text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/sign-in");
            }}
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
