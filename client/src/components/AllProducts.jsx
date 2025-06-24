import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../api/product";
import ProductCard from "./ProductCard";
import { calculateDiscountPercentage } from "./CalculateDiscount";

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        // Format products to match the structure expected by ProductCard
        const formattedProducts = data.products
          .filter((product) => product.Status === "active")
          .map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: product.Selling_Price,
            oldPrice: product.Market_Price,
            weight: product.SIH || "N/A",
            color: product.variations?.[0]?.Colour || "N/A",
            size: product.variations?.[0]?.Size || null,
            discountName: product.Discount_Name || "",
            category: product.subcategories?.[0]?.Description || "",
            brand: product.Brand_Name || "",
            historyStatus: product.History_Status || ""
          }));
        setProducts(formattedProducts);
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
      return product.name?.toUpperCase().startsWith(searchTerm.toUpperCase());
    }
    if (searchTerm.trim().length > 0) {
      const query = searchTerm.trim().toLowerCase();
      const words = query.split(/\s+/);
      // Match if all words are present in any of the searchable fields
      return words.every(
        (word) =>
          (product.name && product.name.toLowerCase().includes(word)) ||
          (product.brand && product.brand.toLowerCase().includes(word)) ||
          (product.category && product.category.toLowerCase().includes(word))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#1D372E]">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-500">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-red-500"
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
    <div className="min-h-screen px-4 py-3 bg-white md:px-16 font-poppins">
      {/* Search Header */}

      {/* Filtered Products */}
      <div className="mt-2 mb-5">
        <h2 className="mb-6 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">Available </span>
          <span className="text-[#5CAF90]">Products</span>
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                onClick={() => handleProductClick(product.id)}
              >
                <ProductCard
                  image={product.image}
                  category={product.category}
                  title={product.name}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  discountLabel={
                    product.oldPrice && product.price
                      ? `${calculateDiscountPercentage(
                          product.oldPrice,
                          product.price
                        )} % OFF`
                      : null
                  }
                  historyStatus={product.historyStatus}
                  id={product.id}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-10 flex items-center justify-center">
            <p className="text-xl md:text-2xl font-bold text-gray-500">
              No Products Found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
