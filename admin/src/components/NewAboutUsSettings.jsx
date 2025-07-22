import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaTimes } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { updateAboutUsSetting, fetchAboutUsSetting } from "../api/setting";
import TimelineDisplay from "./TimelineDisplay";

const NewAboutUsSettings = () => {
  // Statistics
  const [statistics, setStatistics] = useState([]);
  const [newStatistic, setNewStatistic] = useState({ value: "", label: "", suffix: "" });

  // Vision
  const [visionImage, setVisionImage] = useState(null);
  const [visionImagePreview, setVisionImagePreview] = useState(null);
  const [visionTitle, setVisionTitle] = useState("");
  const [visionDescription, setVisionDescription] = useState("");
  const visionImageRef = useRef(null);

  // Mission
  const [missionImage, setMissionImage] = useState(null);
  const [missionImagePreview, setMissionImagePreview] = useState(null);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const missionImageRef = useRef(null);

  // Values
  const [valuesImage, setValuesImage] = useState(null);
  const [valuesImagePreview, setValuesImagePreview] = useState(null);
  const [valuesTitle, setValuesTitle] = useState("");
  const [valuesDescription, setValuesDescription] = useState("");
  const valuesImageRef = useRef(null);

  // Features
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");

  // Why Choose Us
  const [whyChooseUsImage, setWhyChooseUsImage] = useState(null);
  const [whyChooseUsImagePreview, setWhyChooseUsImagePreview] = useState(null);
  const whyChooseUsImageRef = useRef(null);

  // Shopping Experience
  const [shoppingExperienceTitle, setShoppingExperienceTitle] = useState("");
  const [shoppingExperienceDescription, setShoppingExperienceDescription] = useState("");
  const [shoppingExperienceButtonText, setShoppingExperienceButtonText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setIsLoadingData(true);
        const existingData = await fetchAboutUsSetting();
        
        if (existingData) {
          // Load Statistics
          if (existingData.Statistics) {
            const parsedStatistics = typeof existingData.Statistics === 'string' 
              ? JSON.parse(existingData.Statistics) 
              : existingData.Statistics;
            setStatistics(Array.isArray(parsedStatistics) ? parsedStatistics : []);
          }

          // Load Vision data
          if (existingData.Vision_Title) setVisionTitle(existingData.Vision_Title);
          if (existingData.Vision_Description) setVisionDescription(existingData.Vision_Description);
          if (existingData.Vision_Image_Url) setVisionImagePreview(existingData.Vision_Image_Url);

          // Load Mission data
          if (existingData.Mission_Title) setMissionTitle(existingData.Mission_Title);
          if (existingData.Mission_Description) setMissionDescription(existingData.Mission_Description);
          if (existingData.Mission_Image_Url) setMissionImagePreview(existingData.Mission_Image_Url);

          // Load Values data
          if (existingData.Values_Title) setValuesTitle(existingData.Values_Title);
          if (existingData.Values_Description) setValuesDescription(existingData.Values_Description);
          if (existingData.Values_Image_Url) setValuesImagePreview(existingData.Values_Image_Url);

          // Load Features
          if (existingData.Features) {
            const parsedFeatures = typeof existingData.Features === 'string' 
              ? JSON.parse(existingData.Features) 
              : existingData.Features;
            setFeatures(Array.isArray(parsedFeatures) ? parsedFeatures : []);
          }

          // Load Why Choose Us image
          if (existingData.Why_Choose_Us_Image_Url) setWhyChooseUsImagePreview(existingData.Why_Choose_Us_Image_Url);

          // Load Shopping Experience data
          if (existingData.Shopping_Experience_Title) setShoppingExperienceTitle(existingData.Shopping_Experience_Title);
          if (existingData.Shopping_Experience_Description) setShoppingExperienceDescription(existingData.Shopping_Experience_Description);
          if (existingData.Shopping_Experience_Button_Text) setShoppingExperienceButtonText(existingData.Shopping_Experience_Button_Text);

          // Show success message if data was loaded
          const hasData = existingData.Vision_Title || existingData.Mission_Title || existingData.Values_Title || 
                          (parsedStatistics?.length > 0) || (parsedFeatures?.length > 0);
          if (hasData) {
            toast.success("Loaded your existing About Us settings from database!");
          }
        }
      } catch (error) {
        // If no existing data or error, start fresh (this is fine for first-time setup)
        console.log("No existing About Us data found, starting fresh");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadExistingData();
  }, []);

  // Handlers for images
  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const removeImage = (setImage, setPreview, ref) => {
    setImage(null);
    setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  // Statistics handlers
  const handleAddStatistic = () => {
    if (!newStatistic.value || !newStatistic.label) {
      toast.error("Value and label are required");
      return;
    }
    setStatistics([...statistics, { ...newStatistic }]);
    toast.success(`Statistic "${newStatistic.label}" added successfully!`);
    setNewStatistic({ value: "", label: "", suffix: "" });
  };
  const handleRemoveStatistic = (index) => {
    const statLabel = statistics[index].label;
    const updated = [...statistics];
    updated.splice(index, 1);
    setStatistics(updated);
    toast.success(`Statistic "${statLabel}" removed successfully!`);
  };

  // Features handlers
  const handleAddFeature = () => {
    if (!newFeature.trim()) {
      toast.error("Feature text is required");
      return;
    }
    setFeatures([...features, newFeature.trim()]);
    toast.success(`Feature "${newFeature.trim()}" added successfully!`);
    setNewFeature("");
  };
  const handleRemoveFeature = (index) => {
    const featureText = features[index];
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
    toast.success(`Feature "${featureText}" removed successfully!`);
  };

  // Submit handler (POST only)
  const handleSave = async (e) => {
    e.preventDefault();
    // Minimal validation
    if (
      statistics.length === 0 ||
      !visionImagePreview ||
      !visionTitle.trim() ||
      !visionDescription.trim() ||
      !missionImagePreview ||
      !missionTitle.trim() ||
      !missionDescription.trim() ||
      !valuesImagePreview ||
      !valuesTitle.trim() ||
      !valuesDescription.trim() ||
      features.length === 0 ||
      !whyChooseUsImagePreview ||
      !shoppingExperienceTitle.trim() ||
      !shoppingExperienceDescription.trim() ||
      !shoppingExperienceButtonText.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (visionImage) formData.append("visionImage", visionImage);
      if (missionImage) formData.append("missionImage", missionImage);
      if (valuesImage) formData.append("valuesImage", valuesImage);
      if (whyChooseUsImage) formData.append("whyChooseUsImage", whyChooseUsImage);
      formData.append("statistics", JSON.stringify(statistics));
      formData.append("visionTitle", visionTitle);
      formData.append("visionDescription", visionDescription);
      formData.append("missionTitle", missionTitle);
      formData.append("missionDescription", missionDescription);
      formData.append("valuesTitle", valuesTitle);
      formData.append("valuesDescription", valuesDescription);
      formData.append("features", JSON.stringify(features));
      formData.append("shoppingExperienceTitle", shoppingExperienceTitle);
      formData.append("shoppingExperienceDescription", shoppingExperienceDescription);
      formData.append("shoppingExperienceButtonText", shoppingExperienceButtonText);

      await updateAboutUsSetting(formData); // POST only
      toast.success("About Us settings posted successfully");
      // Optionally clear form here
    } catch (error) {
      toast.error(error.message || "Failed to post About Us settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Empty state message
  const EmptyStateMessage = ({ message }) => (
    <div className="bg-gray-50 text-[#1D372E] p-4 rounded-md text-center border border-dashed border-[#5CAF90] my-3">
      <p>{message}</p>
    </div>
  );

  // About Us Preview Modal Component
  const PreviewModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-[#1D372E]">About Us Page Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="btn btn-sm btn-circle bg-gray-200 hover:bg-gray-300 border-none"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Content */}
          <div className="p-6">
            {/* Statistics Section */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-[#1D372E] mb-4">Statistics Section</h4>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-[#1D372E] text-center mb-6">Our Achievements</h2>
                {statistics.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statistics.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-[#5CAF90] mb-2">
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">No statistics added yet</div>
                )}
              </div>
            </div>

            {/* Vision, Mission, Values Section */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-[#1D372E] mb-4">Vision, Mission & Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vision */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                  {visionImagePreview && (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                      <img src={visionImagePreview} alt="Vision" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-[#1D372E] mb-2">
                    {visionTitle || "Our Vision"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {visionDescription || "Vision description will appear here"}
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                  {missionImagePreview && (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                      <img src={missionImagePreview} alt="Mission" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-[#1D372E] mb-2">
                    {missionTitle || "Our Mission"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {missionDescription || "Mission description will appear here"}
                  </p>
                </div>

                {/* Values */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
                  {valuesImagePreview && (
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                      <img src={valuesImagePreview} alt="Values" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-[#1D372E] mb-2">
                    {valuesTitle || "Our Values"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {valuesDescription || "Values description will appear here"}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mb-8">
              <h4 className="text-md font-medium text-[#1D372E] mb-4">Why Choose Us Section</h4>
              <div className="bg-[#1D372E] text-white p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
                    {features.length > 0 ? (
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-[#5CAF90] rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400">No features added yet</div>
                    )}
                  </div>
                  {whyChooseUsImagePreview && (
                    <div className="flex items-center justify-center">
                      <img src={whyChooseUsImagePreview} alt="Why Choose Us" className="max-w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shopping Experience Section */}
            <div>
              <h4 className="text-md font-medium text-[#1D372E] mb-4">Shopping Experience Section</h4>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-[#1D372E] mb-4">
                  {shoppingExperienceTitle || "Your Shopping Experience"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {shoppingExperienceDescription || "Shopping experience description will appear here"}
                </p>
                <button className="btn bg-[#5CAF90] border-[#5CAF90] text-white hover:bg-[#4a9a7d]">
                  {shoppingExperienceButtonText || "Get Started"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Timeline at the top */}
      <div className="w-full" style={{ background: '#1D372E', paddingTop: 24, paddingBottom: 8 }}>
        <TimelineDisplay currentStep="aboutus" />
      </div>
       <div
        style={{ background: '#1D372E', minHeight: '100vh' }} // <-- add this line
      >
      <div className="card bg-white shadow-md relative mx-auto w-[1300px]">
        <div className="card-body">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#5CAF90]"></div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
                  About Us Settings (Create Only)
                </h2>
                {!isLoadingData && (
                  statistics.length > 0 || features.length > 0 || visionTitle || missionTitle || valuesTitle
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
              <span className="ml-3 text-[#1D372E]">Loading your existing About Us settings...</span>
            </div>
          ) : (
            <form onSubmit={handleSave}>
            {/* Statistics */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#1D372E]">Statistics</h3>
                <div className="text-sm text-gray-500">
                  {statistics.length} statistics added
                </div>
              </div>
            {statistics.length > 0 ? (
              <>
                {/* Mobile View */}
                <div className="md:hidden space-y-3 mb-4">
                  {statistics.map((stat, index) => (
                    <div key={index} className="border border-[#1D372E] rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#1D372E] font-medium">
                          {stat.value}{stat.suffix} - {stat.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStatistic(index)}
                          className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white"
                        >
                          <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop/Tablet View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {statistics.map((stat, index) => (
                    <div key={index} className="border border-[#1D372E] rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <span className="text-[#1D372E] font-medium text-sm">
                          {stat.value}{stat.suffix} - {stat.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStatistic(index)}
                          className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white"
                          title="Remove Statistic"
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
                <p className="text-sm font-medium">No statistics found in your settings. Add your first statistic below.</p>
                <p className="text-xs text-gray-500 mt-1">Use the form below to get started</p>
              </div>
            )}
            {/* Add New Statistic */}
            <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
              <h4 className="font-medium text-[#1D372E] mb-3">Add New Statistic</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={newStatistic.value}
                  onChange={e => setNewStatistic({ ...newStatistic, value: e.target.value })}
                  placeholder="Value"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                <input
                  type="text"
                  value={newStatistic.suffix}
                  onChange={e => setNewStatistic({ ...newStatistic, suffix: e.target.value })}
                  placeholder="Suffix"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                <input
                  type="text"
                  value={newStatistic.label}
                  onChange={e => setNewStatistic({ ...newStatistic, label: e.target.value })}
                  placeholder="Label"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddStatistic}
                className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
              >
                <FaPlus className="w-3 h-3 mr-1" /> Add Statistic
              </button>
            </div>
          </div>

          {/* Vision, Mission, Values */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Vision, Mission & Values</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vision */}
              <div className="p-4 border border-[#1D372E] rounded-lg">
                <h4 className="font-medium text-[#1D372E] mb-3">Vision</h4>
                <input
                  type="file"
                  onChange={e => handleImageChange(e, setVisionImage, setVisionImagePreview)}
                  ref={visionImageRef}
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                {visionImagePreview && (
                  <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                    <img src={visionImagePreview} alt="Vision Preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(setVisionImage, setVisionImagePreview, visionImageRef)}
                      className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={visionTitle}
                  onChange={e => setVisionTitle(e.target.value)}
                  placeholder="Vision Title"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                />
                <textarea
                  value={visionDescription}
                  onChange={e => setVisionDescription(e.target.value)}
                  placeholder="Vision Description"
                  className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                  rows={3}
                />
              </div>
              {/* Mission */}
              <div className="p-4 border border-[#1D372E] rounded-lg">
                <h4 className="font-medium text-[#1D372E] mb-3">Mission</h4>
                <input
                  type="file"
                  onChange={e => handleImageChange(e, setMissionImage, setMissionImagePreview)}
                  ref={missionImageRef}
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                {missionImagePreview && (
                  <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                    <img src={missionImagePreview} alt="Mission Preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(setMissionImage, setMissionImagePreview, missionImageRef)}
                      className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={missionTitle}
                  onChange={e => setMissionTitle(e.target.value)}
                  placeholder="Mission Title"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                />
                <textarea
                  value={missionDescription}
                  onChange={e => setMissionDescription(e.target.value)}
                  placeholder="Mission Description"
                  className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                  rows={3}
                />
              </div>
              {/* Values */}
              <div className="p-4 border border-[#1D372E] rounded-lg">
                <h4 className="font-medium text-[#1D372E] mb-3">Values</h4>
                <input
                  type="file"
                  onChange={e => handleImageChange(e, setValuesImage, setValuesImagePreview)}
                  ref={valuesImageRef}
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                {valuesImagePreview && (
                  <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                    <img src={valuesImagePreview} alt="Values Preview" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(setValuesImage, setValuesImagePreview, valuesImageRef)}
                      className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={valuesTitle}
                  onChange={e => setValuesTitle(e.target.value)}
                  placeholder="Values Title"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                />
                <textarea
                  value={valuesDescription}
                  onChange={e => setValuesDescription(e.target.value)}
                  placeholder="Values Description"
                  className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#1D372E]">Why Choose Us Features</h3>
              <div className="text-sm text-gray-500">
                {features.length} features added
              </div>
            </div>
            {features.length > 0 ? (
              <>
                {/* Mobile View */}
                <div className="md:hidden space-y-3 mb-4">
                  {features.map((feature, index) => (
                    <div key={index} className="border border-[#1D372E] rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#1D372E] font-medium">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white"
                        >
                          <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop/Tablet View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {features.map((feature, index) => (
                    <div key={index} className="border border-[#1D372E] rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <span className="text-[#1D372E] font-medium text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="btn bg-red-500 border-red-500 btn-xs btn-square hover:bg-red-600 text-white"
                          title="Remove Feature"
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
                <p className="text-sm font-medium">No features found in your settings. Add your first feature below.</p>
                <p className="text-xs text-gray-500 mt-1">Use the form below to get started</p>
              </div>
            )}
            {/* Add New Feature */}
            <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
              <h4 className="font-medium text-[#1D372E] mb-3">Add New Feature</h4>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder="Feature"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white"
                >
                  <FaPlus className="w-3 h-3 mr-1" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Why Choose Us Image */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Why Choose Us Image</h3>
            <input
              type="file"
              onChange={e => handleImageChange(e, setWhyChooseUsImage, setWhyChooseUsImagePreview)}
              ref={whyChooseUsImageRef}
              className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
            />
            {whyChooseUsImagePreview && (
              <div className="relative mt-4 w-32 h-24 rounded-lg overflow-hidden">
                <img src={whyChooseUsImagePreview} alt="Why Choose Us Preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeImage(setWhyChooseUsImage, setWhyChooseUsImagePreview, whyChooseUsImageRef)}
                  className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                >
                  <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Shopping Experience */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Shopping Experience Section</h3>
            <input
              type="text"
              value={shoppingExperienceTitle}
              onChange={e => setShoppingExperienceTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] mb-2"
            />
            <input
              type="text"
              value={shoppingExperienceButtonText}
              onChange={e => setShoppingExperienceButtonText(e.target.value)}
              placeholder="Button Text"
              className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] mb-2"
            />
            <textarea
              value={shoppingExperienceDescription}
              onChange={e => setShoppingExperienceDescription(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
              onClick={() => navigate(-1)} // or navigate('/Timeline') or call a prop
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
              disabled={isLoading}
              onClick={async () => {
                // Validate required fields here if needed
                try {
                  setIsLoading(true);
                  const formData = new FormData();
                  if (visionImage) formData.append("visionImage", visionImage);
                  if (missionImage) formData.append("missionImage", missionImage);
                  if (valuesImage) formData.append("valuesImage", valuesImage);
                  if (whyChooseUsImage) formData.append("whyChooseUsImage", whyChooseUsImage);
                  formData.append("statistics", JSON.stringify(statistics));
                  formData.append("visionTitle", visionTitle);
                  formData.append("visionDescription", visionDescription);
                  formData.append("missionTitle", missionTitle);
                  formData.append("missionDescription", missionDescription);
                  formData.append("valuesTitle", valuesTitle);
                  formData.append("valuesDescription", valuesDescription);
                  formData.append("features", JSON.stringify(features));
                  formData.append("shoppingExperienceTitle", shoppingExperienceTitle);
                  formData.append("shoppingExperienceDescription", shoppingExperienceDescription);
                  formData.append("shoppingExperienceButtonText", shoppingExperienceButtonText);

                  await updateAboutUsSetting(formData);
                  toast.success("About Us settings saved!");
                  // navigate to next step
                  navigate("/NewHomePageSettings"); // <-- change here
                } catch (error) {
                  toast.error(error.message || "Failed to save About Us settings");
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Next
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
    </div>

      {/* Preview Modal */}
      {showPreview && <PreviewModal />}
    </>
  );
};

export default NewAboutUsSettings;