import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { updateAboutUsSetting } from "../api/setting";
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
  const navigate = useNavigate();

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
    setNewStatistic({ value: "", label: "", suffix: "" });
  };
  const handleRemoveStatistic = (index) => {
    const updated = [...statistics];
    updated.splice(index, 1);
    setStatistics(updated);
  };

  // Features handlers
  const handleAddFeature = () => {
    if (!newFeature.trim()) {
      toast.error("Feature text is required");
      return;
    }
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };
  const handleRemoveFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
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
          <form onSubmit={handleSave}>
            {/* Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Statistics</h3>
            {statistics.length > 0 ? (
              <div className="md:hidden space-y-4">
                {statistics.map((stat, index) => (
                  <div key={index} className="border border-[#1D372E] rounded-lg p-4 bg-white flex justify-between items-center">
                    <span>
                      {stat.value}{stat.suffix} - {stat.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStatistic(index)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateMessage message="No statistics found." />
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
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Why Choose Us Features</h3>
            {features.length > 0 ? (
              <div className="md:hidden space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="border border-[#1D372E] rounded-lg p-4 bg-white flex justify-between items-center">
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateMessage message="No features found." />
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
      </div>
    </div>
    </div>
    </>
  );
};

export default NewAboutUsSettings;