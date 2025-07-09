import { useRef, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill, RiDeleteBack2Fill } from "react-icons/ri";
import {
  FaEdit,
  FaRegCheckSquare,
  FaCheckSquare,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  createProduct,
  updateProduct,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  getCategories,
  getProduct,
} from "../api/product";
// eslint-disable-next-line no-unused-vars
import { components } from "react-select";
import toast from "react-hot-toast";
import Select from "react-select";

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

const ProductForm = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine edit mode based on the id parameter
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [isLoading, setIsLoading] = useState(false);

  // Product Fields
  const [description, setDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [subDescription, setSubDescription] = useState("");

  // Subcategories
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Special offers
  const [seasonalOffer, setSeasonalOffer] = useState(false);
  const [rushDelivery, setRushDelivery] = useState(false);
  const [forYou, setForYou] = useState(false);

  // Single main image
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const mainImageRef = useRef(null);

  // Multiple sub images
  const [subImages, setSubImages] = useState([]);
  const [subImagesPreview, setSubImagesPreview] = useState([]);
  const subImagesRef = useRef(null);
  const [deletedSubImages, setDeletedSubImages] = useState([]);

  // Brands
  const [brands, setBrands] = useState([]);
  const [brandPopupVisible, setBrandPopupVisible] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [isEditingBrand, setIsEditingBrand] = useState(false);

  // Brand image
  const [newBrandImage, setNewBrandImage] = useState(null);
  const [newBrandImagePreview, setNewBrandImagePreview] = useState(null);
  const newBrandImageRef = useRef(null);

  // Variations (Color/Size/Quantity)
  const [colorName, setColorName] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#ffffff");
  const [isColorLocked, setIsColorLocked] = useState(false);
  const [size, setSize] = useState("");
  const [colorQuantity, setColorQuantity] = useState("");
  const [variations, setVariations] = useState([]);
  const [editingVariationIndex, setEditingVariationIndex] = useState(null);

  // FAQ states
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [editingFaqIndex, setEditingFaqIndex] = useState(null);

  // Update the brand image preview whenever the new brand image changes
  useEffect(() => {
    if (newBrandImage) {
      setNewBrandImagePreview(URL.createObjectURL(newBrandImage));
    } else {
      setNewBrandImagePreview(null);
    }
  }, [newBrandImage]);

  // Load brands and available subcategories on mount
  useEffect(() => {
    loadBrands();
    loadSubCategories();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data.brands);
    } catch (error) {
      toast.error(error.message || "Failed to load brands");
    }
  };

  const loadSubCategories = async () => {
    try {
      const data = await getCategories();
      // get only categories whose status is "active"
      const activeCategories = data.categories.filter(
        (category) => category.Status === "active"
      );
      setAvailableSubCategories(activeCategories);
    } catch (error) {
      toast.error(error.message || "Failed to load subcategories");
    }
  };

  // Load product data if in edit mode
  useEffect(() => {
    if (id) {
      const loadProductData = async () => {
        try {
          setIsLoading(true);
          const data = await getProduct(id);
          const product = data.product;
          // Set product fields
          setDescription(product.Description);
          setSelectedBrand(
            product.Product_Brand_idProduct_Brand
              ? product.Product_Brand_idProduct_Brand
              : "other"
          );
          setMarketPrice(product.Market_Price ? product.Market_Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
          setSellingPrice(product.Selling_Price ? product.Selling_Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
          setSubDescription(product.Long_Description);
          setMainImagePreview(product.Main_Image_Url);
          if (product.images) {
            setSubImagesPreview(product.images.map((img) => img.Image_Url));
          }
          // Set variations and FAQs if available
          if (product.variations) {
            setVariations(
              product.variations.map((variant) => ({
                id: variant.idProduct_Variations,
                colorCode: variant.Colour,
                size: variant.Size,
                quantity: String(variant.Qty),
                hasOrders: variant.hasOrders,
              }))
            );
          }
          if (product.faqs) {
            setFaqs(
              product.faqs.map((faq) => ({
                id: faq.idFAQ,
                question: faq.Question,
                answer: faq.Answer,
              }))
            );
          }
          // Set selected subcategories
          if (product.subcategories) {
            setSelectedSubCategories(product.subcategories);
          }
          // Set special offer flags
          setSeasonalOffer(product.Seasonal_Offer === 1);
          setRushDelivery(product.Rush_Delivery === 1);
          setForYou(product.For_You === 1);
          setIsEditMode(true);
        } catch (error) {
          toast.error(error.message || "Failed to load product");
        } finally {
          setIsLoading(false);
        }
      };
      loadProductData();
    }
  }, [id]);

  // Handlers for main image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    if (mainImageRef.current) mainImageRef.current.value = "";
  };

  // Handlers for sub images
  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Replace the existing subImages with the new files
      setSubImages(files);
      // Replace the preview images with the new file previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSubImagesPreview(newPreviews);

      // Reset the input so that you can re-upload the same files if needed
      if (subImagesRef.current) {
        subImagesRef.current.value = "";
      }
    }
  };

  const removeSubImage = (index) => {
    // If it's an existing image (has URL), add to deleted list
    if (typeof subImagesPreview[index] === "string") {
      setDeletedSubImages((prev) => [...prev, subImagesPreview[index]]);
    }
    setSubImagesPreview((prev) => prev.filter((_, i) => i !== index));
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    if (subImagesRef.current) subImagesRef.current.value = "";
  };

  // Brand popup handlers
  const openBrandPopup = () => {
    resetBrandForm();
    setBrandPopupVisible(true);
  };

  const closeBrandPopup = () => {
    resetBrandForm();
    setBrandPopupVisible(false);
  };

  const resetBrandForm = () => {
    setNewBrandName("");
    setNewBrandDescription("");
    setNewBrandImage(null);
    setNewBrandImagePreview(null);
    setEditingBrandId(null);
    setIsEditingBrand(false);
    if (newBrandImageRef.current) newBrandImageRef.current.value = "";
  };

  const handleEditBrand = (brand) => {
    setEditingBrandId(brand.idProduct_Brand);
    setNewBrandName(brand.Brand_Name);
    setNewBrandDescription(brand.ShortDescription || "");
    if (brand.Brand_Image_Url) {
      setNewBrandImagePreview(brand.Brand_Image_Url);
    }
    setIsEditingBrand(true);
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      await deleteBrand(brandId);
      toast.success("Brand deleted successfully");
      loadBrands();
    } catch (error) {
      if (error.message && error.message.includes("Cannot delete brand")) {
        toast.error("Cannot delete brand as it is used in products");
      } else {
        toast.error(error.message || "Failed to delete brand");
      }
    }
  };

  const handleAddOrUpdateBrand = async () => {
    if (newBrandName.trim() === "") {
      toast.error("Brand name is required");
      return;
    }

    try {
      const brandData = new FormData();
      brandData.append("brandName", newBrandName);
      brandData.append("shortDescription", newBrandDescription);
      brandData.append("userId", user.userId);

      if (newBrandImage) {
        brandData.append("brandImage", newBrandImage);
      }

      if (isEditingBrand) {
        await updateBrand(editingBrandId, brandData);
        toast.success("Brand updated successfully");
      } else {
        await createBrand(brandData);
        toast.success("Brand added successfully");
      }

      // Clear all fields
      resetBrandForm();
      loadBrands();
    } catch (error) {
      toast.error(
        error.message || `Failed to ${isEditingBrand ? "update" : "add"} brand`
      );
    }
  };

  const toggleColorLock = () => {
    if (!isColorLocked) {
      // Validate the colorName: if it's a valid hex (e.g. "#abc" or "#aabbcc") or a recognized color name.
      const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
      if (colorName.trim() && hexRegex.test(colorName.trim())) {
        setColorPickerValue(colorName.trim().toLowerCase());
        setIsColorLocked(true);
      } else {
        // If no valid value was typed, show an error.
        toast.error("Please enter a valid hex color");
        return;
      }
    } else {
      setIsColorLocked(false);
      setColorName("");
      setColorPickerValue("#ffffff");
    }
  };

  const handleColorPickerChange = (e) => {
    const newHex = e.target.value.toLowerCase();
    setColorPickerValue(newHex);
    setColorName(newHex);
  };

  // Variation Handlers
  const getInputStyle = () => {
    const bg = isColorLocked ? colorPickerValue : "#ffffff";
    const txt = bg === "#ffffff" ? "#000000" : "#ffffff";
    return { backgroundColor: bg, color: txt };
  };

  // Add variation (color/size/quantity) to table
  const handleAddVariation = () => {
    if (colorQuantity.trim()) {
      const newVar = {
        colorCode: isColorLocked ? colorPickerValue : "No color selected",
        size: size || "No size selected",
        quantity: colorQuantity,
      };
      setVariations((prev) => [...prev, newVar]);
      setSize("");
      setColorQuantity("");
      setColorPickerValue("#ffffff");
      setIsColorLocked(false);
      setColorName("");
    } else {
      toast.error("Quantity is required");
    }
  };

  // Edit variation (color/size/quantity)
  const handleEditVariation = (index) => {
    const variation = variations[index];

    if (variation.colorCode === "No color selected") {
      // clear out the color inputs
      setColorName("");
      setColorPickerValue("#ffffff");
      setIsColorLocked(false);
    } else {
      // populate with the saved hex
      setColorName(variation.colorCode);
      setColorPickerValue(variation.colorCode);
      setIsColorLocked(true);
    }

    // size and quantity as before
    setSize(variation.size === "No size selected" ? "" : variation.size);
    setColorQuantity(variation.quantity);
    setEditingVariationIndex(index);
  };

  // Update variation (color/size/quantity)
  const handleUpdateVariation = () => {
    if (!colorQuantity.trim()) {
      toast.error("Quantity is required");
      return;
    }

    setVariations((prev) => {
      return prev.map((v, i) => {
        if (i !== editingVariationIndex) return v;
        return {
          id: v.id,
          colorCode: isColorLocked ? colorPickerValue : "No color selected",
          size: size || "No size selected",
          quantity: colorQuantity,
        };
      });
    });

    setColorName("");
    setColorPickerValue("#ffffff");
    setIsColorLocked(false);
    setSize("");
    setColorQuantity("");
    setEditingVariationIndex(null);
  };

  // Remove variation row (If you delete the variation you're editing, drop back to “Add” and clear all fields)
  const removeVariation = (index) => {
    // if the variation has orders, prevent deletion
    if (variations[index].hasOrders) {
      toast.error("Cannot delete variation as it has been ordered");
      return;
    }

    setVariations((prev) => prev.filter((_, i) => i !== index));

    // if we were editing this row, reset all inputs & exit edit mode
    if (editingVariationIndex !== null && editingVariationIndex === index) {
      setColorName("");
      setColorPickerValue("#ffffff");
      setIsColorLocked(false);
      setSize("");
      setColorQuantity("");
      setEditingVariationIndex(null);
    }
  };

  // Add FAQ to table
  const handleAddFaq = () => {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      const newFaq = {
        question: faqQuestion,
        answer: faqAnswer,
      };
      setFaqs((prev) => [...prev, newFaq]);
      setFaqQuestion("");
      setFaqAnswer("");
    } else {
      toast.error("Question and answer are required");
    }
  };

  // Edit FAQ (question/answer)
  const handleEditFaq = (index) => {
    const faq = faqs[index];
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setEditingFaqIndex(index);
  };

  // Update FAQ (question/answer)
  const handleUpdateFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    setFaqs((prev) =>
      prev.map((f, i) =>
        i === editingFaqIndex
          ? { id: f.id, question: faqQuestion, answer: faqAnswer }
          : f
      )
    );

    setFaqQuestion("");
    setFaqAnswer("");
    setEditingFaqIndex(null);
  };

  // Remove FAQ row (If you delete the FAQ you're editing, drop back to “Add” and clear all fields)
  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));

    // if we were editing this row, reset all inputs & exit edit mode
    if (editingFaqIndex !== null && editingFaqIndex === index) {
      setFaqQuestion("");
      setFaqAnswer("");
      setEditingFaqIndex(null);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !description ||
      !selectedBrand ||
      !marketPrice ||
      !sellingPrice ||
      selectedSubCategories.length === 0 ||
      (!isEditMode && !mainImage) ||
      variations.length === 0 ||
      variations.some((v) => !v.quantity)
    ) {
      toast.error(
        "Main Description, Brand, Market Price, Selling Price, Sub Categories, Main Image, and Quantity are required"
      );
      return;
    }

    try {
      setIsLoading(true);

      // Build FormData
      const formData = new FormData();
      formData.append("Description", description);
      if (selectedBrand !== "other") {
        formData.append("Product_Brand_idProduct_Brand", selectedBrand);
      }
      formData.append("Market_Price", marketPrice.replace(/,/g, ''));
      formData.append("Selling_Price", sellingPrice.replace(/,/g, ''));
      formData.append("Long_Description", subDescription);
      formData.append("Seasonal_Offer", seasonalOffer.toString());
      formData.append("Rush_Delivery", rushDelivery.toString());
      formData.append("For_You", forYou.toString());
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }
      // For multiple sub images
      subImages.forEach((file) => {
        formData.append("subImages", file);
      });
      formData.append("deletedSubImages", JSON.stringify(deletedSubImages));
      // Append JSON stringified arrays
      formData.append(
        "variations",
        JSON.stringify(
          variations.map((v) => ({
            id: v.id,
            colorCode: v.colorCode,
            size: v.size,
            quantity: v.quantity,
          }))
        )
      );
      formData.append(
        "faqs",
        JSON.stringify(
          faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))
        )
      );
      formData.append("subCategoryIds", JSON.stringify(selectedSubCategories));

      if (isEditMode && id) {
        await updateProduct(id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product added successfully");
      }

      // Clear all fields
      setDescription("");
      setSelectedBrand("");
      setMarketPrice("");
      setSellingPrice("");
      setSubDescription("");
      setMainImage(null);
      setMainImagePreview(null);
      setSubImages([]);
      setSubImagesPreview([]);
      setVariations([]);
      setFaqs([]);
      setSelectedSubCategories([]);
      setSeasonalOffer(false);
      setRushDelivery(false);
      setForYou(false);
      setColorName("");
      setColorPickerValue("#ffffff");
      setIsColorLocked(false);
      setSize("");
      setColorQuantity("");

      if (mainImageRef.current) mainImageRef.current.value = "";
      if (subImagesRef.current) subImagesRef.current.value = "";

      // If edit mode, redirect to product page
      if (isEditMode) {
        navigate("/dashboard/products/edit-product");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
      <div className="card-body p-6 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-white border border-[#1D372E]">
            <div className="card-body p-4">
              <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Main Description
                    </span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>

                {/* Brand */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Brand
                    </span>
                  </label>
                  <div className="flex gap-2 text-[#1D372E]">
                    <Select
                      value={
                        selectedBrand === "other"
                          ? { value: "other", label: "Other" }
                          : brands
                              .map((brand) => ({
                                value: brand.idProduct_Brand,
                                label: brand.Brand_Name,
                              }))
                              .find(
                                (option) => option.value === selectedBrand
                              ) || null
                      }
                      onChange={(selected) =>
                        setSelectedBrand(selected ? selected.value : null)
                      }
                      options={[
                        { value: "other", label: "Other" },
                        ...brands.map((brand) => ({
                          value: brand.idProduct_Brand,
                          label: brand.Brand_Name,
                        })),
                      ]}
                      styles={customStyles}
                      placeholder="Select Brand"
                      className="flex-1 input-sm md:input-md"
                      isClearable={false}
                    />
                    <button
                      type="button"
                      onClick={openBrandPopup}
                      className="btn btn-primary mt-0.5 md:mt-0 btn-sm md:btn-md bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Market Price */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Market Price (LKR)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={marketPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (value === '' || /^\d*$/.test(value)) {
                        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setMarketPrice(formattedValue);
                      }
                    }}
                    placeholder="Enter market price"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>

                {/* Selling Price */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Selling Price (LKR)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={sellingPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (value === '' || /^\d*$/.test(value)) {
                        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        setSellingPrice(formattedValue);
                      }
                    }}
                    placeholder="Enter selling price"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>

                {/* Sub Categories */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Sub Categories
                    </span>
                  </label>
                  <Select
                    value={selectedSubCategories.map((sc) => ({
                      value: sc.idSub_Category,
                      label: sc.Description,
                    }))}
                    onChange={(selected) =>
                      setSelectedSubCategories(
                        selected.map((opt) => ({
                          idSub_Category: opt.value,
                          Description: opt.label,
                        }))
                      )
                    }
                    options={availableSubCategories.map((cat) => ({
                      label: cat.Description,
                      options: cat.subcategories
                        ? cat.subcategories
                            .filter(
                              (subcat) =>
                                !selectedSubCategories.some(
                                  (sc) =>
                                    sc.idSub_Category === subcat.idSub_Category
                                )
                            )
                            .map((subcat) => ({
                              value: subcat.idSub_Category,
                              label: subcat.Description,
                            }))
                        : [],
                    }))}
                    styles={customStyles}
                    isMulti
                    placeholder="Select sub category"
                    className="w-full text-[#1D372E] input-sm md:input-md"
                    formatGroupLabel={(data) => (
                      <div className="font-bold text-[#1D372E]">
                        {data.label}
                      </div>
                    )}
                    components={{
                      // Hide selected subcategory values
                      MultiValue: () => null,
                      // Hide the clear icon
                      ClearIndicator: () => null,
                      // Always show the placeholder instead of selected values
                      ValueContainer: ({ ...props }) => {
                        return (
                          <components.ValueContainer {...props}>
                            {props.selectProps.placeholder}
                          </components.ValueContainer>
                        );
                      },
                    }}
                  />

                  {/* Display of selected subcategories */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSubCategories.map((subcat, index) => (
                      <div
                        key={index}
                        className="badge badge-primary badge-xs md:badge-sm gap-2 px-2 md:px-3 py-3 md:py-4 bg-[#5CAF90] border-[#5CAF90]"
                      >
                        <span>{subcat.Description}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSubCategories((prev) =>
                              prev.filter(
                                (sc) =>
                                  sc.idSub_Category !== subcat.idSub_Category
                              )
                            )
                          }
                        >
                          <RiDeleteBack2Fill className="cursor-pointer w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Offers */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Special Offers
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2.5">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSeasonalOffer(!seasonalOffer)}
                    >
                      <span className="text-[#1D372E] text-sm">
                        Seasonal Offer
                      </span>
                      {seasonalOffer ? (
                        <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </div>

                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setRushDelivery(!rushDelivery)}
                    >
                      <span className="text-[#1D372E] text-sm">
                        Rush Delivery
                      </span>
                      {rushDelivery ? (
                        <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </div>

                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setForYou(!forYou)}
                    >
                      <span className="text-[#1D372E] text-sm">For You</span>
                      {forYou ? (
                        <FaCheckSquare className="text-[#5CAF90] w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <FaRegCheckSquare className="text-[#1D372E] w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images & Description */}
          <div className="card bg-white border border-[#1D372E]">
            <div className="card-body p-4">
              <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                Images and Description
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Image */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Main Image
                    </span>
                  </label>
                  <input
                    type="file"
                    onChange={handleMainImageChange}
                    ref={mainImageRef}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    accept="image/*"
                  />
                  {mainImagePreview && (
                    <div className="relative mt-2 w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={mainImagePreview}
                        alt="Main Preview"
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square absolute top-1 right-1"
                      >
                        <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub Images */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Sub Images
                    </span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleSubImagesChange}
                    ref={subImagesRef}
                    className="file-input file-input-bordered file-input-sm md:file-input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                    accept="image/*"
                  />
                  {subImagesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subImagesPreview.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 rounded-lg overflow-hidden"
                        >
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Sub Preview ${index}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubImage(index)}
                            className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square absolute top-1 right-1"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub Description */}
                <div className="form-control md:col-span-2">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text font-medium">
                      Sub Description
                    </span>
                  </label>
                  <textarea
                    value={subDescription}
                    onChange={(e) => setSubDescription(e.target.value)}
                    placeholder="Enter additional product details"
                    className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] text-sm md:text-base"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variations */}
          <div className="card bg-white border border-[#1D372E]">
            <div className="card-body p-4">
              <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                Product Variations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                {/* Color */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Color
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="Enter color hex value"
                      className="input input-bordered input-sm md:input-md flex-1 border-[#1D372E] text-[#1D372E]"
                      disabled={isColorLocked}
                      style={getInputStyle()}
                    />
                    <div className="relative">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 border border-base-300 rounded-md cursor-pointer"
                        style={{ backgroundColor: colorPickerValue }}
                        onClick={() =>
                          document.getElementById("colorPicker").click()
                        }
                      />
                      <input
                        id="colorPicker"
                        type="color"
                        value={colorPickerValue}
                        onChange={handleColorPickerChange}
                        className="absolute z-10 mt-2 left-0 opacity-0 pointer-events-none"
                        style={{ width: "0px", height: "0px" }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={toggleColorLock}
                      className="text-[#1D372E]"
                    >
                      {isColorLocked ? (
                        <FaCheckSquare className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <FaRegCheckSquare className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Size */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">Size</span>
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Enter size"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>

                {/* Quantity */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Quantity
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={colorQuantity}
                      onChange={(e) => setColorQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      className="input input-bordered input-sm md:input-md flex-1 bg-white border-[#1D372E] text-[#1D372E]"
                    />
                    <button
                      type="button"
                      onClick={
                        editingVariationIndex !== null
                          ? handleUpdateVariation
                          : handleAddVariation
                      }
                      className="btn btn-primary btn-sm md:btn-md bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
                    >
                      {editingVariationIndex !== null ? "Edit" : "Add"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Variations Table */}
              {variations.length > 0 && (
                <div className="mt-4">
                  {/* Desktop View */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="table text-center border border-[#1D372E]">
                        <thead className="bg-[#EAFFF7] text-[#1D372E]">
                          <tr className="border-b border-[#1D372E]">
                            <th className="font-semibold">Color Code</th>
                            <th className="font-semibold">Size</th>
                            <th className="font-semibold">Quantity</th>
                            <th className="font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#1D372E]">
                          {variations.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-[#1D372E]"
                            >
                              <td>
                                <div className="flex items-center justify-center gap-2 text-sm">
                                  {item.colorCode !== "No color selected" && (
                                    <div
                                      className="w-5 h-5 border border-base-300 rounded-md"
                                      style={{
                                        backgroundColor: item.colorCode,
                                      }}
                                    />
                                  )}
                                  <span>{item.colorCode}</span>
                                </div>
                              </td>
                              <td className="text-sm">{item.size}</td>
                              <td className="text-sm">{item.quantity}</td>
                              <td>
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditVariation(index)}
                                    className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                                    title="Edit Variation"
                                  >
                                    <FaEdit />
                                  </button>
                                  {item.hasOrders ? (
                                    <button
                                      type="button"
                                      onClick={() => removeVariation(index)}
                                      className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                                      title="Cannot delete as it has orders"
                                    >
                                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeVariation(index)}
                                      className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                                      title="Delete Variation"
                                    >
                                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    {variations.map((item, index) => (
                      <div
                        key={index}
                        className="card bg-white border border-[#1D372E] text-[#1D372E] p-4"
                      >
                        <div className="flex justify-between items-center text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Color:</span>
                            {item.colorCode !== "No color selected" && (
                              <div
                                className="w-5 h-5 border border-base-300 rounded-md"
                                style={{ backgroundColor: item.colorCode }}
                              />
                            )}
                            <span className="text-xs">{item.colorCode}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditVariation(index)}
                              className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                              title="Edit Variation"
                            >
                              <FaEdit className="w-3 h-3" />
                            </button>
                            {item.hasOrders ? (
                              <button
                                type="button"
                                onClick={() => removeVariation(index)}
                                className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                                title="Cannot delete as it has orders"
                              >
                                <RiDeleteBin5Fill className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeVariation(index)}
                                className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                                title="Delete Variation"
                              >
                                <RiDeleteBin5Fill className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-xs">Size:</span>
                          <span className="text-xs">{item.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">Quantity:</span>
                          <span className="text-xs">{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="card bg-white border border-[#1D372E]">
            <div className="card-body p-4">
              <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                Frequently Asked Questions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Question */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Question
                    </span>
                  </label>
                  <textarea
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="Enter question"
                    className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] text-sm md:text-base"
                    rows={3}
                  />
                </div>

                {/* Answer */}
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm font-medium">
                      Answer
                    </span>
                  </label>
                  <textarea
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] text-sm md:text-base"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={
                      editingFaqIndex !== null ? handleUpdateFaq : handleAddFaq
                    }
                    className="btn btn-primary btn-sm md:btn-md bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
                  >
                    {editingFaqIndex !== null ? "Edit" : "Add"}
                  </button>
                </div>
              </div>

              {/* FAQ List */}
              {faqs.length > 0 && (
                <div className="mt-4 space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="card bg-white border border-[#1D372E] text-[#1D372E]"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <FaQuestionCircle className="mt-1 text-[#5CAF90] w-5 h-5 md:w-4 md:h-4" />
                            <div>
                              <h4 className="font-medium text-xs md:text-sm">
                                {faq.question}
                              </h4>
                              <p className="mt-1 text-xs md:text-sm">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditFaq(index)}
                              className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                              title="Edit FAQ"
                            >
                              <FaEdit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className="btn bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-xs btn-square"
                              title="Delete FAQ"
                            >
                              <RiDeleteBin5Fill className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md ${
                isLoading ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : isEditMode ? (
                "Edit Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Brand Popup */}
      {brandPopupVisible && (
        <div className="modal modal-open">
          <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              {isEditingBrand ? "Edit Brand" : "Add Brand"}
            </h3>
            <button
              onClick={closeBrandPopup}
              className="absolute right-6 top-7 text-lg text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="form-control mb-3">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm lg:text-base font-medium">
                  Brand Name
                </span>
              </label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>

            <div className="form-control mb-3">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm lg:text-base font-medium">
                  Brand Image
                </span>
              </label>
              <input
                type="file"
                ref={newBrandImageRef}
                onChange={(e) => {
                  setNewBrandImage(e.target.files[0]);
                  if (e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewBrandImagePreview(reader.result);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  } else {
                    setNewBrandImagePreview(null);
                  }
                }}
                className="file-input file-input-bordered file-input-sm md:file-input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                accept="image/*"
              />

              {newBrandImagePreview && (
                <div className="relative mt-2 w-24 h-24 border border-base-300 rounded-lg overflow-hidden">
                  <img
                    src={newBrandImagePreview}
                    alt="Brand Preview"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewBrandImage(null);
                      setNewBrandImagePreview(null);
                      if (newBrandImageRef.current)
                        newBrandImageRef.current.value = "";
                    }}
                    className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square absolute top-1 right-1"
                  >
                    <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text text-sm lg:text-base font-medium">
                  Description
                </span>
              </label>
              <textarea
                value={newBrandDescription}
                onChange={(e) => setNewBrandDescription(e.target.value)}
                placeholder="Enter brand description"
                className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] text-sm md:text-base"
                rows={3}
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                onClick={handleAddOrUpdateBrand}
                className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md"
              >
                {isEditingBrand ? "Edit Brand" : "Add Brand"}
              </button>
            </div>

            {/* Brands Table */}
            {brands.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sm lg:text-base mb-2">
                  Existing Brands
                </h4>
                <div className="overflow-x-auto">
                  <table className="table text-center border border-[#1D372E] w-full">
                    <thead className="bg-[#EAFFF7] text-[#1D372E]">
                      <tr className="border-b border-[#1D372E]">
                        <th className="font-semibold text-xs lg:text-sm">
                          Name
                        </th>
                        <th className="font-semibold text-xs lg:text-sm">
                          Image
                        </th>
                        <th className="font-semibold text-xs lg:text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.map((brand) => (
                        <tr
                          key={brand.idProduct_Brand}
                          className="border-b border-[#1D372E]"
                        >
                          <td className="text-xs lg:text-sm">
                            {brand.Brand_Name}
                          </td>
                          <td>
                            {brand.Brand_Image_Url ? (
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-md">
                                  <img
                                    src={brand.Brand_Image_Url}
                                    alt={brand.Brand_Name}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs lg:text-sm opacity-70">
                                No image
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditBrand(brand)}
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                title="Edit Brand"
                              >
                                <FaEdit className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteBrand(brand.idProduct_Brand)
                                }
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                title="Delete Brand"
                              >
                                <RiDeleteBin5Fill className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
