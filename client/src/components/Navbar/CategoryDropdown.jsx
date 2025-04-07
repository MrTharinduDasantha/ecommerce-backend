import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom"; 
import flower from './flower.webp';

export default function CategoryDropdown() {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const buttonRef = useRef(null); 
  const modalRef = useRef(null);
  const navigate = useNavigate(); 

  const categories = [
    { 
      name: "Cakes", 
      image: flower,  
      subcategories: [
        { name: "Birthday Cakes", image: flower },
        { name: "Wedding Cakes", image: flower },
        { name: "Cupcakes", image: flower }
      ]
    },
    { 
      name: "Chocolates", 
      image: flower, 
      subcategories: [
        { name: "Dark Chocolate", image: flower },
        { name: "Milk Chocolate", image: flower },
        { name: "White Chocolate", image: flower }
      ]
    },
    { 
      name: "Cookies", 
      image: flower, 
      subcategories: [
        { name: "Chocolate Chip", image: flower },
        { name: "Oatmeal Raisin", image: flower },
        { name: "Sugar Cookies", image: flower }
      ]
    },
    { 
      name: "Brownies", 
      image: flower, 
      subcategories: [
        { name: "Fudge Brownies", image: flower },
        { name: "Blondies", image: flower },
        { name: "Cheesecake Brownies", image: flower }
      ]
    }
  ];

  // Open and Close Modal
  const handleCategoryModal = () => {
    if (selectedCategory) {
      // If a category is selected, it means we're already in subcategory view. We want to go back to categories.
      setSelectedCategory(null);
    } else {
      setShowCategories(!showCategories);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null); 
    } else {
      setSelectedCategory(categoryName); 
    }
  };

  const handleSubcategoryClick = (subcategoryName) => {
    navigate(`/subcategory/${subcategoryName.toLowerCase().replace(/\s+/g, '-')}`);
    setShowCategories(false); 
    setSelectedCategory(null); // Reset selected category when navigating to subcategory
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowCategories(false);
        setSelectedCategory(null); // Reset to categories when clicking outside
      }
    };

    if (showCategories || selectedCategory) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories, selectedCategory]);

  return (
    <div className="relative font-poppins">
      <button
        ref={buttonRef}
        onClick={handleCategoryModal}
        className="flex items-center space-x-2 bg-[#5CAF90] text-white text-[13.33px] px-4 py-2 rounded "
      >
        <span>All Categories</span>
        <span className="text-[13.33px]">▼</span>
      </button>

      {showCategories && 
        createPortal(
          <div
            ref={modalRef}
            className="absolute left-0 mt-2 bg-white w-[300px] max-h-[70vh] overflow-y-auto rounded-md shadow-lg p-6 z-50"
            style={{
              top: buttonRef.current.getBoundingClientRect().bottom + window.scrollY, // Position it just below the button
            }}
          >
            {/* Categories List */}
            {!selectedCategory ? (
              <div className="w-full">
                <ul className="text-black">
                  {categories.map((category) => (
                    <li
                      key={category.name}
                      className="px-4 py-2 cursor-pointer"
                    >
                      <div 
                        className="flex items-center space-x-2 text-[13.33px]"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <img
                          src={category.image}  
                          alt={category.name}
                          className="w-6 h-6 rounded-full "
                        />
                        <span>{category.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h3 className="text-[16px] font-semibold mb-2">{selectedCategory}</h3>
                <ul className="text-[13.3px] text-black">
                  {categories
                    .find((category) => category.name === selectedCategory)
                    ?.subcategories.map((subcategory, index) => (
                      <li
                        key={index}
                        className="px-4 py-1 cursor-pointer"
                        onClick={() => handleSubcategoryClick(subcategory.name)}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={subcategory.image}  
                            alt={subcategory.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{subcategory.name}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
