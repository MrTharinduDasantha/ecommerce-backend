import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheckSquare, FaRegCheckSquare } from "react-icons/fa";
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
  };

  // Handle adding or updating a category
  const handleCategoryFormSubmit = async () => {
    if (!categoryDescription.trim()) {
      toast.error("Please enter category description");
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
      toast.error("Please enter a subcategory description");
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
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D372E] mb-4">
        {isEditing ? "Edit Category" : "Add Category and Sub Category"}
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
            onClick={handleCategoryFormSubmit}
            className="btn btn-primary bg-[#5CAF90] border-none"
          >
            {isEditing ? "Edit Category" : "Add Category"}
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
                  <td className="border-2 p-2">{cat.Description}</td>
                  <td className="border-2 p-2">
                    <div className="flex justify-center items-center">
                      {cat.Image_Icon_Url ? (
                        <img
                          src={cat.Image_Icon_Url}
                          alt="Category"
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        "No image"
                      )}
                    </div>
                  </td>
                  <td className="border-2 p-2">
                    {cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub, subIndex) => (
                        <div key={subIndex}>{sub.Description}</div>
                      ))
                    ) : (
                      <span>No Sub Category</span>
                    )}
                  </td>
                  <td className="border-2 p-2">
                    <span className="mr-2 cursor-pointer">Active</span>
                    {cat.Status === "active" ? (
                      <FaCheckSquare
                        className="inline-block cursor-pointer"
                        onClick={() => handleToggleStatus(cat)}
                      />
                    ) : (
                      <FaRegCheckSquare
                        className="inline-block cursor-pointer"
                        onClick={() => handleToggleStatus(cat)}
                      />
                    )}
                  </td>
                  <td className="border-2 p-2 max-w-[12rem]">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="btn btn-sm mr-2 bg-[#1D372E] text-white border-none"
                    >
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
                        placeholder="Enter sub category description"
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
                      categories[selectedCategoryIndex].subcategories.length >
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
                              ].subcategories.map((sub, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="border-2 p-2">
                                    {sub.Description}
                                  </td>
                                  <td className="border-2 p-2 max-w-[3rem]">
                                    <button
                                      onClick={() =>
                                        handleRemoveSubCategory(
                                          selectedCategoryIndex,
                                          sub
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
