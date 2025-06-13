import { Link } from "react-router-dom";
import { Home, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar1 = ({
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSubCategorySelect,
}) => {
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Initialize expanded categories when selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategories((prev) =>
        prev.includes(selectedCategoryId) ? prev : [...prev, selectedCategoryId]
      );
    }
  }, [selectedCategoryId]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubCategoryClick = (subCategoryId) => {
    if (onSubCategorySelect) {
      onSubCategorySelect(subCategoryId);
    }
  };

  return (
    <nav className="w-full lg:w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Home Link */}
      <div className="bg-[#1D372E] text-white">
        <Link
          to="/"
          className="flex items-center px-4 py-3 hover:bg-[#2a4d3e] transition-colors"
        >
          <Home className="h-5 w-5 mr-3" />
          <span className="font-medium">Home</span>
        </Link>
      </div>

      {/* All Categories Header */}
      <div className="bg-[#5CAF90] text-white py-3 px-4">
        <span className="font-semibold text-sm">All Categories</span>
      </div>

      {/* Categories List */}
      <div className="max-h-96 overflow-y-auto">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(
            category.idProduct_Category
          );
          const isSelected = category.idProduct_Category === selectedCategoryId;

          return (
            <div
              key={category.idProduct_Category}
              className="border-b border-gray-100"
            >
              {/* Category Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#E8F5F0] border-l-4 border-[#5CAF90] text-[#1D372E] font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <Link
                  to={`/AllCategories/${category.idProduct_Category}`}
                  state={{ selectedCategoryId: category.idProduct_Category }}
                  className="flex-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {category.Description}
                </Link>
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      onClick={() =>
                        toggleCategory(category.idProduct_Category)
                      }
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
              </div>

              {/* Subcategories */}
              {isExpanded &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="bg-gray-50">
                    {category.subcategories.map((subcategory) => {
                      const isSubSelected =
                        subcategory.idSub_Category === selectedSubCategoryId;
                      return (
                        <Link
                          key={subcategory.idSub_Category}
                          to={`/subcategory/${subcategory.idSub_Category}`}
                          state={{
                            subcategoryName: subcategory.Description,
                            categoryName: category.Description,
                          }}
                          className={`block w-full text-left px-8 py-2 text-sm transition-colors ${
                            isSubSelected
                              ? "text-[#5CAF90] font-medium bg-[#E8F5F0] border-r-4 border-[#5CAF90]"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={() =>
                            handleSubCategoryClick(subcategory.idSub_Category)
                          }
                        >
                          {subcategory.Description}
                        </Link>
                      );
                    })}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Show All Products Button at Bottom */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          to="/AllProducts"
          className="block w-full text-center px-3 py-2 text-sm rounded transition-colors bg-[#1D372E] text-white hover:bg-[#2a4d3e] font-medium"
        >
          Show All Products
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar1;
