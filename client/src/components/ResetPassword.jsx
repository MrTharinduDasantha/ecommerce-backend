import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate new password
    if (!newPassword) {
      setNewPasswordError("This field is required.");
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
      // Simulate API request (replace with actual API call)
      setTimeout(() => {
        setMessage("Your password has been reset successfully.");
        setLoading(false);
        // Simulate navigation to sign-in page after a delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }, 2000);
    }
  };

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
              ></button>
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
              ></button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && (
          <p className="text-sm text-green-600 mt-2 text-center">{message}</p>
        )}
        <div className="mt-4 text-center">
          <a
            href="sign-in"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => navigate("/sign-in")}
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
