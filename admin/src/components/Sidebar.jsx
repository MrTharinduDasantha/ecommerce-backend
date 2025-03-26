import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TbDashboardFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdArrowDropdownCircle } from "react-icons/io";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();

  // Manage Products submenu state
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = React.useState(false);

  // Determine if one of the Manage Products routes is active
  const isManageProductsActive =
    location.pathname.includes("products/add-product") ||
    location.pathname.includes("products/add-category-subcategory") ||
    location.pathname.includes("products/edit");

  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  // Parent style: if active, show hover style persistently
  const parentClasses = `flex items-center w-full p-2 text-base rounded-lg transition-colors duration-300 ease-in-out group cursor-pointer ${
    isManageProductsActive
      ? "bg-gray-100 text-[#1D372E]"
      : "hover:bg-gray-100 hover:text-[#1D372E]"
  }`;

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-[#1D372E] border-r border-white ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group"
            >
              <TbDashboardFilled className="w-5 h-5" />
              <span className="ms-3">Dashboard</span>
            </NavLink>
          </li>

          {/* Manage Products */}
          <li>
            <button
              type="button"
              onClick={toggleProductSubMenu}
              className={parentClasses}
              aria-controls="dropdown-product"
            >
              <GiShoppingBag className="w-5 h-5" />
              <span className="flex-1 ms-3 text-left whitespace-nowrap">
                Manage Products
              </span>
              <IoMdArrowDropdownCircle className="w-5 h-5 ml-2" />
            </button>
            {isProductSubMenuOpen && (
              <ul id="dropdown-product" className="py-2 space-y-2">
                <li>
                  <NavLink
                    to="products/add-product"
                    className={({ isActive }) =>
                      `flex items-center w-full p-2 rounded-lg pl-11 transition-colors duration-300 ease-in-out group ${
                        isActive
                          ? "text-[#5CAF90]"
                          : "hover:bg-gray-100 hover:text-[#1D372E]"
                      }`
                    }
                  >
                    Add Product
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="products/add-category-subcategory"
                    className={({ isActive }) =>
                      `flex items-center w-full p-2 rounded-lg pl-11 transition-colors duration-300 ease-in-out group ${
                        isActive
                          ? "text-[#5CAF90]"
                          : "hover:bg-gray-100 hover:text-[#1D372E]"
                      }`
                    }
                  >
                    Category | Sub Category
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="products/edit-product"
                    className={({ isActive }) =>
                      `flex items-center w-full p-2 rounded-lg pl-11 transition-colors duration-300 ease-in-out group ${
                        isActive
                          ? "text-[#5CAF90]"
                          : "hover:bg-gray-100 hover:text-[#1D372E]"
                      }`
                    }
                  >
                    All Products
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Orders */}
          <li>
            <NavLink
              to="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group"
              to="/dashboard/orders"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
            >
              <MdDeliveryDining className="w-5 h-5" />
              <span className="ms-3">Manage Orders</span>
            </NavLink>
          </li>

          {/* Notifications */}
          <li>
            <NavLink
              to="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group"
            >
              <IoNotifications className="w-5 h-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Notifications
              </span>
              <span className="inline-flex items-center justify-center w-3 h-3 p-2.5 ms-3 text-sm font-medium bg-white text-[#1D372E]  rounded-full">
                3
              </span>
            </NavLink>
          </li>

          {/* Manage Users */}
          <li>
            <NavLink
              to="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group"
            >
              <FaUsers className="w-5 h-5" />
              <span className="ms-3">Manage Users</span>
            </NavLink>
            <NavLink
              to="/dashboard/users_managed-form"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
            >
              <FaUsers className="w-5 h-5" />
              <span className="ms-3">Manage Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/customer-managed-form"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
             >
              <FaUsers className="w-5 h-5" />
              <span className="ms-3">Manage Customers</span>
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <NavLink
              to="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="ms-3">Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
