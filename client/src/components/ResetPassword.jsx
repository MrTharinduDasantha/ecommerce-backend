import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [invalidParams, setInvalidParams] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and OTP from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const otpParam = params.get("otp");

    if (!emailParam || !otpParam) {
      setInvalidParams(true);
      setMessage("Invalid or missing parameters. Please try to reset your password again.");
    } else {
      setEmail(emailParam);
      setOtp(otpParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate new password
    if (!newPassword) {
      setNewPasswordError("This field is required.");
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("This field is required.");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // If all fields are valid, proceed with reset password logic
    if (isValid) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:9000/api/auth/customers/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            new_password: newPassword
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to reset password");
        }

        setMessage("Your password has been reset successfully.");
        
        // Navigate to sign-in page after a delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      } catch (error) {
        console.error("Error resetting password:", error);
        setConfirmPasswordError(error.message || "Failed to reset password. Please try again.");
        setLoading(false);
      }
    }
  };

  // If parameters are invalid, show error and link to forgot password page
  if (invalidParams) {
    return (
      <div className="min-h-full p-26 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          <div className="text-center">
            <p className="text-red-500 mb-4">{message}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Forgot Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-26 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  newPasswordError ? "border-red-500" : "border-gray-300"
                } pr-10`}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            {newPasswordError && (
              <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                } pr-10`}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className="text-sm text-green-600 mt-4 text-center">{message}</p>
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

export default ResetPassword;
