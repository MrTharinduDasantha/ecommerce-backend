import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import AppleIcon from "@mui/icons-material/Apple";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCart } from "../context/CartContext";
import Sidebar from "./Sidebar";
import LovelySpringBouquet from "../assets/RushDelivery/LovelySpringBouquet.jpg";
import MacaronsTreat from "../assets/RushDelivery/MacaronsTreat.jpg";
import SweetDelight from "../assets/RushDelivery/SweetDelight.jpg";
import CartierWatch from "../assets/RushDelivery/CartierWatch.jpg";
import BerryDelight from "../assets/RamadanOffers/BerryDelight.jpg";
import FloralTouchDelight from "../assets/RamadanOffers/FloralTouchDelight.jpg";
import StrawberryTreat from "../assets/RamadanOffers/StrawberryTreat.jpg";
import WonderChocolateTreat from "../assets/RamadanOffers/WonderChocolateTreat.jpg";
import LoveInBloomBouquet from "../assets/ForYou/LoveInBloomBouquet.jpg";
import TruffleTemptation from "../assets/ForYou/TruffleTemptation.jpg";
import VersaceEros from "../assets/ForYou/VersaceEros.jpg";
import MeltMyHeart from "../assets/ForYou/MeltMyHeart.jpg";
import ZARAHandbags from "../assets/OnSale/ZARAHandbags.jpg";
import Refrigerator from "../assets/OnSale/Refrigerator.jpg";
import MacbookAir from "../assets/OnSale/MacbookAir.jpg";
import DELLLaptop from "../assets/OnSale/DELLLaptop.jpg";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading, error, getTotal } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.source;
  const selectedProduct = location.state?.selectedProduct;

  // Initialize selected items when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }, [cartItems]);

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        ...item,
        discountName:
          item.discountName ||
          (item.category === "Seasonal Offers"
            ? "Seasonal Discounts"
            : item.category === "Rush Delivery"
            ? "Rush Discounts"
            : item.category === "For You"
            ? "For You Discounts"
            : "Sale Discounts"),
      }));
    navigate("/checkout", {
      state: {
        selectedItems: selectedCartItems,
        source: "cart",
      },
    });
  };

  // Scroll to the selected product if it exists
  useEffect(() => {
    if (selectedProduct && cartItems.length > 0) {
      const productElement = document.getElementById(
        `product-${selectedProduct.id}`
      );
      if (productElement) {
        productElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add a highlight effect
        productElement.classList.add("highlight-product");
        setTimeout(() => {
          productElement.classList.remove("highlight-product");
        }, 2000);
      }
    }
  }, [selectedProduct, cartItems]);

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const formatPrice = (price) => {
    if (isNaN(price)) return "LKR 0";
    return `LKR ${price.toLocaleString()}`;
  };

  // Related products based on source
  const getRelatedProducts = () => {
    if (source === "rush-delivery") {
      return [
        {
          id: 1,
          name: "Lovely Spring Bouquet",
          image: LovelySpringBouquet,
          price: "LKR 7,500",
        },
        {
          id: 2,
          name: "Macarons Treat",
          image: MacaronsTreat,
          price: "LKR 3,500",
        },
        {
          id: 3,
          name: "Sweet Delight",
          image: SweetDelight,
          price: "LKR 4,800",
        },
        {
          id: 4,
          name: "Cartier Watch",
          image: CartierWatch,
          price: "LKR 50,000",
        },
      ];
    } else if (source === "seasonal-offers") {
      return [
        {
          id: 1,
          name: "Berry Delight",
          image: BerryDelight,
          price: "LKR 4,500",
        },
        {
          id: 2,
          name: "Floral Touch Delight",
          image: FloralTouchDelight,
          price: "LKR 5,500",
        },
        {
          id: 3,
          name: "Strawberry Treat",
          image: StrawberryTreat,
          price: "LKR 3,500",
        },
        {
          id: 4,
          name: "Wonder Chocolate Treat",
          image: WonderChocolateTreat,
          price: "LKR 4,000",
        },
      ];
    } else if (source === "for-you") {
      return [
        {
          id: 1,
          name: "Love In Bloom Bouquet",
          image: LoveInBloomBouquet,
          price: "LKR 7,500",
        },
        {
          id: 2,
          name: "Truffle Temptation",
          image: TruffleTemptation,
          price: "LKR 9,000",
        },
        {
          id: 3,
          name: "Versace Eros",
          image: VersaceEros,
          price: "LKR 35,000",
        },
        {
          id: 4,
          name: "Melt My Heart",
          image: MeltMyHeart,
          price: "LKR 6,500",
        },
      ];
    } else if (source === "on-sale") {
      return [
        {
          id: 1,
          name: "ZARA Handbags",
          image: ZARAHandbags,
          price: "LKR 5,500",
        },
        {
          id: 2,
          name: "Refrigerator",
          image: Refrigerator,
          price: "LKR 35,000",
        },
        {
          id: 3,
          name: "Macbook Air",
          image: MacbookAir,
          price: "LKR 200,000",
        },
        {
          id: 4,
          name: "DELL Laptop",
          image: DELLLaptop,
          price: "LKR 150,000",
        },
      ];
    }

    // Default related products for other sources
    return [
      {
        id: 1,
        name: "Lovely Spring Bouquet",
        image: LovelySpringBouquet,
        price: "LKR 7,500",
      },
      {
        id: 2,
        name: "Macarons Treat",
        image: MacaronsTreat,
        price: "LKR 3,500",
      },
      {
        id: 3,
        name: "Sweet Delight",
        image: SweetDelight,
        price: "LKR 4,800",
      },
      {
        id: 4,
        name: "Cartier Watch",
        image: CartierWatch,
        price: "LKR 50,000",
      },
    ];
  };

  const relatedProducts = getRelatedProducts();

  return (
    <div className="min-h-screen bg-white w-full flex flex-col">
      <div className="flex-1 mt-[120px]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Cart Header */}
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-xl">
              Your Cart: {cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""}
            </h1>
            <button className="text-[#5CAF90] hover:text-[#3d2569]">
              <ShareIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CAF90] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                {cartItems.length === 0 ? (
                  <div className="text-gray-500 text-lg text-center py-8 bg-white rounded-lg border border-gray-200">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-6 my-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        id={`product-${item.id}`}
                        className={`grid grid-cols-6 text-center w-auto border-b-2 border-gray-200 pb-4 transition-all duration-500 ${
                          selectedProduct && selectedProduct.id === item.id
                            ? "highlight-product"
                            : ""
                        }`}
                      >
                        <div className="col-span-2">
                          <div className="flex items-center space-x-4">
                            <Link to={`/product/${item.id}`} className="flex items-center space-x-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex flex-col">
                                <h3 className="font-medium">{item.name}</h3>
                                <div className="flex items-center gap-4">
                                  {item.color && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">
                                        Color:
                                      </span>
                                      <span className="text-sm font-medium">
                                        {item.color}
                                      </span>
                                      {item.colorCode && (
                                        <div
                                          className="w-4 h-4 rounded-full border border-gray-300"
                                          style={{
                                            backgroundColor: item.colorCode,
                                          }}
                                        />
                                      )}
                                    </div>
                                  )}
                                  {item.size && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-600">
                                        Size:
                                      </span>
                                      <span className="text-sm font-medium">
                                        {item.size}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="my-auto">
                          <p className="text-[#1D372E] font-medium">{formatPrice(item.price)}</p>
                        </div>
                        <div className="my-auto">
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              if (newQuantity > 0) {
                                updateQuantity(item.id, newQuantity)
                                  .catch(error => {
                                    // Show error message to user
                                    alert(error.message);
                                    // Reset to previous quantity
                                    e.target.value = item.quantity;
                                  });
                              }
                            }}
                            className="w-16 text-center border rounded py-1 ml-4"
                          />
                        </div>
                        <div className="my-auto">
                          <p className="text-[#1D372E] font-medium ml-auto">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="my-auto">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50 ml-4"
                            aria-label="Remove item"
                          >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="lg:w-80 bg-white rounded-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-0 lg:ml-auto">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg">{formatPrice(getTotal())}</span>
                </div>

                <Link
                  to="/"
                  className="block w-full bg-[#1D372E] text-white text-center py-3 rounded hover:bg-[#1D372E] transition-colors mb-4"
                >
                  ← Keep Shopping
                </Link>

                {cartItems.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full text-white text-center py-3 rounded transition-colors mb-8 ${
                      selectedItems.length > 0
                        ? "bg-[#5CAF90] hover:bg-[#5CAF90]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Checkout{" "}
                    {selectedItems.length > 0
                      ? `(${selectedItems.length} items)`
                      : ""}
                  </button>
                )}

                <div className="text-center">
                  <p className="text-[#6B7280] text-sm mb-4">
                    SECURE PAYMENTS PROVIDED BY
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-4 opacity-40"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="h-4 opacity-40"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                      alt="American Express"
                      className="h-4 opacity-40"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      alt="PayPal"
                      className="h-4 opacity-40"
                    />
                    <AppleIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Products Section */}
          <div className="mt-24">
            <h2 className="text-2xl text-[#1D372E] mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer transform transition-transform duration-300 hover:scale-105"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative"
                  >
                    <div className="overflow-hidden rounded-lg mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                        style={{
                          objectPosition:
                            product.name === "Berry Delight"
                              ? "center 70%"
                              : product.name === "Floral Touch Delight"
                              ? "center 40%"
                              : product.name === "Strawberry Treat"
                              ? "center 30%"
                              : product.name === "Versace Eros"
                              ? "center 40%"
                              : "center",
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 text-align-center">
                      {product.name}
                    </h3>
                    <p className="text-[#1D372E] font-medium text-align-center">
                      {product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .highlight-product {
          background-color: rgba(92, 175, 144, 0.1);
          border: 1px solid #5caf90;
          border-radius: 8px;
          padding: 8px;
          animation: pulse 2s;
        }
        .text-align-center {
          text-align: center;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(92, 175, 144, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(92, 175, 144, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(92, 175, 144, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
