// SignUpPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';
import * as api from '../api/organizations'; // Adjusted import path
import TimelineDisplay from '../components/TimelineDisplay';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for OTP verification success via query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'success') {
      navigate('/Timeline?login=success');
    }
  }, [location, navigate]);

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !name || !phone || !address || !website) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.signupUser(email, name, phone, address, website);
      if (response.message === 'OTP sent') {
        setIsOtpSent(true);
        toast.success('OTP sent to your email');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.verifyOtp(email, otp, name, phone, address, website);
      if (response.message === 'OTP verified') {
        toast.success('OTP verified successfully');
        // Do not navigate here; optional step
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid OTP');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving organization and navigating to next page
  const handleSaveAndNext = async () => {
    if (!email || !name || !phone || !address || !website) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      const saveResponse = await api.saveOrganization(email, name, phone, address, website);
      if (saveResponse.message === 'Organization saved successfully') {
        toast.success('Organization saved successfully');
        navigate('/header-footer-create-only');
      } else {
        toast.error('Failed to save organization');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save organization');
      console.error('Save error:', error);
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
      <div className="w-full" style={{ background: '#1D372E', paddingTop: 24, paddingBottom: 8 }}>
        <TimelineDisplay currentStep="signup" />
      </div>
      <div className="bg-white bg-opacity-95 p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sign Up
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Enter your organization details to receive an OTP and complete your sign-up.
        </p>
        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">Organization Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter organization name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <FiMail className="text-[#5CAF90] w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered input-md w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">Phone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">Address</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter address"
                rows={3}
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">Website</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter website URL"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-md w-full ${
                isLoading ? 'cursor-not-allowed' : 'hover:bg-[#4a9a7d]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[#1D372E] text-sm font-medium">OTP</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                placeholder="Enter the OTP"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-md w-full ${
                isLoading ? 'cursor-not-allowed' : 'hover:bg-[#4a9a7d]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Verifying OTP...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        )}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-[#5CAF90] hover:underline cursor-pointer"
          >
            Already have an account? Log In
          </button>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
            onClick={handleSaveAndNext}
            disabled={isLoading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;