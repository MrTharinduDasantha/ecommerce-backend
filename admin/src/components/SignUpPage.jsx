// SignUpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import * as api from '../api/auth'; // Use auth API instead of organizations
import TimelineDisplay from '../components/TimelineDisplay';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_no: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { full_name, email, password, confirmPassword, phone_no } = formData;

    if (!full_name.trim() || !email.trim() || !password.trim() || !phone_no.trim()) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!/^\d{10}$/.test(phone_no)) {
      toast.error('Phone number must be exactly 10 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the existing addUser API call from auth.js
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone_no: formData.phone_no,
        status: 'Active'
      };

      const response = await api.addUser(userData);
      
      if (response) {
        if (response.isExistingUser) {
          toast.success('Welcome back! Continuing to next step...');
        } else {
          toast.success('Admin account created successfully!');
        }
        setTimeout(() => {
          // Navigate to next step in timeline (header/footer settings)
          navigate('/header-footer-create-only');
        }, 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.error === 'Email already exists with different password') {
        toast.error('An account with this email already exists. Please use the correct password or try a different email.');
      } else if (error.error === 'Email already exists') {
        toast.error('An account with this email already exists');
      } else {
        toast.error(error.error || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D372E] flex flex-col items-center justify-center px-4 relative">
      <Toaster position="top-center" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="sand-clock relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-t-[#1D372E] border-b-[#5CAF90] border-l-transparent border-r-transparent rounded-full animate-spin-sand"></div>
            <div className="absolute inset-2 border-2 border-t-[#5CAF90] border-b-[#1D372E] border-l-transparent border-r-transparent rounded-full animate-spin-sand-reverse"></div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin-sand {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-sand-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-sand {
          animation: spin-sand 1.5s linear infinite;
        }
        .animate-spin-sand-reverse {
          animation: spin-sand-reverse 1.5s linear infinite;
        }
      `}</style>
      
      {/* Timeline at the top */}
      <div className="w-full" style={{ background: '#1D372E', paddingTop: 24, paddingBottom: 8 }}>
        <TimelineDisplay currentStep="signup" />
      </div>
      
      <div className="bg-white bg-opacity-95 p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sign Up
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Create your admin account and set up your ecommerce platform.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Full Name
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiUser className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="input input-bordered input-md w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Email
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiMail className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered input-md w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Phone Number
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiPhone className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type="tel"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                className="input input-bordered input-md w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter 10-digit phone number"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiLock className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered input-md w-full pl-10 pr-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 z-10 flex items-center pr-3"
              >
                {showPassword ? (
                  <IoMdEyeOff className="text-[#5CAF90] w-4 h-4" />
                ) : (
                  <IoMdEye className="text-[#5CAF90] w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[#1D372E] text-sm font-medium">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FiLock className="text-[#5CAF90] w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input input-bordered input-md w-full pl-10 pr-10 bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 z-10 flex items-center pr-3"
              >
                {showConfirmPassword ? (
                  <IoMdEyeOff className="text-[#5CAF90] w-4 h-4" />
                ) : (
                  <IoMdEye className="text-[#5CAF90] w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-md w-full ${
              isLoading ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Creating Account...
              </>
            ) : (
              "Continue to Next Step"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
          >
            Already have an account? Log In
          </button>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;