import React from 'react';
import { Link } from 'react-router-dom';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const Sidebar = () => {
  return (
    <nav className="w-full lg:w-64 bg-white sidebar">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs sm:text-sm py-1 sm:py-2">
        <Link to="/" className="text-[#1D372E] hover:underline">Home</Link>
        <span className="mx-1 sm:mx-2">/</span>
        <Link to="/seasonal-offers" className="text-[#1D372E]">Seasonal Offers</Link>
      </div>

      {/* Categories List */}
      <div className="py-1 sm:py-2">
        <div className="bg-[#5CAF90] text-white py-1.5 sm:py-2.5 px-2 sm:px-4 flex items-center justify-between rounded-r-full">
          <span className="font-medium text-xs sm:text-sm">All Items</span>
          <DoubleArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>

        <ul className="text-gray-700">
          <li>
            <Link to="/home-needs" className="block px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:text-[#1D372E] transition-colors">
              Home Needs
            </Link>
          </li>
          <li>
            <Link to="/cosmetics" className="block px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:text-[#1D372E] transition-colors">
              Cosmetics
            </Link>
          </li>
          <li>
            <Link to="/clothing" className="block px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:text-[#1D372E] transition-colors">
              Clothing
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar; 