import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProducts,
  getDiscount,
  createDiscount,
  updateDiscount,
} from "../api/product";
import { FaRegCheckSquare, FaCheckSquare } from "react-icons/fa";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && id !== undefined;

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    description: "",
    discountType: "",
    discountValue: "",
    startDate: null,
    endDate: null,
    status: "active",
  });

  // Products for dropdown
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Filter products to show only those without discounts, or the current product in edit mode
  const productOptions = products
    .filter(
      (product) =>
        product.discounts.length === 0 ||
        product.idProduct === formData.productId
    )
    .map((product) => ({
      value: product.idProduct,
      label: product.Description,
    }));

  // Discount type options
  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount (Rs.)" },
  ];

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (!selectedProductDetails) {
      return 0;
    }
    const originalPrice = parseFloat(selectedProductDetails.Selling_Price) || 0;
    if (!formData.discountType || !formData.discountValue) {
      return originalPrice;
    }
    const discountValue = parseFloat(formData.discountValue) || 0;
    if (formData.discountType === "percentage") {
      return originalPrice - (originalPrice * discountValue) / 100;
    } else if (formData.discountType === "fixed") {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  };

  // Load products and discount data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load products
        const productsData = await getProducts();
        setProducts(productsData.products);

        // If in edit mode, load discount data
        if (isEditMode) {
          const discountData = await getDiscount(id);
          const discount = discountData.discount;

          // Parse dates
          const startDate = discount.Start_Date
            ? new Date(discount.Start_Date)
            : new Date();
          const endDate = discount.End_Date
            ? new Date(discount.End_Date)
            : new Date(new Date().setMonth(new Date().getMonth() + 1));

          setFormData({
            productId: discount.Product_idProduct,
            description: discount.Description,
            discountType: discount.Discount_Type,
            discountValue: discount.Discount_Value,
            startDate: startDate,
            endDate: endDate,
            status: discount.Status,
          });

          // Set selected product details for edit mode
          const selectedProduct = productsData.products.find(
            (product) => product.idProduct === discount.Product_idProduct
          );
          setSelectedProductDetails(selectedProduct);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  // Toggle status
  const toggleStatus = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (
        !formData.productId ||
        !formData.description ||
        !formData.discountType ||
        !formData.discountValue ||
        !formData.startDate ||
        !formData.endDate
      ) {
        toast.error("All fields are required");
        return;
      }

      // Convert discountValue to a number for validation
      const value = Number(formData.discountValue);
      if (isNaN(value)) {
        toast.error("Discount value must be a number");
        return;
      }

      // Validate discount value based on discount type
      if (formData.discountType === "percentage") {
        if (value < 1 || value > 100) {
          toast.error("Percentage discount must be between 1 and 100");
          return;
        }
      } else if (formData.discountType === "fixed") {
        if (value <= 0) {
          toast.error("Fixed discount must be greater than 0");
          return;
        }
      }

      // Validate dates
      if (formData.endDate < formData.startDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Format dates for API
      const apiData = {
        ...formData,
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.endDate.toISOString().split("T")[0],
      };

      if (isEditMode) {
        await updateDiscount(id, apiData);
        toast.success("Discount updated successfully");
      } else {
        await createDiscount(apiData);
        toast.success("Discount created successfully");
      }

      // Navigate back to discounts list
      navigate("/dashboard/discounts/all-discounts");
    } catch (error) {
      toast.error(error.message || "Failed to save discount");
    }
  };

  // Modern Product Details Component
  const ProductDetails = ({ product }) => {
    const discountedPrice = calculateDiscountedPrice();
    const originalPrice = parseFloat(product.Selling_Price);
    const hasDiscount =
      discountedPrice !== originalPrice && formData.discountValue;

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5CAF90] to-[#4a9a7d] px-6 py-4">
          <h3 className="text-lg md:text-xl font-bold text-white">
            Product Preview
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <h4 className="text-xl text-center font-bold text-[#1D372E] mb-2">
              {product.Description}
            </h4>
          </div>

          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={product.Main_Image_Url}
                alt={product.Description}
                className="w-full h-64 object-contain"
              />
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-[#F4F4F4] rounded-lg p-4">
            <h5 className="text-lg font-semibold text-[#1D372E] mb-3">
              Pricing
            </h5>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Price:</span>
                <span className="font-medium text-gray-800">
                  Rs. {parseFloat(product.Market_Price).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Selling Price:</span>
                <span
                  className={`font-medium ${
                    hasDiscount
                      ? "text-gray-500 line-through"
                      : "text-[#5CAF90] text-lg font-bold"
                  }`}
                >
                  Rs. {originalPrice.toFixed(2)}
                </span>
              </div>

              {hasDiscount && (
                <>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-gray-600">Discount Applied:</span>
                    <span className="text-red-600 font-medium">
                      {formData.discountType === "percentage"
                        ? `${formData.discountValue}%`
                        : `Rs. ${parseFloat(formData.discountValue).toFixed(
                            2
                          )}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-green-50 -mx-4 -mb-4 px-4 py-3 mt-3">
                    <span className="font-semibold text-[#1D372E]">
                      Final Selling Price:
                    </span>
                    <span className="text-[#5CAF90] text-xl font-bold">
                      Rs. {discountedPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-center text-sm text-gray-500 mt-6">
                    You save: Rs. {(originalPrice - discountedPrice).toFixed(2)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Brand and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Brand</span>
              <p className="text-[#1D372E] font-medium">
                {product.Brand_Name || "Other"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Stock</span>
              <p className="text-[#1D372E] font-medium">
                {product.SIH || "N/A"} units
              </p>
            </div>
          </div>

          {/* Categories */}
          {product.subcategories && product.subcategories.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-2">
                Categories
              </h5>
              <div className="flex flex-wrap gap-2">
                {product.subcategories.map((subcat) => (
                  <span
                    key={subcat.idSub_Category}
                    className="inline-block bg-[#5CAF90] bg-opacity-10 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {subcat.Description}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-3">
                Available Variations
              </h5>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {product.variations.map((variation) => (
                  <div
                    key={variation.idProduct_Variations}
                    className="flex items-center justify-between p-3 bg-[#F4F4F4] rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {variation.Colour &&
                        variation.Colour !== "No color selected" && (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: variation.Colour }}
                            />
                            <span className="text-sm text-gray-600">
                              {variation.Colour}
                            </span>
                          </div>
                        )}
                      {variation.Size &&
                        variation.Size !== "No size selected" && (
                          <span className="bg-white px-2 py-1 rounded text-sm text-gray-600 border">
                            {variation.Size}
                          </span>
                        )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#1D372E]">
                        Qty: {variation.Qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card bg-white shadow-md">
        <div className="card-body">
          <div className="flex justify-center items-center min-h-[75vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            {isEditMode ? "Edit Discount" : "Add New Discount"}
          </h2>
        </div>

        {/* Form and Product Details Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product and Description */}
              <div
                className={`grid gap-4 ${
                  selectedProductDetails ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {/* Product Selection */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Product
                    </span>
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={(e) => {
                      const selectedValue = e.target.value;

                      // Update form data
                      setFormData((prev) => ({
                        ...prev,
                        productId: selectedValue,
                      }));

                      // Find and set the selected product details
                      if (selectedValue) {
                        const selectedProduct = products.find(
                          (product) =>
                            product.idProduct === parseInt(selectedValue)
                        );
                        setSelectedProductDetails(selectedProduct || null);
                      } else {
                        setSelectedProductDetails(null);
                      }
                    }}
                    className="select select-bordered select-sm md:select-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  >
                    <option value="">Select Product</option>
                    {productOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Description */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Discount Description
                    </span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter discount description"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>
              </div>

              {/* Mobile Product Details - Show below product selection on mobile */}
              {selectedProductDetails && (
                <div className="block lg:hidden">
                  <ProductDetails product={selectedProductDetails} />
                </div>
              )}

              {/* Discount Type and Discount Value*/}
              <div
                className={`grid gap-4 ${
                  selectedProductDetails ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {/* Discount Type */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Discount Type
                    </span>
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="select select-bordered select-sm md:select-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  >
                    <option value="">Select discount type</option>
                    {discountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount Value */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Discount Value{" "}
                      {formData.discountType === "percentage" ? "(%)" : "(Rs.)"}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={`Enter discount value ${
                      formData.discountType === "percentage"
                        ? "in percentage"
                        : "in rupees"
                    }`}
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                  />
                </div>
              </div>

              {/* Date Range and Status */}
              <div
                className={`grid gap-4 ${
                  selectedProductDetails ? "grid-cols-1" : "grid-cols-3"
                }`}
              >
                {/* Start Date */}
                <div className="form-control flex flex-col gap-0.5">
                  <label className="label text-[#1D372E]">
                    <span className="label-text text-sm font-medium">
                      Start Date
                    </span>
                  </label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                  />
                </div>
                {/* End Date */}
                <div className="form-control flex flex-col gap-0.5">
                  <label className="label text-[#1D372E]">
                    <span className="label-text text-sm font-medium">
                      End Date
                    </span>
                  </label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select end date"
                    minDate={formData.startDate}
                  />
                </div>
                {/* Status */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Status
                    </span>
                  </label>
                  <div className="flex flex-row gap-2 mt-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleStatus("active")}
                    >
                      <span className="text-[#1D372E]">Active</span>
                      {formData.status === "active" ? (
                        <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleStatus("inactive")}
                    >
                      <span className="text-[#1D372E]">Inactive</span>
                      {formData.status === "inactive" ? (
                        <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8 flex justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white btn-sm md:btn-md ${
                    selectedProductDetails ? "w-full" : ""
                  }`}
                >
                  {isEditMode ? "Edit Discount" : "Create Discount"}
                </button>
              </div>
            </form>
          </div>

          {/* Product Details Section - Show on desktop when product is selected */}
          {selectedProductDetails && (
            <div className="hidden lg:block lg:w-1/2">
              <ProductDetails product={selectedProductDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
