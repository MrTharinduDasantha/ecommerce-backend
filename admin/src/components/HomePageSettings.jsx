import { useState, useRef, useEffect } from "react";
import { FaEdit, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { fetchHomePageSetting, updateHomePageSetting } from "../api/setting";
import toast from "react-hot-toast";

const HomePageSettings = () => {
  const [homePageSetting, setHomePageSetting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Hero Images State
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [heroImagePreviews, setHeroImagePreviews] = useState([]);

  // Working Section State
  const [workingSectionTitle, setWorkingSectionTitle] = useState("");
  const [workingSectionDescription, setWorkingSectionDescription] =
    useState("");
  const [workingItems, setWorkingItems] = useState([]);
  const [newWorkingItem, setNewWorkingItem] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Refs
  const heroImagesRef = useRef(null);
  const workingImageRefs = useRef([]);

  // Check if all required fields are filled
  const canShowPreview = () => {
    return (
      heroImagePreviews.length >= 3 &&
      workingSectionTitle.trim() &&
      workingSectionDescription.trim() &&
      workingItems.length > 0 &&
      workingItems.every(
        (item) => item.title.trim() && item.description.trim() && item.image
      )
    );
  };

  // Toggle preview based on validation
  const togglePreview = () => {
    if (!showPreview) {
      if (canShowPreview()) {
        setShowPreview(true);
      } else {
        toast.error(
          "Please fill in all required fields before viewing the preview"
        );
      }
    } else {
      setShowPreview(false);
    }
  };

  // Load home page settings when component mounts
  useEffect(() => {
    async function loadHomePageSetting() {
      try {
        setIsLoading(true);
        const data = await fetchHomePageSetting();
        if (data) {
          setHomePageSetting(data);

          // Set hero images
          if (data.Hero_Images) {
            const images = Array.isArray(data.Hero_Images)
              ? data.Hero_Images
              : JSON.parse(data.Hero_Images || "[]");
            setHeroImagePreviews(images);
          }

          // Set working section data
          setWorkingSectionTitle(data.Working_Section_Title || "");
          setWorkingSectionDescription(data.Working_Section_Description || "");

          if (data.Working_Items) {
            const items = Array.isArray(data.Working_Items)
              ? data.Working_Items
              : JSON.parse(data.Working_Items || "[]");
            setWorkingItems(items);
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to load home page settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadHomePageSetting();
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
    if (workingImageRefs.current) {
      workingImageRefs.current.value = "";
    }
  };

  const handleAddWorkingItem = () => {
    if (
      !newWorkingItem.title.trim() ||
      !newWorkingItem.description.trim() ||
      !newWorkingItem.imageFile
    ) {
      toast.error("All fields are required");
      return;
    }

    setWorkingItems([...workingItems, { ...newWorkingItem }]);
    setNewWorkingItem({ title: "", description: "", image: null });
    workingImageRefs.current.value = "";
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

  // Edit handler
  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
  };

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (!canShowPreview()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append hero images
      heroImageFiles.forEach((file, index) => {
        formData.append(`heroImage${index}`, file);
      });

      // Append working section data
      formData.append("workingSectionTitle", workingSectionTitle);
      formData.append("workingSectionDescription", workingSectionDescription);

      // Append working items images
      workingItems.forEach((item, index) => {
        if (item.imageFile) {
          formData.append(`workingImage${index}`, item.imageFile);
        }
      });

      // Append working items data (without image files)
      const workingItemsData = workingItems.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image, // This will be updated by the backend
      }));
      formData.append("workingItems", JSON.stringify(workingItemsData));

      const updatedSetting = await updateHomePageSetting(formData);
      toast.success("Settings saved successfully");
      setHomePageSetting(updatedSetting);
      setIsEditing(false);

      // Reset form
      setHeroImageFiles([]);
      if (heroImagesRef.current) heroImagesRef.current.value = "";

      // Clear working item image files
      setWorkingItems(
        workingItems.map((item) => ({
          ...item,
          imageFile: null,
        }))
      );
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setIsEditing(false);
    setShowPreview(false);

    if (homePageSetting) {
      // Restore state from homePageSetting
      const images = Array.isArray(homePageSetting.Hero_Images)
        ? homePageSetting.Hero_Images
        : JSON.parse(homePageSetting.Hero_Images || "[]");
      setHeroImagePreviews(images);
      setHeroImageFiles([]);

      setWorkingSectionTitle(homePageSetting.Working_Section_Title || "");
      setWorkingSectionDescription(
        homePageSetting.Working_Section_Description || ""
      );

      const items = Array.isArray(homePageSetting.Working_Items)
        ? homePageSetting.Working_Items
        : JSON.parse(homePageSetting.Working_Items || "[]");
      setWorkingItems(items);
    } else {
      setHeroImagePreviews([]);
      setHeroImageFiles([]);
      setWorkingSectionTitle("");
      setWorkingSectionDescription("");
      setWorkingItems([]);
    }

    setNewWorkingItem({ title: "", description: "", image: null });
    if (heroImagesRef.current) heroImagesRef.current.value = "";
  };

  // Empty state message component
  const EmptyStateMessage = ({ message }) => (
    <div className="bg-gray-50 text-[#1D372E] p-4 rounded-md text-center border border-dashed border-[#5CAF90] my-3">
      <p>{message}</p>
    </div>
  );

  // Function to split title and color the last word
  const renderTitleWithColoredLastWord = (title) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;

    const lastWord = words.pop();
    const restOfTitle = words.join(" ");

    return (
      <>
        <span className="text-[#1D372E]">{restOfTitle} </span>
        <span className="text-[#5CAF90]">{lastWord}</span>
      </>
    );
  };

  // Home Page Preview Component
  const HomePagePreview = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImagePreviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [heroImagePreviews.length]);

    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
          Home Page Preview
        </h3>

        {/* Hero Banner Preview */}
        <div className="relative w-full">
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[410px] overflow-hidden rounded-lg">
            {heroImagePreviews.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Hero ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroImagePreviews.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? "border-[#5CAF90] scale-110"
                    : "border-gray-300 hover:border-[#5CAF90]"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* How We Are Working Preview */}
        <div className="container px-4 py-8 mx-auto">
          <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
            {renderTitleWithColoredLastWord(workingSectionTitle)}
          </h2>
          <p className="text-center text-sm sm:text-base text-[#636363] mb-8">
            {workingSectionDescription}
          </p>
          <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
            {workingItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white w-20 h-20 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="mt-3 text-lg text-[#1D372E] font-semibold">
                  {item.title}
                </h3>
                <p className="text-[#5E5E5E] text-sm sm:text-base">
                  {item.description}
                </p>
                {index < workingItems.length - 1 && (
                  <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4] absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && !homePageSetting) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-md relative">
      <div className="card-body">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Manage Home Page
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:absolute md:top-6 md:right-6">
            {!isEditing && !showPreview && (
              <button
                onClick={handleEdit}
                className="btn btn-primary gap-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md"
              >
                <FaEdit className="w-4 h-4" /> Edit
              </button>
            )}
            {!isEditing || canShowPreview() ? (
              <button
                onClick={togglePreview}
                className={`btn gap-2 btn-sm md:btn-md ${
                  showPreview
                    ? "bg-[#1D372E] border-[#1D372E] hover:bg-[#162a23]"
                    : "bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
                }`}
              >
                {showPreview ? (
                  <>
                    <FaEyeSlash className="w-4 h-4" /> Hide Preview
                  </>
                ) : (
                  <>
                    <FaEye className="w-4 h-4" /> Show Preview
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {showPreview ? (
          <HomePagePreview />
        ) : (
          <form onSubmit={handleSave}>
            {/* Hero Images Settings */}
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
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                  disabled={!isEditing}
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
                    {isEditing && (
                      <button
                        type="button"
                        onClick={removeHeroImages}
                        className="btn btn-sm bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] text-white mt-2"
                      >
                        <RiDeleteBin5Fill className="w-3.5 h-3.5 mr-1" />
                        Remove All Images
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Working Section Settings */}
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={workingSectionTitle}
                      onChange={(e) => setWorkingSectionTitle(e.target.value)}
                      placeholder="Enter section title"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  ) : (
                    <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                      <span className="truncate">
                        {homePageSetting?.Working_Section_Title || (
                          <span className="text-gray-400">
                            Enter section title
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-control md:col-span-1">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">
                      Section Description
                    </span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={workingSectionDescription}
                      onChange={(e) =>
                        setWorkingSectionDescription(e.target.value)
                      }
                      placeholder="Enter section description"
                      className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                      rows={3}
                    />
                  ) : (
                    <div className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] min-h-[4rem] overflow-hidden">
                      <span className="text-sm">
                        {homePageSetting?.Working_Section_Description || (
                          <span className="text-gray-400">
                            Enter section description
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Items Table */}
              <h4 className="font-medium text-[#1D372E] mb-3">Working Items</h4>

              {workingItems.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="table table-fixed min-w-[700px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="py-2 w-[200px]">Title</th>
                          <th className="py-2 w-[300px]">Description</th>
                          <th className="py-2 w-[100px]">Image</th>
                          {isEditing && (
                            <th className="py-2 w-[100px]">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="border-b border-[#1D372E]">
                        {workingItems.map((item, index) => (
                          <tr key={index} className="border-b border-[#1D372E]">
                            <td className="py-2 px-4">{item.title}</td>
                            <td className="py-2 px-4">{item.description}</td>
                            <td className="py-2">
                              <div className="flex justify-center">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              </div>
                            </td>
                            {isEditing && (
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWorkingItem(index)}
                                  className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                >
                                  <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {workingItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#1D372E] mb-2">
                              {item.title}
                            </div>
                            <div className="text-sm text-[#1D372E] mb-2">
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
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveWorkingItem(index)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d] ml-2"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyStateMessage message="No working items found." />
              )}

              {/* Add New Working Item */}
              {isEditing && (
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
                        ref={workingImageRefs}
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
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-primary bg-[#1D372E] border-[#1D372E] btn-sm md:btn-md"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md ${
                    isLoading ? "cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default HomePageSettings;
