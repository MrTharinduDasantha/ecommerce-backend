import React from "react";
import { useState, useRef, useEffect } from "react";
import { FaEdit, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaRocket,
  FaTags,
  FaCalendarAlt,
  FaHeart,
  FaNetworkWired,
  FaGift,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import {
  fetchHeaderFooterSetting,
  updateHeaderFooterSetting,
} from "../api/setting";
import toast from "react-hot-toast";
import googleplay from "../assets/googleplay.png";
import appstore from "../assets/appstore.png";

const HeaderFooterSettings = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerFooterSetting, setHeaderFooterSetting] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [copyrightText, setCopyrightText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  // Check if all required fields are filled
  const canShowPreview = () => {
    if (!logoPreview || !copyrightText.trim()) return false;
    if (navIcons.length === 0) return false;
    if (countryBlocks.length === 0) return false;
    if (footerLinks.length === 0) return false;
    if (socialIcons.length === 0) return false;
    return true;
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

          if (data.Nav_Icons && Array.isArray(data.Nav_Icons)) {
            setNavIcons(
              data.Nav_Icons.map(({ icon, label, link, iconImageUrl }) => ({
                icon,
                label,
                link,
                iconImageUrl: iconImageUrl || null,
              }))
            );
          }

          if (data.Country_Blocks && Array.isArray(data.Country_Blocks)) {
            setCountryBlocks(data.Country_Blocks);
          }

          if (data.Footer_Links && Array.isArray(data.Footer_Links)) {
            setFooterLinks(data.Footer_Links);
          }

          if (data.Social_Icons && Array.isArray(data.Social_Icons)) {
            setSocialIcons(data.Social_Icons);
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

  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
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
      const formData = new FormData();
      if (logo) {
        formData.append("navbarLogo", logo);
      }
      formData.append("footerCopyright", copyrightText);

      const navIconsForBackend = navIcons.map(
        ({ icon, label, link, iconImageUrl }) => ({
          icon,
          label,
          link,
          iconImageUrl: iconImageUrl || undefined,
        })
      );
      formData.append("navIcons", JSON.stringify(navIconsForBackend));

      formData.append("countryBlocks", JSON.stringify(countryBlocks));
      formData.append("footerLinks", JSON.stringify(footerLinks));
      formData.append("socialIcons", JSON.stringify(socialIcons));

      navIcons.forEach((icon, index) => {
        if (icon.iconImage && icon.iconImage instanceof File) {
          formData.append(`navIconImage_${index}`, icon.iconImage);
        }
      });

      const updatedSetting = await updateHeaderFooterSetting(formData);
      toast.success("Settings saved successfully");
      setHeaderFooterSetting(updatedSetting);
      setIsEditing(false);

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
    setShowPreview(false);
    if (headerFooterSetting) {
      setLogoPreview(headerFooterSetting.Navbar_Logo_Url);
      setCopyrightText(headerFooterSetting.Footer_Copyright);
      setNavIcons(headerFooterSetting.Nav_Icons || []);
      setCountryBlocks(headerFooterSetting.Country_Blocks || []);
      setFooterLinks(headerFooterSetting.Footer_Links || []);
      setSocialIcons(headerFooterSetting.Social_Icons || []);
    } else {
      setLogoPreview(null);
      setCopyrightText("");
      setNavIcons([]);
      setCountryBlocks([]);
      setFooterLinks([]);
      setSocialIcons([]);
    }
    setLogo(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    setNewNavIcon({
      icon: "",
      label: "",
      link: "",
      iconImage: null,
      iconImagePreview: null,
    });
    setNewCountryBlock({
      title: "",
      address: "",
      hotline: "",
      email: "",
      whatsapp: "",
    });
    setNewFooterLink({
      text: "",
      url: "",
    });
    setNewSocialIcon({
      platform: "",
      url: "",
    });
    if (navIconImageRef.current) navIconImageRef.current.value = "";
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

  const removeNavIconImagePreview = () => {
    setNewNavIcon({
      ...newNavIcon,
      iconImage: null,
      iconImagePreview: null,
    });
    if (navIconImageRef.current) navIconImageRef.current.value = "";
  };

  // Country Blocks Handlers
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

  // Footer Links Handlers
  const handleAddFooterLink = () => {
    if (!newFooterLink.text || !newFooterLink.url) {
      toast.error("Text and URL are required");
      return;
    }
    if (footerLinks.length >= 4) {
      toast.error("Maximum 4 footer links allowed");
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

  const EmptyStateMessage = ({ message }) => (
    <div className="bg-gray-50 text-[#1D372E] p-4 rounded-md text-center border border-dashed border-[#5CAF90] my-3">
      <p>{message}</p>
    </div>
  );

  const HeaderPreview = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
          Header Preview
        </h3>
        <div className="rounded-lg overflow-hidden">
          <div className="hidden md:block">
            <div
              className="bg-[#1D372E] text-white shadow-md font-poppins"
              style={{ height: "65px" }}
            >
              <div className="flex items-center justify-between px-6 h-full">
                <div className="flex items-center ml-6">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-[65px] w-auto cursor-pointer"
                  />
                </div>
                <div className="flex flex-1 max-w-2xl mx-30 font-poppins relative">
                  <input
                    type="text"
                    placeholder="SEARCH THE ENTIRE STORE..."
                    className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                    disabled
                  />
                  <button className="bg-[#5CAF90] p-2 w-9 rounded-r-md">
                    <FaSearch className="text-[#FFFFFF]" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <div className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2">
                      <FaShoppingCart
                        className="text-[15px] cursor-pointer"
                        title="Cart"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2">
                      <FaClipboardList
                        className="text-[15px] cursor-pointer"
                        title="Track Orders"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E]">
                      <FaUser
                        className="text-[15px] cursor-pointer"
                        title="Me"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#F4F4F4] text-[#000000] px-15 py-1 flex items-center space-x-2 sm:space-x-17 text-[13.33px] overflow-x-auto font-poppins">
              <div className="flex items-center space-x-1 px-3 py-1 bg-[#5CAF90] text-white rounded-sm">
                <span className="whitespace-nowrap">All Categories</span>
                <MdArrowDropDown className="text-3xl" />
              </div>
              {navIcons.map((icon, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {icon.icon === "FaGift" && <FaGift />}
                  {icon.icon === "FaRocket" && <FaRocket />}
                  {icon.icon === "FaTags" && <FaTags />}
                  {icon.icon === "FaCalendarAlt" && <FaCalendarAlt />}
                  {icon.icon === "FaNetworkWired" && <FaNetworkWired />}
                  {icon.icon === "FaHeart" && <FaHeart />}
                  <span className="whitespace-nowrap">{icon.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <div className="bg-[#1D372E] text-white shadow-md font-poppins px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-14 sm:h-16 w-auto cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E]"
                >
                  {mobileMenuOpen ? (
                    <IoClose className="text-sm sm:text-base" />
                  ) : (
                    <IoMenu className="text-sm sm:text-base" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-[#1D372E] text-white px-4 pb-3">
              <div className="flex items-center justify-between space-x-3">
                <div className="flex flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="SEARCH THE ENTIRE STORE..."
                    className="w-full px-3 py-2 text-[#000000] text-xs rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                    disabled
                  />
                  <button className="bg-[#5CAF90] p-2 rounded-r-md">
                    <FaSearch className="text-[#FFFFFF] text-xs" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                    <FaShoppingCart
                      className="text-xs sm:text-sm cursor-pointer"
                      title="Cart"
                    />
                  </div>
                  <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                    <FaClipboardList
                      className="text-xs sm:text-sm cursor-pointer"
                      title="Track Orders"
                    />
                  </div>
                  <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                    <FaUser
                      className="text-xs sm:text-sm cursor-pointer"
                      title="Me"
                    />
                  </div>
                </div>
              </div>
            </div>
            {mobileMenuOpen && (
              <div className="bg-[#F4F4F4] text-[#000000] px-4 py-2 font-poppins">
                <div className="flex items-center justify-center space-x-1 px-3 py-2 bg-[#5CAF90] text-white rounded-sm mb-3">
                  <span className="text-sm">All Categories</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                <div className="space-y-2">
                  {navIcons.map((icon, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#5CAF90] hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      <div className="text-sm">
                        {icon.icon === "FaGift" && <FaGift />}
                        {icon.icon === "FaRocket" && <FaRocket />}
                        {icon.icon === "FaTags" && <FaTags />}
                        {icon.icon === "FaCalendarAlt" && <FaCalendarAlt />}
                        {icon.icon === "FaNetworkWired" && <FaNetworkWired />}
                        {icon.icon === "FaHeart" && <FaHeart />}
                      </div>
                      <span className="text-sm">{icon.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FooterPreview = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
          Footer Preview
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <footer
            className="text-white px-4 md:px-6 py-6 md:py-10 lg:py-12"
            style={{
              fontFamily: '"Poppins", sans-serif',
              backgroundColor: "#1D372E",
            }}
          >
            <div className="text-center mb-6 md:mb-10 px-2 md:px-4">
              <h2 className="text-base sm:text-lg md:text-xl text-white mb-2 md:mb-3">
                JOIN THE HAPPY CROWD
              </h2>
              <p className="text-xs sm:text-sm font-light text-white mb-3 md:mb-4">
                Get New Arrivals and Exclusive Offers in Your Inbox
              </p>
              <button className="text-xs sm:text-sm bg-white hover:bg-white text-[#5CAF90] px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition">
                <FaWhatsapp className="text-sm md:text-base lg:text-lg" />
                <span className="hidden sm:inline">
                  Join Our Whatsapp Channel
                </span>
                <span className="sm:hidden">Join WhatsApp</span>
              </button>
            </div>
            <div className="mb-6 md:mb-10">
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
                        (Phone/Fax: {loc.hotline})
                      </p>
                    )}
                    {loc.email && (
                      <p className="text-xs font-light text-white">
                        Email:{" "}
                        <a
                          href={`mailto:${loc.email}`}
                          className="hover:underline text-white"
                        >
                          {loc.email}
                        </a>
                      </p>
                    )}
                    {loc.whatsapp && (
                      <p className="text-xs font-light text-white flex justify-center sm:justify-start items-center gap-2 mt-2">
                        <FaWhatsapp className="text-white text-xs" />{" "}
                        <span>{loc.whatsapp}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-4 md:gap-6 text-center px-2 md:px-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-xs md:text-sm">
                <button className="bg-white text-black px-3 py-2 rounded font-medium hover:bg-gray-300 text-xs transition">
                  Sell with TechWave
                </button>
                <a href="#" className="hover:underline text-xs text-white">
                  Download <span className="font-semibold">TechWave App</span>
                </a>
                <div className="flex gap-2 justify-center">
                  <img
                    src={googleplay}
                    className="h-8 md:h-10 w-auto object-contain"
                    alt="Google Play"
                  />
                  <img
                    src={appstore}
                    className="h-8 md:h-10 w-auto object-contain"
                    alt="App Store"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-4 text-xs text-gray-400 font-light">
                {footerLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <a href={link.url} className="hover:underline text-white">
                      {link.text}
                    </a>
                    {index < footerLinks.length - 1 && (
                      <span className="hidden sm:inline">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-center text-xs mt-3 md:mt-4 text-white font-light">
              {copyrightText}
            </div>
            <div className="border-t border-white pt-4 md:pt-6 mt-4 md:mt-6 flex justify-center gap-3 md:gap-4 text-xs md:text-sm">
              {socialIcons.map((icon, index) => {
                let IconComponent;
                switch (icon.platform) {
                  case "Facebook":
                    IconComponent = FaFacebookF;
                    break;
                  case "Twitter":
                    IconComponent = FaTwitter;
                    break;
                  case "Instagram":
                    IconComponent = FaInstagram;
                    break;
                  case "LinkedIn":
                    IconComponent = FaLinkedinIn;
                    break;
                  case "YouTube":
                    IconComponent = FaYoutube;
                    break;
                  case "WhatsApp":
                    IconComponent = FaWhatsapp;
                    break;
                  default:
                    IconComponent = FaFacebookF;
                }
                return (
                  <a
                    key={index}
                    href={icon.url}
                    aria-label={icon.platform}
                    className={`border border-white rounded-full p-1.5 md:p-2 ${
                      index % 2 === 0 ? "bg-white text-black" : ""
                    } hover:scale-105 transition`}
                  >
                    <IconComponent className="text-xs md:text-sm" />
                  </a>
                );
              })}
            </div>
          </footer>
        </div>
      </div>
    );
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
    <div className="card bg-white shadow-md relative">
      <div className="card-body">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Manage Header and Footer
            </h2>
          </div>
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
          <div className="space-y-8">
            <HeaderPreview />
            <FooterPreview />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                General Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="file-input file-input-bordered file-input-sm w-full bg-white border-[#1D372E] text-[#1D372E] disabled:bg-white disabled:border-[#1D372E] disabled:text-[#1D372E]"
                    disabled={!isEditing}
                  />
                  {logoPreview && (
                    <div className="relative mt-4 w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo Preview"
                        className="object-contain bg-[#1D372E] w-full h-full"
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
                      className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E]"
                    />
                  ) : (
                    <div className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center min-h-[2rem] overflow-hidden">
                      <span className="truncate">
                        {headerFooterSetting?.Footer_Copyright || (
                          <span className="text-gray-400">
                            Enter copyright text
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Navigation Icons
              </h3>
              {navIcons.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="table table-fixed min-w-[500px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="py-2 w-[100px]">Icon</th>
                          <th className="py-2 w-[150px]">Label</th>
                          <th className="py-2 w-[150px]">Link</th>
                          {isEditing && (
                            <th className="py-2 w-[100px]">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="border-b border-[#1D372E]">
                        {navIcons.map((icon, index) => (
                          <tr key={index} className="border border-[#1D372E]">
                            <td className="flex items-center justify-center">
                              {icon.iconImageUrl || icon.iconImagePreview ? (
                                <img
                                  src={
                                    icon.iconImageUrl || icon.iconImagePreview
                                  }
                                  alt={icon.label}
                                  className="w-8 h-8 object-contain my-1"
                                />
                              ) : (
                                <div className="w-14 h-9 flex items-center justify-center rounded">
                                  <span className="text-sm">No icon</span>
                                </div>
                              )}
                            </td>
                            <td>{icon.label}</td>
                            <td>{icon.link}</td>
                            {isEditing && (
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNavIcon(index)}
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
                  <div className="md:hidden space-y-4">
                    {navIcons.map((icon, index) => (
                      <div
                        key={index}
                        className="border border-[#1D372E] rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {icon.iconImageUrl || icon.iconImagePreview ? (
                              <img
                                src={icon.iconImageUrl || icon.iconImagePreview}
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
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNavIcon(index)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
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
                <EmptyStateMessage message="No navigation icons found." />
              )}
              {isEditing && (
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
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Country Blocks
              </h3>
              {countryBlocks.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="table table-fixed min-w-[950px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="py-2 w-[50px]">Title</th>
                          <th className="py-2 w-[200px]">Address</th>
                          <th className="py-2 w-[175px]">Hotline</th>
                          <th className="py-2 w-[250px]">Email</th>
                          <th className="py-2 w-[175px]">WhatsApp</th>
                          {isEditing && (
                            <th className="py-2 w-[100px]">Actions</th>
                          )}
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
                            {isEditing && (
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveCountryBlock(index)
                                  }
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
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCountryBlock(index)}
                              className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            >
                              <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              Address:{" "}
                            </span>
                            <span className="text-gray-600">
                              {block.address}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-[#1D372E]">
                              Hotline:{" "}
                            </span>
                            <span className="text-gray-600">
                              {block.hotline}
                            </span>
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
                            <span className="text-gray-600">
                              {block.whatsapp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyStateMessage message="No country blocks found." />
              )}
              {isEditing && (
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
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1D372E] mb-4">
                Footer Links & Social
              </h3>
              <div className="mb-6">
                <h4 className="font-medium text-[#1D372E] mb-3">
                  Footer Links
                </h4>
                {footerLinks.length > 0 ? (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="table table-fixed min-w-[500px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                        <thead className="bg-[#EAFFF7] text-[#1D372E]">
                          <tr className="border-b border-[#1D372E]">
                            <th className="py-2 w-[250px]">Text</th>
                            <th className="py-2 w-[150px]">URL</th>
                            {isEditing && (
                              <th className="py-2 w-[100px]">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="border-b border-[#1D372E]">
                          {footerLinks.map((link, index) => (
                            <tr
                              key={index}
                              className="border-b border-[#1D372E]"
                            >
                              <td className="py-2">{link.text}</td>
                              <td className="py-2">{link.url}</td>
                              {isEditing && (
                                <td className="py-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveFooterLink(index)
                                    }
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
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFooterLink(index)}
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
                  <EmptyStateMessage message="No footer links found." />
                )}
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
              <div>
                <h4 className="font-medium text-[#1D372E] mb-3">
                  Social Icons
                </h4>
                {socialIcons.length > 0 ? (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="table table-fixed min-w-[550px] text-center border border-[#1D372E] text-[#1D372E] w-full">
                        <thead className="bg-[#EAFFF7] text-[#1D372E]">
                          <tr className="border-b border-[#1D372E]">
                            <th className="py-2 w-[150px]">Platform</th>
                            <th className="py-2 w-[300px]">URL</th>
                            {isEditing && (
                              <th className="py-2 w-[100px]">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="border-b border-[#1D372E]">
                          {socialIcons.map((icon, index) => (
                            <tr
                              key={index}
                              className="border-b border-[#1D372E]"
                            >
                              <td className="py-2">{icon.platform}</td>
                              <td className="py-2">{icon.url}</td>
                              {isEditing && (
                                <td className="py-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSocialIcon(index)
                                    }
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
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSocialIcon(index)}
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
                  <EmptyStateMessage message="No social icons found." />
                )}
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

export default HeaderFooterSettings;