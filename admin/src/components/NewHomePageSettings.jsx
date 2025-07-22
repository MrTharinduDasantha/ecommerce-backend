import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaEye, FaTimes } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateHomePageSetting, fetchHomePageSetting } from "../api/setting";
import TimelineDisplay from "./TimelineDisplay";

const NewHomePageSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

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
              console.log('Raw hero images from database:', parsedHeroImages);
              
              // Process and validate URLs
              const processedHeroImages = parsedHeroImages.map(url => {
                if (typeof url === 'string') {
                  // Handle different URL formats
                  if (url.startsWith('http://localhost:9000/src/uploads/')) {
                    return url; // Already correct format
                  } else if (url.startsWith('/src/uploads/')) {
                    return `http://localhost:9000${url}`;
                  } else if (url.startsWith('src/uploads/')) {
                    return `http://localhost:9000/${url}`;
                  } else if (url.startsWith('uploads/')) {
                    return `http://localhost:9000/src/${url}`;
                  }
                  return url; // Return as-is if we can't process it
                }
                return url;
              });
              
              console.log('Processed hero images:', processedHeroImages);
              
              // Set existing image URLs as previews
              setHeroImagePreviews(processedHeroImages);
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
  const handleSave = async (e, shouldNavigate = true) => {
    e.preventDefault();
    
    // Check if we have hero images (either new files or existing ones from database)
    const hasHeroImages = heroImageFiles.length >= 3 || heroImagePreviews.length >= 3;
    
    if (
      !hasHeroImages ||
      workingSectionTitle.trim() === "" ||
      workingSectionDescription.trim() === "" ||
      workingItems.length === 0 ||
      workingItems.some(
        (item) => !item.title.trim() || !item.description.trim() || !item.imageFile
      )
    ) {
      if (!hasHeroImages) {
        toast.error("Please upload at least 3 hero images or ensure existing images are loaded");
      } else {
        toast.error("Please fill in all required fields");
      }
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Only append new hero images if user uploaded new ones
      if (heroImageFiles.length > 0) {
        heroImageFiles.forEach((file, index) => {
          formData.append(`heroImage${index}`, file);
        });
      }
      
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
      
      if (shouldNavigate) {
        toast.success("Settings saved successfully! Moving to next step...");
        // Move to next page
        navigate("/PolicyDetailsSettings");
      } else {
        toast.success("Home Page settings saved successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Finish button (save only, no navigation)
  const handleFinish = (e) => {
    handleSave(e, false);
  };

  // Handler for Next button (save and navigate)
  const handleNext = (e) => {
    handleSave(e, true);
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
              <button
                onClick={() => setShowPreview(true)}
                className="btn gap-2 btn-sm md:btn-md bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white"
                disabled={isLoading}
              >
                <FaEye className="w-4 h-4" /> Preview
              </button>
            </div>

            {isLoadingData ? (
              <div className="flex justify-center items-center py-12">
                <div className="loading loading-spinner loading-lg text-[#5CAF90]"></div>
                <span className="ml-3 text-[#1D372E]">Loading your existing Home Page settings...</span>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#1D372E]">
                    Hero Banner Images
                  </h3>
                  {heroImagePreviews.length >= 3 && (
                    <span className="text-sm text-[#5CAF90] font-medium">
                      ✓ {heroImagePreviews.length} images loaded
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">
                      {heroImagePreviews.length >= 3 ? 
                        "Upload New Images (Optional - You have existing images)" : 
                        "Upload Images (3-5 images required)"}
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
                      {heroImageFiles.length === 0 && heroImagePreviews.length >= 3 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">✓ Existing Images Loaded:</span> You have {heroImagePreviews.length} hero images from your database. You can upload new images to replace them, or keep the existing ones.
                          </p>
                        </div>
                      )}
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
                        {heroImageFiles.length > 0 ? 'Remove Uploaded Images' : 'Clear Images'}
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
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Back
                </button>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Saving...
                      </>
                    ) : (
                      "Finish"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary bg-[#1D372E] border-none text-white btn-sm md:btn-md"
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
              </div>
            </form>
            )}
          </div>
        </div>
      </div>

      {/* Home Page Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-[#1D372E]">Home Page Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-sm btn-circle bg-gray-200 hover:bg-gray-300 border-none"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {/* Hero Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-[#1D372E] mb-4">Hero Banner Section</h4>
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {heroImagePreviews.length > 0 ? (
                    <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden">
                      {/* 
                        Simplified and robust image rendering.
                        - A key is added to force re-render when the image source changes.
                        - z-index is explicitly set to ensure it's above the background but below the content.
                        - The fallback div has been removed to prevent conflicts.
                      */}
                      <img 
                        key={heroImagePreviews[0]} // Force re-render on URL change
                        src={heroImagePreviews[0]} 
                        alt="Hero Banner" 
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ zIndex: 5 }} // Position image above background
                        onLoad={() => console.log('✅ Hero image displayed successfully:', heroImagePreviews[0])}
                        onError={(e) => {
                          console.error('❌ Hero image display failed:', heroImagePreviews[0]);
                          e.target.style.display = 'none'; // Hide broken image icon
                        }}
                      />
                      
                      {/* Overlay with content */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center" style={{ zIndex: 10 }}>
                        <div className="text-white text-center p-4">
                          <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
                          <p className="text-lg mb-6">Discover amazing products at great prices</p>
                          <button className="btn bg-[#5CAF90] border-[#5CAF90] text-white hover:bg-[#4a9a7d]">
                            Shop Now
                          </button>
                        </div>
                      </div>
                      
                      {/* Image indicators */}
                      {heroImagePreviews.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" style={{ zIndex: 15 }}>
                          {heroImagePreviews.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                          ))}
                        </div>
                      )}
                      
                      {/* Show indicator for image source */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded" style={{ zIndex: 15 }}>
                        {heroImageFiles.length > 0 ? 'New Images' : 'Existing Images'}
                      </div>
                      
                      {/* Simplified debug info */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 text-white text-xs px-3 py-2 rounded max-w-xs space-y-1" style={{ zIndex: 15 }}>
                        <div className="text-green-300 font-medium">✅ Image Loading</div>
                        <div className="text-yellow-300">Count: {heroImagePreviews.length}</div>
                        <a 
                          href={heroImagePreviews[0]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Test URL →
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-300 flex items-center justify-center rounded-lg">
                      <div className="text-gray-500 text-center">
                        <h1 className="text-4xl font-bold mb-4">Hero Banner</h1>
                        <p className="text-lg">Upload hero images to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Section */}
              <div>
                <h4 className="text-md font-medium text-[#1D372E] mb-4">How We Work Section</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1D372E] mb-4">
                      {workingSectionTitle || "How We Work"}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {workingSectionDescription || "Working section description will appear here"}
                    </p>
                  </div>
                  
                  {workingItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {workingItems.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5CAF90] flex items-center justify-center text-white font-bold text-xl">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <h3 className="font-bold text-[#1D372E] mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      <p>No working items added yet</p>
                      <p className="text-sm mt-2">Add working items to see how they'll appear</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewHomePageSettings;