import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import logo from "../assets/logo.png";
import profile from "../assets/userprofile.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const text = "Admin Panel".split("");
  const { user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleNotifications = () =>
    setIsNotificationsOpen(!isNotificationsOpen);

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#1D372E] border-b border-white shadow-sm">
      <style>{`
        @keyframes colorWave {
          0%, 100% { color: white; }
          50% { color: #5CAF90; }
        }
      `}</style>
      <div className="px-3 py-2 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-1.5 text-white rounded-lg sm:hidden hover:bg-[#5CAF90] transition-colors duration-200"
              aria-controls="logo-sidebar"
            >
              {isSidebarOpen ? (
                <RiSidebarFoldFill className="w-5 h-5" />
              ) : (
                <RiSidebarUnfoldFill className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </button>

            <Link
              to="/dashboard/dashboard-private"
              className="flex items-center gap-2"
            >
              <img
                src={logo || "/placeholder.svg"}
                className="h-7 w-auto"
                alt="Logo"
              />
              <span className="hidden sm:block text-lg font-semibold text-white">
                {text.map((char, index) => (
                  <span
                    key={index}
                    style={{
                      animation: `colorWave 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="btn btn-ghost btn-circle text-white"
              >
                <div className="indicator">
                  <IoNotifications className="h-5 w-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    3
                  </span>
                </div>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 z-10 mt-4 w-56 bg-[#1D372E] rounded-lg shadow-lg">
                  <div className="px-4 py-3 border-b border-white">
                    <h3 className="font-medium text-white text-sm">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-2">
                    <div className="p-2 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-white">
                        New order received
                      </p>
                      <p className="text-xs text-gray-300">2 minutes ago</p>
                    </div>
                    <div className="p-2 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-white">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-300">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 btn btn-ghost btn-sm"
              >
                <img
                  src={profile}
                  className="w-7 h-7 rounded-full"
                  alt="Profile"
                />
                <span className="hidden md:block text-white text-sm">
                  {user ? user.fullName : "Admin"}
                </span>
                <IoMdArrowDropdownCircle className="w-4 h-4 text-white" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-10 mt-4 w-48 bg-[#1D372E] rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#5CAF90] transition-colors"
                      >
                        User Profile
                      </Link>
                    </li>
                    <li className="border-t border-white mt-2 pt-2">
                      <Link
                        to="/logout"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#5CAF90] transition-colors"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
