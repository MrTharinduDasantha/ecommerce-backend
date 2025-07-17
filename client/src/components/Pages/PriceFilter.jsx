import React, { useState } from 'react';

const PriceFilter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPriceDisplay, setMinPriceDisplay] = useState('');
  const [maxPriceDisplay, setMaxPriceDisplay] = useState('');

  // Handle min price input change
  const handleMinPriceChange = (e) => {
    const value = e.target.value.replace(' LKR', '').trim(); // Remove LKR if present
    if (value === '' || !isNaN(value)) { // Allow empty or valid numbers
      setMinPrice(value);
      setMinPriceDisplay(value ? `${value} LKR` : '');
    }
  };

  // Handle max price input change
  const handleMaxPriceChange = (e) => {
    const value = e.target.value.replace(' LKR', '').trim(); // Remove LKR if present
    if (value === '' || !isNaN(value)) { // Allow empty or valid numbers
      setMaxPrice(value);
      setMaxPriceDisplay(value ? `${value} LKR` : '');
    }
  };

  const handleFilter = () => {
    // Convert inputs to numbers, handling empty strings
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    // Validate inputs
    if (min < 0 || max < 0) {
      alert('Prices cannot be negative');
      return;
    }
    if (min > max && max !== 0) {
      alert('Minimum price cannot be greater than maximum price');
      return;
    }

    // Pass filter values to parent component
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mb-4 sm:mb-6">
      {/* Header */}
      <div className="bg-[#5CAF90] text-white py-3 px-4">
        <span className="font-semibold text-sm">Filter by Price</span>
      </div>

      {/* Filter Inputs */}
      <div className="p-4 bg-gray-50">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-700 font-medium mb-1">Min Price</label>
            <input
              type="text" // Use text to allow LKR suffix
              value={minPriceDisplay}
              onChange={handleMinPriceChange}
              placeholder="0"
              className="border border-gray-200 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5CAF90] text-sm text-gray-700"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-700 font-medium mb-1">Max Price</label>
            <input
              type="text" // Use text to allow LKR suffix
              value={maxPriceDisplay}
              onChange={handleMaxPriceChange}
              placeholder="Any"
              className="border border-gray-200 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5CAF90] text-sm text-gray-700"
            />
          </div>
          <button
            onClick={handleFilter}
            className="block w-full text-center px-3 py-2 text-sm rounded transition-colors bg-[#1D372E] text-white hover:bg-[#2a4d3e] font-medium"
          >
            Find My Budget Picks
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;