import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import googleplay from "../assets/googleplay.png";
import appstore from "../assets/appstore.png";
import { updateHeaderFooterSetting } from "../api/setting";

const HeaderFooterSettingsCreateOnly = ({ onNext }) => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [copyrightText, setCopyrightText] = useState("");
  const [navIcons, setNavIcons] = useState([]);
  const [newNavIcon, setNewNavIcon] = useState({
    icon: "",
    label: "",
    link: "",
    iconImage: null,
    iconImagePreview: null,
  });
  const [countryBlocks, setCountryBlocks] = useState([]);
  const [newCountryBlock, setNewCountryBlock] = useState({
    title: "",
    address: "",
    hotline: "",
    email: "",
    whatsapp: "",
  });
  const [footerLinks, setFooterLinks] = useState([]);
  const [newFooterLink, setNewFooterLink] = useState({
    text: "",
    url: "",
  });
  const [socialIcons, setSocialIcons] = useState([]);
  const [newSocialIcon, setNewSocialIcon] = useState({
    platform: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const logoInputRef = useRef(null);
  const navIconImageRef = useRef(null);
  const navigate = useNavigate();

  // Handlers for logo
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

  // Navigation Icons
  const handleAddNavIcon = () => {
    if (!newNavIcon.label || !newNavIcon.link) {
      toast.error("Label and link are required");
      return;
    }
    setNavIcons([...navIcons, { ...newNavIcon }]);
    setNewNavIcon({
      icon: "",
      label: "",
      link: "",
      iconImage: null,
      iconImagePreview: null,
    });
    if (navIconImageRef.current) navIconImageRef.current.value = "";
  };
  const handleRemoveNavIcon = (index) => {
    const updatedNavIcons = [...navIcons];
    updatedNavIcons.splice(index, 1);
    setNavIcons(updatedNavIcons);
  };
  const handleNavIconImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNavIcon({
        ...newNavIcon,
        iconImage: file,
        iconImagePreview: URL.createObjectURL(file),
      });
    }
  };
  const removeNavIconImagePreview = () => {
    setNewNavIcon({
      ...newNavIcon,
      iconImage: null,
      iconImagePreview: null,
    });
    if (navIconImageRef.current) navIconImageRef.current.value = "";
  };

  // Country Blocks
  const handleAddCountryBlock = () => {
    if (!newCountryBlock.title || !newCountryBlock.address) {
      toast.error("Title and address are required for country blocks");
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

  // Footer Links
  const handleAddFooterLink = () => {
    if (!newFooterLink.text || !newFooterLink.url) {
      toast.error("Text and URL are required");
      return;
    }
    setFooterLinks([...footerLinks, { ...newFooterLink }]);
    setNewFooterLink({
      text: "",
      url: "",
    });
  };
  const handleRemoveFooterLink = (index) => {
    const updatedFooterLinks = [...footerLinks];
    updatedFooterLinks.splice(index, 1);
    setFooterLinks(updatedFooterLinks);
  };

  // Social Icons
  const handleAddSocialIcon = () => {
    if (!newSocialIcon.platform || !newSocialIcon.url) {
      toast.error("Platform and URL are required");
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
    if (!logoPreview || !copyrightText.trim()) {
      toast.error("Logo and copyright are required");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (logo) formData.append("navbarLogo", logo);
      formData.append("footerCopyright", copyrightText);
      formData.append("navIcons", JSON.stringify(navIcons));
      formData.append("countryBlocks", JSON.stringify(countryBlocks));
      formData.append("footerLinks", JSON.stringify(footerLinks));
      formData.append("socialIcons", JSON.stringify(socialIcons));
      navIcons.forEach((icon, index) => {
        if (icon.iconImage && icon.iconImage instanceof File) {
          formData.append(`navIconImage_${index}`, icon.iconImage);
        }
      });
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

  return (
    <div className="card bg-white shadow-md relative">
      <div className="card-body">
        <form onSubmit={handleSave}>
          {/* General Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Navbar Logo Input */}
              <div className="form-control">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm md:text-base font-medium">
                    Navbar Logo
                  </span>
                </label>
                <input
                  type="file"
                  onChange={handleLogoChange}
                  ref={logoInputRef}
                  className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
                {logoPreview && (
                  <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="object-contain bg-[#1D372E] w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1.5 right-1 text-white"
                    >
                      <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {/* Copyright Input */}
              <div className="form-control">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm md:text-base font-medium">
                    Footer Copyright
                  </span>
                </label>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  placeholder="Enter copyright text"
                  className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                />
              </div>
            </div>
          </div>

          {/* Navigation Icons Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
              Navigation Icons
            </h3>
            {navIcons.length > 0 ? (
              <div className="md:hidden space-y-4">
                {navIcons.map((icon, index) => (
                  <div
                    key={index}
                    className="border border-[#1D372E] rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {icon.iconImagePreview ? (
                          <img
                            src={icon.iconImagePreview}
                            alt={icon.label}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">
                            <span className="text-xs">No icon</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#1D372E]">
                            {icon.label}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {icon.link}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNavIcon(index)}
                        className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      >
                        <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateMessage message="No navigation icons found." />
            )}
            {/* Add New Navigation Icon */}
            <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
              <h4 className="font-medium text-[#1D372E] mb-3">
                Add New Navigation Icon
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">
                      Icon (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newNavIcon.icon}
                    onChange={(e) =>
                      setNewNavIcon({ ...newNavIcon, icon: e.target.value })
                    }
                    placeholder="Enter icon (e.g. FaGift)"
                    className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">
                      Icon Image
                    </span>
                  </label>
                  <input
                    type="file"
                    onChange={handleNavIconImageChange}
                    ref={navIconImageRef}
                    className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                  {newNavIcon.iconImagePreview && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={newNavIcon.iconImagePreview}
                        alt="Icon Preview"
                        className="w-16 h-16 object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeNavIconImagePreview}
                        className="btn btn-xs bg-[#5CAF90] hover:bg-[#4a9a7d] border-[#5CAF90] btn-square absolute top-1 right-1 text-white"
                      >
                        <RiDeleteBin5Fill className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">Label</span>
                  </label>
                  <input
                    type="text"
                    value={newNavIcon.label}
                    onChange={(e) =>
                      setNewNavIcon({
                        ...newNavIcon,
                        label: e.target.value,
                      })
                    }
                    placeholder="Enter label (e.g. Seasonal Offers)"
                    className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-[#1D372E]">Link</span>
                  </label>
                  <input
                    type="text"
                    value={newNavIcon.link}
                    onChange={(e) =>
                      setNewNavIcon({ ...newNavIcon, link: e.target.value })
                    }
                    placeholder="Enter link (e.g. /seasonal-offers)"
                    className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddNavIcon}
                className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
              >
                <FaPlus className="w-3 h-3 mr-1" /> Add Icon
              </button>
            </div>
          </div>

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

          {/* Footer Links & Social Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
              Footer Links & Social
            </h3>
            {/* Footer Links */}
            <div className="mb-6">
              <h4 className="font-medium text-[#1D372E] mb-3">
                Footer Links
              </h4>
              {footerLinks.length > 0 ? (
                <div className="md:hidden space-y-4">
                  {footerLinks.map((link, index) => (
                    <div
                      key={index}
                      className="border border-[#1D372E] rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[#1D372E] mb-1">
                            {link.text}
                          </div>
                          <div className="text-sm text-gray-600 break-all">
                            {link.url}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLink(index)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d] ml-2"
                        >
                          <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateMessage message="No footer links found." />
              )}
              {/* Add New Footer Link */}
              <div className="p-4 border border-[#1D372E] rounded-lg mt-4">
                <h4 className="font-medium text-[#1D372E] mb-3">
                  Add New Footer Link
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-[#1D372E]">
                        Text
                      </span>
                    </label>
                    <input
                      type="text"
                      value={newFooterLink.text}
                      onChange={(e) =>
                        setNewFooterLink({
                          ...newFooterLink,
                          text: e.target.value,
                        })
                      }
                      placeholder="Enter text (e.g. Read About TechWave)"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-[#1D372E]">URL</span>
                    </label>
                    <input
                      type="text"
                      value={newFooterLink.url}
                      onChange={(e) =>
                        setNewFooterLink({
                          ...newFooterLink,
                          url: e.target.value,
                        })
                      }
                      placeholder="Enter URL (e.g. /about)"
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddFooterLink}
                  className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                >
                  <FaPlus className="w-3 h-3 mr-1" /> Add Footer Link
                </button>
              </div>
            </div>
            {/* Social Icons */}
            <div>
              <h4 className="font-medium text-[#1D372E] mb-3">
                Social Icons
              </h4>
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
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="submit"
              className={`btn btn-primary bg-[#043319] border-none text-white btn-sm md:btn-md ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Posting...
                </>
              ) : (
                "Back"
              )}
            </button>
            <button
              type="button"
              className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md"
              onClick={onNext}
              disabled={isLoading}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeaderFooterSettingsCreateOnly;