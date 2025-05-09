import { useState } from "react";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { products } from "./Products";
import { useNavigate } from "react-router-dom";
import OrderDetails from "./OrderDetails";

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    paymentMethod: "cash",
    installmentPlan: "",
  });

  const [addresses, setAddresses] = useState([
    { id: 1, value: "123 Main St, City A", isDefault: true },
    { id: 2, value: "456 Oak Ave, City B", isDefault: false },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [newAddress, setNewAddress] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);

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
  ];

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const discount = cartItems.reduce(
    (sum, item) =>
      sum + (item.marketPrice - item.variant.price) * item.quantity,
    0
  );
  const deliveryFee = 500.0;
  const total = subtotal - discount + deliveryFee;
console.log(subtotal,discount,deliveryFee)
  // Order information
  const orderInfo = {
    orderNo: `#${Math.floor(100000 + Math.random() * 900000)}`,
    deliveryDate: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    address: addresses.find((a) => a.id === selectedAddress)?.value || "",
  };

  // Format price helper function
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
console.log(cartItems)
  // Calculate individual product discounts
  const getProductDiscounts = () => {
    return cartItems.map(item => {
      if (item.marketPrice > item.variant.price) {
        const itemDiscount = (item.marketPrice - item.variant.price) * item.quantity;
        return {
          name: item.name,
          discount: itemDiscount,
          discountName: item.discountName || (
            item.category === 'Seasonal Offers' ? 'Seasonal Discounts' :
            item.category === 'Rush Delivery' ? 'Rush Discounts' :
            item.category === 'For You' ? 'For You Discounts' :
            'Sale Discounts'
          ),
          discountPrice: item.marketPrice - item.sellingPrice
        };
      }
      return null;
    }).filter(Boolean);
  };

  const productDiscounts = getProductDiscounts();
console.log(productDiscounts,"waqas")
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
    orderInfo.address = addresses.find((a) => a.id === addressId)?.value || "";
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      const newId =
        addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1;
      const updatedAddresses = [
        ...addresses,
        { id: newId, value: newAddress, isDefault: false },
      ];
      setAddresses(updatedAddresses);
      setSelectedAddress(newId);
      orderInfo.address = newAddress;
      setNewAddress("");
      setShowAddAddress(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      ...formData,
      deliveryAddress: orderInfo.address,
      orderItems: cartItems,
      totalAmount: total,
    });
    alert("Order placed successfully!");
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Order<span className="text-[#5CAF90]"> Checkout</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FaShoppingCart className="mr-3 text-[#5CAF90]" />
                      Personal<span className="text-[#5CAF90]">&nbsp; Information</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
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
                          className="block text-sm font-medium text-gray-700 mb-2"
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
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-[#5CAF90]" />
                      Delivery <span className="text-[#5CAF90]">&nbsp;Address</span>
                    </h2>
                    <div className="space-y-3">
                      {addresses.map((address) => (
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
                              className="ml-3 block text-sm text-gray-700"
                            >
                              {address.value}{" "}
                              {address.isDefault && (
                                <span className="text-xs border border-gray-400 text-gray-600 px-2 py-1 rounded ml-2 ">
                                  Default
                                </span>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}

                      {showAddAddress ? (
                        <div className="mt-4 space-y-3">
                          <textarea
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Enter full address including city and postal code"
                            rows="3"
                            className="w-full px-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:border-transparent"
                          />
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={handleAddAddress}
                              className="flex-1 px-4 py-2 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4a9a7a] cursor-pointer flex items-center justify-center"
                            >
                              <FaPlus className="mr-2" />
                              Save Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddAddress(false)}
                              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-300 bg-gray-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(true)}
                            className="mt-2 px-4 py-2 hover:bg-gray-300 bg-gray-200 cursor-pointer border border-gray-400 text-gray-700 rounded-lg flex items-center justify-center"
                          >
                            <FaPlus className="mr-2" />
                            Add New Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <FaCreditCard className="mr-3 text-[#5CAF90]" />
                      Payment <span className="text-[#5CAF90]">&nbsp;Method</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
                            className="ml-3 flex items-center"
                          >
                            <FaMoneyBillWave className="mr-3 text-gray-500 text-lg" />
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
                            className="ml-3 flex items-center"
                          >
                            <FaCreditCard className="mr-3 text-gray-500 text-lg" />
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
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full px-6 py-3 border bg-gray-200 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium flex items-center justify-center"
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
    </div>
  );
};

export default Checkout;
