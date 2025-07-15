import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import HeaderFooterSettingsCreateOnly from '../components/HeaderFooterSettingsCreateOnly';
import NewAboutUsSettings from '../components/NewAboutUsSettings';

const Timeline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStep, setCurrentStep] = useState('login'); // Track current step: 'login', 'settings', 'dashboard'
  const navigate = useNavigate();
  const location = useLocation();

  // Timeline steps definition
  const steps = [
    { id: 'login', label: 'Login' },
    { id: 'settings', label: 'Header/Footer Settings' },
    { id: 'aboutus', label: 'About Us' },
  ];

  // Check for login success via query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'success' && currentStep === 'login') {
      setIsLoggedIn(true);
      setCurrentStep('settings');
      toast.success('Login successful!', {
        style: { background: '#5CAF90', color: '#fff' },
      });
    }
  }, [location, currentStep]);

  const handleNavigation = (path) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep('dashboard');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleSkip = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep('dashboard');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  // Timeline display component
  const TimelineDisplay = () => (
    <div className="w-full max-w-3xl mx-auto mb-8 relative">
      <div className="flex items-center justify-between relative">
        {/* Connecting Lines (between step numbers at the top) */}
        {steps.map((step, index) => (
          index < steps.length - 1 && (
            <div
              key={`line-${index}`}
              className={`absolute h-1 ${
                steps.findIndex(s => s.id === currentStep) > index
                  ? 'bg-[#5CAF90]'
                  : 'bg-gray-400'
              }`}
              style={{
                top: '0',
                left: `${(index + 0.5) * (100 / (steps.length - 1))}%`,
                width: `${100 / (steps.length - 1)}%`,
                transform: 'translateX(-50%)',
              }}
            />
          )
        ))}
        {/* Step Circles and Labels */}
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-300 mt-2 ${
                currentStep === step.id || steps.findIndex(s => s.id === currentStep) > index
                  ? 'bg-[#5CAF90]'
                  : 'bg-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm text-white font-medium text-center">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

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
      {/* Timeline displayed at the top */}
      <div className="w-full">
        <TimelineDisplay />
      </div>
      {!isLoggedIn ? (
        <div className="bg-white bg-opacity-95 p-10 rounded-xl shadow-2xl max-w-lg w-full text-center transform transition-all duration-300 hover:scale-105">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome to Your Ecommerce Admin Timeline</h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">Manage your ecommerce platform efficiently. Sign up or log in to access the admin dashboard.</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <button
              onClick={() => handleNavigation('/signup')}
              className="bg-[#1D372E] text-white py-3 px-6 rounded-lg hover:bg-[#2A4A3B] transition duration-300 font-semibold text-lg shadow-md"
              disabled={isLoading}
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigation('/?redirect=timeline')}
              className="bg-[#5CAF90] text-white py-3 px-6 rounded-lg hover:bg-[#4a9a7d] transition duration-300 font-semibold text-lg shadow-md"
              disabled={isLoading}
            >
              Log In
            </button>
          </div>
        </div>
      ) : (
        <>
          {currentStep === 'settings' && (
            <div className="w-full max-w-7xl">
              <HeaderFooterSettingsCreateOnly
                onNext={() => setCurrentStep('aboutus')}
                isLoading={isLoading}
              />
              <div className="flex justify-end gap-4 mt-6 px-4">
                
              </div>
            </div>
          )}
          {currentStep === 'aboutus' && (
            <div className="w-full max-w-7xl">
              <NewAboutUsSettings />
              {/* You can add a Next/Finish button here for the next step */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Timeline;