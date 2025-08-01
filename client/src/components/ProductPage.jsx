import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa"
import { useCart } from "../context/CartContext"
import { getProduct, getProducts } from "../api/product"
import { formatPrice } from "./FormatPrice"
import { getReviewsByProductId } from "../api/review"
import { getCustomerById } from "../api/customer"
import {
  calculateDiscountPercentage,
  calculateTotalDiscount,
  getBestDiscountLabel,
  getFinalPrice,
} from "./CalculateDiscount"
import ProductCard from "./ProductCard"
import DiscountSummary from "./DiscountSummary"

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart, updateCartItem } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState("")
  const [activeDiscount, setActiveDiscount] = useState(null)
  const [isFromCart, setIsFromCart] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [cartItem, setCartItem] = useState(null)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [zoomStyle, setZoomStyle] = useState({})
  const popupImageRef = useRef(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [customers, setCustomers] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(5)

  const handleProductClick = productId => {
    window.scrollTo(0, 0)
    navigate(`/product-page/${productId}`)
  }

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // Fetch main product
        const response = await getProduct(id)
        const reviews = await getReviewsByProductId(id)
        if (response.message === "Product fetched successfully") {
          const customerIds = [
            ...new Set(reviews.map(review => review.Customer_idCustomer)),
          ]
          const customerData = {}

          for (const customerId of customerIds) {
            try {
              const customer = await getCustomerById(customerId)
              customerData[customerId] = customer.Full_Name
            } catch (error) {
              console.error(`Error fetching customer ${customerId}: ${error}`)
            }
          }

          setCustomers(customerData)

          const productData = response.product

          // Log product data to verify discount structure
          console.log("=== PRODUCT DISCOUNT DEBUG ===")
          console.log("Product ID:", productData.idProduct)
          console.log("Product Name:", productData.Description)
          console.log("Normal Discounts:", productData.discounts)
          console.log("Event Discounts:", productData.eventDiscounts)
          console.log(
            "Event Discounts Count:",
            productData.eventDiscounts?.length || 0
          )

          if (productData.eventDiscounts?.length > 0) {
            console.log("Event Discount Details:")
            productData.eventDiscounts.forEach((discount, index) => {
              console.log(
                `  ${index + 1}. ${discount.description} (${
                  discount.discountType
                }: ${discount.discountValue})`
              )
              console.log(
                `     Event ID: ${discount.eventId}, Status: ${discount.status}`
              )
              console.log(`     Product IDs included:`, discount.productIds)
            })
          }
          console.log("=== END DEBUG ===")

          const activeDiscounts = productData.discounts.filter(
            d => d.Status === "active"
          )
          setActiveDiscount(activeDiscounts[0] || null)

          const totalRating = reviews.reduce(
            (sum, review) => sum + parseInt(review.Rating_5),
            0
          )
          const averageRating =
            reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0

          const transformedProduct = {
            id: productData.idProduct,
            name: productData.Description,
            description: productData.Long_Description,
            detail: productData.Long_Description,
            specification: "No specifications available",
            reviews: reviews,
            rating: averageRating,
            noOfRatings: reviews.length,
            marketPrice: parseFloat(productData.Market_Price),
            discounts: productData.discounts || [],
            eventDiscounts: productData.eventDiscounts || [],
            image: productData.Main_Image_Url,
            otherImages: productData.images.map(img => img.Image_Url),
            variants: productData.variations.map(variation => ({
              id: variation.idProduct_Variations,
              color: variation.Colour || null,
              colorName: variation.Colour || null,
              size:
                variation.Size === "No size selected" ? null : variation.Size,
              price:
                parseFloat(variation.Rate) ||
                parseFloat(productData.Selling_Price),
              quantity: variation.Qty,
              SIH: variation.SIH,
            })),
            faqs: productData.faqs || [],
          }

          setProduct(transformedProduct)
          setMainImage(transformedProduct.image)

          // Initialize selected size if the first variant has size
          if (transformedProduct.variants[0]?.size) {
            setSelectedSize(transformedProduct.variants[0].size)
          }

          setQuantity(
            transformedProduct.variants[selectedVariant].quantity > 0 ? 1 : 0
          )

          // Check if coming from cart
          if (location.state?.fromCart) {
            setIsFromCart(true)
            setCartItem(location.state.selectedVariant)
            if (location.state.selectedVariant) {
              const variantIndex = transformedProduct.variants.findIndex(
                v => v.colorName === location.state.selectedVariant.color
              )
              if (variantIndex !== -1) {
                setSelectedVariant(variantIndex)
              }
            }
          }

          // Fetch related products from backend
          const relatedResponse = await getProducts()
          if (relatedResponse.message === "Products fetched successfully") {
            const filteredRelated = relatedResponse.products
              .filter(p => p.idProduct !== productData.idProduct)
              .slice(0, 5)
              .map(product => ({
                id: product.idProduct,
                name: product.Description,
                image: product.Main_Image_Url,
                price: product.Selling_Price,
                oldPrice: product.Market_Price,
                weight: product.SIH || "N/A",
                color: product.variations?.[0]?.Colour || "N/A",
                size: product.variations?.[0]?.Size || null,
                category: product.subcategories?.[0]?.Description || "",
                historyStatus: product.History_Status || "",
                activeDiscount:
                  product.discounts?.find(d => d.Status === "active") || null,
                // Full product data for discount calculation
                product: {
                  idProduct: product.idProduct,
                  Selling_Price: product.Selling_Price,
                  Market_Price: product.Market_Price,
                  discounts: product.discounts || [],
                  eventDiscounts: product.eventDiscounts || [],
                },
              }))

            setRelatedProducts(filteredRelated)
          }
        }
      } catch (error) {
        console.error("Error fetching product or related products:", error)
      }
    }

    fetchProductAndRelated()
  }, [id, location.state, selectedVariant])

  useEffect(() => {
    if (product) {
      setQuantity(currentVariant.quantity > 0 ? 1 : 0)
      // Reset selected size when variant changes if the new variant has size
      if (currentVariant.size) {
        setSelectedSize(currentVariant.size)
      } else {
        setSelectedSize("")
      }
    }
  }, [selectedVariant, product])

  const currentVariant = product?.variants[selectedVariant] || {}

  // Calculate total discount information
  const discountInfo = product
    ? calculateTotalDiscount({
        idProduct: product.id,
        Selling_Price: currentVariant.price,
        Market_Price: product.marketPrice,
        discounts: product.discounts || [],
        eventDiscounts: product.eventDiscounts || [],
      })
    : null

  // Check if current variant has size
  const hasSize =
    currentVariant.size && currentVariant.size !== "No size selected"

  // Check if current variant has color
  const hasColor =
    currentVariant.color && currentVariant.color !== "No color selected"

  const handleAddToCart = async () => {
    if (product && currentVariant.quantity > 0) {
      const cartItem = {
        id: currentVariant.id,
        name: product.name,
        image: mainImage,
        price: currentVariant.price,
        quantity: quantity,
        ...(hasSize && { size: selectedSize }),
        ...(currentVariant.colorName && { color: currentVariant.colorName }),
        ...(currentVariant.color && { colorCode: currentVariant.color }),
      }

      try {
        if (isFromCart) {
          await updateCartItem(cartItem)
        } else {
          await addToCart(cartItem)
        }
        navigate("/cart", {
          state: {
            selectedProduct: cartItem,
            source: "product-page",
          },
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
        if (error.message === "User must be logged in to add items to cart") {
          alert("Please log in to add items to cart")
          navigate("/sign-in")
        } else {
          alert("Failed to add item to cart: " + error.message)
        }
      }
    }
  }

  const renderRatingStars = () => {
    if (!product) return null

    const stars = []
    const fullStars = Math.floor(product.rating)
    const hasHalfStar = product.rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />)
      }
    }

    return (
      <div className="inline-flex items-center">
        {stars}
        <span className="ml-2 text-gray-700"> | {product.noOfRatings}</span>
      </div>
    )
  }

  const handleMouseMove = e => {
    if (!popupImageRef.current) return

    const { left, top, width, height } =
      popupImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
      cursor: "zoom-in",
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      cursor: "default",
    })
  }

  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = product?.reviews
    ? [...product.reviews]
        .reverse()
        .slice(indexOfFirstReview, indexOfLastReview)
    : []
  const totalPages = product?.reviews?.length
    ? Math.ceil(product?.reviews?.length / reviewsPerPage)
    : 0

  const paginate = pageNumber => setCurrentPage(pageNumber)

  if (!product) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Image Popup Modal */}
      {isImagePopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/20"
          onClick={() => setIsImagePopupOpen(false)}
        >
          <div className="relative max-w-4xl w-full max-h-screen">
            <button
              className="cursor-pointer bg-white absolute -top-10 right-0 border-2 rounded-sm border-black text-red-700 text-2xl z-50 hover:text-red-500"
              onClick={() => setIsImagePopupOpen(false)}
            >
              <FaTimes />
            </button>
            <div
              className="relative overflow-hidden rounded-lg bg-gray-100 border-2 border-black"
              onClick={e => e.stopPropagation()}
            >
              <img
                ref={popupImageRef}
                src={mainImage}
                alt={product.name}
                className="w-full h-auto max-h-[80vh] object-cover transition-transform duration-300"
                style={zoomStyle}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Images */}
        <div>
          <div
            className="border rounded-lg overflow-hidden mb-4 mt-3 cursor-zoom-in"
            style={{
              maxWidth: "600px",
              maxHeight: "400px",
              borderColor: "transparent",
            }}
            onClick={() => setIsImagePopupOpen(true)}
          >
            <img
              src={mainImage}
              style={{ maxHeight: "400px" }}
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

          {/* Price and Discount */}
          <div className="space-y-3">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
              {formatPrice(
                `LKR ${
                  discountInfo?.finalPrice?.toFixed(2) ||
                  currentVariant.price?.toFixed(2)
                }`
              )}

              {discountInfo?.hasDiscounts &&
                discountInfo.marketPrice > discountInfo.originalPrice && (
                  <span className="ml-2 text-gray-500 line-through text-base sm:text-lg">
                    {formatPrice(`LKR ${discountInfo.marketPrice.toFixed(2)}`)}
                  </span>
                )}

              {discountInfo?.totalPercentage > 0 && (
                <span className="ml-3 bg-red-600 text-white px-2 py-1 rounded text-sm">
                  {discountInfo.totalPercentage}% OFF
                </span>
              )}
            </div>

            {/* Detailed Discount Information using DiscountSummary component */}
            <DiscountSummary
              product={{
                idProduct: product.id,
                Selling_Price: currentVariant.price,
                Market_Price: product.marketPrice,
                discounts: product.discounts || [],
                eventDiscounts: product.eventDiscounts || [],
              }}
              showDetails={true}
            />
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
            {product.description}
          </p>

          {/* Size Selection - Only show if current variant has size */}
          {hasSize && (
            <div className="mt-2 sm:mt-4">
              <span className="font-semibold">Size:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  ...new Set(
                    product.variants
                      .filter(v => v.size && v.size !== "No size selected")
                      .map(v => v.size)
                  ),
                ].map((size, index) => (
                  <button
                    key={index}
                    className={`cursor-pointer px-3 sm:px-4 py-1 sm:py-2 border rounded-lg hover:bg-[#87c4ae] hover:text-white text-sm sm:text-base ${
                      selectedSize === size ? "bg-[#5CAF90] text-white" : ""
                    }`}
                    onClick={() => {
                      setSelectedSize(size)
                      const firstVariantIndex = product.variants.findIndex(
                        v => v.size === size
                      )
                      setSelectedVariant(firstVariantIndex)
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection – show colors for the chosen size, plus any “no‐size” variants */}
          {hasColor && (
            <div className="mt-2 sm:mt-4">
              <span className="font-semibold">Color:</span>
              <div className="flex gap-2 mt-2">
                {product.variants
                  .filter(
                    v =>
                      v.color &&
                      v.color !== "No color selected" &&
                      (v.size === selectedSize || v.size == null)
                  )
                  .map((variant, index) => (
                    <button
                      key={index}
                      className={`cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                        selectedVariant ===
                        product.variants.findIndex(x => x.id === variant.id)
                          ? "border-gray-800"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: variant.color }}
                      onClick={() => {
                        const newIndex = product.variants.findIndex(
                          x => x.id === variant.id
                        )
                        setSelectedVariant(newIndex)
                      }}
                    />
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
                disabled={currentVariant.quantity <= 0}
              >
                -
              </button>
              <span className="mx-3 sm:mx-4">{quantity}</span>
              <button
                className="text-lg sm:text-xl cursor-pointer"
                onClick={() =>
                  setQuantity(Math.min(quantity + 1, currentVariant.quantity))
                }
                disabled={
                  quantity >= currentVariant.quantity ||
                  currentVariant.quantity <= 0
                }
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
        <div className="flex space-x-2 font-medium sm:space-x-4 border-b pb-2 overflow-x-auto">
          {["details", "faqs", "reviews"].map(tab => (
            <button
              key={tab}
              className={`cursor-pointer hover:bg-[#5CAF90] hover:text-white border-1 rounded-lg px-3 sm:px-4 py-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab
                  ? " text-white bg-[#5CAF90] hover:opacity-90"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "faqs"
                ? "FAQs"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-4 text-gray-600 text-sm sm:text-base">
          {activeTab === "details" && <p>{product.detail}</p>}
          {activeTab === "faqs" && (
            <div>
              {product.faqs && product.faqs.length > 0 ? (
                product.faqs.map((faq, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold">{faq.Question}</h3>
                    <p>{faq.Answer}</p>
                  </div>
                ))
              ) : (
                <p>No frequently asked questions available</p>
              )}
            </div>
          )}
          {activeTab === "reviews" ? (
            product.reviews.length > 0 ? (
              <>
                {currentReviews.map(review => {
                  const customer = customers[review.Customer_idCustomer] || {}
                  const initials = customer
                    .split(" ")
                    .map(name => name[0])
                    .join("")
                    .toUpperCase()
                  return (
                    <div key={review.idReview} className="flex gap-5 mb-4">
                      <div className="bg-green-500 size-10 shrink-0 p-3 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{initials}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {customer || "Unknown User"}
                        </h3>
                        <div className="flex gap-1">
                          {[...Array(parseInt(review.Rating_5))].map(
                            (_, index) => (
                              <FaStar key={index} className="text-yellow-400" />
                            )
                          )}
                        </div>
                        <p>{review.Comment}</p>
                        <span className="text-xs text-gray-500">
                          {review.created_at.split("T")[0]}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 gap-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded ${
                        currentPage === 1
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-[#5CAF90] text-white hover:opacity-90 cursor-pointer"
                      }`}
                    >
                      <FaChevronLeft />
                    </button>
                    <span className="text-sm text-gray-500 mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded ${
                        currentPage === totalPages
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-[#5CAF90] text-white hover:opacity-90 cursor-pointer"
                      }`}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No Reviews yet.</p>
            )
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 sm:mt-12">
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
                  historyStatus={product.historyStatus}
                  activeDiscount={product.activeDiscount}
                  id={product.id}
                  product={product.product}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPage
