import { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheckSquare, FaRegCheckSquare, FaEdit } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import toast from "react-hot-toast";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
} from "../api/product";

const ProductCategorySubCategoryForm = () => {
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const categoryImageRef = useRef(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showSubCategoryPopup, setShowSubCategoryPopup] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      toast.error(error.message || "Failed to fetch categories");
    }
  };

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
    if (categoryImageRef.current) categoryImageRef.current.value = "";
  };

  // Handle adding or updating a category
  const handleCategoryFormSubmit = async () => {
    if (!categoryDescription.trim()) {
      toast.error("Category description is required");
      return;
    }
    const formData = new FormData();
    formData.append("description", categoryDescription);
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    try {
      if (isEditing && editingCategoryId) {
        await updateCategory(editingCategoryId, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category added successfully");
      }
      // Reset the form and fetch categories
      setCategoryDescription("");
      setCategoryImage(null);
      if (categoryImageRef.current) categoryImageRef.current.value = "";
      setCategoryImagePreview(null);
      setIsEditing(false);
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to add category");
    }
  };

  // Load category into form for editing
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditingCategoryId(category.idProduct_Category);
    setCategoryDescription(category.Description);
    if (category.Image_Icon_Url) {
      setCategoryImagePreview(category.Image_Icon_Url);
    } else {
      setCategoryImagePreview(null);
    }
  };

  // Toggle the active/inactive status of a category
  const handleToggleStatus = async (category) => {
    try {
      const newStatus = category.Status === "active" ? "inactive" : "active";
      await toggleCategoryStatus(category.idProduct_Category, newStatus);
      toast.success("Category status updated");
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
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

  // Handle adding a subcategory
  const handleAddSubCategory = async () => {
    if (!subCategoryDescription.trim()) {
      toast.error("Subcategory description is required");
      return;
    }
    try {
      const categoryId = categories[selectedCategoryIndex].idProduct_Category;
      await createSubCategory(categoryId, subCategoryDescription);
      toast.success("Subcategory added successfully");
      fetchCategories();
      setSubCategoryDescription("");
    } catch (error) {
      toast.error(error.message || "Failed to add subcategory");
    }
  };

  // Handle removing a subcategory
  const handleRemoveSubCategory = async (categoryIndex, subCategory) => {
    try {
      await deleteSubCategory(
        categories[categoryIndex].idProduct_Category,
        subCategory.idSub_Category
      );
      toast.success("Subcategory removed successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to remove subcategory");
    }
  };
  return (
    <div className="max-w-5xl mx-auto my-5 p-6 md:p-8 lg:p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">
        {isEditing ? "Edit Category" : "Add Category and Sub Category"}
      </h2>

      {/* Category Form */}
      <div className="flex flex-col sm:flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 mb-8">
        <div className="w-full sm:flex-1 text-[#1D372E]">
          <label className="block font-medium text-sm md:text-base mb-1">
            Description
          </label>
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
            className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
          />
        </div>

        <div className="w-full sm:flex-1 text-[#1D372E]">
          <label className="block font-medium text-sm md:text-base mb-1">
            Image
          </label>
          <input
            type="file"
            onChange={handleCategoryImageChange}
            ref={categoryImageRef}
            className="file-input file-input-bordered w-full text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
          />
          {categoryImagePreview && (
            <div className="relative mt-4 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
              <img
                src={categoryImagePreview}
                alt="Category Preview"
                className="object-cover w-full h-full rounded-2xl"
              />
              <button
                type="button"
                onClick={removeCategoryImage}
                className="absolute top-1 right-1 bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer rounded-2xl"
              >
                <RiDeleteBin5Fill
                  size={18}
                  className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                />
              </button>
            </div>
          )}
        </div>

        <div className="sm:self-end sm:ml-auto mt-5 sm:mt-2 md:mt-1 lg:mt-[25px] lg:self-start">
          <button
            onClick={handleCategoryFormSubmit}
            className="btn btn-primary bg-[#5CAF90] border-none text-sm md:text-base py-1 md:py-2 px-3 md:px-4 rounded-2xl"
          >
            {isEditing ? "Edit Category" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Category Table */}
      {categories.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-[750px] text-center border border-[#1D372E]">
            <thead className="bg-[#5CAF90] text-[#1D372E]">
              <tr>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Category
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Images
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Sub Category
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Status
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[#1D372E]">
              {categories.map((cat, index) => (
                <tr key={index}>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    {cat.Description}
                  </td>
                  <td className="border-2 p-1 md:p-2">
                    <div className="flex justify-center items-center">
                      {cat.Image_Icon_Url ? (
                        <img
                          src={cat.Image_Icon_Url}
                          alt="Category"
                          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover"
                        />
                      ) : (
                        <span className="text-xs md:text-sm lg:text-base">
                          No image
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    {cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub, subIndex) => (
                        <div key={subIndex}>{sub.Description}</div>
                      ))
                    ) : (
                      <span>No Sub Category</span>
                    )}
                  </td>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    <span className="mr-1 md:mr-2 cursor-pointer">Active</span>
                    {cat.Status === "active" ? (
                      <FaCheckSquare
                        className="inline-block cursor-pointer w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-[18px]"
                        onClick={() => handleToggleStatus(cat)}
                      />
                    ) : (
                      <FaRegCheckSquare
                        className="inline-block cursor-pointer w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-[18px]"
                        onClick={() => handleToggleStatus(cat)}
                      />
                    )}
                  </td>
                  <td className="border-2 p-2 max-w-[1rem]">
                    <div className="flex items-center gap-1 md:gap-2 justify-center">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer"
                        title="Edit Category"
                      >
                        <FaEdit className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </button>
                      <button
                        onClick={() => openSubCategoryPopup(index)}
                        className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer ml-1 md:ml-2 lg:ml-3"
                        title="Add Sub Category"
                      >
                        <MdAddBox className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Sub Category Popup */}
              {showSubCategoryPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                  <div className="bg-white rounded-md p-6 md:p-8 w-[90%] max-w-lg relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-[#1D372E]">
                        Add Sub Category
                      </h3>
                      <button
                        onClick={closeSubCategoryPopup}
                        className="cursor-pointer"
                      >
                        <IoClose className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                      </button>
                    </div>

                    {/* Sub Category Form */}
                    <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 lg:mb-5">
                      <label className="block font-medium text-sm md:text-base min-w-[80px] md:min-w-[100px]">
                        Description
                      </label>
                      <input
                        type="text"
                        value={subCategoryDescription}
                        onChange={(e) =>
                          setSubCategoryDescription(e.target.value)
                        }
                        placeholder="Enter sub category description"
                        className="input input-bordered w-full py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] rounded-2xl"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddSubCategory}
                        className="btn bg-[#5CAF90] border-none font-medium text-sm md:text-base py-2 px-3 md:px-4 h-auto min-h-0 rounded-2xl"
                      >
                        Add Sub Category
                      </button>
                    </div>

                    {/* Sub Category Table */}
                    {selectedCategoryIndex !== null &&
                      categories[selectedCategoryIndex]?.subcategories?.length >
                        0 && (
                        <div className="overflow-x-auto mt-4 md:mt-6 lg:mt-8">
                          <table className="table-auto w-full min-w-[300px] border-collapse border border-[#1D372E]">
                            <thead className="bg-[#5CAF90] text-[#1D372E]">
                              <tr>
                                <th className="border-2 p-1 md:p-2 text-sm md:text-base">
                                  Sub Category
                                </th>
                                <th className="border-2 p-1 md:p-2 text-sm md:text-base">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories[
                                selectedCategoryIndex
                              ].subcategories.map((sub, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="border-2 p-1 md:p-2 text-sm md:text-base">
                                    {sub.Description}
                                  </td>
                                  <td className="border-2 p-1 md:p-2 max-w-[1rem]">
                                    <button
                                      onClick={() =>
                                        handleRemoveSubCategory(
                                          selectedCategoryIndex,
                                          sub
                                        )
                                      }
                                      className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer ml-1 md:ml-2 lg:ml-3"
                                      title="Delete Sub Category"
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
