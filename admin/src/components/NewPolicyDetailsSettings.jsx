import React, { useState, lazy, Suspense } from "react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { updatePolicyDetailsSetting } from "../api/setting";

// Dynamically import react-quill-new for client-side rendering
const ReactQuill = lazy(() =>
  import("react-quill-new").then((mod) => {
    import("react-quill-new/dist/quill.snow.css").catch((err) => {
      console.error("Failed to load react-quill-new styles:", err);
    });
    return mod;
  }).catch((err) => {
    console.error("Failed to load react-quill-new:", err);
    throw err;
  })
);

const NewPolicyDetailsSettings = ({ onNext, isLoading: externalLoading }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState({
    refundPolicy: false,
    termsAndConditions: false,
    privacyPolicy: false,
    shippingPolicy: false,
  });
  const [policyDetails, setPolicyDetails] = useState({
    refundPolicy: "",
    termsAndConditions: "",
    privacyPolicy: "",
    shippingPolicy: "",
  });

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, value) => {
    setPolicyDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updatePolicyDetailsSetting(policyDetails);
      toast.success("Policy details saved successfully");
      setIsEditing({
        refundPolicy: false,
        termsAndConditions: false,
        privacyPolicy: false,
        shippingPolicy: false,
      });
      if (onNext) {
        onNext(); // Proceed to the next step (dashboard)
      }
    } catch (error) {
      toast.error(error.message || "Failed to save policy details");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditor = (field, label) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-[#1D372E]">{label}</h3>
        <button
          type="button"
          onClick={() => handleEditToggle(field)}
          className="text-[#5CAF90] hover:text-[#4a9a7d]"
          disabled={isLoading || externalLoading}
        >
          {isEditing[field] ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      </div>
      {isEditing[field] ? (
        <Suspense fallback={<div className="text-[#1D372E] p-4">Loading editor...</div>}>
          <ReactQuill
            value={policyDetails[field] || ""}
            onChange={(value) => handleChange(field, value)}
            className="bg-white text-[#1D372E]"
            theme="snow"
            readOnly={isLoading || externalLoading}
          />
        </Suspense>
      ) : (
        <div
          className="ql-editor bg-gray-50 p-4 rounded-md border border-[#1D372E] text-[#1D372E]"
          dangerouslySetInnerHTML={{ __html: policyDetails[field] || "No content available" }}
        />
      )}
    </div>
  );

  return (
    <div className="card bg-white shadow-md relative">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-[#1D372E] mb-6">Policy Details Settings</h2>
        <form onSubmit={handleSave}>
          {renderEditor("refundPolicy", "Refund Policy")}
          {renderEditor("termsAndConditions", "Terms and Conditions")}
          {renderEditor("privacyPolicy", "Privacy Policy")}
          {renderEditor("shippingPolicy", "Shipping Policy")}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="submit"
              className={`btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md ${
                isLoading || externalLoading ? "cursor-not-allowed" : ""
              }`}
              disabled={isLoading || externalLoading}
            >
              {isLoading || externalLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              className="btn btn-primary bg-[#1D372E] border-none text-white btn-sm md:btn-md"
              onClick={onNext}
              disabled={isLoading || externalLoading}
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPolicyDetailsSettings;