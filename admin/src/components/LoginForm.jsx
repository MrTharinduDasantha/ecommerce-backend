import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import * as api from "../api/auth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const data = await api.loginUser(email, password);

      if (data.message === "Login successful") {
        // Pass additional details if available
        login(
          data.userId,
          data.fullName,
          data.email,
          data.phoneNo,
          data.status
        );
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
        navigate("/dashboard/dashboard-private");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1 text-[#1D372E]">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input bg-white border-2 border-[#2d2d2d] w-full rounded-2xl"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-1 text-[#1D372E] relative">
        <label className="block font-medium">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input bg-white border-2 border-[#1D372E] rounded-2xl w-full pr-10"
          placeholder="Enter your password"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute bottom-3.5 right-3 cursor-pointer text-xl text-[#1D372E]"
        >
          {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
        </span>
      </div>
      <div>
        <button
          type="submit"
          className="mt-2 btn btn-primary bg-[#5CAF90] border-none text-white w-full rounded-2xl"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
