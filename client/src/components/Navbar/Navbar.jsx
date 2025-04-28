import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import CategoryDropdown from '../Navbar/CategoryDropdown';
import logo from './logo.png';
import sunglass from './sunglass.jpg'
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
          <div className="flex items-center ml-6">
            <img src={logo} alt="Logo" className="h-[85px] w-auto" />
          </div>

          {/* Search bar with item suggestions */}
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
<div className="flex space-x-2">
      
      <Link to="/cart">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2"
        >
          <FaShoppingCart className="text-[15px] cursor-pointer" title="Cart" />
        </motion.div>
      </Link>

      <Link to="/track-order/:id">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="p-2 border-2 border-white rounded-full bg-white text-[#1D372E] mr-2"
        >
          <FaClipboardList className="text-[15px] cursor-pointer" title="Track Orders" />
        </motion.div>
      </Link>

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

      {/* Bottom bar */}
      <div className="bg-[#F4F4F4] text-[#000000] px-6 py-2 flex items-center space-x-4 sm:space-x-20 text-sm overflow-x-auto mt-[60px] font-poppins">
        <CategoryDropdown />

        <Link to="/seasonal-offers">
      <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
        <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
          <FaGift />
        </motion.span>
        <span>Seasonal Offers</span>
      </div>
    </Link>


  {/* Buttons that adopt Seasonal Offer styling on hover */}
  <Link to="/rush-delivery">
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
    <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
      <FaRocket />
      </motion.span>
      <span>Rush Delivery</span>
</div>
  </Link>

  <Link to="/on-sale">
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
    <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
      <FaTags />
      </motion.span>
      <span>On Sale</span>
    </div>
  </Link>

  <Link to="/Events">
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
    <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
      <FaCalendarAlt />
      </motion.span>
      <span>Events</span>
    </div>
  </Link>

  <Link to="/brands">
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
    <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
      <FaNetworkWired />
</motion.span>
      <span>Brands</span>
    </div>
  </Link>

  <Link to="/for-you">
    <div className="flex items-center space-x-2 px-4 py-2 rounded-[24px] hover:bg-[#5CAF90] hover:text-white transition-colors duration-200">
      <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}>
      <FaHeart />
      </motion.span>
      <span>For You</span>
    </div>
  </Link>
      </div>

      {isModalOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full sm:w-[680px] bg-white p-6 rounded-lg shadow-lg z-50">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <p className="text-[16px] text-gray-500 mb-4">
            {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"} found
          </p>
          <div className="flex flex-wrap gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="w-full sm:w-48 p-4 border border-[#E8E8E8] rounded-md bg-white">
                  <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                  <h3 className="font-semibold mt-2">{item.name}</h3>
<p className="text-sm text-gray-500">{item.category}</p>
                  <p className="font-bold mt-2">{item.price}</p>
                  <button onClick={() => handleItemClick(item.name)} className="mt-4 bg-[#5CAF90] text-white py-1 px-3 rounded-full">
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
          <button onClick={closeModal} className="mt-4 text-[#5CAF90] font-semibold border border-[#5CAF90] rounded-full py-2 px-4">
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;

