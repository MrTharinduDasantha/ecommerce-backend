import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/product"; // Import the API function
import Sidebar from "../Sidebar";
import Banner from "../Banner";
import ProductCard from "../ProductCard";

const SeasonalOffers = () => {

  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch seasonal offers products using the API function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data.message === "Products fetched successfully") {
          // Map backend data to the required format
          const formattedProducts = data.products.map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: `LKR ${product.Selling_Price}`,
            oldPrice: `LKR ${product.Market_Price}`,
            weight: product.SIH || "N/A",
            color: product.variations?.[0]?.Colour || "N/A",
            size: product.variations?.[0]?.Size || null,
            discountName: product.Discount_Name || "Seasonal Discounts",
            category:product.subcategories?.[0]?.Description || ""
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching seasonal offers products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    // Navigate to product page instead of adding to cart
    navigate(`/product-page/${product.id}`, {
      state: {
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          oldPrice: product.oldPrice,
          color: product.color,
          size: product.size,
          discountName: product.discountName,
 
        }
      }
    });
  };

  const handleViewCart = () => {
    navigate("/cart", {
      state: {
        source: "seasonal-offers",
        selectedProducts: addedProducts,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 lg:px-2 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-4">
          {/* Sidebar - Full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Banner */}
            <Banner className="mb-4 sm:mb-6" />

            {/* Header with View Cart button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold">
                TOP SEASONAL OFFERS
              </h2>
              {addedProducts.length > 0 && (
                <button
                  onClick={handleViewCart}
                  className="bg-[#5CAF90] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
                >
                  View Cart ({addedProducts.length})
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                >
                  <ProductCard
                    image={product.image}
                    category={product.category}
                    title={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    id={product.id}
                    onProductClick={() => handleProductClick(product)}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalOffers;
