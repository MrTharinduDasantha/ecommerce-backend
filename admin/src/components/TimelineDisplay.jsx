import React from 'react';

const steps = [
  { id: 'signup', label: 'Sign Up' }, // Changed from 'Sign Up' to 'signup' for consistency
  { id: 'settings', label: 'Header/Footer Settings' },
  { id: 'aboutus', label: 'About Us' },
  { id: 'home', label: 'Home Page Settings' },
];

const TimelineDisplay = ({ currentStep = 'login' }) => (
  <div className="w-full max-w-4xl mx-auto mb-8 relative">
    <div className="flex items-center justify-between relative">
      {/* Connecting Lines */}
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

export default TimelineDisplay;
