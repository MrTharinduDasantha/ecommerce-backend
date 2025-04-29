import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import flower from './flower.webp';
import { getCategories } from '../../api/product';

export default function CategoryDropdown() {
  const [showCategories, setShowCategories] = useState(false);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const buttonRef = useRef(null);
  const categoryModalRef = useRef(null);
  const subcategoryModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.categories) {
          setCategories(data.categories);
        } else {
          setError("Unexpected data structure: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to load categories:", error.message);
        setError(error.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryModal = () => {
    if (showSubcategories) {
      setShowSubcategories(false);
      setSelectedCategory(null);
    } else {
      setShowCategories(!showCategories);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    setShowSubcategories(true);
  };

  const handleSubcategoryClick = (subcategory) => {
    // Navigate to AllCategories with selected subcategory ID
    navigate(`/all-categories`, { state: { selectedSubcategory: subcategory.idSub_Category } });
    setShowSubcategories(false);
    setSelectedCategory(null);
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setShowCategories(true);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategories && 
          categoryModalRef.current && 
          !categoryModalRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowCategories(false);
      }

      if (showSubcategories && 
          subcategoryModalRef.current && 
          !subcategoryModalRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowSubcategories(false);
        setSelectedCategory(null);
      }
    };

    if (showCategories || showSubcategories) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategories, showSubcategories]);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative font-poppins">
      <button
        ref={buttonRef}
        onClick={handleCategoryModal}
        className="flex items-center space-x-2 bg-[#5CAF90] text-white text-[13.33px] px-4 py-2 rounded"
      >
        <span>All Categories</span>
        <span className="text-[13.33px]">▼</span>
      </button>

      {showCategories && createPortal(
        <div
          ref={categoryModalRef}
          className="absolute left-0 mt-2 bg-white w-[300px] max-h-[70vh] overflow-y-auto rounded-md shadow-lg p-6 z-50"
          style={{
            top: buttonRef.current.getBoundingClientRect().bottom + window.scrollY,
          }}
        >
          <div className="w-full">
            <ul className="text-black">
              {categories.map((category) => (
                <li
                  key={category.idProduct_Category}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center space-x-2 text-[13.33px]">
                    <img
                      src={category.Image_Icon_Url || flower}
                      alt={category.Description}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{category.Description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )}

      {showSubcategories && selectedCategory && createPortal(
        <div
          ref={subcategoryModalRef}
          className="absolute left-0 mt-2 bg-white w-[300px] max-h-[70vh] overflow-y-auto rounded-md shadow-lg p-6 z-50"
          style={{
            top: buttonRef.current.getBoundingClientRect().bottom + window.scrollY,
          }}
        >
          <div className="w-full">
            <div className="flex items-center mb-4 pb-2 bg-[#5CAF90]">
            </div>
            <h3 className="text-[15px] font-medium mb-3">{selectedCategory.Description}</h3>
            <ul className="text-black">
              {selectedCategory.subcategories && selectedCategory.subcategories.map((subcategory) => (
                <li
                  key={subcategory.idSub_Category}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <span className="text-[13.33px]">{subcategory.Description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}