import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CategoryDropdown from "../Navbar/CategoryDropdown";
import { products } from "../products"; // Make sure the path is correct
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
} from "react-icons/fa";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

            {/* Profile */}
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E]"
              >
                <FaUser className="text-[15px] cursor-pointer" title="Me" />
              </motion.div>
            </Link>
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

      {/* Search Results Modal */}
      {isModalOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full sm:w-[680px] bg-white p-6 rounded-lg shadow-lg z-50">
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
