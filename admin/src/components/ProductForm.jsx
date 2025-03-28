import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill, RiDeleteBack2Fill } from "react-icons/ri";
import { FaRegCheckSquare, FaCheckSquare } from "react-icons/fa";

const ProductForm = () => {
  // Main form states
  // eslint-disable-next-line no-unused-vars
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Subcategories
  const categoryData = [
    { category: "Electronics", subCategories: ["Mobile", "Laptop"] },
    { category: "Clothing", subCategories: ["Men's Wear", "Women's Wear"] },
  ];
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Single main image
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  // Multiple sub images
  const [subImages, setSubImages] = useState([]);
  const [subImagesPreview, setSubImagesPreview] = useState([]);

  // Brands
  const [brands, setBrands] = useState([
    { name: "Apple" },
    { name: "Samsung" },
    { name: "Nike" },
    { name: "Adidas" },
  ]);
  const [brandPopupVisible, setBrandPopupVisible] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Color/Size/Quantity states
  const [colorName, setColorName] = useState("");
  const [colorPickerValue, setColorPickerValue] = useState("#ffffff");
  const [isColorLocked, setIsColorLocked] = useState(false);
  const [size, setSize] = useState("");
  const [colorQuantity, setColorQuantity] = useState("");

  // Table for color/size/quantity
  const [variations, setVariations] = useState([]);

  // FAQ states
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);

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
  };

  // Handlers for sub images
  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSubImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSubImagesPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    setSubImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Handlers for subcategory multi-select
  const handleSubcategorySelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedSubcategories.includes(selectedValue)) {
      setSelectedSubcategories((prev) => [...prev, selectedValue]);
    }
  };

  const removeSubcategory = (subcat) => {
    setSelectedSubcategories((prev) => prev.filter((sc) => sc !== subcat));
  };

  // Brand popup handlers
  const openBrandPopup = () => {
    setBrandPopupVisible(true);
  };

  const closeBrandPopup = () => {
    setBrandPopupVisible(false);
    setNewBrandName("");
  };

  // Hide scrollbar when popup is open, restore when closed
  useEffect(() => {
    if (brandPopupVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [brandPopupVisible]);

  const handleAddBrand = () => {
    if (newBrandName.trim() !== "") {
      setBrands((prev) => [...prev, { name: newBrandName }]);
    }
    closeBrandPopup();
  };

  // Helper mapping for color names to hex
  const colorNameMap = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
  };

  // A helper to decide how the input should be styled based on current color
  const getInputStyle = () => {
    // If locked, always use colorPickerValue as background
    let bg = isColorLocked ? colorPickerValue : "#ffffff";
    let txt = "#ffffff";

    // If not locked, but user typed a recognized color or a valid hex,
    // we show that in the input’s background. Otherwise, keep it white.
    if (!isColorLocked && colorName.trim()) {
      const typed = colorName.trim().toLowerCase();
      const recognizedHex = colorNameMap[typed];
      const isHex =
        typed.startsWith("#") && (typed.length === 4 || typed.length === 7);

      if (recognizedHex) {
        bg = recognizedHex;
      } else if (isHex) {
        bg = typed;
      } else {
        // Unrecognized => keep default white background
        bg = "#ffffff";
        txt = "#000000";
      }
    }

    // Now decide text color:
    // If the final background is white, use black text so it's visible
    if (bg.toLowerCase() === "#ffffff") {
      txt = "#000000";
    } else {
      // Otherwise, use white text
      txt = "#ffffff";
    }

    return {
      backgroundColor: bg,
      color: txt,
    };
  };

  const toggleColorLock = () => {
    if (!isColorLocked) {
      const typedColor = colorName.trim().toLowerCase();
      const recognizedHex = colorNameMap[typedColor];
      const isHex =
        typedColor.startsWith("#") &&
        (typedColor.length === 4 || typedColor.length === 7);

      if (recognizedHex) {
        // Lock to recognized color
        setColorPickerValue(recognizedHex);
        setIsColorLocked(true);
      } else if (isHex) {
        // Lock to typed hex
        setColorPickerValue(typedColor);
        setIsColorLocked(true);
      } else {
        // Not recognized => clear the input
        setColorName("");
      }
    } else {
      // Already locked => unlock, reset everything
      setIsColorLocked(false);
      setColorName("");
      setColorPickerValue("#ffffff");
    }
  };

  const handleColorPickerChange = (e) => {
    const newHex = e.target.value.toLowerCase();
    setColorPickerValue(newHex);

    // If it matches a known name, show that name in the input
    const foundName = Object.keys(colorNameMap).find(
      (cName) => colorNameMap[cName] === newHex
    );
    if (foundName) {
      // E.g. "white" => "White"
      setColorName(foundName.charAt(0).toUpperCase() + foundName.slice(1));
    } else {
      // Just store the hex code in the input
      setColorName(newHex);
    }
  };

  // Add variation (color/size/quantity) to table
  const handleAddVariation = () => {
    // Only add if color is locked and size & quantity are filled
    if (isColorLocked && size.trim() !== "" && colorQuantity.trim() !== "") {
      const newVar = {
        colorCode: colorPickerValue,
        size: size,
        quantity: colorQuantity,
      };
      setVariations((prev) => [...prev, newVar]);
      // Reset size & quantity fields
      setSize("");
      setColorQuantity("");
      // Optionally keep color locked or unlock, depending on your preference
      // We'll keep it locked so user can keep adding with the same color if desired
    }
  };

  // Remove variation row
  const removeVariation = (index) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  // Add FAQ to table
  const handleAddFaq = () => {
    if (faqQuestion.trim() !== "" && faqAnswer.trim() !== "") {
      const newFaq = {
        question: faqQuestion,
        answer: faqAnswer,
      };
      setFaqs((prev) => [...prev, newFaq]);
      // Reset inputs
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };

  // Remove FAQ row
  const removeFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save product in DB
    // Here you would collect all form data and send to server
    console.log({
      productName,
      description,
      selectedBrand,
      selectedSubcategories,
      marketPrice,
      sellingPrice,
      mainImage,
      subImages,
      subDescription,
      variations,
      faqs,
    });
  };

  return (
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D372E] mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description and Brand */}
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Main Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Brand</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="select select-bordered w-full bg-white border-2 border-[#1D372E]"
              >
                <option value="">Select Brand</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={openBrandPopup}
                className="btn btn-primary bg-[#5CAF90] border-none"
              >
                Add Brand
              </button>
            </div>
          </div>
        </div>

        {/* Market Price and Sub Categories */}
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Market Price
            </label>
            <input
              type="number"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              placeholder="Enter market price"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Sub Categories
            </label>
            <select
              className="w-full select select-bordered bg-white border-2 border-[#1D372E]"
              onChange={handleSubcategorySelect}
            >
              <option value="">Select Sub Category</option>
              {categoryData.map((cat, cIndex) => (
                <optgroup key={cIndex} label={cat.category}>
                  {cat.subCategories.map((subcat, sIndex) => (
                    <option key={sIndex} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Display selected subcategories below the input */}
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {selectedSubcategories.map((subcat, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-[#5CAF90] text-white px-3 py-2 rounded flex-shrink-0"
                >
                  <span className="mr-2">{subcat}</span>
                  <RiDeleteBack2Fill
                    className="cursor-pointer"
                    onClick={() => removeSubcategory(subcat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selling Price and Main Image */}
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Selling Price
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="Enter selling price"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Main Image</label>
            <input
              type="file"
              onChange={handleMainImageChange}
              className="file-input file-input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
            {mainImagePreview && (
              <div className="relative mt-4 w-32 h-32 border border-gray-300 rounded">
                <img
                  src={mainImagePreview}
                  alt="Main Preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-1 right-1 bg-[#5CAF90] p-1.5 cursor-pointer"
                >
                  <RiDeleteBin5Fill size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub Images and Sub Description */}
        <div className="flex flex-wrap gap-5">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Sub Images</label>
            <input
              type="file"
              multiple
              onChange={handleSubImagesChange}
              className="file-input file-input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
            {/* Show previews of sub images */}
            {subImagesPreview.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar">
                {subImagesPreview.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-32 border border-gray-300 rounded flex-shrink-0"
                  >
                    <img
                      src={preview}
                      alt={`Sub Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubImage(index)}
                      className="absolute top-1 right-1 bg-[#5CAF90] p-1.5 cursor-pointer"
                    >
                      <RiDeleteBin5Fill size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Sub Description
            </label>
            <textarea
              value={subDescription}
              onChange={(e) => setSubDescription(e.target.value)}
              placeholder="Enter additional product details"
              className="w-full textarea textarea-bordered bg-white border-2 border-[#1D372E]"
              rows={5}
            />
          </div>
        </div>

        {/* Variations (Color/Size/Quantity) Table */}
        <div className="flex flex-wrap gap-5 items-center">
          {/* Color */}
          <div className="flex-1 min-w-[200px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Color</label>
            <div className="flex items-center gap-2">
              {/* Color Name Input */}
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Enter color name or hex"
                className="input input-bordered w-full bg-white border-2 border-[#1D372E] placeholder:text-gray-400"
                disabled={isColorLocked}
                style={getInputStyle()} // <-- Use dynamic style
              />

              {/* Color Display Box */}
              <div className="relative">
                <div
                  className="w-10 h-10 border-2 border-[#1D372E] rounded cursor-pointer"
                  style={{ backgroundColor: colorPickerValue }}
                  onClick={() => {
                    // Programmatically open the hidden color input
                    const picker = document.getElementById("colorPicker");
                    if (picker) picker.click();
                  }}
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

              {/* Toggle Icon */}
              {isColorLocked ? (
                <FaCheckSquare
                  className="cursor-pointer text-2xl"
                  onClick={toggleColorLock}
                />
              ) : (
                <FaRegCheckSquare
                  className="cursor-pointer text-2xl"
                  onClick={toggleColorLock}
                />
              )}
            </div>
          </div>

          {/* Size */}
          <div className="flex-1 min-w-[200px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter size"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          {/* Quantity */}
          <div className="flex-1 min-w-[200px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Quantity</label>
            <input
              type="number"
              value={colorQuantity}
              onChange={(e) => setColorQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          {/* Add Variation Button */}
          <div className="mt-7">
            <button
              type="button"
              onClick={handleAddVariation}
              className="btn bg-[#5CAF90] border-none font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Variations Table */}
        {variations.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full text-center border border-[#1D372E]">
              <thead className="bg-[#5CAF90] text-[#1D372E]">
                <tr>
                  <th className="border-2 p-2">Color Code</th>
                  <th className="border-2 p-2">Size</th>
                  <th className="border-2 p-2">Quantity</th>
                  <th className="border-2 p-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {variations.map((item, index) => (
                  <tr key={index}>
                    <td className="border-2 p-2">
                      <div className="inline-flex items-center gap-2">
                        {/* Small color box */}
                        <div
                          className="w-6 h-6 border border-gray-300"
                          style={{ backgroundColor: item.colorCode }}
                        />
                        {/* Hex value text */}
                        <span>{item.colorCode}</span>
                      </div>
                    </td>
                    <td className="border-2 p-2">{item.size}</td>
                    <td className="border-2 p-2">{item.quantity}</td>
                    <td className="border-2 p-2">
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="btn btn-sm bg-[#1D372E] text-white border-none"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Frequently Ask Question Section --- */}
        <div className="flex flex-wrap gap-5 mt-6">
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">
              Frequently Ask Question
            </label>
            <input
              type="text"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
              placeholder="Enter Frequently Ask Question"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block text-lg font-medium mb-1">Answer</label>
            <input
              type="text"
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              placeholder="Enter Answer"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
            />
          </div>

          <div className="mt-7">
            <button
              type="button"
              onClick={handleAddFaq}
              className="btn bg-[#5CAF90] border-none font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* FAQ Table */}
        {faqs.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full text-center border border-[#1D372E]">
              <thead className="bg-[#5CAF90] text-[#1D372E]">
                <tr>
                  <th className="border-2 p-2">Frequently Ask Question</th>
                  <th className="border-2 p-2">Answer</th>
                  <th className="border-2 p-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {faqs.map((faq, index) => (
                  <tr key={index}>
                    <td className="border-2 p-2">{faq.question}</td>
                    <td className="border-2 p-2">{faq.answer}</td>
                    <td className="border-2 p-2">
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="btn btn-sm bg-[#1D372E] text-white border-none"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn bg-[#5CAF90] border-none font-medium"
          >
            Save Product
          </button>
        </div>
      </form>

      {/* Brand Popup */}
      {brandPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md p-8 w-[90%] max-w-lg relative">
            {/* Popup Header */}
            <div className="flex justify-between items-center text-[#1D372E] mb-6">
              <h3 className="text-xl font-bold">Add Brand</h3>
              <button onClick={closeBrandPopup} className="cursor-pointer">
                <IoClose size={24} />
              </button>
            </div>

            {/* Add Brand Form */}
            <div className="flex items-center text-[#1D372E] mb-5">
              <label className="block text-lg font-medium min-w-[125px]">
                Brand Name
              </label>
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAddBrand}
                className="btn bg-[#5CAF90] border-none font-medium"
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
