import { FaShoppingCart } from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom"
import { formatPrice } from "./FormatPrice"
import ReviewsIcon from "@mui/icons-material/Reviews"

// Helper function to safely parse prices (handles both strings and numbers)
const parsePrice = price => {
  if (price === null || price === undefined) return 0
  if (typeof price === "number") return isNaN(price) ? 0 : price
  if (typeof price === "string") {
    // Remove currency symbols and commas
    const cleaned = price.replace(/[^\d.-]/g, "")
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const OrderDetails = ({
  deliveryFee,
  orderInfo,
  selectedItems: propSelectedItems,
  showHeader = true,
  setIsProductReviewModalOpen,
  setSelectedProductId,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  // Use provided items from props if available, otherwise use from location state
  const selectedItems = propSelectedItems || location.state?.selectedItems || []

  const handleProductClick = productId => {
    window.scrollTo(0, 0)
    navigate(`/product-page/${productId}`)
  }

  console.log("s", selectedItems)

  // Calculate subtotal and discount for selected items
  const subtotal = selectedItems.reduce((sum, item) => {
    const price = parsePrice(item.price)
    return sum + price * item.quantity
  }, 0)

  // Calculate total market price
  const totalMarketPrice = selectedItems.reduce((sum, item) => {
    const marketPrice = parsePrice(item.marketPrice)
    return sum + marketPrice * item.quantity
  }, 0)

  // Calculate total discount
  const totalDiscount = totalMarketPrice - subtotal
  // Calculate final total (subtotal already includes discounts)
  const total = subtotal + (deliveryFee || 0)

  // Calculate individual product totals and discounts
  const getProductTotals = () => {
    return selectedItems.map(item => {
      const price = parsePrice(item.price)
      const marketPrice = parsePrice(item.marketPrice)
      const itemTotal = price * item.quantity
      const itemDiscount =
        marketPrice > price ? (marketPrice - price) * item.quantity : 0

      return {
        name: item.name,
        quantity: item.quantity,
        price: price,
        marketPrice: marketPrice,
        total: itemTotal,
        discount: itemDiscount,
      }
    })
  }

  const productTotals = getProductTotals()
  const totalSavings = productTotals.reduce(
    (sum, item) => sum + item.discount,
    0
  )

  // If no items, show a message
  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-[#E8E8E8]">
        <div className="p-6 text-center">
          {showHeader && (
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              <FaShoppingCart className="inline mr-2 text-[#5CAF90]" />
              Order <span className="text-[#5CAF90]">Details</span>
            </h2>
          )}
          <p className="text-gray-500">No order items found for this order.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-gray-50 rounded-xl overflow-hidden ${
        location.pathname.split("/")[1] !== "track-order" &&
        "border border-[#E8E8E8] shadow-md"
      }`}
    >
      <div className="p-6 overflow-auto">
        {showHeader && (
          <h2 className="text-lg font-semibold text-gray-700 mb-6">
            <FaShoppingCart className="inline mr-2 text-[#5CAF90]" />
            Order <span className="text-[#5CAF90]">Details</span>
          </h2>
        )}

        {/* Order Items */}
        <div className="mt-4 space-y-4">
          {selectedItems.map((item, index) => (
            <div
              key={`${item.id || index}-${item.color || ""}-${item.size || ""}`}
              className="flex items-center space-x-4 bg-gray-100 rounded-lg p-3 cursor-pointer border border-[#E8E8E8]"
              onClick={() => handleProductClick(item.productId)}
            >
              {item.image ? (
                <div>
                  <img
                    src={item.image}
                    alt="Product"
                    className="w-24 h-24 rounded object-cover"
                  />
                  {orderInfo.Status === "Delivered" && (
                    <div
                      className="bg-[#5CAF90] p-1 mx-auto rounded-md hover:bg-[#4a9a7d] transition-colors w-fit flex gap-1 items-center mt-2"
                      onClick={e => {
                        e.stopPropagation()
                        setIsProductReviewModalOpen(true)
                        setSelectedProductId(item.productId)
                      }}
                    >
                      <ReviewsIcon className="text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 rounded bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{item.name}</p>

                {/* Variation Section (Updated) */}
                {(item.color || item.size) && (
                  <div className="mt-1 space-y-1">
                    {/* Show color only if it's valid */}
                    {item.color && item.color !== "No color selected" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 font-medium">
                          Color:
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    )}
                    {/* Show size only if it's valid */}
                    {item.size && item.size !== "No size selected" && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 font-medium">
                          Size:
                        </span>
                        <span className="text-sm font-medium">{item.size}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-600 mt-1">
                  Qty: {item.quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-black font-semibold">
                    {formatPrice(item.price)}
                  </p>
                  {item.marketPrice &&
                    parsePrice(item.marketPrice) > parsePrice(item.price) && (
                      <p className="text-gray-500 line-through text-sm">
                        {formatPrice(item.marketPrice)}
                      </p>
                    )}
                </div>
                {item.marketPrice &&
                  parsePrice(item.marketPrice) > parsePrice(item.price) && (
                    <div className="mt-1">
                      <span className="text-[12px] text-[#5CAF90] font-medium">
                        {item.discountName ||
                          (item.category === "Seasonal Offers"
                            ? "Seasonal Discounts"
                            : item.category === "Rush Delivery"
                            ? "Rush Discounts"
                            : item.category === "For You"
                            ? "For You Discounts"
                            : "Sale Discounts")}
                      </span>
                      <span className="text-[12px] text-[#5CAF90] ml-2">
                        Save Rs.{" "}
                        {productTotals[index]?.discount?.toLocaleString() || 0}
                      </span>
                    </div>
                  )}
                <div className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Item Total:</span>{" "}
                  {formatPrice(productTotals[index]?.total || 0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}

        {location.pathname.split("/")[1] !== "track-order" && (
          <div>
            <div className="space-y-3 border-t border-[#E8E8E8] pt-4 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Discounts</span>
                  <span className="text-[#5CAF90]">
                    -Rs. {totalDiscount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {formatPrice(deliveryFee || 0)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E8E8E8] mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Info */}
        {location.pathname.split("/")[1] !== "track-order" && orderInfo && (
          <div className="mt-4 bg-gray-100 border rounded-lg border-[#E8E8E8] p-4">
            <p className="text-gray-700">
              <strong>Order No:</strong> {orderInfo.orderNo}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Delivery Date:</strong> {orderInfo.deliveryDate}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Address:</strong> {orderInfo.address}
            </p>
          </div>
        )}

        {/* Additional Info - Remove hardcoded values */}
      </div>
    </div>
  )
}

export default OrderDetails
