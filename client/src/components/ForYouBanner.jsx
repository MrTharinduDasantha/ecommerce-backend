import React from 'react';

const ForYouBanner = () => {
  return (
    <div className="relative overflow-hidden bg-[#5CAF90] h-40 w-full mb-6">
      {/* Content */}
      <div className="relative z-10 p-6 ml-4">
        <h1 className="text-[#1D372E] text-3xl font-semibold mb-2">
          Personalized Gifts At Asipiya
        </h1>
        <p className="text-[#1D372E] text-base italic opacity-80 max-w-3xl">
          Discover products curated just for you based on your preferences and shopping history. Find your perfect match with our smart and personalized recommendations. Show them your love and appreciation with gifts for your anniversary, Valentine's or their birthday with Asipiya gift collection.
        </p>
      </div>

      {/* Decorative shape */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-[#1D372E] opacity-20 rounded-full transform translate-x-1/3 -translate-y-3/4" />
    </div>
  );
};

export default ForYouBanner; 