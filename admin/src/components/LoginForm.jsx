import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const data = await api.loginUser(email, password);

      if (data.message === "Login successful") {
        login(data.userId, data.fullName);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError(error || "Invalid credentials");
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      <div className="space-y-1 text-[#2d2d2d]">
        <label className="block text-lg font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input bg-white border-2 border-[#2d2d2d] w-full"
          placeholder="Enter your email"
        />
      </div>
      <div className="space-y-1 text-[#2d2d2d]">
        <label className="block text-lg font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input bg-white border-2 border-[#2d2d2d] w-full"
          placeholder="Enter your password"
        />
      </div>
      <div>
        <button
          type="submit"
          className="mt-2 btn btn-primary bg-[#a3fe00] hover:bg-[#77c900] border-none text-[#2d2d2d] transition-colors duration-300 ease-in-out w-full"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
