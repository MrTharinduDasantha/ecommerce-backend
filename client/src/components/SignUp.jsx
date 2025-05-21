import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileNo, setMobileNo] = useState("");
  const [mobileNoError, setMobileNoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Validate email format
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    setSubmitError("");

    // Validate name
    if (!name) {
      setNameError("This field is required.");
      isValid = false;
    } else {
      setNameError("");
    }

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

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("This field is required.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Validate mobile number
    if (!mobileNo) {
      setMobileNoError("This field is required.");
      isValid = false;
    } else {
      setMobileNoError("");
    }

    // If all fields are valid, proceed with sign-up logic
    if (isValid) {
      try {
        const response = await fetch("http://localhost:9000/api/auth/customers/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            first_name: name,
            full_name: name,
            mobile_no: mobileNo,
            status: "active"
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // If registration is successful, automatically log the user in
        const loginResponse = await fetch("http://localhost:9000/api/auth/customers/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.message || "Login failed after registration");
        }

        // Login with the token and user data
        login(loginData.token, loginData.user);
        
        // Navigate to home or dashboard
        navigate("/");
      } catch (error) {
        console.error("Registration error:", error);
        setSubmitError(error.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-full p-8 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                nameError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="mobileNo">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNo"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                mobileNoError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your mobile number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
            {mobileNoError && (
              <p className="text-red-500 text-sm mt-1">{mobileNoError}</p>
            )}
          </div>
          <div className="mb-4 relative">
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
                placeholder="Confirm your password"
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
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm">Already have an account? </span>
          <a
            href="sign-in"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
