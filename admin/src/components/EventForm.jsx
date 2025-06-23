import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/product";
import { getEvent, createEvent, updateEvent } from "../api/event";
import { FaRegCheckSquare, FaCheckSquare, FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";

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
  });

  // Products for dropdown
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const eventImageRef = useRef(null);

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

          setFormData({
            eventName: event.Event_Name,
            eventDescription: event.Event_Description,
            eventImage: null,
            eventImageUrl: event.Event_Image_Url,
            productIds: event.products.map((p) => p.idProduct),
            status: event.Status,
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

          {/* Product Selection */}
          <div className="form-control">
            <label className="label text-[#1D372E] mb-0.5">
              <span className="label-text text-sm font-medium">
                Add Products to Event
              </span>
            </label>
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="select select-bordered select-sm md:select-md flex-1 bg-white border-[#1D372E] text-[#1D372E]"
              >
                <option value="">Select a product</option>
                {products
                  .filter(
                    (product) =>
                      !formData.productIds.includes(product.idProduct)
                  )
                  .map((product) => (
                    <option key={product.idProduct} value={product.idProduct}>
                      {product.Description}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addProduct}
                className="btn btn-primary btn-sm md:btn-md bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
                title="Add Product to Event"
              >
                <FaPlus className="w-3 h-3" />
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
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {selectedProducts.map((product) => (
                  <div
                    key={product.idProduct}
                    className="card bg-[#F4F4F4] border border-[#1D372E] shadow-sm"
                  >
                    <div className="card-body p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-semibold text-[#1D372E] flex-1">
                          {product.Description}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.idProduct)}
                          className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                        >
                          <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {product.Main_Image_Url && (
                        <img
                          src={product.Main_Image_Url}
                          alt={product.Description}
                          className="w-full h-60 object-cover rounded border"
                        />
                      )}
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default EventForm;
