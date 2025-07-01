import { useState, useRef, useEffect } from "react";
import { FaEdit, FaPlus, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import CountUp from "react-countup";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { fetchAboutUsSetting, updateAboutUsSetting } from "../api/setting";
import toast from "react-hot-toast";

const AboutUsSettings = () => {
  const [aboutUsSetting, setAboutUsSetting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Statistics State
  const [statistics, setStatistics] = useState([]);
  const [newStatistic, setNewStatistic] = useState({
    value: "",
    label: "",
    suffix: "",
  });

  // Vision State
  const [visionImage, setVisionImage] = useState(null);
  const [visionImagePreview, setVisionImagePreview] = useState(null);
  const [visionTitle, setVisionTitle] = useState("");
  const [visionDescription, setVisionDescription] = useState("");

  // Mission State
  const [missionImage, setMissionImage] = useState(null);
  const [missionImagePreview, setMissionImagePreview] = useState(null);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");

  // Values State
  const [valuesImage, setValuesImage] = useState(null);
  const [valuesImagePreview, setValuesImagePreview] = useState(null);
  const [valuesTitle, setValuesTitle] = useState("");
  const [valuesDescription, setValuesDescription] = useState("");

  // Features State
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");

  // Why Choose Us State
  const [whyChooseUsImage, setWhyChooseUsImage] = useState(null);
  const [whyChooseUsImagePreview, setWhyChooseUsImagePreview] = useState(null);

  // Shopping Experience State
  const [shoppingExperienceTitle, setShoppingExperienceTitle] = useState("");
  const [shoppingExperienceDescription, setShoppingExperienceDescription] =
    useState("");
  const [shoppingExperienceButtonText, setShoppingExperienceButtonText] =
    useState("");

  // Refs
  const visionImageRef = useRef(null);
  const missionImageRef = useRef(null);
  const valuesImageRef = useRef(null);
  const whyChooseUsImageRef = useRef(null);

  // Check if all required fields are filled
  const canShowPreview = () => {
    return (
      statistics.length > 0 &&
      visionImagePreview &&
      visionTitle.trim() &&
      visionDescription.trim() &&
      missionImagePreview &&
      missionTitle.trim() &&
      missionDescription.trim() &&
      valuesImagePreview &&
      valuesTitle.trim() &&
      valuesDescription.trim() &&
      features.length > 0 &&
      whyChooseUsImagePreview &&
      shoppingExperienceTitle.trim() &&
      shoppingExperienceDescription.trim() &&
      shoppingExperienceButtonText.trim()
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

  // Load about us settings when component mounts
  useEffect(() => {
    async function loadAboutUsSetting() {
      try {
        setIsLoading(true);
        const data = await fetchAboutUsSetting();
        if (data) {
          setAboutUsSetting(data);

          // Set statistics
          if (data.Statistics && Array.isArray(data.Statistics)) {
            setStatistics(data.Statistics);
          }

          // Set vision data
          setVisionImagePreview(data.Vision_Image_Url);
          setVisionTitle(data.Vision_Title || "");
          setVisionDescription(data.Vision_Description || "");

          // Set mission data
          setMissionImagePreview(data.Mission_Image_Url);
          setMissionTitle(data.Mission_Title || "");
          setMissionDescription(data.Mission_Description || "");

          // Set values data
          setValuesImagePreview(data.Values_Image_Url);
          setValuesTitle(data.Values_Title || "");
          setValuesDescription(data.Values_Description || "");

          // Set features
          if (data.Features && Array.isArray(data.Features)) {
            setFeatures(data.Features);
          }

          // Set why choose us image
          setWhyChooseUsImagePreview(data.Why_Choose_Us_Image_Url);

          // Set shopping experience data
          setShoppingExperienceTitle(data.Shopping_Experience_Title || "");
          setShoppingExperienceDescription(
            data.Shopping_Experience_Description || ""
          );
          setShoppingExperienceButtonText(
            data.Shopping_Experience_Button_Text || ""
          );
        }
      } catch (error) {
        toast.error(error.message || "Failed to load about us settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadAboutUsSetting();
  }, []);

  // Image handlers
  const handleVisionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVisionImage(file);
      setVisionImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMissionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMissionImage(file);
      setMissionImagePreview(URL.createObjectURL(file));
    }
  };

  const handleValuesImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValuesImage(file);
      setValuesImagePreview(URL.createObjectURL(file));
    }
  };

  const handleWhyChooseUsImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWhyChooseUsImage(file);
      setWhyChooseUsImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove image handlers
  const removeVisionImage = () => {
    setVisionImage(null);
    setVisionImagePreview(null);
    if (visionImageRef.current) visionImageRef.current.value = "";
  };

  const removeMissionImage = () => {
    setMissionImage(null);
    setMissionImagePreview(null);
    if (missionImageRef.current) missionImageRef.current.value = "";
  };

  const removeValuesImage = () => {
    setValuesImage(null);
    setValuesImagePreview(null);
    if (valuesImageRef.current) valuesImageRef.current.value = "";
  };

  const removeWhyChooseUsImage = () => {
    setWhyChooseUsImage(null);
    setWhyChooseUsImagePreview(null);
    if (whyChooseUsImageRef.current) whyChooseUsImageRef.current.value = "";
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
    const updatedStatistics = [...statistics];
    updatedStatistics.splice(index, 1);
    setStatistics(updatedStatistics);
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
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  // Edit handler
  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
    if (aboutUsSetting) {
      // Load existing data into form fields
      setVisionImagePreview(aboutUsSetting.Vision_Image_Url);
      setVisionTitle(aboutUsSetting.Vision_Title || "");
      setVisionDescription(aboutUsSetting.Vision_Description || "");
      setMissionImagePreview(aboutUsSetting.Mission_Image_Url);
      setMissionTitle(aboutUsSetting.Mission_Title || "");
      setMissionDescription(aboutUsSetting.Mission_Description || "");
      setValuesImagePreview(aboutUsSetting.Values_Image_Url);
      setValuesTitle(aboutUsSetting.Values_Title || "");
      setValuesDescription(aboutUsSetting.Values_Description || "");
      setWhyChooseUsImagePreview(aboutUsSetting.Why_Choose_Us_Image_Url);
      setShoppingExperienceTitle(
        aboutUsSetting.Shopping_Experience_Title || ""
      );
      setShoppingExperienceDescription(
        aboutUsSetting.Shopping_Experience_Description || ""
      );
      setShoppingExperienceButtonText(
        aboutUsSetting.Shopping_Experience_Button_Text || ""
      );
    }
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

      // Build form data
      const formData = new FormData();

      // Append images if new ones are provided
      if (visionImage) formData.append("visionImage", visionImage);
      if (missionImage) formData.append("missionImage", missionImage);
      if (valuesImage) formData.append("valuesImage", valuesImage);
      if (whyChooseUsImage)
        formData.append("whyChooseUsImage", whyChooseUsImage);

      // Append other data
      formData.append("statistics", JSON.stringify(statistics));
      formData.append("visionTitle", visionTitle);
      formData.append("visionDescription", visionDescription);
      formData.append("missionTitle", missionTitle);
      formData.append("missionDescription", missionDescription);
      formData.append("valuesTitle", valuesTitle);
      formData.append("valuesDescription", valuesDescription);
      formData.append("features", JSON.stringify(features));
      formData.append("shoppingExperienceTitle", shoppingExperienceTitle);
      formData.append(
        "shoppingExperienceDescription",
        shoppingExperienceDescription
      );
      formData.append(
        "shoppingExperienceButtonText",
        shoppingExperienceButtonText
      );

      const updatedSetting = await updateAboutUsSetting(formData);
      toast.success("Settings saved successfully");
      setAboutUsSetting(updatedSetting);
      setIsEditing(false);

      // Reset form
      setVisionImage(null);
      setMissionImage(null);
      setValuesImage(null);
      setWhyChooseUsImage(null);
      if (visionImageRef.current) visionImageRef.current.value = "";
      if (missionImageRef.current) missionImageRef.current.value = "";
      if (valuesImageRef.current) valuesImageRef.current.value = "";
      if (whyChooseUsImageRef.current) whyChooseUsImageRef.current.value = "";
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

    if (aboutUsSetting) {
      // Restore state from aboutUsSetting
      setStatistics(aboutUsSetting.Statistics || []);
      setVisionImage(null);
      setVisionImagePreview(aboutUsSetting.Vision_Image_Url || null);
      setVisionTitle(aboutUsSetting.Vision_Title || "");
      setVisionDescription(aboutUsSetting.Vision_Description || "");
      setMissionImage(null);
      setMissionImagePreview(aboutUsSetting.Mission_Image_Url || null);
      setMissionTitle(aboutUsSetting.Mission_Title || "");
      setMissionDescription(aboutUsSetting.Mission_Description || "");
      setValuesImage(null);
      setValuesImagePreview(aboutUsSetting.Values_Image_Url || null);
      setValuesTitle(aboutUsSetting.Values_Title || "");
      setValuesDescription(aboutUsSetting.Values_Description || "");
      setFeatures(aboutUsSetting.Features || []);
      setWhyChooseUsImage(null);
      setWhyChooseUsImagePreview(
        aboutUsSetting.Why_Choose_Us_Image_Url || null
      );
      setShoppingExperienceTitle(
        aboutUsSetting.Shopping_Experience_Title || ""
      );
      setShoppingExperienceDescription(
        aboutUsSetting.Shopping_Experience_Description || ""
      );
      setShoppingExperienceButtonText(
        aboutUsSetting.Shopping_Experience_Button_Text || ""
      );
    } else {
      // If no aboutUsSetting, reset to initial state
      setStatistics([]);
      setVisionImage(null);
      setVisionImagePreview(null);
      setVisionTitle("");
      setVisionDescription("");
      setMissionImage(null);
      setMissionImagePreview(null);
      setMissionTitle("");
      setMissionDescription("");
      setValuesImage(null);
      setValuesImagePreview(null);
      setValuesTitle("");
      setValuesDescription("");
      setFeatures([]);
      setWhyChooseUsImage(null);
      setWhyChooseUsImagePreview(null);
      setShoppingExperienceTitle("");
      setShoppingExperienceDescription("");
      setShoppingExperienceButtonText("");
    }

    // Reset new statistic and feature
    setNewStatistic({ value: "", label: "", suffix: "" });
    setNewFeature("");

    // Clear file inputs
    if (visionImageRef.current) visionImageRef.current.value = "";
    if (missionImageRef.current) missionImageRef.current.value = "";
    if (valuesImageRef.current) valuesImageRef.current.value = "";
    if (whyChooseUsImageRef.current) whyChooseUsImageRef.current.value = "";
  };

  // Empty state message component
  const EmptyStateMessage = ({ message }) => (
    <div className="bg-gray-50 text-[#1D372E] p-4 rounded-md text-center border border-dashed border-[#5CAF90] my-3">
      <p>{message}</p>
    </div>
  );

  // About Us Preview Component
  const AboutUsPreview = () => {
    return (
      <div className="space-y-8">
        <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
          About Us Preview
        </h3>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-[#5CAF90] via-[#7DCFB0] to-[#5CAF90] p-6 rounded-lg">
          <div className="grid grid-cols-1 gap-6 text-center xl:grid-cols-4 xl:gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp start={0} end={stat.value} duration={2} />
                  {stat.suffix}
                </p>
                <p className="text-sm text-black">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision, Mission, Values Section */}
        <div className="bg-white py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Vision */}
            <div className="text-center">
              <div className="mb-6 w-48 h-48 mx-auto">
                <img
                  src={visionImagePreview}
                  alt="Vision"
                  className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                />
              </div>
              <h3 className="text-[#1D372E] text-2xl font-bold mb-4">
                {visionTitle}
              </h3>
              <p className="text-gray-600 text-sm">{visionDescription}</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-300"></div>

            {/* Mission */}
            <div className="text-center">
              <div className="mb-6 w-48 h-48 mx-auto">
                <img
                  src={missionImagePreview}
                  alt="Mission"
                  className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                />
              </div>
              <h3 className="text-[#1D372E] text-2xl font-bold mb-4">
                {missionTitle}
              </h3>
              <p className="text-gray-600 text-sm">{missionDescription}</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block absolute right-[32%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

            {/* Values */}
            <div className="text-center">
              <div className="mb-6 w-48 h-48 mx-auto">
                <img
                  src={valuesImagePreview}
                  alt="Values"
                  className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                />
              </div>
              <h3 className="text-[#1D372E] text-2xl font-bold mb-4">
                {valuesTitle}
              </h3>
              <p className="text-gray-600 text-sm">{valuesDescription}</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="w-full bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left side - Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={whyChooseUsImagePreview}
                  alt="Why Choose Us Illustration"
                  className="w-[590px] h-[462.18px] object-contain rounded-lg mx-auto"
                />
              </div>
              {/* Right side - Features */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
                  Why Choose us ?
                </h2>
                <div className="space-y-4 overflow-y-auto">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-3 pb-4">
                        <div className="flex-shrink-0 w-5 h-5 border border-[#5CAF90] rounded flex items-center justify-center">
                          <FaCheck className="text-xs text-[#5CAF90]" />
                        </div>
                        <span className="text-black text-sm">{feature}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopping Experience Section */}
        <div className="w-full h-[347px] bg-gradient-to-b from-[#5CAF90] to-[#E8F5F1] py-16 mt-16 mb-32 mx-auto">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-[#1D372E] mb-4">
              {shoppingExperienceTitle}
            </h2>
            <p className="text-sm text-[#1D372E] mb-8 max-w-2xl mx-auto">
              {shoppingExperienceDescription}
            </p>
            <div className="flex justify-center">
              <button className="bg-[#5CAF90] text-white w-[250px] h-[50px] rounded-full text-sm font-medium hover:bg-[#1D372E] transition-duration-300 shadow-md flex items-center justify-center">
                <div className="w-[50px] h-[29px] flex items-center justify-center">
                  {shoppingExperienceButtonText}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && !aboutUsSetting) {
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
              Manage About Us
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
          <AboutUsPreview />
        ) : (
          <form onSubmit={handleSave}>
            {/* Statistics Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Statistics
              </h3>
              {/* Existing Statistics */}
              {statistics.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="table table-fixed min-w-[600px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="py-2 w-[150px]">Value</th>
                          <th className="py-2 w-[100px]">Suffix</th>
                          <th className="py-2 w-[250px]">Label</th>
                          {isEditing && (
                            <th className="py-2 w-[100px]">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="border-b border-[#1D372E]">
                        {statistics.map((stat, index) => (
                          <tr key={index} className="border-b border-[#1D372E]">
                            <td className="py-2">{stat.value}</td>
                            <td className="py-2">{stat.suffix}</td>
                            <td className="py-2">{stat.label}</td>
                            {isEditing && (
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStatistic(index)}
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
                    {statistics.map((stat, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#1D372E] mb-1">
                              {stat.value}
                              {stat.suffix} - {stat.label}
                            </div>
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStatistic(index)}
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
                <EmptyStateMessage message="No statistics found." />
              )}

              {/* Add New Statistic */}
              {isEditing && (
                <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                  <h4 className="font-medium text-[#1D372E] mb-3">
                    Add New Statistic
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Value</span>
                      </label>
                      <input
                        type="text"
                        value={newStatistic.value}
                        onChange={(e) =>
                          setNewStatistic({
                            ...newStatistic,
                            value: e.target.value,
                          })
                        }
                        placeholder="Enter value (e.g. 15)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Suffix
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newStatistic.suffix}
                        onChange={(e) =>
                          setNewStatistic({
                            ...newStatistic,
                            suffix: e.target.value,
                          })
                        }
                        placeholder="Enter suffix (e.g. +, %, k+)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Label</span>
                      </label>
                      <input
                        type="text"
                        value={newStatistic.label}
                        onChange={(e) =>
                          setNewStatistic({
                            ...newStatistic,
                            label: e.target.value,
                          })
                        }
                        placeholder="Enter label (e.g. Years of Experience)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStatistic}
                    className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                  >
                    <FaPlus className="w-3 h-3 mr-1" /> Add Statistic
                  </button>
                </div>
              )}
            </div>

            {/* Vision, Mission, Values Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Vision, Mission & Values
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vision */}
                <div className="p-4 border border-[#1D372E] rounded-lg">
                  <h4 className="font-medium text-[#1D372E] mb-3">Vision</h4>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Image</span>
                      </label>
                      <input
                        type="file"
                        onChange={handleVisionImageChange}
                        ref={visionImageRef}
                        className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                        disabled={!isEditing}
                      />
                      {visionImagePreview && (
                        <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={visionImagePreview || "/placeholder.svg"}
                            alt="Vision Preview"
                            className="object-cover w-full h-full"
                          />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={removeVisionImage}
                              className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Title</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={visionTitle}
                          onChange={(e) => setVisionTitle(e.target.value)}
                          placeholder="Enter vision title"
                          className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                        />
                      ) : (
                        <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                          <span className="truncate">
                            {aboutUsSetting?.Vision_Title || (
                              <span className="text-gray-400">
                                Enter vision title
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Description
                        </span>
                      </label>
                      {isEditing ? (
                        <textarea
                          value={visionDescription}
                          onChange={(e) => setVisionDescription(e.target.value)}
                          placeholder="Enter vision description"
                          className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                          rows={3}
                        />
                      ) : (
                        <div className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] min-h-[4rem] overflow-hidden">
                          <span className="text-sm">
                            {aboutUsSetting?.Vision_Description || (
                              <span className="text-gray-400">
                                Enter vision description
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mission */}
                <div className="p-4 border border-[#1D372E] rounded-lg">
                  <h4 className="font-medium text-[#1D372E] mb-3">Mission</h4>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Image</span>
                      </label>
                      <input
                        type="file"
                        onChange={handleMissionImageChange}
                        ref={missionImageRef}
                        className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                        disabled={!isEditing}
                      />
                      {missionImagePreview && (
                        <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={missionImagePreview || "/placeholder.svg"}
                            alt="Mission Preview"
                            className="object-cover w-full h-full"
                          />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={removeMissionImage}
                              className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Title</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={missionTitle}
                          onChange={(e) => setMissionTitle(e.target.value)}
                          placeholder="Enter mission title"
                          className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                        />
                      ) : (
                        <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                          <span className="truncate">
                            {aboutUsSetting?.Mission_Title || (
                              <span className="text-gray-400">
                                Enter mission title
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Description
                        </span>
                      </label>
                      {isEditing ? (
                        <textarea
                          value={missionDescription}
                          onChange={(e) =>
                            setMissionDescription(e.target.value)
                          }
                          placeholder="Enter mission description"
                          className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                          rows={3}
                        />
                      ) : (
                        <div className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] min-h-[4rem] overflow-hidden">
                          <span className="text-sm">
                            {aboutUsSetting?.Mission_Description || (
                              <span className="text-gray-400">
                                Enter mission description
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div className="p-4 border border-[#1D372E] rounded-lg">
                  <h4 className="font-medium text-[#1D372E] mb-3">Values</h4>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Image</span>
                      </label>
                      <input
                        type="file"
                        onChange={handleValuesImageChange}
                        ref={valuesImageRef}
                        className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                        disabled={!isEditing}
                      />
                      {valuesImagePreview && (
                        <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                          <img
                            src={valuesImagePreview || "/placeholder.svg"}
                            alt="Values Preview"
                            className="object-cover w-full h-full"
                          />
                          {isEditing && (
                            <button
                              type="button"
                              onClick={removeValuesImage}
                              className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Title</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={valuesTitle}
                          onChange={(e) => setValuesTitle(e.target.value)}
                          placeholder="Enter values title"
                          className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                        />
                      ) : (
                        <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                          <span className="truncate">
                            {aboutUsSetting?.Values_Title || (
                              <span className="text-gray-400">
                                Enter values title
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Description
                        </span>
                      </label>
                      {isEditing ? (
                        <textarea
                          value={valuesDescription}
                          onChange={(e) => setValuesDescription(e.target.value)}
                          placeholder="Enter values description"
                          className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                          rows={3}
                        />
                      ) : (
                        <div className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] min-h-[4rem] overflow-hidden">
                          <span className="text-sm">
                            {aboutUsSetting?.Values_Description || (
                              <span className="text-gray-400">
                                Enter values description
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Why Choose Us Features
              </h3>
              {/* Existing Features */}
              {features.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="table table-fixed min-w-[500px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="py-2 w-[400px]">Feature</th>
                          {isEditing && (
                            <th className="py-2 w-[100px]">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="border-b border-[#1D372E]">
                        {features.map((feature, index) => (
                          <tr key={index} className="border-b border-[#1D372E]">
                            <td className="py-2 text-left px-4">{feature}</td>
                            {isEditing && (
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFeature(index)}
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
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-[#1D372E]">
                              {feature}
                            </div>
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
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
                <EmptyStateMessage message="No features found." />
              )}

              {/* Add New Feature */}
              {isEditing && (
                <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                  <h4 className="font-medium text-[#1D372E] mb-3">
                    Add New Feature
                  </h4>
                  <div className="flex gap-4">
                    <div className="form-control flex-1">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Feature
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Enter feature (e.g. High-quality Products)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          &nbsp;
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="mt-5 btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white"
                      >
                        <FaPlus className="w-3 h-3 mr-1" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Why Choose Us Image Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Why Choose Us Image
              </h3>
              <div className="form-control">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm md:text-base font-medium">
                    Why Choose Us Image
                  </span>
                </label>
                <input
                  type="file"
                  onChange={handleWhyChooseUsImageChange}
                  ref={whyChooseUsImageRef}
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                  disabled={!isEditing}
                />
                {whyChooseUsImagePreview && (
                  <div className="relative mt-4 w-32 h-24 rounded-lg overflow-hidden">
                    <img
                      src={whyChooseUsImagePreview || "/placeholder.svg"}
                      alt="Why Choose Us Preview"
                      className="object-cover w-full h-full"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={removeWhyChooseUsImage}
                        className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                      >
                        <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Shopping Experience Settings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Shopping Experience Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm md:text-base font-medium">
                      Title
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={shoppingExperienceTitle}
                      onChange={(e) =>
                        setShoppingExperienceTitle(e.target.value)
                      }
                      placeholder="Enter title"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  ) : (
                    <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                      <span className="truncate">
                        {aboutUsSetting?.Shopping_Experience_Title || (
                          <span className="text-gray-400">Enter title</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm md:text-base font-medium">
                      Button Text
                    </span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={shoppingExperienceButtonText}
                      onChange={(e) =>
                        setShoppingExperienceButtonText(e.target.value)
                      }
                      placeholder="Enter button text"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  ) : (
                    <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                      <span className="truncate">
                        {aboutUsSetting?.Shopping_Experience_Button_Text || (
                          <span className="text-gray-400">
                            Enter button text
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label text-[#1D372E] mb-0.5">
                    <span className="label-text text-sm md:text-base font-medium">
                      Description
                    </span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={shoppingExperienceDescription}
                      onChange={(e) =>
                        setShoppingExperienceDescription(e.target.value)
                      }
                      placeholder="Enter description"
                      className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                      rows={4}
                    />
                  ) : (
                    <div className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E] min-h-[6rem] overflow-hidden">
                      <span className="text-sm">
                        {aboutUsSetting?.Shopping_Experience_Description || (
                          <span className="text-gray-400">
                            Enter description
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
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

export default AboutUsSettings;
