import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEyeSlash, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import { updateHeaderFooterSetting } from "../api/setting";
import TimelineDisplay from "../components/TimelineDisplay";

const HeaderFooterSettingsCreateOnly = ({ onNext }) => {
  const [countryBlocks, setCountryBlocks] = useState([]);
  const [newCountryBlock, setNewCountryBlock] = useState({
    title: "",
    address: "",
    hotline: "",
    email: "",
    whatsapp: "",
  });
  const [socialIcons, setSocialIcons] = useState([]);
  const [newSocialIcon, setNewSocialIcon] = useState({
    platform: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  // Country Blocks
  const handleAddCountryBlock = () => {
    if (!newCountryBlock.title || !newCountryBlock.address) {
      toast.error("Title and address are required for country blocks");
      return;
    }
    if (countryBlocks.length >= 4) {
      toast.error("Maximum 4 country blocks allowed");
      return;
    }
    setCountryBlocks([...countryBlocks, { ...newCountryBlock }]);
    setNewCountryBlock({
      title: "",
      address: "",
      hotline: "",
      email: "",
      whatsapp: "",
    });
  };
  const handleRemoveCountryBlock = (index) => {
    const updatedCountryBlocks = [...countryBlocks];
    updatedCountryBlocks.splice(index, 1);
    setCountryBlocks(updatedCountryBlocks);
  };

  // Social Icons
  const handleAddSocialIcon = () => {
    if (!newSocialIcon.platform || !newSocialIcon.url) {
      toast.error("Platform and URL are required");
      return;
    }
    if (socialIcons.some((icon) => icon.platform === newSocialIcon.platform)) {
      toast.error("This platform is already added");
      return;
    }
    setSocialIcons([...socialIcons, { ...newSocialIcon }]);
    setNewSocialIcon({
      platform: "",
      url: "",
    });
  };
  const handleRemoveSocialIcon = (index) => {
    const updatedSocialIcons = [...socialIcons];
    updatedSocialIcons.splice(index, 1);
    setSocialIcons(updatedSocialIcons);
  };

  // Submit handler (POST only)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("countryBlocks", JSON.stringify(countryBlocks));
      formData.append("socialIcons", JSON.stringify(socialIcons));
      await updateHeaderFooterSetting(formData); // POST only
      toast.success("Settings posted successfully");
      // Optionally clear form here
    } catch (error) {
      toast.error(error.message || "Failed to post settings");
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

  // Preview Component
  const Preview = () => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-[#1D372E] mb-4">Preview</h3>
      <div className="border rounded-lg overflow-hidden">
        <div
          className="text-white px-4 md:px-6 py-6 md:py-10 lg:py-12"
          style={{ backgroundColor: "#1D372E", fontFamily: '"Poppins", sans-serif' }}
        >
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {countryBlocks.map((loc, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <h3 className="font-bold text-sm md:text-base lg:text-lg text-white mb-2">
                    {loc.title}
                  </h3>
                  <p className="text-xs font-light text-white whitespace-pre-line">
                    {loc.address}
                  </p>
                  {loc.hotline && (
                    <p className="text-xs font-light text-white mt-2">
                      (Phone: {loc.hotline})
                    </p>
                  )}
                  {loc.email && (
                    <p className="text-xs font-light text-white">
                      Email: <a href={`mailto:${loc.email}`} className="hover:underline">{loc.email}</a>
                    </p>
                  )}
                  {loc.whatsapp && (
                    <p className="text-xs font-light text-white flex justify-center sm:justify-start items-center gap-2 mt-2">
                      <span>{loc.whatsapp}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white pt-4 md:pt-6 mt-4 flex justify-center gap-4 text-xs md:text-sm">
            {socialIcons.map((icon, index) => {
              const IconComponent = {
                Facebook: FaFacebookF,
                Twitter: FaTwitter,
                Instagram: FaInstagram,
                LinkedIn: FaLinkedinIn,
                YouTube: FaYoutube,
                WhatsApp: FaWhatsapp,
              }[icon.platform];
              if (!IconComponent) return null;
              return (
                <a
                  key={index}
                  href={icon.url}
                  aria-label={icon.platform}
                  className="border border-white rounded-full p-1.5 md:p-2 hover:scale-105 transition"
                >
                  <IconComponent className="text-xs md:text-sm" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Timeline at the top */}
      <div className="w-full" style={{ background: '#1D372E', paddingTop: 24, paddingBottom: 8 }}>
        <TimelineDisplay currentStep="settings" />
      </div>
      <div style={{ background: '#1D372E', minHeight: '100vh' }}>
        <div className="card bg-white shadow-md relative mx-auto w-[1300px]">
          <div className="card-body">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[#5CAF90]"></div>
                <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
                  Manage Header and Footer (Create Only)
                </h2>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`btn gap-2 btn-sm md:btn-md ${showPreview ? 'bg-[#1D372E] border-[#1D372E] hover:bg-[#162a23]' : 'bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]'}`}
                disabled={isLoading}
              >
                {showPreview ? <><FaEyeSlash className="w-4 h-4" /> Hide Preview</> : <><FaEye className="w-4 h-4" /> Show Preview</>}
              </button>
            </div>

            {showPreview && <Preview />}

            <form onSubmit={handleSave}>
              {/* Country Blocks */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                  Country Blocks
                </h3>
                {countryBlocks.length > 0 ? (
                  <div className="md:hidden space-y-4">
                    {countryBlocks.map((block, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-[#1D372E] text-lg">
                            {block.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveCountryBlock(index)}
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              Address:{" "}
                            </span>
                            <span className="text-gray-600">{block.address}</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              Hotline:{" "}
                            </span>
                            <span className="text-gray-600">{block.hotline}</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              Email:{" "}
                            </span>
                            <span className="text-gray-600 break-all">
                              {block.email}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              WhatsApp:{" "}
                            </span>
                            <span className="text-gray-600">{block.whatsapp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyStateMessage message="No country blocks found." />
                )}
                {/* Add New Country Block */}
                <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                  <h4 className="font-medium text-[#1D372E] mb-3">
                    Add New Country Block
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Title</span>
                      </label>
                      <input
                        type="text"
                        value={newCountryBlock.title}
                        onChange={(e) =>
                          setNewCountryBlock({
                            ...newCountryBlock,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter title (e.g. SL:)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Hotline
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newCountryBlock.hotline}
                        onChange={(e) =>
                          setNewCountryBlock({
                            ...newCountryBlock,
                            hotline: e.target.value,
                          })
                        }
                        placeholder="Enter hotline (e.g. +94 112 345 678)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Address
                        </span>
                      </label>
                      <textarea
                        value={newCountryBlock.address}
                        onChange={(e) =>
                          setNewCountryBlock({
                            ...newCountryBlock,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter address (e.g. TechWave Solutions, 123 Main Street)"
                        className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">Email</span>
                      </label>
                      <input
                        type="email"
                        value={newCountryBlock.email}
                        onChange={(e) =>
                          setNewCountryBlock({
                            ...newCountryBlock,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter email (e.g. info@techwave.com)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          WhatsApp
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newCountryBlock.whatsapp}
                        onChange={(e) =>
                          setNewCountryBlock({
                            ...newCountryBlock,
                            whatsapp: e.target.value,
                          })
                        }
                        placeholder="Enter whatsapp number (e.g. +94 112 345 678)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCountryBlock}
                    className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                  >
                    <FaPlus className="w-3 h-3 mr-1" /> Add Country Block
                  </button>
                </div>
              </div>

              {/* Social Icons */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                  Social Icons
                </h3>
                {socialIcons.length > 0 ? (
                  <div className="md:hidden space-y-4">
                    {socialIcons.map((icon, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#1D372E] mb-1">
                              {icon.platform}
                            </div>
                            <div className="text-sm text-gray-600 break-all">
                              {icon.url}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialIcon(index)}
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d] ml-2"
                          >
                            <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyStateMessage message="No social icons found." />
                )}
                {/* Add New Social Icon */}
                <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                  <h4 className="font-medium text-[#1D372E] mb-3">
                    Add New Social Icon
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">
                          Platform
                        </span>
                      </label>
                      <select
                        value={newSocialIcon.platform}
                        onChange={(e) =>
                          setNewSocialIcon({
                            ...newSocialIcon,
                            platform: e.target.value,
                          })
                        }
                        className="select select-bordered select-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      >
                        <option value="">Select Platform</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="YouTube">YouTube</option>
                        <option value="WhatsApp">WhatsApp</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-[#1D372E]">URL</span>
                      </label>
                      <input
                        type="text"
                        value={newSocialIcon.url}
                        onChange={(e) =>
                          setNewSocialIcon({
                            ...newSocialIcon,
                            url: e.target.value,
                          })
                        }
                        placeholder="Enter URL (e.g. https://facebook.com/techwave)"
                        className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSocialIcon}
                    className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                  >
                    <FaPlus className="w-3 h-3 mr-1" /> Add Social Icon
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md"
                  onClick={() => navigate('/signup')}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const formData = new FormData();
                      formData.append("countryBlocks", JSON.stringify(countryBlocks));
                      formData.append("socialIcons", JSON.stringify(socialIcons));
                      await updateHeaderFooterSetting(formData);
                      toast.success("Header/Footer settings saved!");
                      if (onNext) {
                        onNext();
                      } else {
                        navigate("/newaboutUssetting");
                      }
                    } catch (error) {
                      toast.error(error.message || "Failed to save settings");
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

export default HeaderFooterSettingsCreateOnly;