import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import CategoryDropdown from './CategoryDropdown';
import logo from './logo.png';
import sunglass from './sunglass.jpg';
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
  FaGift
} from 'react-icons/fa';

const items = [
  { id: 1, name: "Apple iPhone 12", category: "Electronics", image: sunglass, price: "$799" },
  { id: 2, name: "Nike Air Max 2021", category: "Footwear", image: sunglass, price: "$120" },
  { id: 3, name: "Bose QuietComfort 35 II", category: "Electronics", image: sunglass, price: "$299" },
  { id: 4, name: "Adidas Ultraboost 21", category: "Footwear", image: sunglass, price: "$180" },
  { id: 5, name: "Canon EOS R5", category: "Electronics", image: sunglass, price: "$3899" },
  { id: 6, name: "Gucci Sunglasses", category: "Fashion", image: sunglass, price: "$450" },
];

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
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

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full bg-[#1D372E] text-white z-50 shadow-md font-poppins" style={{ height: '60px' }}>
        <div className="flex items-center justify-between px-6 h-full">
          {/* Logo */}
          <div className="flex items-center ml-6 ">
            <img src={logo} alt="Logo" className="h-[80px] w-auto" />
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

          {/* Cart, Orders, Profile */}
          <div className="flex space-x-2">
            <Link to="/cart">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2">
                <FaShoppingCart className="text-[15px] cursor-pointer" title="Cart" />
              </motion.div>
            </Link>
            <Link to="/track-orders">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2">
                <FaClipboardList className="text-[15px] cursor-pointer" title="Track Orders" />
              </motion.div>
            </Link>
            <Link to="/profile">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E]">
                <FaUser className="text-[15px] cursor-pointer" title="Me" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#F4F4F4] text-[#000000] px-6 py-2 flex items-center space-x-4 sm:space-x-24 text-sm overflow-x-auto mt-[60px] font-poppins">
        <CategoryDropdown />
        <Link to="/seasonal-offers">
          <div className="flex items-center space-x-2 bg-[#5CAF90] text-white text-[13.33px] px-4 py-2 rounded-[24px] hover:bg-[#1D372E]">
            <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
              <FaGift />
            </motion.span>
            <span>Seasonal Offers</span>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Navbar;
