import React from "react";
import foryou from "./flower.webp";

const Review = () => {
  return (
    <div className="w-full max-w-[900px] mx-auto border-t border-b py-4 space-y-4 font-poppins border-[#505050] px-4 md:px-0">
      {/* User Review */}
      <div className="flex items-start space-x-4 md:pl-40 md:pr-40">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="User"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-[#191D23] text-sm md:text-base">Samantha Payne</h3>
          </div>
          <div className="flex text-yellow-400 text-sm md:text-base">★★★★★</div>
          <p className="text-[#525252] text-xs md:text-sm">
            We booked a ‘Premium Cleaning Package’ with WISDOM CLEAN, and they delivered exceptional service.
          </p>
          <span className="text-[11px] text-[#64748B]">23 Nov 2021</span>
        </div>
      </div>

      {/* Business Response */}
      <div className="flex items-start space-x-4 md:pl-40 md:pr-25 bg-gray-50 p-4 rounded-lg">
        <img 
          src={foryou} 
          alt="Business Logo" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
        />
        <div className="flex-1">
          <h3 className="font-semibold text-[#191D23] text-sm md:text-base">WISDOM CLEAN</h3>
          <p className="text-[#525252] text-xs md:text-sm">
            Thank you for your wonderful feedback! We’re thrilled to hear that you were satisfied with our Premium Cleaning Package. 
            We appreciate your support and look forward to serving you again! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Review;