import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/product";
import { getEvent, createEvent, updateEvent } from "../api/event";
import { FaRegCheckSquare, FaCheckSquare, FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import SearchableSelect from "./SearchableSelect";
import "react-datepicker/dist/react-datepicker.css";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && id !== undefined;

  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventImage: null,
    eventImageUrl: null,
    productIds: [],
    status: "active",
    discounts: [],
  });

  // Products for dropdown
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const eventImageRef = useRef(null);

  // Discount modal state
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    productIds: [],
    Description: "",
    Discount_Type: "",
    Discount_Value: "",
    Start_Date: null,
    End_Date: null,
    Status: "active",
  });
  const [editingDiscountIndex, setEditingDiscountIndex] = useState(-1);

  // Load products and event data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load products
        const productsData = await getProducts();
        setProducts(productsData.products);

        // If in edit mode, load event data
        if (isEditMode) {
          const eventData = await getEvent(id);
          const event = eventData.event;

          // Normalize discount dates to 'YYYY-MM-DD'
          const normalizedDiscounts = event.discounts.map((discount) => ({
            ...discount,
            Start_Date: new Date(discount.Start_Date)
              .toISOString()
              .split("T")[0],
            End_Date: new Date(discount.End_Date).toISOString().split("T")[0],
            productIds: discount.productIds || [],
          }));

          setFormData({
            eventName: event.Event_Name,
            eventDescription: event.Event_Description,
            eventImage: null,
            eventImageUrl: event.Event_Image_Url,
            productIds: event.products.map((p) => p.idProduct),
            status: event.Status,
            discounts: normalizedDiscounts,
          });

          // Set selected products for edit mode
          setSelectedProducts(event.products);
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

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        eventImage: file,
        eventImageUrl: URL.createObjectURL(file),
      }));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      eventImage: null,
      eventImageUrl: null,
    }));
    if (eventImageRef.current) {
      eventImageRef.current.value = null;
    }
  };

  // Add product to event
  const addProduct = () => {
    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    const productIdNum = parseInt(selectedProductId);
    if (formData.productIds.includes(productIdNum)) {
      toast.error("Product already added");
      return;
    }

    const product = products.find((p) => p.idProduct === productIdNum);
    if (product) {
      setSelectedProducts((prev) => [...prev, product]);
      setFormData((prev) => ({
        ...prev,
        productIds: [...prev.productIds, productIdNum],
      }));
      setSelectedProductId("");
    }
  };

  // Remove product from event
  const removeProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.idProduct !== productId)
    );
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  };

  // Toggle status
  const toggleStatus = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  // Discount modal functions
  const openDiscountModal = () => {
    setDiscountForm({
      productIds: [],
      Description: "",
      Discount_Type: "",
      Discount_Value: "",
      Start_Date: null,
      End_Date: null,
      Status: "active",
    });
    setEditingDiscountIndex(-1);
    setShowDiscountModal(true);
  };

  const editDiscount = (index) => {
    const discount = formData.discounts[index];
    setDiscountForm({
      productIds: discount.productIds,
      Description: discount.Description,
      Discount_Type: discount.Discount_Type,
      Discount_Value: discount.Discount_Value,
      Start_Date: new Date(discount.Start_Date),
      End_Date: new Date(discount.End_Date),
      Status: discount.Status,
    });
    setEditingDiscountIndex(index);
    setShowDiscountModal(true);
  };

  const closeDiscountModal = () => {
    setShowDiscountModal(false);
    setEditingDiscountIndex(-1);
  };

  // Handle discount form changes
  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    setDiscountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountDateChange = (date, field) => {
    setDiscountForm((prev) => ({ ...prev, [field]: date }));
  };

  const toggleDiscountStatus = (Status) => {
    setDiscountForm((prev) => ({ ...prev, Status }));
  };

  // Calculate discounted price for a product
  const calculateDiscountedPrice = (product, discount) => {
    const originalPrice = parseFloat(product.Selling_Price) || 0;
    if (!discount.Discount_Type || !discount.Discount_Value) {
      return originalPrice;
    }
    const discountValue = parseFloat(discount.Discount_Value) || 0;
    if (discount.Discount_Type === "percentage") {
      return originalPrice - (originalPrice * discountValue) / 100;
    } else if (discount.Discount_Type === "fixed") {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  };

  // Add or update discount
  const handleAddDiscount = () => {
    // Validation
    if (
      discountForm.productIds.length === 0 ||
      !discountForm.Description ||
      !discountForm.Discount_Type ||
      !discountForm.Discount_Value ||
      !discountForm.Start_Date ||
      !discountForm.End_Date
    ) {
      toast.error("All fields are required");
      return;
    }

    // Validate discount value
    const value = Number(discountForm.Discount_Value);
    if (isNaN(value)) {
      toast.error("Discount value must be a number");
      return;
    }

    if (discountForm.Discount_Type === "percentage") {
      if (value < 1 || value > 100) {
        toast.error("Percentage discount must be between 1 and 100");
        return;
      }
    } else if (discountForm.Discount_Type === "fixed") {
      if (value <= 0) {
        toast.error("Fixed discount must be greater than 0");
        return;
      }
    }

    // Validate dates
    if (discountForm.End_Date < discountForm.Start_Date) {
      toast.error("End date must be after start date");
      return;
    }

    const newDiscount = {
      ...discountForm,
      Start_Date: discountForm.Start_Date.toISOString().split("T")[0],
      End_Date: discountForm.End_Date.toISOString().split("T")[0],
    };

    if (editingDiscountIndex >= 0) {
      // Update existing discount
      setFormData((prev) => ({
        ...prev,
        discounts: prev.discounts.map((discount, index) =>
          index === editingDiscountIndex ? newDiscount : discount
        ),
      }));
      toast.success("Discount updated successfully");
    } else {
      // Add new discount
      setFormData((prev) => ({
        ...prev,
        discounts: [...prev.discounts, newDiscount],
      }));
      toast.success("Discount added successfully");
    }

    closeDiscountModal();
  };

  // Remove discount
  const removeDiscount = (index) => {
    setFormData((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
    toast.success("Discount removed successfully");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.eventName ||
      !formData.eventDescription ||
      (!isEditMode && !formData.eventImage) ||
      formData.productIds.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const submitData = {
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        productIds: formData.productIds,
        status: formData.status,
        eventImage: formData.eventImage,
        discounts: formData.discounts,
        removeImage:
          formData.eventImageUrl === null && isEditMode ? "true" : "false",
      };

      if (isEditMode) {
        await updateEvent(id, submitData);
        toast.success("Event updated successfully");
      } else {
        await createEvent(submitData);
        toast.success("Event created successfully");
      }

      // Navigate back to events list
      navigate("/dashboard/events/all-events");
    } catch (error) {
      toast.error(error.message || "Failed to save event");
    }
  };

  // Get products that already have discounts applied
  const getProductsWithDiscounts = () => {
    const productsWithDiscounts = new Set();
    formData.discounts.forEach((discount) => {
      discount.productIds.forEach((productId) => {
        productsWithDiscounts.add(productId);
      });
    });
    return productsWithDiscounts;
  };

  // Get available products for discount (only from selected event products and without existing discounts)
  const getAvailableProductsForDiscount = () => {
    const productsWithDiscounts = getProductsWithDiscounts();

    // When editing a discount, allow products that are part of the current discount being edited
    let allowedProductIds = new Set();
    if (editingDiscountIndex >= 0) {
      const currentDiscount = formData.discounts[editingDiscountIndex];
      currentDiscount.productIds.forEach((id) => allowedProductIds.add(id));
    }

    return selectedProducts
      .filter(
        (product) =>
          !productsWithDiscounts.has(product.idProduct) ||
          allowedProductIds.has(product.idProduct)
      )
      .map((product) => ({
        value: product.idProduct,
        label: product.Description,
      }));
  };

  // Get products affected by a discount
  const getDiscountProducts = (discount) => {
    return selectedProducts.filter((product) =>
      discount.productIds.includes(product.idProduct)
    );
  };

  // Format discount value for display
  const formatDiscountValue = (value, type) => {
    if (type === "percentage") {
      // Remove decimal places for percentage
      return `${Number.parseInt(value)}%`;
    } else {
      return `Rs. ${value}`;
    }
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
            {isEditMode ? "Edit Event" : "Add New Event"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div className="form-control">
            <label className="label text-[#1D372E] mb-0.5">
              <span className="label-text text-sm font-medium">
                Add Products to Event
              </span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchableSelect
                  options={products
                    .filter(
                      (product) =>
                        !formData.productIds.includes(product.idProduct)
                    )
                    .map((product) => ({
                      value: product.idProduct,
                      label: product.Description,
                    }))}
                  value={selectedProductId}
                  onChange={setSelectedProductId}
                  placeholder="Select a product"
                  searchPlaceholder="Search by product..."
                />
              </div>
              <button
                type="button"
                onClick={addProduct}
                className="btn btn-outline btn-sm md:btn-md border-[#5CAF90] text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white px-6"
                title="Add Product to Event"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedProducts.length === 0) {
                    toast.error("First add products to the Event");
                  } else {
                    openDiscountModal();
                  }
                }}
                className="btn btn-outline btn-sm md:btn-md border-[#5CAF90] text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white px-6"
                title="Add Discount to Event"
              >
                Add Discount
              </button>
            </div>
          </div>

          {/* Selected Products Display */}
          {selectedProducts.length > 0 && (
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">
                  Selected Products ({selectedProducts.length})
                </span>
              </label>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {selectedProducts.map((product) => {
                  // Find if this product has a discount
                  const productDiscount = formData.discounts.find((discount) =>
                    discount.productIds.includes(product.idProduct)
                  );
                  const discountedPrice = productDiscount
                    ? calculateDiscountedPrice(product, productDiscount)
                    : null;
                  const originalPrice = parseFloat(product.Selling_Price);

                  return (
                    <div
                      key={product.idProduct}
                      className="card bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-[#1D372E] mb-1 line-clamp-2">
                              {product.Description}
                            </h4>
                            {productDiscount && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                Discount Applied
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(product.idProduct)}
                            className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square text-white"
                            title="Remove Product"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {product.Main_Image_Url && (
                          <div className="mb-3">
                            <img
                              src={product.Main_Image_Url}
                              alt={product.Description}
                              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                            />
                          </div>
                        )}

                        {/* Product Description */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {product.Long_Description || product.Description}
                          </p>
                        </div>

                        {/* Price Information */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">
                              Market Price:
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              Rs. {parseFloat(product.Market_Price).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">
                              Selling Price:
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                productDiscount
                                  ? "line-through text-gray-500"
                                  : "text-[#5CAF90]"
                              }`}
                            >
                              Rs. {originalPrice.toFixed(2)}
                            </span>
                          </div>

                          {productDiscount && (
                            <>
                              <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-red-600">
                                    Discount:
                                  </span>
                                  <span className="text-sm font-bold text-red-600">
                                    {formatDiscountValue(
                                      productDiscount.Discount_Value,
                                      productDiscount.Discount_Type
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-1 bg-green-100 rounded p-2">
                                  <span className="text-sm font-bold text-[#1D372E]">
                                    Final Price:
                                  </span>
                                  <span className="text-lg font-bold text-[#5CAF90]">
                                    Rs. {discountedPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Name and Description */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Event Name */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">
                  Event Name
                </span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter event name"
                className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>

            {/* Event Description */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">
                  Event Description
                </span>
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="3"
                className="textarea textarea-bordered textarea-sm md:textarea-md w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>
          </div>

          {/* Event Image and Status */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Event Image */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">
                  Event Image
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={eventImageRef}
                className="file-input file-input-bordered file-input-sm md:file-input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
              {/* Image Preview */}
              {formData.eventImageUrl && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={formData.eventImageUrl}
                    alt="Event preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square absolute top-1 right-1"
                  >
                    <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">Status</span>
              </label>
              <div className="flex flex-row gap-4 mt-2">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatus("active")}
                >
                  <span className="text-[#1D372E]">Active</span>
                  {formData.status === "active" ? (
                    <FaCheckSquare className="text-[#5CAF90] w-4 h-4" />
                  ) : (
                    <FaRegCheckSquare className="text-[#1D372E] w-4 h-4" />
                  )}
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatus("inactive")}
                >
                  <span className="text-[#1D372E]">Inactive</span>
                  {formData.status === "inactive" ? (
                    <FaCheckSquare className="text-[#5CAF90] w-4 h-4" />
                  ) : (
                    <FaRegCheckSquare className="text-[#1D372E] w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Event Discounts Display */}
          {formData.discounts.length > 0 && (
            <div className="form-control">
              <div className="flex justify-between items-center mb-4">
                <label className="label text-[#1D372E] mb-0">
                  <span className="label-text text-sm font-semibold">
                    Event Discounts ({formData.discounts.length})
                  </span>
                </label>
              </div>
              <div className="space-y-4">
                {formData.discounts.map((discount, index) => {
                  const affectedProducts = getDiscountProducts(discount);
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-[#5CAF90] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-bold text-[#1D372E] text-lg">
                              {discount.Description}
                            </h5>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                discount.Status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {discount.Status.toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 mb-1">
                                DISCOUNT VALUE
                              </h6>
                              <p className="text-xl font-bold text-[#5CAF90]">
                                {formatDiscountValue(
                                  discount.Discount_Value,
                                  discount.Discount_Type
                                )}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 mb-1">
                                START DATE
                              </h6>
                              <p className="text-sm font-medium text-[#1D372E]">
                                {new Date(
                                  discount.Start_Date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>

                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <h6 className="text-xs font-semibold text-gray-600 mb-1">
                                END DATE
                              </h6>
                              <p className="text-sm font-medium text-[#1D372E]">
                                {new Date(discount.End_Date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <h6 className="text-xs font-semibold text-gray-600 mb-2">
                              APPLIED TO PRODUCTS
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {affectedProducts.map((product, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-[#5CAF90] bg-opacity-10 text-white px-3 py-1 rounded-full text-xs font-medium border border-[#5CAF90] border-opacity-20"
                                >
                                  {product.Description}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => editDiscount(index)}
                            className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-sm btn-square"
                            title="Edit Discount"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeDiscount(index)}
                            className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-sm btn-square"
                            title="Remove Discount"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-control mt-8 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white btn-sm md:btn-md"
            >
              {isEditMode ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>

      {/* Add/Edit Discount Modal */}
      {showDiscountModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                {editingDiscountIndex >= 0 ? "Edit Discount" : "Add Discount"}
              </h3>
              <button
                onClick={closeDiscountModal}
                className="absolute right-6 top-7 text-[#1D372E]"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Selection for Discount */}
              <div className="form-control">
                <label className="label text-[#1D372E] mb-2">
                  <span className="label-text text-sm font-semibold">
                    Select Products for Discount
                  </span>
                </label>
                {getAvailableProductsForDiscount().length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      {editingDiscountIndex >= 0
                        ? "No additional products available for discount (all selected products already have discounts or are part of this discount)."
                        : "All selected products already have discounts applied. Remove existing discounts to add new ones."}
                    </p>
                  </div>
                ) : (
                  <SearchableSelect
                    options={getAvailableProductsForDiscount()}
                    value={discountForm.productIds}
                    onChange={(value) =>
                      setDiscountForm((prev) => ({
                        ...prev,
                        productIds: value,
                      }))
                    }
                    placeholder="Select products..."
                    searchPlaceholder="Search by product..."
                    multiple={true}
                  />
                )}
              </div>

              {/* Show selected products */}
              {discountForm.productIds.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-[#5CAF90] border-opacity-20">
                  <h6 className="text-sm font-semibold text-[#1D372E] mb-3">
                    Selected Products ({discountForm.productIds.length}):
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {discountForm.productIds.map((productId) => {
                      const product = selectedProducts.find(
                        (p) => p.idProduct === productId
                      );
                      return (
                        <span
                          key={productId}
                          className="inline-block bg-white text-[#1D372E] px-3 py-2 rounded-lg text-sm font-medium border border-[#5CAF90] border-opacity-30 shadow-sm"
                        >
                          {product?.Description}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Discount Description and Status */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      Discount Description
                    </span>
                  </label>
                  <input
                    type="text"
                    name="Description"
                    value={discountForm.Description}
                    onChange={handleDiscountChange}
                    placeholder="Enter discount description"
                    className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      Status
                    </span>
                  </label>
                  <div className="flex flex-row gap-4 mt-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleDiscountStatus("active")}
                    >
                      <span className="text-[#1D372E]">Active</span>
                      {discountForm.Status === "active" ? (
                        <FaCheckSquare className="text-[#5CAF90] w-4 h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-4 h-4" />
                      )}
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleDiscountStatus("inactive")}
                    >
                      <span className="text-[#1D372E]">Inactive</span>
                      {discountForm.Status === "inactive" ? (
                        <FaCheckSquare className="text-[#5CAF90] w-4 h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Discount Type and Value */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      Discount Type
                    </span>
                  </label>
                  <select
                    name="Discount_Type"
                    value={discountForm.Discount_Type}
                    onChange={handleDiscountChange}
                    className="select select-bordered select-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  >
                    <option value="">Select discount type</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      Discount Value{" "}
                      {discountForm.Discount_Type === "percentage"
                        ? "(%)"
                        : "(Rs.)"}
                    </span>
                  </label>
                  <input
                    type="number"
                    name="Discount_Value"
                    value={discountForm.Discount_Value}
                    onChange={handleDiscountChange}
                    placeholder={`Enter discount value`}
                    className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    step={
                      discountForm.Discount_Type === "percentage" ? "1" : "0.01"
                    }
                  />
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      Start Date
                    </span>
                  </label>
                  <div className="relative w-full">
                    <DatePicker
                      selected={discountForm.Start_Date}
                      onChange={(date) =>
                        handleDiscountDateChange(date, "Start_Date")
                      }
                      className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select start date"
                      showPopperArrow={false}
                      style={{ width: "100%" }}
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-[#1D372E] mb-2">
                    <span className="label-text text-sm font-semibold">
                      End Date
                    </span>
                  </label>
                  <div className="relative w-full">
                    <DatePicker
                      selected={discountForm.End_Date}
                      onChange={(date) =>
                        handleDiscountDateChange(date, "End_Date")
                      }
                      className="input input-bordered input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select end date"
                      minDate={discountForm.Start_Date}
                      showPopperArrow={false}
                      style={{ width: "100%" }}
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action mt-8 flex gap-3">
              <button
                onClick={closeDiscountModal}
                className="btn btn-md bg-[#1D372E] border-[#1D372E] text-white px-6"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDiscount}
                className="btn btn-md bg-[#5CAF90] border-[#5CAF90] text-white hover:bg-[#4a9a7d] px-6"
              >
                {editingDiscountIndex >= 0 ? "Update Discount" : "Add Discount"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;
