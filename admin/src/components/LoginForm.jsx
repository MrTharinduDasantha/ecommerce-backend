import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error">{error}</div>}
      <div className="space-y-1 text-[#2d2d2d]">
        <label className="block text-lg font-medium ">Email</label>
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
