import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts } from "../api/product";
import ProductCard from "./ProductCard";
import { calculateDiscountPercentage } from "./CalculateDiscount";

const FilteredProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const formattedProducts = data.products
          .filter(product => product.Status === "active")
          .map(product => ({
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
            description: product.Description || ""
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    setSearchTerm(search ? search : "");
  }, [location.search]);

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    if (query.length === 1) {
      return (
        (product.name && product.name.toLowerCase().startsWith(query)) ||
        (product.brand && product.brand.toLowerCase().startsWith(query)) ||
        (product.category && product.category.toLowerCase().startsWith(query)) ||
        (product.description && product.description.toLowerCase().startsWith(query))
      );
    }
    const words = query.split(/\s+/);
    return words.every(
      word =>
        (product.name && product.name.toLowerCase().includes(word)) ||
        (product.brand && product.brand.toLowerCase().includes(word)) ||
        (product.category && product.category.toLowerCase().includes(word)) ||
        (product.description && product.description.toLowerCase().includes(word))
    );
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
    <div className="min-h-screen px-4 py-8 bg-white md:px-16 font-poppins">
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
          Filtered Products
        </h3>
        {products.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500">No products loaded from backend.</div>
        )}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
              >
                <Link to={`/product-page/${product.id}`}>
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
                    id={product.id}
                    className="h-full"
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          products.length > 0 && (
            <div className="text-center text-gray-500">No products found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default FilteredProducts;
