import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateHomePageSetting, fetchHomePageSetting } from "../api/setting";
import TimelineDisplay from "./TimelineDisplay";

const NewHomePageSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Hero Images State
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [heroImagePreviews, setHeroImagePreviews] = useState([]);

  // Working Section State
  const [workingSectionTitle, setWorkingSectionTitle] = useState("");
  const [workingSectionDescription, setWorkingSectionDescription] = useState("");
  const [workingItems, setWorkingItems] = useState([]);
  const [newWorkingItem, setNewWorkingItem] = useState({
    title: "",
    description: "",
    image: null,
    imageFile: null,
  });

  // Refs
  const heroImagesRef = useRef(null);
  const workingImageRef = useRef(null);

  const navigate = useNavigate();

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setIsLoadingData(true);
        const existingData = await fetchHomePageSetting();
        
        if (existingData) {
          // Load Hero Images
          if (existingData.Hero_Images) {
            const parsedHeroImages = typeof existingData.Hero_Images === 'string' 
              ? JSON.parse(existingData.Hero_Images) 
              : existingData.Hero_Images;
            if (Array.isArray(parsedHeroImages) && parsedHeroImages.length > 0) {
              // Set existing image URLs as previews
              setHeroImagePreviews(parsedHeroImages);
            }
          }

          // Load Working Section data
          if (existingData.Working_Section_Title) setWorkingSectionTitle(existingData.Working_Section_Title);
          if (existingData.Working_Section_Description) setWorkingSectionDescription(existingData.Working_Section_Description);

          // Load Working Items
          if (existingData.Working_Items) {
            const parsedWorkingItems = typeof existingData.Working_Items === 'string' 
              ? JSON.parse(existingData.Working_Items) 
              : existingData.Working_Items;
            setWorkingItems(Array.isArray(parsedWorkingItems) ? parsedWorkingItems : []);
          }

          // Show success message if data was loaded
          const hasData = existingData.Working_Section_Title || 
                          (parsedHeroImages?.length > 0) || 
                          (parsedWorkingItems?.length > 0);
          if (hasData) {
            toast.success("Loaded your existing Home Page settings from database!");
          }
        }
      } catch (error) {
        // If no existing data or error, start fresh (this is fine for first-time setup)
        console.log("No existing Home Page data found, starting fresh");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadExistingData();
  }, []);

  // Hero images handlers
  const handleHeroImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3) {
      toast.error("Please select at least 3 images");
      return;
    }
    if (files.length > 5) {
      toast.error("Please select maximum 5 images");
      return;
    }
    setHeroImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setHeroImagePreviews(previews);
  };

  const removeHeroImages = () => {
    setHeroImageFiles([]);
    setHeroImagePreviews([]);
    if (heroImagesRef.current) heroImagesRef.current.value = "";
  };

  const removeNewWorkingItemImage = () => {
    setNewWorkingItem({
      ...newWorkingItem,
      imageFile: null,
      image: null,
    });
    if (workingImageRef.current) workingImageRef.current.value = "";
  };

  const handleAddWorkingItem = () => {
    if (workingItems.length >= 4) {
      toast.error("You can add a maximum of 4 working items");
      return;
    }
    if (
      !newWorkingItem.title.trim() ||
      !newWorkingItem.description.trim() ||
      !newWorkingItem.imageFile
    ) {
      toast.error("All fields are required");
      return;
    }
    setWorkingItems([...workingItems, { ...newWorkingItem }]);
    setNewWorkingItem({ title: "", description: "", image: null, imageFile: null });
    if (workingImageRef.current) workingImageRef.current.value = "";
  };

  const handleRemoveWorkingItem = (index) => {
    const updatedItems = [...workingItems];
    updatedItems.splice(index, 1);
    setWorkingItems(updatedItems);
  };

  const handleNewWorkingImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewWorkingItem({
        ...newWorkingItem,
        imageFile: file,
        image: URL.createObjectURL(file),
      });
    }
  };

  // Save handler (POST only)
  const handleSave = async (e) => {
    e.preventDefault();
    if (
      heroImageFiles.length < 3 ||
      workingSectionTitle.trim() === "" ||
      workingSectionDescription.trim() === "" ||
      workingItems.length === 0 ||
      workingItems.some(
        (item) => !item.title.trim() || !item.description.trim() || !item.imageFile
      )
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      heroImageFiles.forEach((file, index) => {
        formData.append(`heroImage${index}`, file);
      });
      formData.append("workingSectionTitle", workingSectionTitle);
      formData.append("workingSectionDescription", workingSectionDescription);
      workingItems.forEach((item, index) => {
        if (item.imageFile) {
          formData.append(`workingImage${index}`, item.imageFile);
        }
      });
      const workingItemsData = workingItems.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image,
      }));
      formData.append("workingItems", JSON.stringify(workingItemsData));
      await updateHomePageSetting(formData);
      toast.success("Settings saved successfully");
      // Move to next page
      navigate("/PolicyDetailsSettings");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Empty state message component
  const EmptyStateMessage = ({ message }) => (
    <div className="bg-gray-50 text-[#1D372E] p-4 rounded-md text-center border border-dashed border-[#5CAF90] my-3">
      <p>{message}</p>
    </div>
  );

  return (
    <>
      {/* Timeline at the top */}
      <div className="w-full" style={{ background: "#1D372E", paddingTop: 24, paddingBottom: 8 }}>
        <TimelineDisplay currentStep="home" />
      </div>
      <div style={{ background: "#1D372E", minHeight: "100vh" }}>
        <div className="card bg-white shadow-md relative mx-auto w-[90vw] sm:w-[600px] md:w-[900px] lg:w-[1100px]">
          <div className="card-body">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[#5CAF90]"></div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
                    Home Page Settings (Create Only)
                  </h2>
                  {!isLoadingData && (
                    heroImagePreviews.length > 0 || workingItems.length > 0 || workingSectionTitle
                  ) && (
                    <p className="text-sm text-[#5CAF90] mt-1">
                      ✓ Existing settings loaded from database
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isLoadingData ? (
              <div className="flex justify-center items-center py-12">
                <div className="loading loading-spinner loading-lg text-[#5CAF90]"></div>
                <span className="ml-3 text-[#1D372E]">Loading your existing Home Page settings...</span>
              </div>
            ) : (
              <form onSubmit={handleSave}>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                  Hero Banner Images
                </h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">
                      Upload Images (3-5 images required)
                    </span>
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleHeroImagesChange}
                    ref={heroImagesRef}
                    className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                  {heroImagePreviews.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-4">
                        {heroImagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative w-24 h-16 rounded-lg overflow-hidden"
                          >
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Hero Preview ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={removeHeroImages}
                        className="btn btn-sm bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] text-white mt-2"
                      >
                        <RiDeleteBin5Fill className="w-3.5 h-3.5 mr-1" />
                        Remove All Images
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                  How We Are Working Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-[#1D372E]">
                        Section Title
                      </span>
                    </label>
                    <input
                      type="text"
                      value={workingSectionTitle}
                      onChange={(e) => setWorkingSectionTitle(e.target.value)}
                      placeholder="Enter section title"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  </div>
                  <div className="form-control md:col-span-1">
                    <label className="label">
                      <span className="label-text text-[#1D372E]">
                        Section Description
                      </span>
                    </label>
                    <textarea
                      value={workingSectionDescription}
                      onChange={(e) => setWorkingSectionDescription(e.target.value)}
                      placeholder="Enter section description"
                      className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-[#1D372E]">Working Items</h4>
                  <div className="text-sm text-gray-500">
                    {workingItems.length}/4 items added
                  </div>
                </div>
                {workingItems.length > 0 ? (
                  <>
                    {/* Mobile View */}
                    <div className="md:hidden space-y-3 mb-4">
                      {workingItems.map((item, index) => (
                        <div
                          key={index}
                          className="border border-[#1D372E] rounded-lg p-4 bg-white shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-[#1D372E] mb-2">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {item.description}
                              </div>
                              <div className="w-16 h-16 rounded overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveWorkingItem(index)}
                              className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white ml-2"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop/Tablet View */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                      {workingItems.map((item, index) => (
                        <div
                          key={index}
                          className="border border-[#1D372E] rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-[#1D372E] mb-2">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                {item.description}
                              </div>
                              <div className="w-20 h-16 rounded overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveWorkingItem(index)}
                              className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white"
                              title="Remove Working Item"
                            >
                              <RiDeleteBin5Fill className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-[#1D372E] p-6 rounded-lg text-center border-2 border-dashed border-[#5CAF90] my-4">
                    <p className="text-sm font-medium">No working items found in your settings. Add your first working item below.</p>
                    <p className="text-xs text-gray-500 mt-1">Use the form below to get started</p>
                  </div>
                )}
                <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                  <h4 className="font-medium text-[#1D372E] mb-3">
                    Add New Working Item
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Title</span>
                      </label>
                      <input
                        type="text"
                        value={newWorkingItem.title}
                        onChange={(e) =>
                          setNewWorkingItem({
                            ...newWorkingItem,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter title"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Description
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newWorkingItem.description}
                        onChange={(e) =>
                          setNewWorkingItem({
                            ...newWorkingItem,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter description"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Image</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewWorkingImageChange}
                        ref={workingImageRef}
                        className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                      {newWorkingItem.image && (
                        <div className="relative mt-4 w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={newWorkingItem.image}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={removeNewWorkingItemImage}
                            className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddWorkingItem}
                    className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                  >
                    <FaPlus className="w-3 h-3 mr-1" /> Add Working Item
                  </button>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHomePageSettings;