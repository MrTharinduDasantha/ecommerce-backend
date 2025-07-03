import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CategoryDropdown from "./CategoryDropdown";
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
import { getProducts } from "../../api/product";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Product search popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  // Fetch all products for search popup
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const formattedProducts = data.products
          .filter((product) => product.Status === "active")
          .map((product) => ({
            id: product.idProduct,
            name: product.Description,
            image: product.Main_Image_Url,
            price: product.Selling_Price,
            category: product.subcategories?.[0]?.Description || "",
            brand: product.Brand_Name || "",
            description: product.Description || "",
          }));
        setAllProducts(formattedProducts);
      } catch (err) {
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Live filter products as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      setFilteredProducts(
        allProducts.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.brand && p.brand.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
        )
      );
      setIsPopupOpen(true);
    } else {
      setFilteredProducts([]);
      setIsPopupOpen(false);
    }
  }, [searchQuery, allProducts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit and update URL
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/filtered-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsPopupOpen(false);
    }
  };

  const handleProductClick = (name) => {
    setSearchQuery(name);
    setIsPopupOpen(false);
    navigate(`/filtered-products?search=${encodeURIComponent(name)}`);
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
            <form
              className="flex max-w-2xl mx-30 font-poppins relative"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
            >
              <input
                type="text"
                placeholder="SEARCH THE ENTIRE STORE..."
                className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setIsPopupOpen(true)}
              />
              <button
                className="bg-[#5CAF90] p-2 w-9 rounded-r-md"
                type="submit"
                // Prevent navigation if searchQuery is empty
                disabled={searchQuery.trim().length === 0}
                style={{
                  opacity: searchQuery.trim().length === 0 ? 0.5 : 1,
                  cursor:
                    searchQuery.trim().length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FaSearch className="text-[#FFFFFF]" />
              </button>
              {/* Search Popup */}
              {isPopupOpen && (
                <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center px-4 py-2 hover:bg-[#F4F4F4] cursor-pointer"
                        onClick={() => handleProductClick(product.name)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="font-semibold text-[#1D372E]">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.category}
                          </div>
                          <div className="text-xs text-[#5CAF90] font-bold">
                            {product.price}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </form>

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
                    <div className="absolute right-0 mt-4 w-28 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block mx-auto text-center px-4 py-2 text-sm text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/about"
                        className="block mx-auto text-center px-4 py-2 text-sm text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        About Us
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block mx-auto text-center px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 my-1 rounded cursor-pointer transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-2 border-2 border-white rounded-full bg-white text-[#1D372E]"
                  >
                    <FaUser className="text-[15px]" />
                    <FaChevronDown className="ml-1 text-[12px]" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-28 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        to="/about"
                        className="block mx-auto text-center px-4 py-2 text-sm text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        About Us
                      </Link>
                      <button
                        onClick={() => {
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block mx-auto text-center px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 my-1 rounded cursor-pointer transition"
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
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
            <form
              className="flex flex-1 max-w-sm relative"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
            >
              <input
                type="text"
                placeholder="SEARCH THE ENTIRE STORE..."
                className="w-full px-3 py-2 text-[#000000] text-xs rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setIsPopupOpen(true)}
              />
              <button
                className="bg-[#5CAF90] p-2 rounded-r-md"
                type="submit"
                // Prevent navigation if searchQuery is empty
                disabled={searchQuery.trim().length === 0}
                style={{
                  opacity: searchQuery.trim().length === 0 ? 0.5 : 1,
                  cursor:
                    searchQuery.trim().length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FaSearch className="text-[#FFFFFF] text-xs" />
              </button>
              {/* Search Popup */}
              {isPopupOpen && (
                <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center px-3 py-2 hover:bg-[#F4F4F4] cursor-pointer"
                        onClick={() => handleProductClick(product.name)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded mr-2"
                        />
                        <div>
                          <div className="font-semibold text-[#1D372E] text-xs">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {product.category}
                          </div>
                          <div className="text-[10px] text-[#5CAF90] font-bold">
                            {product.price}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-xs">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </form>

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
                    <div className="absolute right-0 mt-4 w-28 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        className="block mx-auto text-center px-3 py-2 text-xs text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/about"
                        className="block mx-auto text-center px-3 py-2 text-xs text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        About Us
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block mx-auto text-center px-3 py-2 text-xs text-white bg-red-500 hover:bg-red-600 my-1 rounded cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-1.5 sm:p-2 border border-white rounded-full bg-white text-[#1D372E]"
                  >
                    <FaUser className="text-xs sm:text-sm" />
                    <FaChevronDown className="ml-1 text-[10px]" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-28 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/about"
                        className="block mx-auto text-center px-3 py-2 text-xs text-gray-700 hover:text-[#5CAF90] transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        About Us
                      </Link>
                      <button
                        onClick={() => {
                          navigate("/sign-in");
                          setIsDropdownOpen(false);
                        }}
                        className="block mx-auto text-center px-3 py-2 text-xs text-white bg-blue-500 hover:bg-blue-600 my-1 rounded cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
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
    </>
  );
}

export default Navbar;
