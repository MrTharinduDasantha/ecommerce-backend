"use client";

import { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {
  FaCheckSquare,
  FaRegCheckSquare,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  createSubCategory,
  deleteSubCategory,
} from "../api/product";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      toast.error(error.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
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

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("description", categoryDescription);
      if (categoryImage) {
        formData.append("image", categoryImage);
      }

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
    } finally {
      setIsSubmitting(false);
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
      setIsSubmitting(true);
      const categoryId = categories[selectedCategoryIndex].idProduct_Category;
      await createSubCategory(categoryId, subCategoryDescription);
      toast.success("Subcategory added successfully");
      fetchCategories();
      setSubCategoryDescription("");
    } catch (error) {
      toast.error(error.message || "Failed to add subcategory");
    } finally {
      setIsSubmitting(false);
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
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-xl font-bold text-[#1D372E]">
            {isEditing ? "Edit Category" : "Add Category and Sub Category"}
          </h2>
        </div>

        {/* Category Form */}
        <div className="card bg-white border border-[#1D372E] mb-6">
          <div className="card-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text font-medium">Description</span>
                </label>
                <input
                  type="text"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                  className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
              </div>

              <div className="form-control">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text font-medium">Image</span>
                </label>
                <input
                  type="file"
                  onChange={handleCategoryImageChange}
                  ref={categoryImageRef}
                  className="file-input file-input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                {categoryImagePreview && (
                  <div className="relative mt-2 w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={categoryImagePreview}
                      alt="Category Preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={removeCategoryImage}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square absolute top-1 right-1"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={handleCategoryFormSubmit}
                  className={`btn btn-primary bg-[#5CAF90] border-none text-white ${
                    isSubmitting ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : isEditing ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-fixed min-w-[750px] text-center border border-[#1D372E]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#1D372E]">
                  <th className="font-semibold w-[125px]">Category</th>
                  <th className="font-semibold w-[100px]">Image</th>
                  <th className="font-semibold w-[325px]">Sub Categories</th>
                  <th className="font-semibold w-[100px]">Status</th>
                  <th className="font-semibold w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {categories.map((cat, index) => (
                  <tr key={index} className="border-b border-[#1D372E]">
                    <td>{cat.Description}</td>
                    <td>
                      {cat.Image_Icon_Url ? (
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-md">
                            <img
                              src={cat.Image_Icon_Url || "/placeholder.svg"}
                              alt="Category"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm opacity-70">No image</span>
                      )}
                    </td>
                    <td>
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cat.subcategories.map((sub, subIndex) => (
                            <span
                              key={subIndex}
                              className="badge badge-outline"
                            >
                              {sub.Description}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm opacity-70">
                          No subcategories
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <span>Active</span>
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className="text-[#5CAF90]"
                        >
                          {cat.Status === "active" ? (
                            <FaCheckSquare className="w-4 h-4" />
                          ) : (
                            <FaRegCheckSquare className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openSubCategoryPopup(index)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Add Sub Category"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No categories found. Add your first category above.</span>
          </div>
        )}
      </div>

      {/* Sub Category Popup */}
      {showSubCategoryPopup && (
        <div className="modal modal-open">
          <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-lg mb-4">Add Sub Category</h3>
            <button
              onClick={closeSubCategoryPopup}
              className="absolute right-6 top-7 text-lg text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Description</span>
              </label>
              <input
                type="text"
                value={subCategoryDescription}
                onChange={(e) => setSubCategoryDescription(e.target.value)}
                placeholder="Enter sub category description"
                className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>

            <div className="modal-action">
              <button
                onClick={handleAddSubCategory}
                className={`btn btn-primary bg-[#5CAF90] border-none text-white ${
                  isSubmitting ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Adding...
                  </>
                ) : (
                  "Add Sub Category"
                )}
              </button>
            </div>

            {/* Sub Category Table */}
            {selectedCategoryIndex !== null &&
              categories[selectedCategoryIndex]?.subcategories?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Existing Sub Categories</h4>
                  <div className="overflow-x-auto">
                    <table className="table text-center border border-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="font-semibold">Sub Category</th>
                          <th className="font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories[selectedCategoryIndex].subcategories.map(
                          (sub, subIndex) => (
                            <tr
                              key={subIndex}
                              className="border-b border-[#1D372E]"
                            >
                              <td>{sub.Description}</td>
                              <td>
                                <button
                                  onClick={() =>
                                    handleRemoveSubCategory(
                                      selectedCategoryIndex,
                                      sub
                                    )
                                  }
                                  className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                  title="Delete Sub Category"
                                >
                                  <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          )
                        )}
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

export default ProductCategorySubCategoryForm;
