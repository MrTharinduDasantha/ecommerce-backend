import { useState } from "react";
import { Link } from "react-router-dom";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#1D372E] border-b border-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-1 text-sm rounded-lg border-2 sm:hidden hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out"
            >
              {isSidebarOpen ? (
                <RiSidebarFoldFill className="w-6 h-6" />
              ) : (
                <RiSidebarUnfoldFill className="w-6 h-6" />
              )}
            </button>
            <Link to="/dashboard" className="flex ms-2 md:me-24">
              <img src={logo} className="w-8 h-8 me-3" alt="Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                Admin Panel
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm items-center"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  <img src={profile} className="w-8 h-8" alt="Profile" />
                  {isDropdownOpen ? (
                    <IoMdArrowDropdownCircle className="w-5 h-5 ml-2" />
                  ) : (
                    <IoMdArrowDropupCircle className="w-5 h-5 ml-2" />
                  )}
                </button>
              </div>
              {/* User dropdown */}
              {isDropdownOpen && (
                <div
                  className="z-50 absolute right-0 mt-[22rem] w-48 text-base list-none bg-[#1D372E] divide-y divide-white rounded-sm shadow-sm"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm" role="none">
                      Admin
                    </p>
                    <p className="text-sm font-medium" role="none">
                      admin@gmail.com
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        User Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Manage Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Manage Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Notifications
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Manage Users
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/logout"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {/* End of user dropdown */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
