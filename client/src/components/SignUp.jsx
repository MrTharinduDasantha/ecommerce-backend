import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

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
        const response = await fetch(
          "http://localhost:9000/api/auth/customers/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              first_name: name,
              full_name: name,
              mobile_no: mobileNo,
              status: "active",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // If registration is successful, automatically log the user in
        const loginResponse = await fetch(
          "http://localhost:9000/api/auth/customers/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          }
        );

        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(
            loginData.message || "Login failed after registration"
          );
        }

        // Login with the token and user data
        login(loginData.token, loginData.user);

        // Navigate to home or dashboard
        navigate("/");
      } catch (error) {
        console.error("Registration error:", error);
        setSubmitError(
          error.message || "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D372E]">
          Sign Up
        </h2>
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <User className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type="text"
                id="name"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  nameError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

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

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Mobile Number
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Phone className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type="text"
                id="mobileNo"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  mobileNoError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Enter your mobile number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </div>
            {mobileNoError && (
              <p className="text-red-500 text-sm mt-1">{mobileNoError}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Lock className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white text-[#1D372E] ${
                  passwordError ? "border-red-500" : "border-[#5CAF90]"
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-[#5CAF90] w-4 h-4" />
                ) : (
                  <Eye className="text-[#5CAF90] w-4 h-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
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
                placeholder="Confirm your password"
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
            className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-[#1D372E]">
            Already have an account?{" "}
          </span>
          <button
            type="button"
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
