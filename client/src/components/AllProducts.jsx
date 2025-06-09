import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../../../client/src/api/product"; // Adjust import path

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products); // Adjust based on your API response
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Get the search filter from the URL query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const letter = params.get("letter");
    const search = params.get("search");
    if (search && search.trim().length > 0) {
      setSearchTerm(search);
    } else if (letter && /^[A-Z]$/i.test(letter)) {
      setSearchTerm(letter.toUpperCase());
    } else {
      setSearchTerm("");
    }
  }, [location.search]);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    if (searchTerm.length === 1 && /^[A-Z]$/i.test(searchTerm)) {
      return product.Description?.toUpperCase().startsWith(searchTerm.toUpperCase());
    }
    if (searchTerm.trim().length > 0) {
      const query = searchTerm.trim().toLowerCase();
      const words = query.split(/\s+/);
      // Match if all words are present in any of the searchable fields
      return words.every(word =>
        (product.Description && product.Description.toLowerCase().includes(word)) ||
        (product.Brand_Name && product.Brand_Name.toLowerCase().includes(word)) ||
        (product.Category && product.Category.toLowerCase().includes(word)) ||
        (product.Long_Description && product.Long_Description.toLowerCase().includes(word))
      );
    }
    return true;
  });

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
      {/* Search Header */}

      {/* Filtered Products */}
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
          Available Products
        </h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product, index) => (
              <Link to={`/product-page/${product.idProduct}`} key={index}>
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
                    {/* Discount badge if applicable */}
                    {calculateDiscount(product.Market_Price, product.Selling_Price) && (
                      <span className="absolute top-2 right-2 bg-[#5CAF90] text-white text-[11px] px-2 py-0.5 rounded">
                        {calculateDiscount(product.Market_Price, product.Selling_Price)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="mt-2 px-2">
                    <h3 className="text-[11px] text-gray-400 mb-1">{product.Brand_Name}</h3>
                    <h3 className="text-[13px] font-medium text-gray-700 leading-snug line-clamp-2">
                      {product.Description}
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[16px] font-semibold text-[#5E5E5E]">
                        ${Number(product.Selling_Price).toFixed(2)}
                      </span>
                      {product.Market_Price > product.Selling_Price && (
                        <span className="text-[13px] line-through text-gray-400">
                          ${Number(product.Market_Price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

// Utility function for discount
const calculateDiscount = (marketPrice, sellingPrice) => {
  if (!marketPrice || !sellingPrice) return null;
  const discount = ((marketPrice - sellingPrice) / marketPrice) * 100;
  return discount > 0 ? Math.round(discount) : null;
};

export default AllProducts;