import { useRef, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill, RiDeleteBack2Fill } from "react-icons/ri";
import {
  FaRegCheckSquare,
  FaCheckSquare,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  createProduct,
  updateProduct,
  createBrand,
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
    borderRadius: "1rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "1rem",
    borderWidth: "2px",
    borderColor: "#1D372E",
  }),
  control: (provided) => ({
    ...provided,
    minHeight: "2.5rem",
    borderWidth: "2px",
    borderColor: "#1D372E",
    borderRadius: "1rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#1D372E",
    },
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "0.875rem",
  }),
};

const ProductForm = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Determine edit mode based on the id parameter
  const [isEditMode, setIsEditMode] = useState(!!id);

  // Product Fields
  const [description, setDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [subDescription, setSubDescription] = useState("");

  // Subcategories
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  // Single main image
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const mainImageRef = useRef(null);

  // Multiple sub images
  const [subImages, setSubImages] = useState([]);
  const [subImagesPreview, setSubImagesPreview] = useState([]);
  const subImagesRef = useRef(null);

  // Brands
  const [brands, setBrands] = useState([]);
  const [brandPopupVisible, setBrandPopupVisible] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");

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

  // FAQ states
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);

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
      setAvailableSubCategories(data.categories);
    } catch (error) {
      toast.error(error.message || "Failed to load subcategories");
    }
  };

  // Load product data if in edit mode
  useEffect(() => {
    if (id) {
      const loadProductData = async () => {
        try {
          const data = await getProduct(id);
          const product = data.product;
          // Set product fields
          setDescription(product.Description);
          setSelectedBrand(product.Product_Brand_idProduct_Brand);
          setMarketPrice(product.Market_Price);
          setSellingPrice(product.Selling_Price);
          setSubDescription(product.Long_Description);
          setMainImagePreview(product.Main_Image_Url);
          if (product.images) {
            setSubImagesPreview(product.images.map((img) => img.Image_Url));
          }
          // Set variations and FAQs if available
          if (product.variations) {
            setVariations(
              product.variations.map((variant) => ({
                colorCode: variant.Colour,
                size: variant.Size,
                quantity: variant.Qty,
              }))
            );
          }
          if (product.faqs) {
            setFaqs(
              product.faqs.map((faq) => ({
                question: faq.Question,
                answer: faq.Answer,
              }))
            );
          }
          // Set selected subcategories
          if (product.subcategories) {
            setSelectedSubCategories(product.subcategories);
          }
          setIsEditMode(true);
        } catch (error) {
          toast.error(error.message || "Failed to load product");
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
      setSubImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSubImagesPreview((prev) => [...prev, ...newPreviews]);
      // Reset the input to allow re-uploading the same files
      if (subImagesRef.current) {
        subImagesRef.current.value = "";
      }
    }
  };

  const removeSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    setSubImagesPreview((prev) => prev.filter((_, i) => i !== index));
    if (subImagesRef.current) subImagesRef.current.value = "";
  };

  // Brand popup handlers
  const openBrandPopup = () => {
    setBrandPopupVisible(true);
  };

  const closeBrandPopup = () => {
    setBrandPopupVisible(false);
    setNewBrandName("");
    setNewBrandDescription("");
  };

  // Hide scrollbar when popup is open, restore when closed
  useEffect(() => {
    if (brandPopupVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [brandPopupVisible]);

  const handleAddBrand = async () => {
    if (newBrandName.trim() === "") {
      toast.error("Brand name is required");
      return;
    }

    try {
      const brandData = {
        brandName: newBrandName,
        brandImage: newBrandImage,
        shortDescription: newBrandDescription,
        userId: user.userId,
      };
      await createBrand(brandData);
      toast.success("Brand added successfully");

      // Clear all fields
      setNewBrandName("");
      setNewBrandDescription("");
      setNewBrandImage(null);

      if (newBrandImageRef.current) newBrandImageRef.current.value = "";

      loadBrands();
    } catch (error) {
      toast.error(error.message || "Failed to add brand");
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
    let bg = isColorLocked ? colorPickerValue : "#ffffff";
    let txt = bg === "#ffffff" ? "#000000" : "#ffffff";
    return { backgroundColor: bg, color: txt };
  };

  // Add variation (color/size/quantity) to table
  const handleAddVariation = () => {
    if (size.trim() && colorQuantity.trim()) {
      const newVar = {
        colorCode: isColorLocked ? colorPickerValue : "No color selected",
        size: size,
        quantity: colorQuantity,
      };
      setVariations((prev) => [...prev, newVar]);
      setSize("");
      setColorQuantity("");
      setColorPickerValue("#ffffff");
      setIsColorLocked(false);
      setColorName("");
    } else {
      toast.error("Size and quantity are required");
    }
  };

  // Remove variation row
  const removeVariation = (index) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
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

  // Remove FAQ row
  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!description.trim() || !selectedBrand) {
      toast.error("Description and brand are required");
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("Description", description);
    formData.append("Product_Brand_idProduct_Brand", selectedBrand);
    formData.append("Market_Price", marketPrice);
    formData.append("Selling_Price", sellingPrice);
    formData.append("Long_Description", subDescription);
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    // For multiple sub images
    subImages.forEach((file) => {
      formData.append("subImages", file);
    });
    // Append JSON stringified arrays
    formData.append("variations", JSON.stringify(variations));
    formData.append("faqs", JSON.stringify(faqs));
    formData.append("subCategoryIds", JSON.stringify(selectedSubCategories));

    try {
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
    }
  };
  return (
    <div className="mx-auto my-5 p-6 md:p-8 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-5 lg:space-y-6"
      >
        {/* Description and Brand */}
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Main Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Brand
            </label>
            <div className="flex items-center gap-2">
              <Select
                value={
                  brands
                    .map((brand) => ({
                      value: brand.idProduct_Brand,
                      label: brand.Brand_Name,
                    }))
                    .find((option) => option.value === selectedBrand) || null
                }
                onChange={(selected) => setSelectedBrand(selected.value)}
                options={brands.map((brand) => ({
                  value: brand.idProduct_Brand,
                  label: brand.Brand_Name,
                }))}
                styles={customStyles}
                placeholder="Select Brand"
                className="w-full"
              />
              <button
                type="button"
                onClick={openBrandPopup}
                className="btn btn-primary bg-[#5CAF90] border-none text-sm md:text-base py-1 md:py-2 px-3 md:px-4 rounded-2xl"
              >
                Add Brand
              </button>
            </div>
          </div>
        </div>

        {/* Market Price and Sub Categories */}
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Market Price
            </label>
            <input
              type="number"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              placeholder="Enter market price"
              className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Sub Categories
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
                            (sc) => sc.idSub_Category === subcat.idSub_Category
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
              className="w-full"
              formatGroupLabel={(data) => (
                <div className="font-bold text-[#1D372E]">{data.label}</div>
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
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {selectedSubCategories.map((subcat, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-[#5CAF90] text-white px-2 md:px-3 py-2 rounded-2xl flex-shrink-0 text-xs md:text-sm"
                >
                  <span className="mr-1 md:mr-2">{subcat.Description}</span>
                  <RiDeleteBack2Fill
                    className="cursor-pointer w-3 h-3 md:w-4 md:h-4"
                    onClick={() =>
                      setSelectedSubCategories((prev) =>
                        prev.filter(
                          (sc) => sc.idSub_Category !== subcat.idSub_Category
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selling Price and Main Image */}
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Selling Price
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Enter selling price"
              className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Main Image
            </label>
            <input
              type="file"
              onChange={handleMainImageChange}
              ref={mainImageRef}
              className="file-input file-input-bordered w-full text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
            />
            {mainImagePreview && (
              <div className="relative mt-3 md:mt-4 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 border border-gray-300 rounded-2xl">
                <img
                  src={mainImagePreview}
                  alt="Main Preview"
                  className="object-cover w-full h-full rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-1 right-1 bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer rounded-2xl"
                >
                  <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub Images and Sub Description */}
        <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Sub Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleSubImagesChange}
              ref={subImagesRef}
              className="file-input file-input-bordered w-full text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
            />
            {subImagesPreview.length > 0 && (
              <div className="flex gap-2 mt-3 md:mt-4 overflow-x-auto pb-2 scrollbar">
                {subImagesPreview.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 border border-gray-300 rounded-2xl flex-shrink-0"
                  >
                    <img
                      src={preview}
                      alt={`Sub Preview ${index}`}
                      className="object-cover w-full h-full rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubImage(index)}
                      className="absolute top-1 right-1 bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer rounded-2xl"
                    >
                      <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium text-sm md:text-base mb-1">
              Sub Description
            </label>
            <textarea
              value={subDescription}
              onChange={(e) => setSubDescription(e.target.value)}
              placeholder="Enter additional product details"
              className="w-full textarea textarea-bordered py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
              rows={5}
            />
          </div>
        </div>

        {/* Variations Section */}
        <div className="mt-6 md:mt-7 lg:mt-8">
          <div className="bg-[#5CAF90] text-[#1D372E] p-2 md:p-3 border-2 border-[#1D372E] border-b-0 rounded-t-2xl">
            <h3 className="font-bold text-center text-sm md:text-base lg:text-lg">
              Product Variations
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5 items-center p-3 md:p-4 lg:p-5 border-2 border-[#1D372E] rounded-b-2xl">
            {/* Color */}
            <div className="flex-1 min-w-[200px] text-[#1D372E]">
              <label className="block font-medium text-sm md:text-base mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="Enter color hex value"
                  className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] placeholder:text-gray-400 rounded-2xl"
                  disabled={isColorLocked}
                  style={getInputStyle()}
                />
                <div className="relative">
                  <div
                    className="w-10 h-10 border-2 border-[#1D372E] rounded-2xl cursor-pointer"
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
                {isColorLocked ? (
                  <FaCheckSquare
                    className="cursor-pointer w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    onClick={toggleColorLock}
                  />
                ) : (
                  <FaRegCheckSquare
                    className="cursor-pointer w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    onClick={toggleColorLock}
                  />
                )}
              </div>
            </div>

            {/* Size */}
            <div className="flex-1 min-w-[200px] text-[#1D372E]">
              <label className="block font-medium text-sm md:text-base mb-1">
                Size
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Enter size"
                className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
              />
            </div>

            {/* Quantity */}
            <div className="flex-1 min-w-[200px] text-[#1D372E]">
              <label className="block font-medium text-sm md:text-base mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={colorQuantity}
                onChange={(e) => setColorQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
              />
            </div>

            <div className="mt-5 md:mt-6 lg:mt-7">
              <button
                type="button"
                onClick={handleAddVariation}
                className="btn btn-primary bg-[#5CAF90] border-none text-sm md:text-base py-1 md:py-2 px-3 md:px-4 rounded-2xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Variations Table */}
          {variations.length > 0 && (
            <div className="overflow-x-auto mt-3 md:mt-4">
              <table className="table-auto w-full text-center border border-[#1D372E]">
                <thead className="bg-[#5CAF90] text-[#1D372E]">
                  <tr>
                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                      Color Code
                    </th>
                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                      Size
                    </th>
                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                      Quantity
                    </th>
                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {variations.map((item, index) => (
                    <tr key={index}>
                      <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                        <div className="inline-flex items-center gap-1 md:gap-2">
                          {item.colorCode !== "No color selected" && (
                            <div
                              className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border border-[#1D372E]"
                              style={{ backgroundColor: item.colorCode }}
                            />
                          )}
                          <span>{item.colorCode}</span>
                        </div>
                      </td>
                      <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                        {item.size}
                      </td>
                      <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                        {item.quantity}
                      </td>
                      <td className="border-2 p-1 md:p-2">
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer ml-1 md:ml-2 lg:ml-3"
                          title="Remove Varation"
                        >
                          <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-6 md:mt-7 lg:mt-8">
          <div className="bg-[#5CAF90] text-[#1D372E] p-2 md:p-3 border-2 border-[#1D372E] border-b-0 rounded-t-2xl">
            <h3 className="font-bold text-center text-sm md:text-base lg:text-lg">
              Frequently Ask Question
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5 p-3 md:p-4 lg:p-5 border-2 border-[#1D372E] rounded-b-2xl">
            <div className="flex-1 min-w-[200px] text-[#1D372E]">
              <label className="block font-medium text-sm md:text-base mb-1">
                Question
              </label>
              <textarea
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                placeholder="Enter question"
                className="w-full textarea textarea-bordered py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                rows={5}
              />
            </div>
            <div className="flex-1 min-w-[200px] text-[#1D372E]">
              <label className="block font-medium text-sm md:text-base mb-1">
                Answer
              </label>
              <textarea
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                placeholder="Enter answer"
                className="w-full textarea textarea-bordered py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                rows={5}
              />
            </div>
            <div className="mt-5 md:mt-6 lg:mt-7">
              <button
                type="button"
                onClick={handleAddFaq}
                className="btn btn-primary bg-[#5CAF90] border-none text-sm md:text-base py-1 md:py-2 px-3 md:px-4 rounded-2xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Show FAQs */}
          {faqs.length > 0 && (
            <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-2 border-[#1D372E] rounded-2xl p-3 md:p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2 md:gap-3">
                      <FaQuestionCircle className="text-[#5CAF90] mt-0.5 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base text-[#1D372E]">
                          {faq.question}
                        </h4>
                        <div className="mt-1 md:mt-2">
                          <p className="text-xs md:text-sm lg:text-base text-[#1D372E]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="bg-[#5CAF90] text-[#1D372E] p-1 md:p-1.5 cursor-pointer rounded-2xl"
                      title="Remove FAQ"
                    >
                      <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-4 md:mt-5 lg:mt-6">
          <button
            type="submit"
            className="btn btn-primary bg-[#5CAF90] border-none text-sm md:text-base py-1 md:py-2 px-3 md:px-4 rounded-2xl"
          >
            {isEditMode ? "Edit Product" : "Add Product"}
          </button>
        </div>
      </form>

      {/* Brand Popup */}
      {brandPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md p-6 md:p-8 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto relative">
            {/* Popup Header */}
            <div className="flex justify-between items-center text-[#1D372E] mb-3 md:mb-4 lg:mb-5">
              <h3 className="text-lg md:text-xl font-bold">Add Brand</h3>
              <button onClick={closeBrandPopup} className="cursor-pointer">
                <IoClose className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </button>
            </div>
            {/* Add Brand Form */}
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 text-[#1D372E] mb-3 md:mb-4 lg:mb-5">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="block font-medium text-sm md:text-base min-w-[80px] md:min-w-[100px]">
                  Name
                </label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Enter brand name"
                  className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="block font-medium text-sm md:text-base min-w-[80px] md:min-w-[100px]">
                    Image
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
                    className="file-input file-input-bordered w-full text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                  />
                </div>
                {/* Brand Image Preview */}
                {newBrandImagePreview && (
                  <div className="relative mt-2 md:ml-[115px] w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 border border-gray-300 rounded-2xl">
                    <img
                      src={newBrandImagePreview || "/placeholder.svg"}
                      alt="Brand Preview"
                      className="object-cover w-full h-full rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewBrandImage(null);
                        setNewBrandImagePreview(null);
                        if (newBrandImageRef.current)
                          newBrandImageRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer rounded-2xl"
                    >
                      <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                <label className="block font-medium text-sm md:text-base min-w-[80px] md:min-w-[100px]">
                  Description
                </label>
                <textarea
                  value={newBrandDescription}
                  onChange={(e) => setNewBrandDescription(e.target.value)}
                  placeholder="Enter brand description"
                  className="textarea w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                  rows={3}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddBrand}
                className="btn bg-[#5CAF90] border-none font-medium text-sm md:text-base py-2 px-3 md:px-4 h-auto min-h-0 rounded-2xl"
              >
                Add Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
