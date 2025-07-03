import { useState, useEffect, useCallback } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Apple, Delete } from "@mui/icons-material"
import ProductCard from "./ProductCard"
import { useCart } from "../context/CartContext"
import { getProducts } from "../api/product"
import { formatPrice } from "./FormatPrice"
import { calculateDiscountPercentage } from "./CalculateDiscount"

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, loading, error } =
    useCart()

  const [selectedItems, setSelectedItems] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [items, setItems] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const selectedProduct = location.state?.selectedProduct

  const handleProductClick = productId => {
    window.scrollTo(0, 0)
    navigate(`/product-page/${productId}`)
  }

  // Initialize selected items when cart items change
  useEffect(() => {
    setSelectedItems(items.map(item => item.id))
  }, [items])

  useEffect(() => {
    setItems(cartItems)
  }, [cartItems])

  // Calculate total price based on selected items only
  const calculateSelectedTotal = useCallback(() => {
    return items
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items, selectedItems])

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const response = await getProducts()
      if (response.message === "Products fetched successfully") {
        const filteredRelated =
          items.length > 0
            ? response.products
                .filter(p => !items.some(item => item.id === p.idProduct))
                .slice(0, 5)
            : response.products.slice(0, 5)

        setRelatedProducts(
          filteredRelated.map(product => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: product.Selling_Price,
            oldPrice: product.Market_Price,
            weight: product.SIH || "N/A",
            color: product.variations?.[0]?.Colour || "N/A",
            category: product.subcategories?.[0]?.Description || "",
          }))
        )
      }
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }, [items])

  useEffect(() => {
    fetchRelatedProducts()
  }, [fetchRelatedProducts])

  const handleCheckout = useCallback(async () => {
    const updatePromises = items
      .filter(item => selectedItems.includes(item.id))
      .map(item => {
        const originalItem = cartItems.find(ci => ci.id === item.id)
        if (originalItem && originalItem.quantity !== item.quantity)
          return updateQuantity(item.id, item.quantity)
        return Promise.resolve()
      })
    try {
      await Promise.all(updatePromises)
      const selectedCartItems = items
        .filter(item => selectedItems.includes(item.id))
        .map(item => ({
          ...item,
        }))

      navigate("/checkout", {
        state: { selectedItems: selectedCartItems, source: "cart" },
      })
    } catch (error) {
      console.error("Error updating quantities before checkout:", error)
    }
  }, [items, selectedItems, navigate, cartItems, updateQuantity])

  // Toggle item selection
  const toggleItemSelection = itemId => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Toggle all items selection
  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map(item => item.id))
    }
  }

  // Highlight selected product if exists
  useEffect(() => {
    if (selectedProduct && items.length > 0) {
      const productElement = document.getElementById(
        `product-${selectedProduct.id}`
      )
      if (productElement) {
        productElement.scrollIntoView({ behavior: "smooth", block: "center" })
        productElement.classList.add("highlight-product")
        setTimeout(() => {
          productElement.classList.remove("highlight-product")
        }, 2000)
      }
    }
  }, [selectedProduct, items])

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
  ]

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5CAF90] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    )
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
                Your Cart: {items.length} item
                {items.length !== 1 ? "s" : ""}
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Section */}
              <div className="flex-1">
                {items.length === 0 ? (
                  <div className="text-gray-500 text-lg text-center py-24.5 bg-white rounded-lg border-2 border-gray-200 mt-8.5">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="space-y-6 my-auto rounded-lg">
                    {/* Select All checkbox */}
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.length === items.length &&
                          items.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-[#5CAF90] text-[#5CAF90]"
                      />
                      <label className="ml-3 text-sm text-gray-700 font-bold">
                        Select all ({selectedItems.length}/{items.length})
                      </label>
                    </div>

                    {items.map(item => (
                      <div key={item.id} className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className="pt-2">
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
                          className={`flex-1 border border-gray-200 rounded-lg p-4 ${
                            selectedProduct?.id === item.id
                              ? "highlight-product"
                              : ""
                          }`}
                        >
                          {/* Mobile & Tablet Layout */}
                          <div className="md:hidden">
                            <div className="flex gap-4 mb-4">
                              <Link
                                to={`/product-page/${item.productId}`}
                                className="flex-shrink-0"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                  loading="lazy"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link to={`/product-page/${item.productId}`}>
                                  <h3 className="font-medium text-sm sm:text-base line-clamp-2 mb-2">
                                    {item.name}
                                  </h3>
                                </Link>

                                {/* Price section for mobile */}
                                <div className="mb-2">
                                  {item.mktPrice && item.mktPrice > item.price && (
                                    <p className="text-[#5E5E5E] line-through text-sm">
                                      {formatPrice(item.mktPrice)}
                                    </p>
                                  )}
                                  <p className="text-[#1D372E] font-semibold text-base">
                                    {formatPrice(item.price)}
                                  </p>
                                  {item.discountAmount > 0 && (
                                    <p className="text-green-600 text-xs">
                                      Save {formatPrice(item.discountAmount)}
                                    </p>
                                  )}
                                </div>

                                {/* Color and Size for mobile */}
                                {(item.color || item.size) && (
                                  <div className="space-y-1 mb-3">
                                    {item.color &&
                                      item.color !== "No color selected" && (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-gray-600 font-semibold">
                                            Color:
                                          </span>
                                          <div
                                            className="w-3 h-3 rounded-full border border-gray-300"
                                            style={{
                                              backgroundColor: item.color,
                                            }}
                                          />
                                        </div>
                                      )}
                                    {item.size &&
                                      item.size !== "No size selected" && (
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-gray-600 font-semibold">
                                            Size:
                                          </span>
                                          <span className="text-xs font-medium">
                                            {item.size}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quantity, Total, and Delete for mobile */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {/* Quantity Selector */}
                                <div className="border rounded-lg px-3 py-1 flex items-center gap-2">
                                  <button
                                    className="text-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                                    onClick={() => {
                                      const newQuantity = Math.max(
                                        1,
                                        item.quantity - 1
                                      )
                                      handleQuantityChange(item.id, newQuantity)
                                    }}
                                    disabled={item.availableQty <= 0}
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-medium min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="text-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                                    onClick={() => {
                                      const newQuantity = Math.min(
                                        item.quantity + 1,
                                        item.availableQty
                                      )
                                      handleQuantityChange(item.id, newQuantity)
                                    }}
                                    disabled={
                                      item.quantity >= item.availableQty ||
                                      item.availableQty <= 0
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Total Price */}
                                <div>
                                  <p className="text-[#1D372E] font-semibold text-base">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Delete sx={{ fontSize: 20 }} />
                              </button>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:grid md:grid-cols-6 md:gap-4 md:items-center md:text-center">
                            {/* Product Info */}
                            <div className="md:col-span-2">
                              <Link
                                to={`/product-page/${item.productId}`}
                                className="flex items-center space-x-4"
                                onClick={() =>
                                  handleProductClick(item.productId)
                                }
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 lg:w-25 lg:h-25 object-cover rounded-lg flex-shrink-0"
                                  loading="lazy"
                                />
                                <div className="flex flex-col text-left min-w-0">
                                  <h3 className="font-medium line-clamp-2 text-sm lg:text-base">
                                    {item.name}
                                  </h3>

                                  {/* Color and Size for desktop */}
                                  {(item.color || item.size) && (
                                    <div className="mt-2 space-y-1">
                                      {item.color &&
                                        item.color !== "No color selected" && (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-600 font-semibold">
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
                                      {item.size &&
                                        item.size !== "No size selected" && (
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-600 font-semibold">
                                              Size:
                                            </span>
                                            <span className="text-xs font-medium">
                                              {item.size}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </div>

                            {/* Price */}
                            <div>
                              {item.mktPrice && item.mktPrice > item.price && (
                                <p className="text-[#5E5E5E] line-through text-sm font-semibold">
                                  {formatPrice(item.mktPrice)}
                                </p>
                              )}
                              <p className="text-[#1D372E] font-semibold">
                                {formatPrice(item.price)}
                              </p>
                              {item.discountAmount > 0 && (
                                <p className="text-green-600 text-xs">
                                  Save {formatPrice(item.discountAmount)}
                                </p>
                              )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex justify-center">
                              <div className="border rounded-lg px-3 py-1 inline-flex items-center gap-2">
                                <button
                                  className="text-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                                  onClick={() => {
                                    const newQuantity = Math.max(
                                      1,
                                      item.quantity - 1
                                    )
                                    handleQuantityChange(item.id, newQuantity)
                                  }}
                                  disabled={item.availableQty <= 0}
                                >
                                  -
                                </button>
                                <span className="font-medium min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="text-lg cursor-pointer w-6 h-6 flex items-center justify-center"
                                  onClick={() => {
                                    const newQuantity = Math.min(
                                      item.quantity + 1,
                                      item.availableQty
                                    )
                                    handleQuantityChange(item.id, newQuantity)
                                  }}
                                  disabled={
                                    item.quantity >= item.availableQty ||
                                    item.availableQty <= 0
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Total */}
                            <div>
                              <p className="text-[#1D372E] font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>

                            {/* Delete */}
                            <div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Delete sx={{ fontSize: 20 }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="lg:w-80 bg-white rounded-lg border border-gray-200 p-6 h-fit lg:sticky lg:top-0 lg:ml-auto mt-8.5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(calculateSelectedTotal())}
                  </span>
                </div>

                <Link
                  to="/"
                  className="block w-full bg-[#1D372E] text-white text-center py-3 rounded hover:bg-[#1D372E] transition-colors mb-4"
                >
                  ← Keep Shopping
                </Link>

                {items.length > 0 && (
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
                  <h3 className="text-black mb-4 font-semibold">
                    Secure Payments Provided By
                  </h3>
                  <div className="flex justify-center items-center gap-4 flex-wrap">
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
                          className="h-4"
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
              <div className="mt-8 sm:mt-12 mb-5 px-10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6">
                  Related <span className="text-[#5CAF90]">Products</span>
                </h2>
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {relatedProducts.map(product => (
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
