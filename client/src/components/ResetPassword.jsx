import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

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
      setMessage(
        "Invalid or missing parameters. Please try to reset your password again."
      );
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
        const response = await fetch(
          "http://localhost:9000/api/auth/customers/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              otp,
              new_password: newPassword,
            }),
          }
        );

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
        setConfirmPasswordError(
          error.message || "Failed to reset password. Please try again."
        );
        setLoading(false);
      }
    }
  };

  // If parameters are invalid, show error and link to forgot password page
  if (invalidParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1D372E]">
            Reset Password
          </h2>
          <div className="text-center">
            <p className="text-red-500 mb-4">{message}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] transition-colors"
            >
              Back to Forgot Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D372E]">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Lock className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  newPasswordError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="text-[#5CAF90] w-4 h-4" />
                ) : (
                  <Eye className="text-[#5CAF90] w-4 h-4" />
                )}
              </button>
            </div>
            {newPasswordError && (
              <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Lock className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  confirmPasswordError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-[#5CAF90] w-4 h-4" />
                ) : (
                  <Eye className="text-[#5CAF90] w-4 h-4" />
                )}
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
            className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] disabled:opacity-70 transition-colors cursor-pointer"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-sm text-green-600 mt-4 text-center">{message}</p>
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

export default ResetPassword;
