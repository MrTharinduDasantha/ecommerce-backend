import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { getBrands } from "../../api/product"; // Adjust import based on your file structure

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data.brands); // Adjust depending on your API response structure
      } catch (error) {
        setError(error.message || "Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.Brand_Name.toUpperCase().includes(searchTerm.toUpperCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsPopupOpen(e.target.value.length > 0);
  };

  if (loading) {
    return <div className="text-center">Loading brands...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

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
        {filteredBrands.map((brand, index) => (
          <Link to={`/brand/${brand.Brand_Name}`} key={index}>
            <div className="bg-white border border-[#E8E8E8] rounded-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 h-full p-4 text-center">
              <img src={brand.Brand_Image_Url || '/placeholder.svg'} alt={brand.Brand_Name} className="h-16 mx-auto" />
              <h3 className="text-[16px] font-semibold text-[#1D372E] mt-2">{brand.Brand_Name}</h3>
              <p className="text-[13.33px] text-[#5E5E5E] text-center mt-2">{brand.ShortDescription.substring(0, 100)}...</p>
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
                <Link to={`/brand/${brand.Brand_Name}`} key={index} className="flex flex-col items-center border border-[#E8E8E8] p-2 rounded hover:shadow">
                  <img src={brand.Brand_Image_Url || '/placeholder.svg'} alt={brand.Brand_Name} className="h-10" />
                  <span className="text-[#1D372E] font-medium">{brand.Brand_Name}</span>
                  <p className="text-[13.33px] text-[#5E5E5E] text-center">{brand.ShortDescription.substring(0, 80)}...</p>
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