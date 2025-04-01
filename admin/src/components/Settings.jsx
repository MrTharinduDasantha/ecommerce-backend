import { useState, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";

const Settings = () => {
  // eslint-disable-next-line no-unused-vars
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [copyrightText, setCopyrightText] = useState("");
  const logoInputRef = useRef(null);

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

  const handleSave = (e) => {
    e.preventDefault();
    // Todo: Save settings to server
    toast.success("Settings saved successfully");
  };
  return (
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D372E] mb-6">
        Manage Settings
      </h2>

      {/* Header and Footer Settings */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-8 bg-[#5CAF90] mr-3"></div>
          <h3 className="text-xl font-semibold text-[#1D372E]">
            Header and Footer
          </h3>
        </div>
        <button className="flex items-center bg-[#5CAF90] text-white px-4 py-2 rounded-2xl cursor-pointer">
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSave}>
        <div className="flex flex-wrap gap-5">
          {/* Navbar Logo Input */}
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium mb-1">Navbar Logo</label>
            <input
              type="file"
              onChange={handleLogoChange}
              ref={logoInputRef}
              className="file-input file-input-bordered w-full bg-white border-2 border-[#1D372E] rounded-2xl"
            />
            {logoPreview && (
              <div className="relative mt-4 w-32 h-32 border border-gray-300 rounded-2xl">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="object-cover w-full h-full rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-1 right-1 bg-[#5CAF90] p-1.5 cursor-pointer rounded-2xl"
                >
                  <RiDeleteBin5Fill size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Copyright Input */}
          <div className="flex-1 min-w-[250px] text-[#1D372E]">
            <label className="block font-medium mb-1">Footer Copyright</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="Enter copyright text"
              className="input input-bordered w-full bg-white border-2 border-[#1D372E] rounded-2xl"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="btn bg-[#5CAF90] border-none font-medium rounded-2xl"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
