import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProducts,
  getDiscount,
  createDiscount,
  updateDiscount,
} from "../api/product";
import { FaRegCheckSquare, FaCheckSquare } from "react-icons/fa";
import Select from "react-select";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Custom styles for react-select components
const customStyles = {
  menuList: (provided) => ({
    ...provided,
    maxHeight: "160px",
    overflowY: "auto",
    borderRadius: "0.3rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.3rem",
    borderWidth: "1px",
    borderColor: "#1D372E",
  }),
  control: (provided) => ({
    ...provided,
    minHeight: "2.5rem",
    borderWidth: "1px",
    borderColor: "#1D372E",
    borderRadius: "0.3rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#1D372E",
    },
    // Reduce control height and font size on small screens
    "@media screen and (max-width: 640px)": {
      minHeight: "2rem",
      fontSize: "0.75rem",
    },
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
    // Reduce option font size on small screens
    "@media screen and (max-width: 640px)": {
      fontSize: "0.75rem",
    },
  }),
};

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

  // Discount type options
  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount (Rs.)" },
  ];

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
            discountType: discount.Dicaunt_Type,
            discountValue: discount.Discount_Value,
            startDate: startDate,
            endDate: endDate,
            status: discount.Status,
          });
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

  // Handle product select change
  const handleProductChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, productId: selectedOption.value }));
  };

  // Handle discount type change
  const handleDiscountTypeChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, discountType: selectedOption.value }));
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Selection */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">Product</span>
              </label>
              <Select
                value={
                  products
                    .map((product) => ({
                      value: product.idProduct,
                      label: product.Description,
                    }))
                    .find((option) => option.value === formData.productId) ||
                  null
                }
                onChange={handleProductChange}
                options={products.map((product) => ({
                  value: product.idProduct,
                  label: product.Description,
                }))}
                styles={customStyles}
                placeholder="Select Product"
                className="text-[#1D372E]"
              />
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

          {/* Discount Type and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Type */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm font-medium">
                  Discount Type
                </span>
              </label>
              <Select
                value={discountTypeOptions.find(
                  (option) => option.value === formData.discountType
                )}
                onChange={handleDiscountTypeChange}
                options={discountTypeOptions}
                styles={customStyles}
                placeholder="Select discount type"
                className="text-[#1D372E]"
              />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <span className="label-text text-sm font-medium">End Date</span>
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
                <span className="label-text text-sm font-medium">Status</span>
              </label>
              <div className="flex flex-row gap-2 mt-2">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatus("active")}
                >
                  <span className="text-[#1D372E]">Active</span>
                  {formData.status === "active" ? (
                    <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3 md:w-4 md:h-4" />
                  ) : (
                    <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3 md:w-4 md:h-4" />
                  )}
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatus("inactive")}
                >
                  <span className="text-[#1D372E]">Inactive</span>
                  {formData.status === "inactive" ? (
                    <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3 md:w-4 md:h-4" />
                  ) : (
                    <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3 md:w-4 md:h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white btn-sm md:btn-md"
            >
              {isEditMode ? "Edit Discount" : "Create Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountForm;
