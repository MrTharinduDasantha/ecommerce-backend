import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { products } from "./Products";
import Banner from "../assets/banner.png";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, updateCartItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isFromCart, setIsFromCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const selectedProduct = products.find((p) => p.id === parseInt(id));
    if (selectedProduct) {
      setProduct(selectedProduct);
      setMainImage(selectedProduct.image);
      if (selectedProduct.variants[0]?.size) {
        setSelectedSize(selectedProduct.variants[0].size[0]);
      }
      setQuantity(selectedProduct.variants[selectedVariant].quantity > 0 ? 1 : 0);
    }

    // Check if coming from cart
    if (location.state?.fromCart) {
      setIsFromCart(true);
      setCartItem(location.state.selectedVariant);
      // Set initial variant based on cart item
      if (location.state.selectedVariant) {
        const variantIndex = selectedProduct.variants.findIndex(
          v => v.colorName === location.state.selectedVariant.color
        );
        if (variantIndex !== -1) {
          setSelectedVariant(variantIndex);
        }
      }
    }
  }, [id, location.state]);

  useEffect(() => {
    if (product) {
      setQuantity(currentVariant.quantity > 0 ? 1 : 0);
    }
  }, [selectedVariant, product]);

  const currentVariant = product?.variants[selectedVariant] || {};

  const handleAddToCart = () => {
    if (product && currentVariant.quantity > 0) {
      const cartItem = {
        id: product.id,
        name: product.name,
        image: mainImage,
        price: `LKR ${currentVariant.price.toFixed(2)}`,
        quantity: quantity,
        size: selectedSize,
        color: currentVariant.colorName || null,
        colorCode: currentVariant.color || null
      };
      
      if (isFromCart) {
        // Update existing cart item
        updateCartItem(cartItem);
        navigate('/cart', { 
          state: { 
            selectedProduct: cartItem,
            source: 'product-page'
          } 
        });
      } else {
        // Add new item to cart
        addToCart(cartItem);
        navigate('/cart', { 
          state: { 
            selectedProduct: cartItem,
            source: 'product-page'
          } 
        });
      }
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 inline" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
      }
    }

    return (
      <div className="inline-flex items-center">
        {stars}
        <span className="ml-2 text-gray-700"> | {product.noOfRatings}</span>
      </div>
    );
  };

  if (!product) return <div className="text-center py-8">Loading...</div>;

  const relatedProducts = products
    .filter((p) => p.id !== parseInt(id))
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Images */}
        <div>
          <div
            className=" border rounded-lg overflow-hidden mb-4 mt-3"
            style={{ maxWidth: "600px", maxHeight: "400px", borderColor:"transparent" }}
          >
            <img
              src={mainImage}
              style={{maxHeight: "400px"}}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Other Images */}
          <div className="flex justify-center space-x-2 overflow-x-auto py-2">
            <img
              src={product.image}
              alt="Main"
              className="w-16 h-16 border rounded cursor-pointer object-cover flex-shrink-0"
              onClick={() => setMainImage(product.image)}
            />
            {product.otherImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product ${index + 1}`}
                className="w-16 h-16 border rounded cursor-pointer object-cover flex-shrink-0"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            {product.name}
          </h1>

          {/* Rating */}
          <div>{renderRatingStars()}</div>

          {/* Price */}
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
            LKR {currentVariant.price.toFixed(2)}
            {product.marketPrice > currentVariant.price && (
              <span className="ml-2 text-gray-500 line-through text-base sm:text-lg">
                LKR {product.marketPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
            {product.description}
          </p>

          {/* Size Selection */}
          {currentVariant.size && (
            <div className="mt-2 sm:mt-4">
              <span className="font-semibold">Size:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentVariant.size.map((size) => (
                  <button
                    key={size}
                    className={`cursor-pointer px-3 sm:px-4 py-1 sm:py-2 border rounded-lg hover:bg-[#87c4ae] hover:text-white text-sm sm:text-base ${
                      selectedSize === size ? "bg-[#5CAF90] text-white" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {currentVariant.color && (
            <div className="mt-2 sm:mt-4">
              <span className="font-semibold">Color:</span>
              <div className="flex gap-2 mt-2">
                {product.variants.map((variant, index) => (
                  <div key={index} className="relative group">
                    <button
                      className={`cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-[20%] border-1 ${
                        selectedVariant === index
                          ? "border-gray-500 border-3"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: variant.color }}
                      onClick={() => setSelectedVariant(index)}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {variant.colorName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <span
            className={`inline-block ${
              currentVariant.quantity > 0 ? "bg-[#5CAF90]" : "bg-red-600"
            } px-2 text-white border border-black sm:px-3 py-1 rounded-md text-xs sm:text-sm`}
          >
            {currentVariant.quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>

          {/* Quantity & Cart */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-4">
            {/* Quantity Selector */}
            <div className="flex items-center border px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
              <button
                className="text-lg sm:text-xl cursor-pointer"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={currentVariant.quantity <= 0} // Disable if out of stock
              >
                -
              </button>
              <span className="mx-3 sm:mx-4">{quantity}</span>
              <button
                className="text-lg sm:text-xl cursor-pointer"
                onClick={() =>
                  setQuantity(Math.min(quantity + 1, currentVariant.quantity))
                } // Prevent exceeding stock
                disabled={
                  quantity >= currentVariant.quantity ||
                  currentVariant.quantity <= 0
                } // Disable if max reached or out of stock
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              className={`${
                currentVariant.quantity > 0
                  ? " hover:opacity-90 cursor-pointer"
                  : " cursor-not-allowed"
              } text-white bg-[#5CAF90] border-black border-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto text-center`}
              disabled={currentVariant.quantity <= 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 sm:mt-12">
        <div className="flex space-x-2 font-medium sm:space-x-4 border-b pb-2  overflow-x-auto">
          {["details", "specification", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`cursor-pointer hover:bg-[#5CAF90] hover:text-white border-1 rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab
                  ? " text-white bg-[#5CAF90] hover:opacity-90"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-4 text-gray-600 text-sm sm:text-base">
          {activeTab === "details" && <p>{product.detail}</p>}
          {activeTab === "specification" && <p>{product.specification}</p>}
          {activeTab === "reviews" && <p>{product.reviews}</p>}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6">
          Related <span className="text-[#5CAF90]">Products</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="border p-2 sm:p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/product-page/${relatedProduct.id}`)}
            >
              <div className="aspect-square">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <h3 className="mt-2 text-center text-xs sm:text-sm font-semibold line-clamp-2">
                {relatedProduct.name}
              </h3>
              <div className="text-center text-gray-800 font-bold text-sm sm:text-base">
                LKR {relatedProduct.variants[0].price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="mt-8 sm:mt-12">
        <img src={Banner} alt="Banner" className="w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProductPage;
