import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d2d2d]">
      <div className="w-full max-w-96 p-8 space-y-6 bg-[#ffffff] rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-[#2d2d2d]">
          Admin Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
