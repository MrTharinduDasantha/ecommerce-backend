import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  fetchPolicyDetailsSetting,
  updatePolicyDetailsSetting,
} from "../api/setting";
import toast from "react-hot-toast";

const PolicyDetailsSettings = () => {
  const [policyDetailsSetting, setPolicyDetailsSetting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("legal");

  // Policy content states
  const [legalPolicyContent, setLegalPolicyContent] = useState("");
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState("");
  const [securityPolicyContent, setSecurityPolicyContent] = useState("");
  const [termsOfServiceContent, setTermsOfServiceContent] = useState("");

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "align",
    "link",
    "blockquote",
    "code-block",
    "color",
    "background",
  ];

  // Policy tabs configuration
  const policyTabs = [
    {
      id: "legal",
      label: "Legal Policy",
      content: legalPolicyContent,
      setter: setLegalPolicyContent,
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      content: privacyPolicyContent,
      setter: setPrivacyPolicyContent,
    },
    {
      id: "security",
      label: "Security Policy",
      content: securityPolicyContent,
      setter: setSecurityPolicyContent,
    },
    {
      id: "terms",
      label: "Terms of Service",
      content: termsOfServiceContent,
      setter: setTermsOfServiceContent,
    },
  ];

  // Check if all required fields are filled
  const canShowPreview = () => {
    const stripHtml = (html) => {
      // Remove HTML tags and check if there's actual text content
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    };

    return (
      stripHtml(legalPolicyContent).trim() &&
      stripHtml(privacyPolicyContent).trim() &&
      stripHtml(securityPolicyContent).trim() &&
      stripHtml(termsOfServiceContent).trim()
    );
  };

  // Toggle preview based on validation
  const togglePreview = () => {
    if (!showPreview) {
      if (canShowPreview()) {
        setShowPreview(true);
        // Reset to first tab when showing preview
        setActiveTab("legal");
      } else {
        toast.error(
          "Please fill in all policy content before viewing the preview"
        );
      }
    } else {
      setShowPreview(false);
    }
  };

  // Load policy details settings when component mounts
  useEffect(() => {
    async function loadPolicyDetailsSetting() {
      try {
        setIsLoading(true);
        const data = await fetchPolicyDetailsSetting();
        if (data) {
          setPolicyDetailsSetting(data);
          setLegalPolicyContent(data.Legal_Policy_Content || "");
          setPrivacyPolicyContent(data.Privacy_Policy_Content || "");
          setSecurityPolicyContent(data.Security_Policy_Content || "");
          setTermsOfServiceContent(data.Terms_Of_Service_Content || "");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load policy details settings");
      } finally {
        setIsLoading(false);
      }
    }

    loadPolicyDetailsSetting();
  }, []);

  // Edit handler
  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
    // Reset to first tab when editing
    setActiveTab("legal");

    // Force refresh of ReactQuill editor
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  };

  // Tab switch handler
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    // If in editing mode, refresh the editor after tab switch
    if (isEditing) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 50);
    }
  };

  // Save handler
  const handleSave = async (e) => {
    e.preventDefault();

    if (!canShowPreview()) {
      toast.error("Please fill in all policy content");
      return;
    }

    try {
      setIsLoading(true);

      const policyData = {
        legalPolicyContent,
        privacyPolicyContent,
        securityPolicyContent,
        termsOfServiceContent,
      };

      const updatedSetting = await updatePolicyDetailsSetting(policyData);
      toast.success("Policy details saved successfully");
      setPolicyDetailsSetting(updatedSetting);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to save policy details");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setIsEditing(false);
    setShowPreview(false);
    setActiveTab("legal");

    if (policyDetailsSetting) {
      // Restore state from policyDetailsSetting
      setLegalPolicyContent(policyDetailsSetting.Legal_Policy_Content || "");
      setPrivacyPolicyContent(
        policyDetailsSetting.Privacy_Policy_Content || ""
      );
      setSecurityPolicyContent(
        policyDetailsSetting.Security_Policy_Content || ""
      );
      setTermsOfServiceContent(
        policyDetailsSetting.Terms_Of_Service_Content || ""
      );
    } else {
      // If no policyDetailsSetting, reset to initial state
      setLegalPolicyContent("");
      setPrivacyPolicyContent("");
      setSecurityPolicyContent("");
      setTermsOfServiceContent("");
    }
  };

  // Get current active tab content
  const getCurrentTabContent = () => {
    switch (activeTab) {
      case "legal":
        return legalPolicyContent;
      case "privacy":
        return privacyPolicyContent;
      case "security":
        return securityPolicyContent;
      case "terms":
        return termsOfServiceContent;
      default:
        return "";
    }
  };

  // Preview Component
  const PolicyPreview = () => {
    const renderTabContent = () => {
      const content = getCurrentTabContent();
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
          Policy Details Preview
        </h3>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {policyTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSwitch(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#5CAF90] text-[#5CAF90]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 text-[#1D372E] rounded-lg border border-gray-200 min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    );
  };

  if (isLoading && !policyDetailsSetting) {
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
              Manage Policy Details
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
          <PolicyPreview />
        ) : (
          <form onSubmit={handleSave}>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
              {policyTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-[#5CAF90] text-[#5CAF90]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {/* Only render the active tab's content */}
              {(() => {
                const currentTab = policyTabs.find(
                  (tab) => tab.id === activeTab
                );
                if (!currentTab) return null;

                return (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-[#1D372E] text-lg font-medium">
                        {currentTab.label} Content
                      </span>
                    </label>
                    {isEditing ? (
                      <div className="border border-[#1D372E] text-[#1D372E] rounded-lg">
                        <ReactQuill
                          key={`${currentTab.id}-${isEditing}`}
                          value={currentTab.content}
                          onChange={currentTab.setter}
                          modules={quillModules}
                          formats={quillFormats}
                          theme="snow"
                          style={{ minHeight: "300px" }}
                          placeholder={`Enter ${currentTab.label.toLowerCase()} content...`}
                        />
                      </div>
                    ) : (
                      <div className="border border-[#1D372E] rounded-lg p-4 bg-white min-h-[300px] overflow-auto">
                        {currentTab.content ? (
                          <div
                            className="prose max-w-none text-[#1D372E]"
                            dangerouslySetInnerHTML={{
                              __html: currentTab.content,
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 italic">
                            No content available for{" "}
                            {currentTab.label.toLowerCase()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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

export default PolicyDetailsSettings;
