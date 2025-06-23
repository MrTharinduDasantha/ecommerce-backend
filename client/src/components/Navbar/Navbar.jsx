import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CategoryDropdown from "./CategoryDropdown";
import products from "../Products.jsx";
import logo from "./logo.png";
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
  FaChevronDown,
} from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext.jsx";
import { fetchHeaderFooterSetting } from "../../api/setting";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Backend data states
  const [logoUrl, setLogoUrl] = useState("");
  const [navIcons, setNavIcons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { cartItems } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch header footer settings from backend
  useEffect(() => {
    const fetchHeaderFooterSettings = async () => {
      try {
        const data = await fetchHeaderFooterSettin();
        if (data) {
          setLogoUrl(data.Navbar_Logo_Url);
          setNavIcons(data.Nav_Icons || []);
        }
      } catch (error) {
        console.error("Failed to fetch header footer settings:", error);
        // Default values if API fails
        setLogoUrl(logo);
        setNavIcons([
          {
            icon: "FaGift",
            label: "Seasonal Offers",
            link: "/seasonal-offers",
          },
          { icon: "FaRocket", label: "Rush Delivery", link: "/rush-delivery" },
          { icon: "FaTags", label: "On Sale", link: "/on-sale" },
          { icon: "FaCalendarAlt", label: "Events", link: "/events" },
          { icon: "FaNetworkWired", label: "Brands", link: "/brands" },
          { icon: "FaHeart", label: "For You", link: "/for-you" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderFooterSettings();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter products based on name, category, description
      const filtered = products.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsModalOpen(true);
    } else {
      setFilteredItems([]);
      setIsModalOpen(false);
    }
  };

  const handleItemClick = (itemName) => {
    setSearchQuery(itemName);
    setFilteredItems([]);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Helper function to get icon component
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaGift: FaGift,
      FaRocket: FaRocket,
      FaTags: FaTags,
      FaCalendarAlt: FaCalendarAlt,
      FaNetworkWired: FaNetworkWired,
      FaHeart: FaHeart,
    };
    return iconMap[iconName] || FaGift;
  };

  // Check if current route matches nav item
  const isActiveRoute = (link) => {
    return location.pathname === link;
  };

  // Handle navigation click
  const handleNavClick = (link) => {
    navigate(link);
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div
        className="fixed top-0 left-0 w-full bg-[#1D372E] text-white z-50 shadow-md"
        style={{ height: "60px" }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div
          className="fixed top-0 left-0 w-full bg-[#1D372E] text-white z-50 shadow-md font-poppins"
          style={{ height: "65px" }}
        >
          <div className="flex items-center justify-between px-6 h-full">
            {/* Logo */}
            <div className="flex items-center ml-6">
              <Link to="/">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-[80px] w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Search bar */}
            <div className="flex max-w-2xl mx-30 font-poppins relative">
              <input
                type="text"
                placeholder="SEARCH THE ENTIRE STORE..."
                className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="bg-[#5CAF90] p-2 w-9 rounded-r-md">
                <FaSearch className="text-[#FFFFFF]" />
              </button>
            </div>

            {/* Icons */}
            <div className="flex space-x-2">
              {/* Cart Icon */}
              <Link to="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2"
                >
                  <FaShoppingCart
                    className="text-[15px] cursor-pointer"
                    title="Cart"
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Track Order */}
              <Link to="/track-order/:id">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2"
                >
                  <FaClipboardList
                    className="text-[15px] cursor-pointer"
                    title="Track Orders"
                  />
                </motion.div>
              </Link>

              {/* Profile and Logout */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-2 border-2 border-white rounded-full bg-white text-[#1D372E]"
                  >
                    <FaUser className="text-[15px]" />
                    <FaChevronDown className="ml-1 text-[12px]" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#5CAF90] hover:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#5CAF90] hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/sign-in">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E]"
                  >
                    <FaUser className="text-[15px] cursor-pointer" title="Me" />
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom menu - Desktop */}
        <div className="bg-[#F4F4F4] text-[#000000] px-15 py-1 flex items-center space-x-2 sm:space-x-17 text-[13.33px] overflow-x-auto mt-[65px] font-poppins">
          <CategoryDropdown />

          {/* Navigation Icons */}
          {navIcons.map((navItem, index) => {
            const IconComponent = getIconComponent(navItem.icon);
            const isActive = isActiveRoute(navItem.link);

            return (
              <Link key={index} to={navItem.link}>
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-[24px] transition-colors duration-200 ${
                    isActive
                      ? "text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white"
                      : "hover:bg-[#5CAF90] hover:text-white"
                  }`}
                >
                  {navItem.icon ? (
                    <motion.span
                      animate={{ rotate: [-10, 10, -10] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <IconComponent />
                    </motion.span>
                  ) : (
                    <img
                      src={navItem.iconImageUrl}
                      alt={navItem.label}
                      className="w-4 h-4 object-cover"
                    />
                  )}
                  <span className="whitespace-nowrap">{navItem.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className="md:hidden">
        {/* Logo and Menu Toggle */}
        <div className="fixed top-0 left-0 w-full bg-[#1D372E] text-white shadow-md font-poppins px-4 py-2 z-50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-14 sm:h-16 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Menu Toggle */}
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

        {/* Search and Icons */}
        <div className="fixed top-[70px] sm:top-[74px] left-0 w-full bg-[#1D372E] text-white px-4 pb-3 z-50">
          <div className="flex items-center justify-between space-x-3">
            {/* Search bar */}
            <div className="flex flex-1 max-w-sm relative">
              <input
                type="text"
                placeholder="SEARCH THE ENTIRE STORE..."
                className="w-full px-3 py-2 text-[#000000] text-xs rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="bg-[#5CAF90] p-2 rounded-r-md">
                <FaSearch className="text-[#FFFFFF] text-xs" />
              </button>
            </div>

            {/* Icons */}
            <div className="flex space-x-2">
              {/* Cart Icon */}
              <Link to="/cart" className="relative">
                <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                  <FaShoppingCart
                    className="text-xs sm:text-sm cursor-pointer"
                    title="Cart"
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* Track Order */}
              <Link to="/track-order/:id">
                <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                  <FaClipboardList
                    className="text-xs sm:text-sm cursor-pointer"
                    title="Track Orders"
                  />
                </div>
              </Link>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]"
                  >
                    <FaUser className="text-xs sm:text-sm" />
                    <FaChevronDown className="ml-1 text-[10px]" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-xs text-gray-700 hover:bg-[#5CAF90] hover:text-white"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-[#5CAF90] hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/sign-in">
                  <div className="p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]">
                    <FaUser
                      className="text-xs sm:text-sm cursor-pointer"
                      title="Me"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-[115px] sm:top-[125px] left-0 w-full bg-[#F4F4F4] text-[#000000] px-4 py-2 font-poppins z-40 max-h-[calc(100vh-115px)] overflow-y-auto">
            {/* Category Dropdown */}
            <div className="mb-3">
              <CategoryDropdown
                isMobile={true}
                onCategoryClick={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Navigation Icons - Column Layout */}
            <div className="space-y-2">
              {navIcons.map((navItem, index) => {
                const IconComponent = getIconComponent(navItem.icon);
                const isActive = isActiveRoute(navItem.link);

                return (
                  <button
                    key={index}
                    onClick={() => handleNavClick(navItem.link)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer w-full text-left ${
                      isActive
                        ? "text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white"
                        : "hover:bg-[#5CAF90] hover:text-white"
                    }`}
                  >
                    <div className="text-sm">
                      {navItem.icon ? (
                        <IconComponent />
                      ) : (
                        <img
                          src={navItem.iconImageUrl}
                          alt={navItem.label}
                          className="w-4 h-4 object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm">{navItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Spacer for fixed header */}
        <div className="h-[115px] sm:h-[125px]"></div>
      </div>

      {/* Search Results Modal */}
      {isModalOpen && (
        <div className="fixed top-28 md:top-24 left-1/2 transform -translate-x-1/2 w-full max-w-[680px] bg-white p-6 rounded-lg shadow-lg z-50 mx-4">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <p className="text-[16px] text-gray-500 mb-4">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "result" : "results"} found
          </p>
          <div className="flex flex-wrap gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-48 p-4 border border-[#E8E8E8] rounded-md bg-white"
                >
                  <Link
                    to={`/product-page/${item.id}`}
                    className="block"
                    onClick={() => handleItemClick(item.name)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <h3 className="font-semibold mt-2">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="font-bold mt-2">{item.price}</p>
                  </Link>
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
          <button
            onClick={closeModal}
            className="mt-4 text-[#5CAF90] font-semibold border border-[#5CAF90] rounded-full py-2 px-4"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
