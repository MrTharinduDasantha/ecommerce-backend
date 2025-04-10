import { useState, useRef, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {
  fetchHeaderFooterSetting,
  updateHeaderFooterSetting,
} from "../api/setting";
import toast from "react-hot-toast";

const Settings = () => {
  const [headerFooterSetting, setHeaderFooterSetting] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [copyrightText, setCopyrightText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logoInputRef = useRef(null);

  // Load header and footer settings when component mounts
  useEffect(() => {
    async function loadHeaderFooterSetting() {
      try {
        setIsLoading(true);
        const data = await fetchHeaderFooterSetting();
        if (data) {
          setHeaderFooterSetting(data);
        }
      } catch (error) {
        toast.error(
          error.message || "Failed to load header and footer settings"
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadHeaderFooterSetting();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  // When edit is clicked, load the stored settings into the input fields
  const handleEdit = () => {
    setIsEditing(true);
    if (headerFooterSetting) {
      setLogoPreview(headerFooterSetting.Navbar_Logo_Url);
      setCopyrightText(headerFooterSetting.Footer_Copyright);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!logoPreview || !copyrightText.trim()) {
      toast.error("Logo and copyright are required");
      return;
    }

    try {
      setIsLoading(true);
      // Build form data
      const formData = new FormData();
      // Append the file only if a new one is provided
      if (logo) {
        formData.append("navbarLogo", logo);
      }
      formData.append("footerCopyright", copyrightText);

      const updatedSetting = await updateHeaderFooterSetting(formData);
      toast.success("Settings saved successfully");
      setHeaderFooterSetting(updatedSetting);
      setIsEditing(false);

      // Reset the form
      setLogo(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogo(null);
    setLogoPreview(null);
    setCopyrightText("");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  if (isLoading && !headerFooterSetting) {
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
    <div className="card bg-white shadow-md">
      <div className="card-body">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-xl font-bold text-[#1D372E]">
              Manage Settings
            </h2>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="btn btn-primary btn-sm gap-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
            >
              <FaEdit className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Navbar Logo Input */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Navbar Logo</span>
              </label>
              <input
                type="file"
                onChange={handleLogoChange}
                ref={logoInputRef}
                className="file-input file-input-bordered w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                disabled={!isEditing}
              />
              {logoPreview && (
                <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="object-contain w-full h-full"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Copyright Input */}
            <div className="form-control">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Footer Copyright</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder="Enter copyright text"
                  className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
              ) : (
                <div className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center">
                  {copyrightText || (
                    <span className="text-gray-400">Enter copyright text</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-sm bg-[#5CAF90] border-none text-white ${
                  isLoading ? "cursor-not-allowed" : "hover:bg-[#4a9a7d]"
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
      </div>
    </div>
  );
};

export default Settings;
