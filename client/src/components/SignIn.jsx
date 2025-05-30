import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const from = location.state?.from?.pathname || "/";

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

    // Validate password
    if (!password) {
      setPasswordError("This field is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // If all fields are valid, proceed with sign-in logic
    if (isValid) {
      console.log("Signing in with:", email, password);
      setPasswordError(""); // Clear previous errors
      try {
        const response = await fetch("http://localhost:9000/api/auth/customers/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
console.log(response,"waqas")
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to sign in");
        }
console.log(data)
        const token = data.token;
        const user = data.user; // Get user from response

        login(email, password); // Call login from AuthContext with token and user
        
         // Navigate to home or dashboard
        navigate("/");

      } catch (error) {
        console.error("Sign-in error:", error);
        setPasswordError(error.message || "Sign-in failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-full p-20 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
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
          <div className="mb-6 relative">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } pr-10`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              ></button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="forgot-password"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm">Don't have an account? </span>
          <a
            href="sign-up"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
