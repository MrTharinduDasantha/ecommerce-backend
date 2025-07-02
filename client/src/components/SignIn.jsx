import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
        // Use the login function from AuthContext
        await login(email, password);
        localStorage.setItem('userEmail', email);
        // Navigate to home or dashboard
        navigate(from);
      } catch (error) {
        console.error("Sign-in error:", error);
        setPasswordError(
          error.message || "Sign-in failed. Please check your credentials."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D372E]">
          Sign In
        </h2>
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

          <button
            type="submit"
            className="w-full bg-[#5CAF90] text-white py-2 rounded-lg hover:bg-[#4a9a7d] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-2 text-center">
          <span className="text-sm text-[#1D372E]">
            Don't have an account?{" "}
          </span>
          <button
            type="button"
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
