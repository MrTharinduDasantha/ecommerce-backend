import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import prada from "./prada.webp";
import ck from "./ck.png";
import loreal from "./loreal.jpg";
import gucci from "./gucci.jpg";
import lv from "./lv.jpg";
import nike from "./nike.jpg";

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const brands = [
    {
      name: "PRADA",
      description:
        "Prada is an iconic luxury fashion house known for its handbags, shoes, and accessories. Founded in 1913 by Mario Prada, it is one of the leading brands in the global fashion industry.",
      logo: prada,
    },
    {
      name: "LOREAL PARIS",
      description:
        "L'Oréal Paris is a French multinational cosmetics and beauty company founded in 1909. It is known for its skincare, haircare, make-up, and fragrance products, being one of the largest beauty brands in the world.",
      logo: loreal,
    },
    {
      name: "CALVIN KLEIN",
      description:
        "Calvin Klein is a renowned American fashion brand founded in 1968, recognized for its minimalist aesthetic and iconic collections, including fragrances, clothing, and accessories.",
      logo: ck,
    },
    {
      name: "GUCCI",
      description:
        "Gucci, founded in 1921 by Guccio Gucci, is an Italian luxury fashion brand known for its leather goods, clothing, and accessories. It’s one of the world's most valuable and recognized brands.",
      logo: gucci,
    },
    {
      name: "NIKE",
      description:
        "Nike is an American multinational corporation that designs, manufactures, and sells sportswear, footwear, and equipment. Founded in 1964 by Bill Bowerman and Phil Knight, it is the largest supplier of athletic shoes in the world.",
      logo: nike,
    },
    {
      name: "LOUIS VUITTON",
      description:
        "Louis Vuitton is a French luxury fashion house founded in 1854. It is best known for its high-end handbags, luggage, and fashion accessories. Louis Vuitton is one of the most valuable luxury brands globally.",
      logo: lv,
    },
    {
      name: "PRADA",
      description:
        "Prada is an iconic luxury fashion house known for its handbags, shoes, and accessories. Founded in 1913 by Mario Prada, it is one of the leading brands in the global fashion industry.",
      logo: prada,
    },
    {
      name: "LOREAL PARIS",
      description:
        "L'Oréal Paris is a French multinational cosmetics and beauty company founded in 1909. It is known for its skincare, haircare, make-up, and fragrance products, being one of the largest beauty brands in the world.",
      logo: loreal,
    },
    {
      name: "CALVIN KLEIN",
      description:
        "Calvin Klein is a renowned American fashion brand founded in 1968, recognized for its minimalist aesthetic and iconic collections, including fragrances, clothing, and accessories.",
      logo: ck,
    },
    {
      name: "GUCCI",
      description:
        "Gucci, founded in 1921 by Guccio Gucci, is an Italian luxury fashion brand known for its leather goods, clothing, and accessories. It’s one of the world's most valuable and recognized brands.",
      logo: gucci,
    },
    {
      name: "NIKE",
      description:
        "Nike is an American multinational corporation that designs, manufactures, and sells sportswear, footwear, and equipment. Founded in 1964 by Bill Bowerman and Phil Knight, it is the largest supplier of athletic shoes in the world.",
      logo: nike,
    },
    {
      name: "LOUIS VUITTON",
      description:
        "Louis Vuitton is a French luxury fashion house founded in 1854. It is best known for its high-end handbags, luggage, and fashion accessories. Louis Vuitton is one of the most valuable luxury brands globally.",
      logo: lv,
    },
  ];

  const filteredBrands = brands.filter((brand) =>
    brand.name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsPopupOpen(e.target.value.length > 0);
  };

  return (
    <div className="bg-white min-h-screen p-8 font-poppins relative">
      <h2 className="text-[39.81px] font-semibold text-center text-[#2D2D2D]">
        <span className="text-[#1D372E]">Brands at </span>
        <span className="text-[#5CAF90]">Asipiya</span>
      </h2>
      <br/>

      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center border border-[#E8E8E8] rounded-md overflow-hidden w-full sm:w-[400px]">
          <input
            type="text"
            placeholder="SEARCH BRANDS"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-[#000000] text-[13px] outline-none bg-[#FFFFFF]"
          />
          <button className="bg-[#5CAF90] p-2 w-9">
            <FaSearch className="text-[#FFFFFF]" />
          </button>
        </div>
      
      </div>
      <br/>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {brands.map((brand, index) => (
          <Link to={`/brand/${brand.name}`} key={index}>
            <div className="bg-white border border-[#E8E8E8] rounded-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 h-full p-4 text-center">
              <img src={brand.logo} alt={brand.name} className="h-16 mx-auto" />
              <h3 className="text-[16px] font-semibold text-[#1D372E] mt-2">{brand.name}</h3>
              <p className="text-[13.33px] text-[#5E5E5E] text-center mt-2">{brand.description.substring(0, 100)}...</p>
            </div>
          </Link>
        ))}
      </div>
      <br/>

      {/* Search Popup */}
      {isPopupOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-md z-50 border border-gray-300">
          <button
            className="absolute top-2 right-2 text-[#1D372E]"
            onClick={() => setIsPopupOpen(false)}
          >
            <FaTimes />
          </button>
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          {filteredBrands.length > 0 ? (
            <div className="grid gap-4">
              {filteredBrands.map((brand, index) => (
                <Link to={`/brand/${brand.name}`} key={index} className="flex flex-col items-center border border-[#E8E8E8] p-2 rounded hover:shadow">
                  <img src={brand.logo} alt={brand.name} className="h-10" />
                  <span className="text-[#1D372E] font-medium">{brand.name}</span>
                  <p className="text-[13.33px] text-[#5E5E5E] text-center">{brand.description.substring(0, 80)}...</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No brands found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Brands;
