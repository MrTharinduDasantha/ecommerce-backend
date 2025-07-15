import { useState, useContext, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  TbDashboard,
  TbShoppingBag,
  TbLogout,
  TbUsers,
  TbTruck,
  TbBell,
} from "react-icons/tb";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import {
  MdOutlineFestival,
  MdOutlineDiscount,
  MdOutlineReviews,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Submenu states
  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const [isEventSubMenuOpen, setIsEventSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [isDiscountSubMenuOpen, setIsDiscountSubMenuOpen] = useState(false);
  const [isSettingsSubMenuOpen, setIsSettingsSubMenuOpen] = useState(false);

  // Determine active states
  const isManageProductsActive = location.pathname.includes("products/");
  const isManageEventsActive = location.pathname.includes("events/");
  const isManageDiscountsActive = location.pathname.includes("discounts/");
  const isManageUsersActive =
    location.pathname.includes("users_managed-form") ||
    location.pathname.includes("customer-managed-form") ||
    location.pathname.includes("admin-logs");
  const isManageSettingsActive = location.pathname.includes("settings/");
  const isManageOrdersActive = location.pathname.includes("orders");
  const isManageReviewsActive = location.pathname.includes("reviews");
  const isNotificationsActive = location.pathname.includes("notifications");

  // Toggle submenu functions
  const toggleProductSubMenu = () => {
    setIsProductSubMenuOpen(!isProductSubMenuOpen);
  };

  const toggleEventSubMenu = () => {
    setIsEventSubMenuOpen(!isEventSubMenuOpen);
  };

  const toggleDiscountSubMenu = () => {
    setIsDiscountSubMenuOpen(!isDiscountSubMenuOpen);
  };

  const toggleUsersSubMenu = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  const toggleSettingsSubMenu = () => {
    setIsSettingsSubMenuOpen(!isSettingsSubMenuOpen);
  };

  // Open submenus based on active state
  useEffect(() => {
    if (isManageProductsActive) setIsProductSubMenuOpen(true);
  }, [isManageProductsActive]);

  useEffect(() => {
    if (isManageEventsActive) setIsEventSubMenuOpen(true);
  }, [isManageEventsActive]);

  useEffect(() => {
    if (isManageDiscountsActive) setIsDiscountSubMenuOpen(true);
  }, [isManageDiscountsActive]);

  useEffect(() => {
    if (isManageUsersActive) setIsUsersSubMenuOpen(true);
  }, [isManageUsersActive]);

  useEffect(() => {
    if (isManageSettingsActive) setIsSettingsSubMenuOpen(true);
  }, [isManageSettingsActive]);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen pt-16 transition-transform bg-[#1D372E] border-r border-emerald-950
        w-56 md:w-[15.5rem] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-1 py-4 overflow-y-auto">
        <ul className="menu  menu-sm space-y-1 font-medium">
          {/* Dashboard */}
          <li>
            <NavLink
              to="dashboard-private"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-xs md:text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbDashboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Dashboard
            </NavLink>
          </li>

          {/* Manage Products */}
          <li>
            <button
              onClick={toggleProductSubMenu}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors
              hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                isManageProductsActive
                  ? "bg-[#5CAF90] text-primary-content font-medium"
                  : "text-base-content/85"
              }`}
            >
              <div className="flex items-center gap-3">
                <TbShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Manage Products</span>
              </div>
              {isProductSubMenuOpen ? (
                <IoMdArrowDropupCircle className="w-4 h-4" />
              ) : (
                <IoMdArrowDropdownCircle className="w-4 h-4" />
              )}
            </button>
            {isProductSubMenuOpen && (
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="products/add-product"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
            )}
          </li>

          {/* Manage Events */}
          <li>
            <button
              onClick={toggleEventSubMenu}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors
              hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                isManageEventsActive
                  ? "bg-[#5CAF90] text-primary-content font-medium"
                  : "text-base-content/85"
              }`}
            >
              <div className="flex items-center gap-3">
                <MdOutlineFestival className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Manage Events</span>
              </div>
              {isEventSubMenuOpen ? (
                <IoMdArrowDropupCircle className="w-4 h-4" />
              ) : (
                <IoMdArrowDropdownCircle className="w-4 h-4" />
              )}
            </button>
            {isEventSubMenuOpen && (
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="events/add-event"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Add Event
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="events/all-events"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    All Events
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Discounts */}
          <li>
            <button
              onClick={toggleDiscountSubMenu}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors
              hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                isManageDiscountsActive
                  ? "bg-[#5CAF90] text-primary-content font-medium"
                  : "text-base-content/85"
              }`}
            >
              <div className="flex items-center gap-3">
                <MdOutlineDiscount className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Manage Discounts</span>
              </div>
              {isDiscountSubMenuOpen ? (
                <IoMdArrowDropupCircle className="w-4 h-4" />
              ) : (
                <IoMdArrowDropdownCircle className="w-4 h-4" />
              )}
            </button>
            {isDiscountSubMenuOpen && (
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="discounts/add-discount"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
            )}
          </li>

          {/* Manage Users */}
          <li>
            <button
              onClick={toggleUsersSubMenu}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors
            hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
              isManageUsersActive
                ? "bg-[#5CAF90] text-primary-content font-medium"
                : "text-base-content/85"
            }`}
            >
              <div className="flex items-center gap-3">
                <TbUsers className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Manage Users</span>
              </div>
              {isUsersSubMenuOpen ? (
                <IoMdArrowDropupCircle className="w-4 h-4" />
              ) : (
                <IoMdArrowDropdownCircle className="w-4 h-4" />
              )}
            </button>
            {isUsersSubMenuOpen && (
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="users_managed-form"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
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
            )}
          </li>

          {/* Manage Settings */}
          <li>
            <button
              onClick={toggleSettingsSubMenu}
              className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors
              hover:bg-[#5CAF90] hover:text-white cursor-pointer ${
                isManageSettingsActive
                  ? "bg-[#5CAF90] text-primary-content font-medium"
                  : "text-base-content/85"
              }`}
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Manage Settings</span>
              </div>
              {isSettingsSubMenuOpen ? (
                <IoMdArrowDropupCircle className="w-4 h-4" />
              ) : (
                <IoMdArrowDropdownCircle className="w-4 h-4" />
              )}
            </button>
            {isSettingsSubMenuOpen && (
              <ul className="menu-sub pl-6 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="settings/about-us"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="settings/header-footer"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Header & Footer
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="settings/home-page"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Home Page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="settings/policy-details"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors
                      hover:bg-[#5CAF90] hover:text-white ${
                        isActive
                          ? "text-[#5CAF90] font-medium"
                          : "text-base-content/85"
                      }`
                    }
                  >
                    Policy Details
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Orders */}
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-xs md:text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive || isManageOrdersActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbTruck className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Manage Orders
            </NavLink>
          </li>

          {/* Manage Reviews */}
          <li>
            <NavLink
              to="reviews"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-xs md:text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive || isManageReviewsActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <MdOutlineReviews className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Manage Reviews
            </NavLink>
          </li>

          {/* Notifications */}
          <li>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-xs md:text-sm transition-colors
                hover:bg-[#5CAF90] hover:text-white ${
                  isActive || isNotificationsActive
                    ? "bg-[#5CAF90] text-primary-content font-medium"
                    : "text-base-content/85"
                }`
              }
            >
              <TbBell className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Notifications
            </NavLink>
          </li>

          {/* Divider */}
          <div className="divider my-2"></div>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-xs md:text-sm transition-colors text-base-content/85
                hover:bg-error hover:text-white"
            >
              <TbLogout className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
