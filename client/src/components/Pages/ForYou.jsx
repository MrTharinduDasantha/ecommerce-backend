import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../api/product"; // Import the API function
import Sidebar from "../Sidebar";
import ProductCard from "../ProductCard";
import ForYouBanner from "../ForYouBanner";
import { calculateDiscountPercentage } from "../CalculateDiscount";

const ForYou = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  // Fetch products using the API function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        if (data.message === "Products fetched successfully") {
          // Filter products where For_You is 1
          const forYouProducts = data.products.filter(
            (product) => product.For_You === 1
          );
          // Map filtered products to the required format
          const formattedProducts = forYouProducts.map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: product.Selling_Price,
            oldPrice: product.Market_Price,
            weight: product.SIH || "N/A",
            color: product.variations?.[0]?.Colour || "N/A",
            size: product.variations?.[0]?.Size || null,
            discountName: product.Discount_Name || "For You Discounts",
            category: product.subcategories?.[0]?.Description || "",
            historyStatus: product.History_Status || "",
            activeDiscount: product.discounts?.find(d => d.Status === "active") || null,
            eventDiscounts: product.eventDiscounts || [],
            // Pass full product object for complete discount calculation
            product: {
              idProduct: product.idProduct,
              Selling_Price: product.Selling_Price,
              Market_Price: product.Market_Price,
              discounts: product.discounts || [],
              eventDiscounts: product.eventDiscounts || []
            }
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleViewCart = () => {
    // Navigate to cart page with all added products
    navigate("/cart", {
      state: {
        source: "for-you",
        selectedProducts: addedProducts,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 lg:px-2 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-4">
          {/* Sidebar - Full width on mobile, fixed width on desktop */}
          {/* <div className="w-full lg:w-64 xl:w-72">
            <Sidebar />
          </div> */}

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Banner */}
            <ForYouBanner className="mb-4 sm:mb-6" />

            {/* Header with View Cart button */}
              <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
                <span className="text-[#1D372E]">Products </span>
                <span className="text-[#5CAF90]">For You</span>
              </h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
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
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.length > 0 ? (
                products.map((product) => (
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
                      weight={product.weight}
                      historyStatus={product.historyStatus}
                      activeDiscount={product.activeDiscount}
                      eventDiscounts={product.eventDiscounts}
                      id={product.id}
                      product={product.product}
                      className="h-full"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 flex items-center justify-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-500">
                    No products available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
