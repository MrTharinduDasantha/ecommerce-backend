import React from "react";
import { Link } from "react-router-dom";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const Sidebar1 = ({ subcategories }) => {
  return (
    <nav className="w-full lg:w-64 bg-gray-100 sidebar rounded-lg">
      {/* Breadcrumb */}
      <div className="flex px-2 items-center text-xs sm:text-sm py-1 sm:py-2">
        <Link to="/" className="text-[#1D372E] hover:underline">
          👈Home
        </Link>
       
      </div>

      {/* Categories List */}
      <div className="py-1 sm:py-2">
        <div className="bg-[#5CAF90] text-white py-1.5 sm:py-2.5 px-2 sm:px-4 flex items-center justify-between rounded-r-full">
          <span className="font-medium text-xs sm:text-sm">All Items</span>
          <DoubleArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>

        <ul className="text-gray-700">
         
     
          {/* Dynamically render subcategories */}
          {subcategories.map(subcategory => (
            <li key={subcategory.idSub_Category}>
              <Link
                to={`/subcategory/${subcategory.idSub_Category}`} // Adjust the path as needed
                className="block px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:text-[#1D372E] transition-colors"
              >
                {subcategory.Description}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar1;