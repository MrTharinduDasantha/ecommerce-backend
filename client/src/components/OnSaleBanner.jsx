import React from 'react';

const OnSaleBanner = () => {
  return (
    <div className="relative overflow-hidden bg-[#5CAF90] h-40 w-full mb-6">
      {/* Content */}
      <div className="relative z-10 p-6 ml-4">
        <h1 className="text-[#1D372E] text-3xl font-semibold mb-2">
          Sales and Promotions At Asipiya
        </h1>
        <p className="text-[#1D372E] text-base italic opacity-80 max-w-3xl">
          Get the best deals and promotions on our products. Save big on your favorite items with our exclusive sales and promotions. Experience the bliss of shopping with Asipiya.
        </p>
      </div>

      {/* Decorative shape */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-[#1D372E] opacity-20 rounded-full transform translate-x-1/3 -translate-y-3/4" />
    </div>
  );
};

export default OnSaleBanner; 