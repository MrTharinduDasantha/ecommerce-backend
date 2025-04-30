import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { getProducts } from "../../../client/src/api/product"; // Adjust import based on your file structure

const AllProducts = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products); // Adjust based on your API response structure
      } catch (error) {
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.Description.toUpperCase().includes(searchTerm.toUpperCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsPopupOpen(e.target.value.length > 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#1D372E]">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[33.18px] font-semibold text-[#1D372E] mb-6 text-left">
        Products
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center border border-[#E8E8E8] rounded-md overflow-hidden w-full sm:w-[400px]">
          <input
            type="text"
            placeholder="SEARCH PRODUCTS"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-[#000000] text-[13px] outline-none bg-[#FFFFFF]"
          />
          <button className="bg-[#5CAF90] p-2 w-9">
            {/* Search Icon */}
            <span className="text-[#FFFFFF]">🔍</span>
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
          Available Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Link to={`/product/${product.idProduct}`} key={index}>
                <div
                  className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
                  style={{ width: '220px', height: '290px' }}
                >
                  <div className="relative">
                    <img
                      src={product.Main_Image_Url || '/placeholder.svg'}
                      alt={product.Description}
                      className="w-[220px] h-[170px] object-cover"
                    />
                    {/* Discount Badge */}
                    {calculateDiscount(product.Market_Price, product.Selling_Price) && (
                      <span className="absolute top-4 right-3 bg-[#5CAF90] text-white text-[11.11px] px-2 py-0.5 rounded">
                        {calculateDiscount(product.Market_Price, product.Selling_Price)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-[11.11px] text-gray-400 mb-1 pl-4">
                      {product.Brand_Name}
                    </h3>
                    <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] pl-4">
                      {product.Description}
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">
                        ${Number(product.Selling_Price).toFixed(2)}
                      </span>
                      {product.Market_Price > product.Selling_Price && (
                        <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">
                          ${Number(product.Market_Price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500">No products available.</div>
          )}
        </div>
      </div>

     
    </div>
  );
};

// Calculate discount percentage
const calculateDiscount = (marketPrice, sellingPrice) => {
  if (!marketPrice || !sellingPrice) return null;
  const discount = ((marketPrice - sellingPrice) / marketPrice) * 100;
  return discount > 0 ? Math.round(discount) : null;
};


  

export default AllProducts;