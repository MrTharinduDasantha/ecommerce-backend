import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Apple, Delete } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import { getProducts } from "../api/product";
import { formatPrice } from "./FormatPrice";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading, error } =
    useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.selectedProduct;

  // Initialize selected items when cart items change
  useEffect(() => {
    setSelectedItems(cartItems.map((item) => item.id));
  }, [cartItems]);

  // Calculate total price based on selected items only
  const calculateSelectedTotal = useCallback(() => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems, selectedItems]);

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      if (response.message === "Products fetched successfully") {
        const filteredRelated =
          cartItems.length > 0
            ? response.products
                .filter(
                  (p) => !cartItems.some((item) => item.id === p.idProduct)
                )
                .slice(0, 5)
            : response.products.slice(0, 5);

        setRelatedProducts(
          filteredRelated.map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: product.Selling_Price,
            oldPrice: product.Market_Price,
            weight: product.SIH || "N/A",
            color: product.variations?.[0]?.Colour || "N/A",
            category: product.subcategories?.[0]?.Description || "",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  const handleCheckout = useCallback(() => {
    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        ...item,
      }));

    navigate("/checkout", {
      state: { selectedItems: selectedCartItems, source: "cart" },
    });
  }, [cartItems, selectedItems, navigate]);

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Toggle all items selection
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // Highlight selected product if exists
  useEffect(() => {
    if (selectedProduct && cartItems.length > 0) {
      const productElement = document.getElementById(
        `product-${selectedProduct.id}`
      );
      if (productElement) {
        productElement.scrollIntoView({ behavior: "smooth", block: "center" });
        productElement.classList.add("highlight-product");
        setTimeout(() => {
          productElement.classList.remove("highlight-product");
        }, 2000);
      }
    }
  }, [selectedProduct, cartItems]);

  const paymentLogos = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      alt: "Visa",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      alt: "Mastercard",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
      alt: "American Express",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      alt: "PayPal",
    },
    {
      icon: <Apple sx={{ fontSize: 16, color: "#9CA3AF" }} />,
      alt: "Apple Pay",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CAF90] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white w-full flex flex-col">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-3 mt-6">
          Cart <span className="text-[#5CAF90]">Page</span>
        </h2>
        <div className="flex-1 mt-[10px]">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Cart Header */}
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-xl">
                Your Cart: {cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""}
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                {cartItems.length === 0 ? (
                  <div className="text-gray-500 text-lg text-center py-24.5 bg-white rounded-lg border-2 border-gray-200 mt-8.5">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-6 my-auto rounded-lg">
                    {/* Select All checkbox - moved outside the product container */}
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === cartItems.length &&
                          cartItems.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-[#5CAF90] text-[#5CAF90]"
                      />
                      <label className="ml-3 text-sm text-gray-700 font-bold">
                        Select all ({selectedItems.length}/{cartItems.length})
                      </label>
                    </div>

                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {/* Checkbox moved outside the product container */}
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-[#5CAF90] text-[#5CAF90]"
                          />
                        </div>

                        {/* Product container */}
                        <div
                          id={`product-${item.id}`}
                          className={`flex-1 grid grid-cols-6 text-center w-auto border border-gray-200 rounded-lg ${
                            selectedProduct?.id === item.id
                              ? "highlight-product"
                              : ""
                          }`}
                        >
                          <div className="col-span-2">
                            <Link
                              to={`/product-page/${item.productId}`}
                              className="flex items-center space-x-8"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-25 h-25 min-w-25 object-cover rounded-lg"
                                loading="lazy"
                              />
                              <div className="flex flex-col text-left">
                                <h3 className="font-medium line-clamp-1">
                                  {item.name}
                                </h3>

                                {/* Only show this container if either color or size exists */}
                                {(item.color || item.size) && (
                                  <div className="items-center">
                                    {/* Color - Only show if exists */}
                                    {item.color &&
                                      item.color !== "No color selected" && (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm text-gray-600 font-semibold">
                                            Color:
                                          </span>
                                          <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{
                                              backgroundColor: item.color,
                                            }}
                                          />
                                        </div>
                                      )}
                                    {/* Size - Only show if exists */}
                                    {item.size &&
                                      item.size !== "No size selected" && (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-sm text-gray-600 font-semibold">
                                            Size:
                                          </span>
                                          <span className="text-sm font-medium">
                                            {item.size}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            </Link>
                          </div>
                          <div className="my-auto">
                            <p className="text-[#5E5E5E] line-through text-[15px] font-semibold">
                              {formatPrice(item.mktPrice)}
                            </p>
                            <p className="text-[#1D372E] font-semibold">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          {/* Quantity Selector */}
                          <div className="m-auto border rounded-lg px-[8px] pb-1">
                            <button
                              className="text-lg sm:text-xl cursor-pointer"
                              onClick={() => {
                                const newQuantity = Math.max(
                                  1,
                                  item.quantity - 1
                                );
                                updateQuantity(item.id, newQuantity).catch(
                                  console.error
                                );
                              }}
                              disabled={item.availableQty <= 0}
                            >
                              -
                            </button>
                            <span className="mx-2 sm:mx-2">
                              {item.quantity}
                            </span>
                            <button
                              className="text-lg sm:text-xl cursor-pointer"
                              onClick={() => {
                                const newQuantity = Math.min(
                                  item.quantity + 1,
                                  item.availableQty
                                );
                                updateQuantity(item.id, newQuantity).catch(
                                  console.error
                                );
                              }}
                              disabled={
                                item.quantity >= item.availableQty ||
                                item.availableQty <= 0
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className="my-auto">
                            <p className="text-[#1D372E] font-semibold ml-auto">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          <div className="my-auto">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50 ml-4 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Delete sx={{ fontSize: 20 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="lg:w-80 bg-white rounded-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-0 lg:ml-auto mt-8.5 ">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(calculateSelectedTotal())}
                  </span>
                </div>

                <Link
                  to="/"
                  className="block w-full bg-[#1D372E] text-white text-center py-3 rounded hover:bg-[#1D372E] transition-colors mb-4 "
                >
                  ← Keep Shopping
                </Link>

                {cartItems.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full text-white cursor-pointer text-center py-3 rounded transition-colors mb-8 ${
                      selectedItems.length > 0
                        ? "bg-[#5CAF90] hover:bg-[#5CAF90]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Checkout{" "}
                    {selectedItems.length > 0 &&
                      `(${selectedItems.length} item${
                        selectedItems.length !== 1 ? "s" : ""
                      })`}
                  </button>
                )}

                <div className="text-center">
                  <h3 className="text-black  mb-4 font-semibold">
                    Secure Payments Provided By
                  </h3>
                  <div className="flex justify-center items-center gap-4">
                    {paymentLogos.map((logo, index) =>
                      logo.icon ? (
                        <span key={index} aria-label={logo.alt}>
                          {logo.icon}
                        </span>
                      ) : (
                        <img
                          key={index}
                          src={logo.src}
                          alt={logo.alt}
                          className="h-4 "
                          loading="lazy"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6">
                  Related <span className="text-[#5CAF90]">Products</span>
                </h2>
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                      onClick={() =>  navigate(`/product-page/${product.id}`)}
                    >
                      <ProductCard
                        image={product.image}
                        category={product.category}
                        title={product.name}
                        price={formatPrice(product.price)}
                        oldPrice={formatPrice(product.oldPrice)}
                        weight={product.weight}
                        id={product.id}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
