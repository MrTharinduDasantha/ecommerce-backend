import React, { useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbDashboardFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Separate submenu states
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);

  // Determine if one of the Manage Products routes is active
  const isManageProductsActive =
    location.pathname.includes("products/add-product") ||
    location.pathname.includes("products/add-category-subcategory") ||
    location.pathname.includes("products/edit-product");


  // Determine if one of the Manage Users routes is active
  const isManageUsersActive =
    location.pathname.includes("users_managed-form") ||
    location.pathname.includes("customer-managed-form");

  // Toggle functions

  // Determine if one of the Manage Orders routes is active
  const isManageOrdersActive = location.pathname.includes("orders");


  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const toggleUsersSubMenu = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  // Parent style for submenus – use active background if the respective section is active
  const productParentClasses = `flex items-center w-full p-2 text-base rounded-lg transition-colors duration-300 ease-in-out group cursor-pointer ${
    isManageProductsActive
      ? "bg-gray-100 text-[#1D372E]"
      : "hover:bg-gray-100 hover:text-[#1D372E]"
  }`;

  const usersParentClasses = `flex items-center w-full p-2 text-base rounded-lg transition-colors duration-300 ease-in-out group cursor-pointer ${
    isManageUsersActive
      ? "bg-gray-100 text-[#1D372E]"
      : "hover:bg-gray-100 hover:text-[#1D372E]"
  }`;

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

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
              to="dashboard-private"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-colors duration-300 ease-in-out group ${
                  isActive
                    ? "bg-gray-100 text-[#1D372E]"
                    : "hover:bg-gray-100 hover:text-[#1D372E]"
                }`
              }
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
              className={productParentClasses}
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
                    Add Category
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

          {/* Manage Users */}
          <li>
            <button
              type="button"
              onClick={toggleUsersSubMenu}
              className={usersParentClasses}
              aria-controls="dropdown-users"
            >
              <FaUsers className="w-5 h-5" />
              <span className="flex-1 ms-3 text-left whitespace-nowrap">
                Manage Users
              </span>
              <IoMdArrowDropdownCircle className="w-5 h-5 ml-2" />
            </button>
            {isUsersSubMenuOpen && (
              <ul id="dropdown-users" className="py-2 space-y-2">
                <li>
                  <NavLink
                    to="/dashboard/users_managed-form"
                    className={({ isActive }) =>
                      `flex items-center w-full p-2 rounded-lg pl-11 transition-colors duration-300 ease-in-out group ${
                        isActive
                          ? "text-[#a3fe00]"
                          : "hover:bg-gray-100 hover:text-[#2d2d2d]"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/customer-managed-form"
                    className={({ isActive }) =>
                      `flex items-center w-full p-2 rounded-lg pl-11 transition-colors duration-300 ease-in-out group ${
                        isActive
                          ? "text-[#a3fe00]"
                          : "hover:bg-gray-100 hover:text-[#2d2d2d]"
                      }`
                    }
                  >
                    Customer
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Orders */}
          <li>
  <NavLink
    to="/dashboard/orders"
    className={({ isActive }) =>
      `flex items-center p-2 rounded-lg transition-colors duration-300 ease-in-out group ${
        isActive || isManageOrdersActive
          ? "bg-gray-100 text-[#2d2d2d]"
          : "hover:bg-gray-100 hover:text-[#2d2d2d]"
      }`
    }
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
              <span className="inline-flex items-center justify-center w-3 h-3 p-2.5 ms-3 text-sm font-medium bg-white text-[#1D372E] rounded-full">
                3
              </span>
            </NavLink>
          </li>

          {/* Logout */}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out group cursor-pointer"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="ms-3">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
