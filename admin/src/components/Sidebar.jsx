import { useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbShoppingBag,
  TbLogout,
  TbUsers,
  TbTruck,
  TbBell,
  TbSettings,
} from "react-icons/tb";
import { MdOutlineDiscount } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Submenu states
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [isDiscountSubMenuOpen, setIsDiscountSubMenuOpen] = useState(false);

  // Determine active states
  const isManageProductsActive = location.pathname.includes("products/");
  const isManageDiscountsActive = location.pathname.includes("discounts/");
  const isManageUsersActive =
    location.pathname.includes("users_managed-form") ||
    location.pathname.includes("customer-managed-form") ||
    location.pathname.includes("admin-logs");
  const isManageOrdersActive = location.pathname.includes("orders");
  const isNotificationsActive = location.pathname.includes("notifications");

  // Toggle submenu functions
  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const toggleDiscountSubMenu = () => {
    setIsDiscountSubMenuOpen(!isDiscountSubMenuOpen);
  };

  const toggleUsersSubMenu = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen pt-16 transition-transform bg-[#1D372E] border-r border-emerald-950
        w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="menu menu-sm space-y-1 font-medium">
          {/* Dashboard */}
          <li>
            <NavLink
              to="dashboard-private"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
          </li>

          {/* Manage Products */}
          <li className="menu-collapse">
            <details open={isProductSubMenuOpen || isManageProductsActive}>
              <summary
                onClick={toggleProductSubMenu}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors
                  hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                    isManageProductsActive
                      ? "bg-[#5CAF90] text-primary-content font-medium"
                      : "text-base-content/85"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <TbShoppingBag className="w-4 h-4" />
                  <span>Manage Products</span>
                </div>
              </summary>
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="products/add-product"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
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
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
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
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    All Products
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Manage Discounts */}
          <li className="menu-collapse">
            <details open={isDiscountSubMenuOpen || isManageDiscountsActive}>
              <summary
                onClick={toggleDiscountSubMenu}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors
                  hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                    isManageDiscountsActive
                      ? "bg-[#5CAF90] text-primary-content font-medium"
                      : "text-base-content/85"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <MdOutlineDiscount className="w-4 h-4" />
                  <span>Manage Discounts</span>
                </div>
              </summary>
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="discounts/add-discount"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Add Discount
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="discounts/all-discounts"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    All Discounts
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
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors
                  hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                    isManageUsersActive
                      ? "bg-[#5CAF90] text-primary-content font-medium"
                      : "text-base-content/85"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <TbUsers className="w-4 h-4" />
                  <span>Manage Users</span>
                </div>
              </summary>
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="users_managed-form"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
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
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
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
                      `block rounded-md px-3 py-1.5 text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Admin Logs
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          {/* Manage Orders */}
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive || isManageOrdersActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbTruck className="w-4 h-4" />
              Manage Orders
            </NavLink>
          </li>

          {/* Notifications */}
          <li>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive || isNotificationsActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbBell className="w-4 h-4" />
              Notifications
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbSettings className="w-4 h-4" />
              Manage Settings
            </NavLink>
          </li>

          {/* Divider */}
          <div className="divider my-2"></div>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm transition-colors text-base-content/85
                hover:bg-error hover:text-white"
            >
              <TbLogout className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
