import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = (e) => {
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

    // If email is valid, proceed with the logic
    if (isValid) {
      setLoading(true);
      // Simulate API request (replace with actual API call)
      setTimeout(() => {
        setMessage("A password reset link has been sent to your email.");
        setLoading(false);
        // Simulate navigation to reset-password page after a delay
        setTimeout(() => {
          navigate("/reset-password");
        }, 3000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-full p-36 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
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
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
