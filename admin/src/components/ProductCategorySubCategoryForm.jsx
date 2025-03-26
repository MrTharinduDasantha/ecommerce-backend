import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";

const ProductCategorySubCategoryForm = () => {
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showSubCategoryPopup, setShowSubCategoryPopup] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [subCategoryDescription, setSubCategoryDescription] = useState("");

  // Hide scrollbar when popup is open, restore when closed
  useEffect(() => {
    if (showSubCategoryPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showSubCategoryPopup]);

  // Handle category image change
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setCategoryImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove the selected image
  const removeCategoryImage = () => {
    setCategoryImage(null);
    setCategoryImagePreview(null);
  };

  // Add a new category row to the categories table
  const handleAddCategory = () => {
    if (!categoryDescription.trim()) return;

    const newCategory = {
      description: categoryDescription,
      image: categoryImage,
      imagePreview: categoryImagePreview,
      active: true,
      subCategories: [],
    };

    setCategories([...categories, newCategory]);
    // Reset the form
    setCategoryDescription("");
    setCategoryImage(null);
    setCategoryImagePreview(null);
  };

  // Toggle the active status of a category
  const toggleCategoryStatus = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].active = !updatedCategories[index].active;
    setCategories(updatedCategories);
  };

  // Open subcategory popup
  const openSubCategoryPopup = (index) => {
    setSelectedCategoryIndex(index);
    setShowSubCategoryPopup(true);
  };

  // Close subcategory popup
  const closeSubCategoryPopup = () => {
    setShowSubCategoryPopup(false);
    setSelectedCategoryIndex(null);
    setSubCategoryDescription("");
  };

  // Add a subcategory to the selected category
  const handleAddSubCategory = () => {
    if (!subCategoryDescription.trim()) return;
    const updatedCategories = [...categories];
    updatedCategories[selectedCategoryIndex].subCategories.push({
      name: subCategoryDescription,
    });
    setCategories(updatedCategories);
    setSubCategoryDescription("");
  };

  // Remove a subcategory
  const removeSubCategory = (catgoryIndex, subCategoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[catgoryIndex].subCategories.splice(subCategoryIndex, 1);
    setCategories(updatedCategories);
  };
  return (
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D372E] mb-4">
        Add Category and Sub Category
      </h2>

      {/* Category Form */}
      <div className="flex flex-wrap gap-5 mb-8">
        <div className="flex-1 min-w-[250px] text-[#1D372E]">
          <label className="block text-lg font-medium mb-1">Description</label>
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
            className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
          />
        </div>

        <div className="flex-1 min-w-[250px] text-[#1D372E]">
          <label className="block text-lg font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleCategoryImageChange}
            className="file-input file-input-bordered w-full bg-white border-2 border-[#1D372E]"
          />
          {categoryImagePreview && (
            <div className="relative mt-4 w-32 h-32 border border-gray-300 rounded">
              <img
                src={categoryImagePreview}
                alt="Category Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={removeCategoryImage}
                className="absolute top-1 right-1 bg-[#5CAF90] p-1.5 cursor-pointer"
              >
                <RiDeleteBin5Fill size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-[30px]">
          <button
            onClick={handleAddCategory}
            className="btn btn-primary bg-[#5CAF90] border-none"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Category Table */}
      {categories.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-center border border-[#1D372E]">
            <thead className="bg-[#5CAF90] text-[#1D372E]">
              <tr>
                <th className="border-2 p-2">Category</th>
                <th className="border-2 p-2">Images</th>
                <th className="border-2 p-2">Sub Category</th>
                <th className="border-2 p-2">Status</th>
                <th className="border-2 p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#1D372E]">
              {categories.map((cat, index) => (
                <tr key={index}>
                  <td className="border-2 p-2">{cat.description}</td>
                  <td className="border-2 p-2">
                    <div className="flex justify-center items-center">
                      {cat.imagePreview ? (
                        <img
                          src={cat.imagePreview}
                          alt="Category"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        "No image"
                      )}
                    </div>
                  </td>
                  <td className="border-2 p-2">
                    {cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub, subIndex) => (
                        <div key={subIndex}>{sub.name}</div>
                      ))
                    ) : (
                      <span>No Sub Category</span>
                    )}
                  </td>
                  <td className="border-2 p-2">
                    <span className="mr-2 cursor-pointer">Active</span>
                    {cat.active ? (
                      <FaCheckSquare
                        className="inline-block cursor-pointe"
                        onClick={() => toggleCategoryStatus(index)}
                      />
                    ) : (
                      <FaRegCheckSquare
                        className="inline-block cursor-pointer"
                        onClick={() => toggleCategoryStatus(index)}
                      />
                    )}
                  </td>
                  <td className="border-2 p-2 max-w-[11rem]">
                    <button className="btn btn-sm mr-2 bg-[#1D372E] text-white border-none">
                      Edit Category
                    </button>
                    <button
                      onClick={() => openSubCategoryPopup(index)}
                      className="btn btn-sm bg-[#1D372E] text-white border-none"
                    >
                      Add Sub Category
                    </button>
                  </td>
                </tr>
              ))}

              {/* Sub Category Popup */}
              {showSubCategoryPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                  <div className="bg-white rounded-md p-8 w-[90%] max-w-lg relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-[#1D372E]">
                        Add Sub Category
                      </h3>
                      <button
                        onClick={closeSubCategoryPopup}
                        className="cursor-pointer"
                      >
                        <IoClose size={24} />
                      </button>
                    </div>

                    {/* Sub Category Form */}
                    <div className="flex items-center gap-4 mb-5">
                      <label className="block text-lg font-medium min-w-[100px]">
                        Description
                      </label>
                      <input
                        type="text"
                        value={subCategoryDescription}
                        onChange={(e) =>
                          setSubCategoryDescription(e.target.value)
                        }
                        placeholder="Enter sub category"
                        className="input input-bordered w-full bg-white border-2 border-[#1D372E]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddSubCategory}
                        className="btn bg-[#5CAF90] border-none font-medium"
                      >
                        Add Sub Category
                      </button>
                    </div>

                    {/* Sub Category Table */}
                    {selectedCategoryIndex !== null &&
                      categories[selectedCategoryIndex].subCategories.length >
                        0 && (
                        <div className="overflow-x-auto mt-8">
                          <table className="table-auto w-full border-collapse border border-[#1D372E]">
                            <thead className="bg-[#5CAF90] text-[#1D372E]">
                              <tr>
                                <th className="border-2 p-2">Sub Category</th>
                                <th className="border-2 p-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories[
                                selectedCategoryIndex
                              ].subCategories.map((sub, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="border-2 p-2">{sub.name}</td>
                                  <td className="border-2 p-2 max-w-[3rem]">
                                    <button
                                      onClick={() =>
                                        removeSubCategory(
                                          selectedCategoryIndex,
                                          subIndex
                                        )
                                      }
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
                  </div>
                </div>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductCategorySubCategoryForm;
