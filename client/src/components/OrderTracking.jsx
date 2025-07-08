import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getCustomerOrders, getOrderDetails, trackOrder } from "../api/order"
import DeliveryMap from "./DeliveryMap"
import OrderDetails from "./OrderDetails"
import InvoiceDownloadButton from "./InvoicePDF"
import { formatPrice } from "./FormatPrice"
import ReviewsIcon from "@mui/icons-material/Reviews"
import CloseIcon from "@mui/icons-material/Close"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import StarIcon from "@mui/icons-material/Star"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import {
  addOrderReview,
  addProductReview,
  deleteOrderReview,
  getReviewsByOrderId,
  updateOrderReview,
} from "../api/review"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const OrderTracking = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [trackingInfo, setTrackingInfo] = useState(null)
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false)
  const [isOrderReviewEditModalOpen, setIsOrderReviewEditModalOpen] =
    useState(false)
  const [isProductReviewModalOpen, setIsProductReviewModalOpen] =
    useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showOrderReviewSuccessMessage, setShowOrderReviewSuccessMessage] =
    useState(false)
  const [
    showOrderReviewEditSuccessMessage,
    setShowOrderReviewEditSuccessMessage,
  ] = useState(false)
  const [showOrderReviewErrorMessage, setShowOrderReviewErrorMessage] =
    useState(false)
  const [showOrderReviewEditErrorMessage, setShowOrderReviewEditErrorMessage] =
    useState(false)
  const [showProductReviewSuccessMessage, setShowProductReviewSuccessMessage] =
    useState(false)
  const [showProductReviewErrorMessage, setShowProductReviewErrorMessage] =
    useState(false)
  const [orderRating, setOrderRating] = useState(0)
  const [productRating, setProductRating] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [orderReview, setOrderReview] = useState({})
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  })

  const [formErrors, setFormErrors] = React.useState({
    rating: "",
    comment: "",
  })

  console.log("OR:", orderReview)

  // Get customer ID from user object
  const customerId = user?.id

  // Fetch all orders for the user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        if (customerId) {
          console.log("Fetching orders for customer ID:", customerId)
          const ordersData = await getCustomerOrders(customerId)
          console.log("Orders response:", ordersData)

          // Handle both array or object response formats
          const ordersArray = Array.isArray(ordersData)
            ? ordersData
            : ordersData.orders || []

          setOrders(ordersArray)

          // If an ID is provided in the URL, select that order
          if (id && ordersArray.length > 0) {
            const order = ordersArray.find(
              order => order.idOrder.toString() === id
            )
            if (order) {
              setSelectedOrder(order)
            } else {
              // If order with ID not found, select the first order
              setSelectedOrder(ordersArray[0])
            }
          } else if (ordersArray.length > 0) {
            // If no ID provided, select the first order
            setSelectedOrder(ordersArray[0])
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [customerId, id])

  // Fetch order details and tracking when selected order changes
  useEffect(() => {
    const fetchOrderDetailsAndTracking = async () => {
      if (selectedOrder && customerId) {
        try {
          setLoading(true)

          // Use idOrder for API calls
          const orderId = selectedOrder.idOrder

          // Fetch order details
          const detailsResponse = await getOrderDetails(customerId, orderId)
          console.log("Order details:", detailsResponse)
          setOrderDetails(detailsResponse)

          // Fetch tracking information
          const trackingResponse = await trackOrder(customerId, orderId)
          console.log("Tracking info:", trackingResponse)
          setTrackingInfo(trackingResponse)
        } catch (err) {
          console.error("Error fetching order details:", err)
          setError("Failed to load order details. Please try again later.")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOrderDetailsAndTracking()
  }, [selectedOrder, customerId])

  useEffect(() => {
    const fetchOrderReview = async () => {
      try {
        if (orderDetails) {
          const review = await getReviewsByOrderId(orderDetails.order.idOrder)
          setOrderReview(review[0] || {})
        } else {
          setOrderReview({})
        }
      } catch (error) {
        console.error(error)
        setOrderReview({})
      }
    }
    if (orderDetails) {
      fetchOrderReview()
    }
  }, [orderDetails, selectedOrder])

  useEffect(() => {
    if (isOrderReviewEditModalOpen && orderReview) {
      setReview({
        rating: parseInt(orderReview.rating) || 0,
        comment: orderReview.comment || "",
      })
      setOrderRating(parseInt(orderReview.rating) || 0)
    }
  }, [isOrderReviewEditModalOpen, orderReview])

  const handleOrderSelect = order => {
    setSelectedOrder(order)
    setReview({
      rating: 0,
      comment: "",
    })
    setOrderRating(0)
    setProductRating(0)
  }

  const validateReview = () => {
    let isValid = true
    const errors = {
      rating: "",
      comment: "",
    }
    if (!review.rating) {
      errors.rating = "Rating is required"
      isValid = false
    }
    if (!review.comment.trim()) {
      errors.comment = "Comment is required"
      isValid = false
    }
    setFormErrors(errors)
    return isValid
  }

  const handleOrderReviewSubmit = async () => {
    if (validateReview()) {
      try {
        const reviewData = {
          customer_id: user.id,
          order_id: orderDetails.order.idOrder,
          rating: review.rating,
          comment: review.comment,
        }
        await addOrderReview(reviewData)
        setReview({
          rating: 0,
          comment: "",
        })
        setOrderRating(0)
        setFormErrors({
          rating: "",
          comment: "",
        })
        setOrderReview({ ...review, created_at: new Date().toISOString() })
        setShowOrderReviewSuccessMessage(true)
        setTimeout(() => {
          setIsOrderReviewModalOpen(false)
          setShowOrderReviewSuccessMessage(false)
        }, 1500)
      } catch (error) {
        setShowOrderReviewErrorMessage(true)
        console.error("Failed to submit review:", error)
        setTimeout(() => {
          setShowOrderReviewErrorMessage(false)
        }, 1500)
      }
    }
  }

  const handleProductReviewSubmit = async () => {
    if (validateReview()) {
      try {
        const reviewData = {
          customer_id: user.id,
          product_id: selectedProductId,
          rating: review.rating,
          comment: review.comment,
        }
        await addProductReview(reviewData)
        setReview({
          rating: 0,
          comment: "",
        })
        setProductRating(0)
        setFormErrors({
          rating: "",
          comment: "",
        })
        setShowProductReviewSuccessMessage(true)
        setTimeout(() => {
          setIsProductReviewModalOpen(false)
          setShowProductReviewSuccessMessage(false)
        }, 1500)
      } catch (error) {
        setShowProductReviewErrorMessage(true)
        console.error("Failed to submit review:", error)
        setTimeout(() => {
          setShowProductReviewErrorMessage(false)
        }, 1500)
      }
    }
  }

  const handleOrderReviewEditSubmit = async () => {
    if (validateReview()) {
      try {
        const updatedReview = {
          rating: review.rating,
          comment: review.comment,
        }
        await updateOrderReview(orderDetails.order.idOrder, updatedReview)
        setOrderReview(updatedReview)
        setReview({
          rating: 0,
          comment: "",
        })
        setOrderRating(0)
        setFormErrors({
          rating: "",
          comment: "",
        })
        setShowOrderReviewEditSuccessMessage(true)
        setTimeout(() => {
          setIsOrderReviewEditModalOpen(false)
          setShowOrderReviewEditSuccessMessage(false)
        }, 1500)
      } catch (error) {
        setShowOrderReviewEditErrorMessage(true)
        console.error("Failed to submit review:", error)
        setTimeout(() => {
          setShowOrderReviewEditErrorMessage(false)
        }, 1500)
      }
    }
  }

  const confirmDeleteReview = async () => {
    try {
      await deleteOrderReview(orderDetails.order.idOrder)
      setOrderReview({})
      setIsDeleteConfirmOpen(false)
    } catch (error) {
      console.error("Error deleting review: ", error)
    }
  }

  const handleInputChange = (field, value) => {
    setReview(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!user) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Please sign in to view your orders
          </h2>
          <p className="mt-2 text-gray-600">
            You need to be logged in to track your orders.
          </p>
          <p className="mt-2 text-gray-500">
            User data: {JSON.stringify(user)}
          </p>
        </div>
      </div>
    )
  }

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading your orders...</h2>
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold">{error}</h2>
          <p className="mt-4">Debug info:</p>
          <p>User ID: {customerId || "Not available"}</p>
          <p>User object: {JSON.stringify(user)}</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No orders found</h2>
          <p className="mt-2 text-gray-600">
            You haven't placed any orders yet.
          </p>
          <p className="mt-2 text-gray-500">User ID: {customerId}</p>
        </div>
      </div>
    )
  }

  // Get tracking status from the tracking info
  const getOrderStatusItems = () => {
    // If we have tracking info, use it
    if (trackingInfo && trackingInfo.status_history) {
      return trackingInfo.status_history.map((item, index) => {
        const isActive = index === 0 // Most recent status is active
        const isCompleted = true // All history items are completed

        return {
          id: item.id || index + 1,
          status: item.status_to || "Status Update",
          completed: isCompleted,
          active: isActive,
          date: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : null,
        }
      })
    }

    // Fallback if no tracking info available
    return [
      {
        id: 1,
        status: "Order Confirmed",
        completed: true,
        active: false,
        date: selectedOrder?.created_at
          ? new Date(selectedOrder.created_at).toLocaleString()
          : null,
      },
      {
        id: 2,
        status: "Processing",
        completed: selectedOrder?.Delivery_Status === "processing",
        active: selectedOrder?.Delivery_Status === "processing",
        date: null,
      },
      {
        id: 3,
        status: "Shipped",
        completed: selectedOrder?.Delivery_Status === "shipped",
        active: selectedOrder?.Delivery_Status === "shipped",
        date: null,
      },
      {
        id: 4,
        status: "Delivered",
        completed: selectedOrder?.Delivery_Status === "delivered",
        active: selectedOrder?.Delivery_Status === "delivered",
        date: null,
      },
    ]
  }

  // Calculate order totals for the selected order
  const orderItems = orderDetails?.items || []

  // Use the fields from the actual API response
  const subtotal = selectedOrder?.Total_Amount
    ? parseFloat(selectedOrder.Total_Amount)
    : 0;
  const discount = 0; // No discount field in the response
  const deliveryFee = 500.00; // Fixed delivery fee
  const total = subtotal + deliveryFee; // Calculate total with fixed delivery fee

  // Current order status from tracking info or selected order
  const currentStatus = trackingInfo?.current_status || {
    delivery_date: selectedOrder?.Delivery_Date,
    delivery_status: selectedOrder?.Delivery_Status,
    payment_status: selectedOrder?.Payment_Stats,
  }

  // Prepare invoice data for download
  const prepareInvoiceData = () => {
    const invoiceData = {
      orderId: selectedOrder.idOrder,
      customerId: customerId,
      orderDate: selectedOrder.Date_Time,
      paymentMethod: selectedOrder.Payment_Type,
      paymentStatus: selectedOrder.Payment_Stats,
      deliveryType: selectedOrder.Delivery_Type,
      deliveryStatus: selectedOrder.Delivery_Status,
      customerName: selectedOrder.Full_Name,
      address: selectedOrder.Address,
      city: selectedOrder.City,
      country: selectedOrder.Country,
      // items: orderDetails.items || [],

      order: selectedOrder,
      orderDetails: orderDetails,

      subtotal: subtotal,
      discount: discount,
      deliveryFee: deliveryFee,
      total: total,
      orderItems: orderItems,
      currentStatus: currentStatus,
      trackingInfo: trackingInfo,
    }

    console.log("Invoice data prepared:", invoiceData)
    console.log("Address info for map:", {
      address: selectedOrder.Address,
      city: selectedOrder.City,
      country: selectedOrder.Country,
    })

    return invoiceData
  }

  // Prepare order items for OrderDetails component
  const prepareOrderItems = () => {
    if (!orderDetails || !orderDetails.items) {
      return []
    }

    return orderDetails.items.map(item => {
      // Handle null Rate and Qty by calculating from totals
      let effectiveRate = item.Rate
      let effectiveQty = item.Qty

      if (!effectiveRate || !effectiveQty) {
        // If Rate or Qty is null, calculate from Total_Amount
        // Assume quantity 1 if not available and use Total_Amount as price
        effectiveQty = item.Qty || 1
        effectiveRate = item.Total_Amount
          ? parseFloat(item.Total_Amount) / effectiveQty
          : 0
      }

      return {
        id: item.Product_Variations_idProduct_Variations,
        productId: item.Product_Variations_idProduct_Variations,
        name: item.product_name || "Unknown Product",
        image: item.product_image || null,
        price: effectiveRate,
        quantity: effectiveQty,
        color: item.Colour,
        size: item.Size,
        marketPrice:
          item.Total && effectiveQty
            ? parseFloat(item.Total) / effectiveQty
            : effectiveRate, // Calculate market price from Total (before discount)
        total: item.Total_Amount || item.Total || 0,
      }
    })
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-full mx-auto">
        <h2 className="text-2xl font-semibold text-center">
          Your <span className="text-[#5CAF90]">Orders</span>
        </h2>

        {orders.length > 1 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">
              Select an order to track:
            </h3>
            <div className="flex flex-wrap gap-2">
              {orders.map(order => (
                <button
                  key={order.idOrder}
                  onClick={() => handleOrderSelect(order)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedOrder?.idOrder === order.idOrder
                      ? "bg-[#5CAF90] text-white border-[#5CAF90]"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Order #{order.idOrder}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Order Items Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] h-[634px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Order <span className="text-[#5CAF90]">Items</span>
            </h3>
            {orderDetails &&
            orderDetails.items &&
            orderDetails.items.length > 0 ? (
              <div className="flex-grow overflow-y-auto mb-4  border border-[#E8E8E8] rounded-lg no-scrollbar">
                <div className="h-full">
                  <OrderDetails
                    deliveryFee={deliveryFee}
                    selectedItems={prepareOrderItems()}
                    showHeader={false}
                    orderInfo={selectedOrder}
                    setIsProductReviewModalOpen={setIsProductReviewModalOpen}
                    setReview={setReview}
                    setSelectedProductId={setSelectedProductId}
                    setProductRating={setProductRating}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] text-center text-gray-500">
                No item details available for this order.
              </div>
            )}
            {selectedOrder.Status === "Delivered" && (
              <button
                onClick={() => {
                  setReview({
                    rating: 0,
                    comment: "",
                  })
                  setOrderRating(0)
                  setIsOrderReviewModalOpen(true)
                }}
                className="invoice-button mt-auto self-center"
              >
                <ReviewsIcon className="invoice-icon" />
                <span className="invoice-text">Add a review</span>
              </button>
            )}
          </div>
          {/* Left Section - Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] flex flex-col h-full">
              <h3 className="text-lg font-semibold text-center">
                Order <span className="text-[#5CAF90]">Status</span>
              </h3>

              {/* Status Timeline */}
              <div className="relative mt-4 flex-grow overflow-y-auto">
                {/* Vertical line */}
                <div className="absolute left-[14px] top-0 h-full w-0.5 bg-gray-300 "></div>

                {/* Status Items */}
                <ul className="space-y-4 pl-5">
                  {getOrderStatusItems().map(item => (
                    <li
                      key={item.id}
                      className="relative flex items-center gap-2"
                    >
                      {/* Status dot */}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-4 flex-shrink-0
                        ${
                          item.active
                            ? "border-[#5CAF90] bg-white animate-pulse"
                            : item.completed
                            ? "bg-[#5CAF90] border-[#5CAF90]"
                            : "bg-white border-gray-300"
                        }`}
                      ></div>

                      {/* Status content */}
                      <div
                        className={`p-2 w-full transition-all duration-200 ${
                          item.active
                            ? "bg-[#5CAF90]/10 border border-[#5CAF90] rounded-md"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm font-medium ${
                              item.completed
                                ? "text-[#5CAF90]"
                                : item.active
                                ? "text-[#5CAF90]"
                                : "text-gray-500"
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.completed && (
                            <span className="text-xs text-gray-500">✓</span>
                          )}
                        </div>
                        {item.date && (
                          <p className="text-xs mt-0.5 text-gray-500">
                            {item.date}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-3 p-3 bg-gray-100 rounded-md border border-[#E8E8E8]">
                <div className="flex items-center">
                  <div className="bg-[#5CAF90]/10 p-1.5 rounded-full mr-2">
                    <svg
                      className="w-4 h-4 text-[#5CAF90]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-xs text-gray-600">
                      {selectedOrder?.Delivery_Date
                        ? new Date(
                            selectedOrder.Delivery_Date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Tracking Status (fixed height) */}
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8]">
            <h3 className="text-lg font-semibold text-center mb-4">
              Order <span className="text-[#5CAF90]">Summary</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order #:</span>
                <span className="font-medium">
                  {selectedOrder?.idOrder || "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {selectedOrder?.Date_Time || "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">
                  {selectedOrder?.Payment_Type || "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`font-medium capitalize ${
                    selectedOrder?.Payment_Stats === "paid"
                      ? "text-green-500"
                      : "text-orange-500"
                  }`}
                >
                  {selectedOrder?.Payment_Stats || "pending"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Type:</span>
                <span className="font-medium capitalize">
                  {selectedOrder?.Delivery_Type || "standard"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Status:</span>
                <span className="font-medium capitalize">
                  {selectedOrder?.Delivery_Status || "processing"}
                </span>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-500">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">
                    {formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Delivery Address</h4>
              <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                {selectedOrder?.Full_Name && (
                  <p className="font-medium">{selectedOrder.Full_Name}</p>
                )}
                {selectedOrder?.Address && <p>{selectedOrder.Address}</p>}
                {(selectedOrder?.City || selectedOrder?.Country) && (
                  <p>
                    {selectedOrder?.City}
                    {selectedOrder?.City && selectedOrder?.Country ? ", " : ""}
                    {selectedOrder?.Country}
                  </p>
                )}
                {!selectedOrder?.Full_Name &&
                  !selectedOrder?.Address &&
                  !selectedOrder?.City &&
                  !selectedOrder?.Country && (
                    <p className="text-gray-500 italic">
                      Address information not available
                    </p>
                  )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <InvoiceDownloadButton orderData={prepareInvoiceData()} />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] flex flex-col h-[500px] lg:col-span-2 z-10">
            <h3 className="text-lg font-semibold text-center mb-4">
              Delivery <span className="text-[#5CAF90]">Location</span>
            </h3>
            <div className="flex-grow border rounded-lg border-gray-200 overflow-hidden">
              <DeliveryMap
                address={selectedOrder?.Address}
                city={selectedOrder?.City}
                country={selectedOrder?.Country}
                fullName={selectedOrder?.Full_Name}
              />
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-[#E8E8E8] flex flex-col h-fit lg:col-span-1">
            <h3 className="text-lg font-semibold text-center mb-4">
              Order <span className="text-[#5CAF90]">Review</span>
            </h3>
            {Object.keys(orderReview).length !== 0 ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  {[...Array(parseInt(orderReview.rating) || 0)].map(
                    (_, index) => (
                      <StarIcon key={index} className="text-yellow-400" />
                    )
                  )}
                  <p className="text-justify">{orderReview.comment}</p>
                  {orderReview.created_at && (
                    <span className="text-sm text-gray-500">
                      {orderReview.created_at.split("T")[0]}
                    </span>
                  )}
                </div>
                <div className="space-x-2 shrink-0">
                  <button onClick={() => setIsOrderReviewEditModalOpen(true)}>
                    <EditIcon className="text-green-500 cursor-pointer" />
                  </button>
                  <button onClick={() => setIsDeleteConfirmOpen(true)}>
                    <DeleteIcon className="text-red-500 cursor-pointer" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No Review Yet</p>
            )}
          </div>
        </div>
      </div>
      {(isOrderReviewModalOpen || isProductReviewModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Submit {isOrderReviewModalOpen ? "Order" : "Product"} Review
              </h2>
              <button
                onClick={() =>
                  isOrderReviewModalOpen
                    ? setIsOrderReviewModalOpen(false)
                    : setIsProductReviewModalOpen(false)
                }
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>
            <>
              {showOrderReviewSuccessMessage ||
              showOrderReviewErrorMessage ||
              showProductReviewSuccessMessage ||
              showProductReviewErrorMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  {showOrderReviewSuccessMessage ||
                  showProductReviewSuccessMessage ? (
                    <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  ) : (
                    <CancelIcon className="text-red-500 text-5xl mb-3" />
                  )}
                  <p className="text-lg font-medium text-gray-800">
                    {showOrderReviewSuccessMessage ||
                    showProductReviewSuccessMessage
                      ? "Review Submitted"
                      : "Review Submission Failed"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        {[...Array(5)].map((_, index) => {
                          const rating = index + 1
                          const isActive =
                            rating <=
                            (isOrderReviewModalOpen
                              ? orderRating
                              : productRating)
                          return (
                            <div
                              key={index}
                              className="cursor-pointer relative"
                            >
                              <input
                                type="radio"
                                value={review.rating}
                                onChange={() => {
                                  isOrderReviewModalOpen
                                    ? setOrderRating(rating)
                                    : setProductRating(rating)
                                  handleInputChange("rating", rating)
                                }}
                                checked={
                                  isOrderReviewModalOpen
                                    ? orderRating === rating
                                    : productRating === rating
                                }
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                              />
                              {isActive ? (
                                <StarIcon className="text-yellow-400" />
                              ) : (
                                <StarBorderIcon className="text-yellow-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        {formErrors.rating && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.rating}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Comment <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write your comment"
                        value={review.comment}
                        onChange={e =>
                          handleInputChange("comment", e.target.value)
                        }
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5CAF90] ${
                          formErrors.comment
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.comment && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      onClick={() =>
                        isOrderReviewModalOpen
                          ? setIsOrderReviewModalOpen(false)
                          : setIsProductReviewModalOpen(false)
                      }
                      className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 hover:shadow-md transform transition-all duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={
                        isOrderReviewModalOpen
                          ? handleOrderReviewSubmit
                          : handleProductReviewSubmit
                      }
                      className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      )}
      {isOrderReviewEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Edit Your Review</h2>
              <button
                onClick={() => setIsOrderReviewEditModalOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>
            <>
              {showOrderReviewEditSuccessMessage ||
              showOrderReviewEditErrorMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  {showOrderReviewEditSuccessMessage ? (
                    <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  ) : (
                    <CancelIcon className="text-red-500 text-5xl mb-3" />
                  )}
                  <p className="text-lg font-medium text-gray-800">
                    {showOrderReviewEditSuccessMessage
                      ? "Review Updated"
                      : "Review Update Failed"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        {[...Array(5)].map((_, index) => {
                          const rating = index + 1
                          const isActive = rating <= orderRating
                          return (
                            <div
                              key={index}
                              className="cursor-pointer relative"
                            >
                              <input
                                type="radio"
                                value={rating}
                                onChange={() => {
                                  setOrderRating(rating)
                                  setReview(prev => ({ ...prev, rating }))
                                }}
                                checked={orderRating === rating}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                              />
                              {isActive ? (
                                <StarIcon className="text-yellow-400" />
                              ) : (
                                <StarBorderIcon className="text-yellow-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        {formErrors.rating && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.rating}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Comment <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write your comment"
                        value={review.comment}
                        onChange={e =>
                          setReview(prev => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5CAF90] ${
                          formErrors.comment
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.comment && (
                        <p className="mt-1 text-sm text-red-500">
                          {formErrors.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      onClick={() => setIsOrderReviewEditModalOpen(false)}
                      className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 hover:shadow-md transform transition-all duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOrderReviewEditSubmit}
                      className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Confirm Delete
              </h3>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-700 transition-all duration-300 rounded-md hover:text-gray-900 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteReview}
                  className="px-4 py-2 text-white transition-all duration-300 transform bg-red-500 rounded-md hover:bg-red-600 hover:opacity-80 hover:scale-105 hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTracking
