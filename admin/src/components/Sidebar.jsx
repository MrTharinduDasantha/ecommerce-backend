import { useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbDashboardFilled } from "react-icons/tb";
import { GiShoppingBag } from "react-icons/gi";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Submenu states
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);

  // Determine active states
  const isManageProductsActive = location.pathname.includes("products/");
  const isManageUsersActive =
    location.pathname.includes("users_managed-form") ||
    location.pathname.includes("customer-managed-form") ||
    location.pathname.includes("admin-logs");
  const isManageOrdersActive = location.pathname.includes("orders");

  // Toggle submenu functions
  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const toggleUsersSubMenu = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-14 transition-transform bg-[#1D372E] border-r border-white
        w-60 md:w-56 lg:w-60 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-3 overflow-y-auto">
        <ul className="menu menu-sm gap-1 font-medium text-white">
          {/* Dashboard */}
          <li>
            <NavLink
              to="dashboard-private"
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 hover:bg-[#5CAF90] transition-colors ${
                  isActive ? "bg-[#5CAF90] text-white font-medium" : ""
                }`
              }
            >
              <TbDashboardFilled className="w-4 h-4" />
              Dashboard
            </NavLink>
          </li>

          {/* Manage Products */}
          <li className="menu-collapse">
            <details open={isProductSubMenuOpen || isManageProductsActive}>
              <summary
                onClick={toggleProductSubMenu}
                className={`flex items-center justify-between gap-3 py-2 hover:bg-[#5CAF90] transition-colors cursor-pointer ${
                  isManageProductsActive
                    ? "bg-[#5CAF90] text-white font-medium"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <GiShoppingBag className="w-4 h-4" />
                  <span>Manage Products</span>
                </div>
              </summary>
              <ul className="menu-sub pl-4 mt-1">
                <li>
                  <NavLink
                    to="products/add-product"
                    className={({ isActive }) =>
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
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
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
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
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
                      }`
                    }
                  >
                    All Products
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Manage Users */}
          <li className="menu-collapse">
            <details open={isUsersSubMenuOpen || isManageUsersActive}>
              <summary
                onClick={toggleUsersSubMenu}
                className={`flex items-center justify-between gap-3 py-2 hover:bg-[#5CAF90] transition-colors cursor-pointer ${
                  isManageUsersActive
                    ? "bg-[#5CAF90] text-white font-medium"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaUsers className="w-4 h-4" />
                  <span>Manage Users</span>
                </div>
              </summary>
              <ul className="menu-sub pl-4 mt-1">
                <li>
                  <NavLink
                    to="users_managed-form"
                    className={({ isActive }) =>
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="customer-managed-form"
                    className={({ isActive }) =>
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
                      }`
                    }
                  >
                    Customer
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="admin-logs"
                    className={({ isActive }) =>
                      `py-1.5 hover:bg-[#5CAF90] hover:text-white transition-colors ${
                        isActive ? "text-[#5CAF90] font-medium" : ""
                      }`
                    }
                  >
                    Admin Logs
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 hover:bg-[#5CAF90] transition-colors ${
                  isActive ? "bg-[#5CAF90] text-white font-medium" : ""
                }`
              }
            >
              <IoMdSettings className="w-4 h-4" />
              Manage Settings
            </NavLink>
          </li>

          {/* Manage Orders */}
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 hover:bg-[#5CAF90] transition-colors ${
                  isActive || isManageOrdersActive
                    ? "bg-[#5CAF90] text-white font-medium"
                    : ""
                }`
              }
            >
              <MdDeliveryDining className="w-4 h-4" />
              Manage Orders
            </NavLink>
          </li>

          {/* Notifications */}
          <li>
            <NavLink
              to="#"
              className="flex items-center gap-3 py-2 hover:bg-[#5CAF90] transition-colors"
            >
              <IoNotifications className="w-4 h-4" />
              <span>Notifications</span>
              <span className="badge badge-sm badge-primary ml-auto">3</span>
            </NavLink>
          </li>

          {/* Divider */}
          <div className="divider my-2"></div>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-2 hover:bg-[#5CAF90] transition-colors w-full text-left"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
