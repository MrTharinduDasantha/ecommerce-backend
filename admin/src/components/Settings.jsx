import { useState, useRef, useEffect } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
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
  const [activeTab, setActiveTab] = useState("general");

  // Navigation Icons State
  const [navIcons, setNavIcons] = useState([]);
  const [newNavIcon, setNewNavIcon] = useState({
    icon: "",
    label: "",
    link: "",
    iconImage: null,
    iconImagePreview: null,
  });

  // Country Blocks State
  const [countryBlocks, setCountryBlocks] = useState([]);
  const [newCountryBlock, setNewCountryBlock] = useState({
    title: "",
    address: "",
    hotline: "",
    email: "",
    whatsapp: "",
  });

  // Footer Links State
  const [footerLinks, setFooterLinks] = useState([]);
  const [newFooterLink, setNewFooterLink] = useState({
    text: "",
    url: "",
  });

  // Social Icons State
  const [socialIcons, setSocialIcons] = useState([]);
  const [newSocialIcon, setNewSocialIcon] = useState({
    platform: "",
    url: "",
  });

  const logoInputRef = useRef(null);
  const navIconImageRef = useRef(null);

  // Load header and footer settings when component mounts
  useEffect(() => {
    async function loadHeaderFooterSetting() {
      try {
        setIsLoading(true);
        const data = await fetchHeaderFooterSetting();
        if (data) {
          setHeaderFooterSetting(data);
          setLogoPreview(data.Navbar_Logo_Url);
          setCopyrightText(data.Footer_Copyright);

          // Set navigation icons if available
          if (data.Nav_Icons && Array.isArray(JSON.parse(data.Nav_Icons))) {
            setNavIcons(JSON.parse(data.Nav_Icons));
          }

          // Set country blocks if available
          if (
            data.Country_Blocks &&
            Array.isArray(JSON.parse(data.Country_Blocks))
          ) {
            setCountryBlocks(JSON.parse(data.Country_Blocks));
          }

          // Set footer links if available
          if (
            data.Footer_Links &&
            Array.isArray(JSON.parse(data.Footer_Links))
          ) {
            setFooterLinks(JSON.parse(data.Footer_Links));
          }

          // Set social icons if available
          if (
            data.Social_Icons &&
            Array.isArray(JSON.parse(data.Social_Icons))
          ) {
            setSocialIcons(JSON.parse(data.Social_Icons));
          }
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

      // Add navigation icons
      formData.append("navIcons", JSON.stringify(navIcons));

      // Add country blocks
      formData.append("countryBlocks", JSON.stringify(countryBlocks));

      // Add footer links
      formData.append("footerLinks", JSON.stringify(footerLinks));

      // Add social icons
      formData.append("socialIcons", JSON.stringify(socialIcons));

      // Upload nav icon images if any
      navIcons.forEach((icon, index) => {
        if (icon.iconImage && icon.iconImage instanceof File) {
          formData.append(`navIconImage_${index}`, icon.iconImage);
        }
      });

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

  // Navigation Icons Handlers
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

  // Country Blocks Handlers
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

  // Footer Links Handlers
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

  // Social Icons Handlers
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
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Manage Settings
            </h2>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="btn btn-primary gap-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md"
            >
              <FaEdit className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-[#1D372E] mb-6 w-fit">
          <button
            className={`px-3 py-3 font-medium text-white hover:bg-[#5CAF90] transition border-r cursor-pointer ${
              activeTab === "general" ? "bg-[#5CAF90]" : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`px-3 py-3 font-medium text-white hover:bg-[#5CAF90] transition border-r cursor-pointer ${
              activeTab === "navIcons" ? "bg-[#5CAF90]" : ""
            }`}
            onClick={() => setActiveTab("navIcons")}
          >
            Navigation Icons
          </button>
          <button
            className={`px-3 py-3 font-medium text-white hover:bg-[#5CAF90] transition border-r cursor-pointer ${
              activeTab === "countryBlocks" ? "bg-[#5CAF90]" : ""
            }`}
            onClick={() => setActiveTab("countryBlocks")}
          >
            Country Blocks
          </button>
          <button
            className={`px-3 py-3 font-medium text-white hover:bg-[#5CAF90] transition border-r cursor-pointer ${
              activeTab === "footerLinks" ? "bg-[#5CAF90]" : ""
            }`}
            onClick={() => setActiveTab("footerLinks")}
          >
            Footer Links & Social
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* General Settings */}
          {activeTab === "general" && (
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
                  className="file-input file-input-bordered file-input-sm md:file-input-md w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
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
                  <span className="label-text text-sm md:text-base font-medium">
                    Footer Copyright
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    placeholder="Enter copyright text"
                    className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  />
                ) : (
                  <div className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center">
                    {headerFooterSetting?.Footer_Copyright || (
                      <span className="text-gray-400">
                        Enter copyright text
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Icons Settings */}
          {activeTab === "navIcons" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1D372E]">
                Navigation Icons
              </h3>

              {/* Existing Navigation Icons */}
              <div className="overflow-x-auto">
                <table className="table-auto text-center border border-[#1D372E] text-[#1D372E] w-full">
                  <thead className="bg-[#EAFFF7] text-[#1D372E]">
                    <tr className="border-b border-[#1D372E]">
                      <th className="py-2">Icon</th>
                      <th className="py-2">Label</th>
                      <th className="py-2">Link</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="border-b border-[#1D372E]">
                    {navIcons.map((icon, index) => (
                      <tr key={index} className="border border-[#1D372E]">
                        <td className="flex items-center justify-center">
                          {icon.iconImagePreview ? (
                            <img
                              src={icon.iconImagePreview}
                              alt={icon.label}
                              className="w-8 h-8 object-contain my-1"
                            />
                          ) : (
                            <div className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded">
                              <span className="text-xs">{icon.icon}</span>
                            </div>
                          )}
                        </td>
                        <td>{icon.label}</td>
                        <td>{icon.link}</td>
                        <td>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNavIcon(index)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Navigation Icon */}
              {isEditing && (
                <div className="p-4 border border-[#1D372E] rounded-lg">
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
                  {newNavIcon.iconImagePreview && (
                    <div className="mt-2">
                      <img
                        src={newNavIcon.iconImagePreview}
                        alt="Icon Preview"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleAddNavIcon}
                    className="btn btn-sm btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] text-white mt-4"
                  >
                    <FaPlus className="w-3 h-3 mr-1" /> Add Icon
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Country Blocks Settings */}
          {activeTab === "countryBlocks" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1D372E]">
                Country Blocks
              </h3>

              {/* Existing Country Blocks */}
              <div className="overflow-x-auto">
                <table className="table-auto text-center border border-[#1D372E] text-[#1D372E] w-full">
                  <thead className="bg-[#EAFFF7] text-[#1D372E]">
                    <tr className="border-b border-[#1D372E]">
                      <th className="py-2">Title</th>
                      <th className="py-2">Address</th>
                      <th className="py-2">Hotline</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">WhatsApp</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="border-b border-[#1D372E]">
                    {countryBlocks.map((block, index) => (
                      <tr key={index} className="border-b border-[#1D372E]">
                        <td className="py-2">{block.title}</td>
                        <td className="py-2">
                          {block.address.substring(0, 20)}...
                        </td>
                        <td className="py-2">{block.hotline}</td>
                        <td className="py-2">{block.email}</td>
                        <td className="py-2">{block.whatsapp}</td>
                        <td className="py-2">
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCountryBlock(index)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Country Block */}
              {isEditing && (
                <div className="p-4 border border-[#1D372E] rounded-lg">
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
              )}
            </div>
          )}

          {/* Footer Links & Social Icons Settings */}
          {activeTab === "footerLinks" && (
            <div className="space-y-6">
              {/* Footer Links */}
              <div>
                <h3 className="text-lg font-semibold text-[#1D372E]">
                  Footer Links
                </h3>

                {/* Existing Footer Links */}
                <div className="overflow-x-auto mt-4">
                  <table className="table-auto text-center border border-[#1D372E] text-[#1D372E] w-full">
                    <thead className="bg-[#EAFFF7] text-[#1D372E]">
                      <tr className="border-b border-[#1D372E]">
                        <th className="py-2">Text</th>
                        <th className="py-2">URL</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-[#1D372E]">
                      {footerLinks.map((link, index) => (
                        <tr key={index} className="border-b border-[#1D372E]">
                          <td className="py-2">{link.text}</td>
                          <td className="py-2">{link.url}</td>
                          <td className="py-2">
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFooterLink(index)}
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                              >
                                <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Footer Link */}
                {isEditing && (
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
                )}
              </div>

              {/* Social Icons */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#1D372E]">
                  Social Icons
                </h3>

                {/* Existing Social Icons */}
                <div className="overflow-x-auto mt-4">
                  <table className="table-auto text-center border border-[#1D372E] text-[#1D372E] w-full">
                    <thead className="bg-[#EAFFF7] text-[#1D372E]">
                      <tr className="border-b border-[#1D372E]">
                        <th className="py-2">Platform</th>
                        <th className="py-2">URL</th>
                        <th className="py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-[#1D372E]">
                      {socialIcons.map((icon, index) => (
                        <tr key={index} className="border-b border-[#1D372E]">
                          <td className="py-2">{icon.platform}</td>
                          <td className="py-2">{icon.url}</td>
                          <td className="py-2">
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSocialIcon(index)}
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                              >
                                <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Social Icon */}
                {isEditing && (
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
                )}
              </div>
            </div>
          )}

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
      </div>
    </div>
  );
};

export default Settings;
