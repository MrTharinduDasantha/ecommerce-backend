import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; 
import kids from "./kids.jpg";
import love from"./love.webp";
import birthday from "./birthday.jpg";
import bestsellers from "./bestsellers.webp";

const Events = [
  { name: "Birthday Gift", image: birthday },
  { name: "Best Sellers", image: bestsellers },
  { name: "I Love You", image: love },
  { name: "For Kids", image: kids },
  { name: "Birthday Gift", image: birthday },
  { name: "Best Sellers", image: bestsellers },
  { name: "I Love You", image: love },
  { name: "For Kids", image: kids },
];

const EventSection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter events based on search term
  const filteredEvents = Events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[39.81px] font-semibold text-[#2D2D2D] mb-6 text-center">
        <span className="text-[#1D372E]">Events at </span>
        <span className="text-[#5CAF90]">Asipiya</span>
      </h2>

      {/* Search bar */}
      <div className="flex justify-center mb-6 ml-55">
        <div className="flex flex-1 max-w-full sm:max-w-2xl px-4">
          <input
            type="text"
            placeholder="SEARCH EVENTS"
            className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins border border-[#E8E8E8]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-[#5CAF90] p-2 w-9 rounded-r-md">
            <FaSearch className="text-[#FFFFFF]" />
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-lg relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
            style={{ width: '250px', height: '300px' }} // Increased card width and height
          >
            <div className="relative "> {/* Reduced padding to reduce the gap */}
              <img
                src={event.image}
                alt={event.name}
                className="w-[250px] h-[190px] object-cover" // Increased image width
              />
             
            </div>
            <div className="mt-4">
              <h3 className="text-[16px] font-semibold text-center text-[#1D372E]">{event.name}</h3>
              {/* See Offers Button */}
              <button 
                className="mt-2 w-[150px] py-2 bg-[#5CAF90] text-center  ml-13 text-[#FFFFFF] rounded-[30px] font-semibold text-[14px] hover:bg-[#4a9f7a] transition-colors"
              >
                See Offers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSection;
