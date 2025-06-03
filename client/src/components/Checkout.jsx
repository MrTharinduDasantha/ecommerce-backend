import { useEffect, useState } from "react"
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
} from "react-icons/fa"
import { products } from "./Products"
import { useNavigate } from "react-router-dom"
import OrderDetails from "./OrderDetails"
import { useAuth } from "../context/AuthContext"
import { getCustomerById } from "../api/customer"
import CloseIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

const Checkout = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    paymentMethod: "cash",
    installmentPlan: "",
  })

  const [addresses, setAddresses] = useState([
    { id: 1, address: "123 Main St, City A", isDefault: true },
    { id: 2, address: "456 Oak Ave, City B", isDefault: false },
  ])
  const [selectedAddress, setSelectedAddress] = useState(1)

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false)

  const [formErrors, setFormErrors] = useState({
    address: "",
    city: "",
    country: "",
    mobile: "",
  })

  const [newAddressDetails, setNewAddressDetails] = useState({
    address: "",
    city: "",
    country: "",
    mobile: "",
  })

  const [showAddSuccessMessage, setShowAddSuccessMessage] = useState(false)

  const { user } = useAuth()

  //fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const customerData = await getCustomerById(user.id)
        setFormData(prev => ({
          ...prev,
          name: customerData.Full_Name,
          contactNumber: customerData.Mobile_No,
        }))
      } catch (error) {
        console.error("Error fetching customer data:", error)
      }
    }
    fetchUserData()
  }, [user.id])

  const validateForm = () => {
    let isValid = true
    const errors = {
      address: "",
      city: "",
      country: "",
      mobile: "",
    }

    if (!newAddressDetails.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!newAddressDetails.city.trim()) {
      errors.city = "City is required"
      isValid = false
    }

    if (!newAddressDetails.country.trim()) {
      errors.country = "Country is required"
      isValid = false
    }

    if (!newAddressDetails.mobile.trim()) {
      errors.mobile = "Mobile number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(newAddressDetails.mobile.trim())) {
      errors.mobile = "Mobile number must be exactly 10 digits"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleAddAddress = () => {
    if (validateForm()) {
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1
      const formattedAddress = `${newAddressDetails.address.trim()}, ${newAddressDetails.city.trim()}, ${newAddressDetails.country.trim()}`
      setAddresses(prevAddresses => [
        ...prevAddresses,
        {
          id: newId,
          address: formattedAddress,
          isDefault: false,
        },
      ])
      setNewAddressDetails({
        address: "",
        city: "",
        country: "",
        mobile: "",
      })
      setFormErrors({
        address: "",
        city: "",
        country: "",
        mobile: "",
      })

      // Show success message
      setShowAddSuccessMessage(true)

      // Close the modal after a delay
      setTimeout(() => {
        setIsAddAddressModalOpen(false)
        setShowAddSuccessMessage(false)
      }, 1500)
    }
  }

  // Sample cart items
  const cartItems = [
    {
      ...products[0],
      variant: products[0].variants[0],
      quantity: 2,
    },
    {
      ...products[1],
      variant: { ...products[1].variants[0], size: ["M"] },
      quantity: 2,
    },
    {
      ...products[4],
      variant: products[4].variants[0],
      quantity: 1,
    },
  ]

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  )
  const discount = cartItems.reduce(
    (sum, item) =>
      sum + (item.marketPrice - item.variant.price) * item.quantity,
    0
  )
  const deliveryFee = 500.0
  const total = subtotal - discount + deliveryFee
  console.log(subtotal, discount, deliveryFee)
  // Order information
  const orderInfo = {
    orderNo: `#${Math.floor(100000 + Math.random() * 900000)}`,
    deliveryDate: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    address: addresses.find(a => a.id === selectedAddress)?.address || "",
  }

  // Format price helper function
  const formatPrice = price => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  console.log(cartItems)
  // Calculate individual product discounts
  const getProductDiscounts = () => {
    return cartItems
      .map(item => {
        if (item.marketPrice > item.variant.price) {
          const itemDiscount =
            (item.marketPrice - item.variant.price) * item.quantity
          return {
            name: item.name,
            discount: itemDiscount,
            discountName:
              item.discountName ||
              (item.category === "Seasonal Offers"
                ? "Seasonal Discounts"
                : item.category === "Rush Delivery"
                ? "Rush Discounts"
                : item.category === "For You"
                ? "For You Discounts"
                : "Sale Discounts"),
            discountPrice: item.marketPrice - item.sellingPrice,
          }
        }
        return null
      })
      .filter(Boolean)
  }

  const productDiscounts = getProductDiscounts()
  console.log(productDiscounts, "waqas")
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddressChange = addressId => {
    setSelectedAddress(addressId)
    orderInfo.address = addresses.find(a => a.id === addressId)?.value || ""
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log({
      ...formData,
      deliveryAddress: orderInfo.address,
      orderItems: cartItems,
      totalAmount: total,
    })
    alert("Order placed successfully!")
    navigate("/")
  }

  const handleCancel = () => {
    navigate("/cart")
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Order<span className="text-[#5CAF90]"> Checkout</span>
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Side - Order Details (40% width) */}
          <div className="lg:w-[40%]">
            <OrderDetails
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
              orderInfo={orderInfo}
              productDiscounts={productDiscounts}
            />
          </div>

          {/* Right Side - Checkout Form (60% width) */}
          <div className="lg:w-[60%]">
            <div className="overflow-hidden border border-gray-200 shadow-lg bg-gray-50 rounded-xl">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                      <FaShoppingCart className="mr-3 text-[#5CAF90]" />
                      Personal
                      <span className="text-[#5CAF90]">&nbsp; Information</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contactNumber"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:border-transparent"
                          placeholder="Enter your contact number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-8">
                    <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                      <FaMapMarkerAlt className="mr-3 text-[#5CAF90]" />
                      Delivery{" "}
                      <span className="text-[#5CAF90]">&nbsp;Address</span>
                    </h2>
                    <div className="space-y-3">
                      {addresses.map(address => (
                        <div
                          key={address.id}
                          className={`p-3 border bg-gray-100 rounded-lg cursor-pointer transition-all ${
                            selectedAddress === address.id
                              ? "border-[#5CAF90] bg-gray-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleAddressChange(address.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`address-${address.id}`}
                              name="deliveryAddress"
                              value={address.id}
                              checked={selectedAddress === address.id}
                              onChange={() => handleAddressChange(address.id)}
                              className="h-5 w-5 text-[#5CAF90] focus:ring-[#5CAF90] border-gray-300 cursor-pointer"
                            />
                            <label
                              htmlFor={`address-${address.id}`}
                              className="block ml-3 text-sm text-gray-700"
                            >
                              {address.address}{" "}
                              {address.isDefault && (
                                <span className="px-2 py-1 ml-2 text-xs text-gray-600 border border-gray-400 rounded ">
                                  Default
                                </span>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => setIsAddAddressModalOpen(true)}
                          className="flex items-center justify-center px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-300"
                        >
                          <FaPlus className="mr-2" />
                          Add New Address
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                      <FaCreditCard className="mr-3 text-[#5CAF90]" />
                      Payment{" "}
                      <span className="text-[#5CAF90]">&nbsp;Method</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                      <div
                        className={`p-4 border bg-gray-100 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === "cash"
                            ? "border-[#5CAF90] bg-gray-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: "cash" })
                        }
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            value="cash"
                            checked={formData.paymentMethod === "cash"}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-[#5CAF90] focus:ring-[#5CAF90] border-gray-300"
                          />
                          <label
                            htmlFor="cash"
                            className="flex items-center ml-3"
                          >
                            <FaMoneyBillWave className="mr-3 text-lg text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                Cash on Delivery
                              </p>
                              <p className="text-xs text-gray-500">
                                Pay when you receive
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div
                        className={`p-4 border bg-gray-100 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === "card"
                            ? "border-[#5CAF90] bg-gray-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, paymentMethod: "card" })
                        }
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-[#5CAF90] focus:ring-[#5CAF90] border-gray-300"
                          />
                          <label
                            htmlFor="card"
                            className="flex items-center ml-3"
                          >
                            <FaCreditCard className="mr-3 text-lg text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-800">
                                Credit/Debit Card
                              </p>
                              <p className="text-xs text-gray-500">
                                Secure online payment
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-700 bg-gray-200 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 cursor-pointer bg-[#5CAF90] text-white rounded-lg hover:bg-[#4a9a7a] focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:ring-offset-2 font-medium flex items-center justify-center"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Add New Address
              </h3>
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              {showAddSuccessMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  <p className="text-lg font-medium text-gray-800">
                    Address Successfully Added
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="newAddress"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="newAddress"
                      value={newAddressDetails.address}
                      onChange={e =>
                        setNewAddressDetails({
                          ...newAddressDetails,
                          address: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      rows="3"
                      placeholder="Enter your street address"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="newCity"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="newCity"
                      value={newAddressDetails.city}
                      onChange={e =>
                        setNewAddressDetails({
                          ...newAddressDetails,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="newCountry"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="newCountry"
                      value={newAddressDetails.country}
                      onChange={e =>
                        setNewAddressDetails({
                          ...newAddressDetails,
                          country: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.country
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your country"
                    />
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.country}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="newMobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="newMobile"
                      value={newAddressDetails.mobile}
                      onChange={e =>
                        setNewAddressDetails({
                          ...newAddressDetails,
                          mobile: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.mobile ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your mobile number"
                      maxLength="10"
                      pattern="\d{10}"
                    />
                    <p className="text-xs text-gray-500">
                      Mobile number must be 10 digits
                    </p>
                    {formErrors.mobile && (
                      <p className="text-sm text-red-500">
                        {formErrors.mobile}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() => setIsAddAddressModalOpen(false)}
                      className="px-4 py-2 text-gray-700 transition-all duration-300 rounded-md hover:text-gray-900 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-[#5CAF90] text-white rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
