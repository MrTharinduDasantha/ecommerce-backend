import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CategoryDropdown from "../Navbar/CategoryDropdown";
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
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Only handle navigation for AllProducts filtering
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // If a single English letter, navigate to AllProducts with letter filter
    if (/^[a-zA-Z]$/.test(query)) {
      navigate(`/AllProducts?letter=${query.toUpperCase()}`);
      return;
    }
    // For any other search, navigate to AllProducts with search param
    if (query.trim().length > 0) {
      navigate(`/AllProducts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Add this handler for the search button
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (
      searchQuery.trim().length === 1 &&
      /^[a-zA-Z]$/.test(searchQuery.trim())
    ) {
      navigate(`/AllProducts?letter=${searchQuery.trim().toUpperCase()}`);
    } else if (searchQuery.trim().length > 0) {
      navigate(`/AllProducts?search=${encodeURIComponent(searchQuery.trim())}`);
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

  // Load cart count from local storage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  }, []);

  return (
    <>
      {/* Top bar */}
      <div
        className="fixed top-0 left-0 w-full bg-[#1D372E] text-white z-50 shadow-md font-poppins"
        style={{ height: "60px" }}
      >
        <div className="flex items-center justify-between px-6 h-full">
          {/* Logo */}
          <div className="flex items-center ml-6">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="h-[85px] w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex flex-1 max-w-2xl mx-30 font-poppins ml-75 relative">
            <form className="flex w-full" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="SEARCH THE ENTIRE STORE..."
                className="w-full sm:w-[400px] px-4 py-2 text-[#000000] text-[13px] rounded-l-md outline-none bg-[#FFFFFF] font-poppins"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="bg-[#5CAF90] p-2 w-9 rounded-r-md flex items-center justify-center"
                aria-label="Search"
              >
                <FaSearch className="text-[#FFFFFF]" />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="flex space-x-2">
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2"
              >
                <FaShoppingCart
                  className="text-[15px] cursor-pointer"
                  title="Cart"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
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

      {/* Bottom menu */}
      <div className="bg-[#F4F4F4] text-[#000000] px-15 py-1 flex items-center space-x-2 sm:space-x-17 text-[13.33px] overflow-x-auto mt-[60px] font-poppins ">
        <CategoryDropdown />

        {/* Navigation Icons */}
        <Link to="/seasonal-offers">
          <NavIcon icon={<FaGift />} label="Seasonal Offers" />
        </Link>
        <Link to="/rush-delivery">
          <NavIcon icon={<FaRocket />} label="Rush Delivery" />
        </Link>
        <Link to="/on-sale">
          <NavIcon icon={<FaTags />} label="On Sale" />
        </Link>
        <Link to="/events">
          <NavIcon icon={<FaCalendarAlt />} label="Events" />
        </Link>
        <Link to="/brands">
          <NavIcon icon={<FaNetworkWired />} label="Brands" />
        </Link>
        <Link to="/for-you">
          <NavIcon icon={<FaHeart />} label="For You" />
        </Link>
      </div>
    </>
  );
}

// Helper component for icons
function NavIcon({ icon, label }) {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
      <motion.span
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      >
        {icon}
      </motion.span>
      <span>{label}</span>
    </div>
  );
}

export default Navbar;
