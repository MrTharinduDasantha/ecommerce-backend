import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import profile from "../assets/userprofile.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const text = "Admin Panel".split("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#1D372E] border-b border-white">
      <style>{`
        @keyframes colorWave {
          0%, 100% { color: white; }
          50% { color: #5CAF90; }
        }
      `}</style>

      <div className="px-2 py-2 md:px-3 md:py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center p-1 text-sm rounded-lg border-2 sm:hidden hover:bg-gray-100 hover:text-[#1D372E] transition-colors duration-300 ease-in-out"
            >
              {isSidebarOpen ? (
                <RiSidebarFoldFill className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <RiSidebarUnfoldFill className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
            <Link
              to="/dashboard/dashboard-private"
              className="flex ms-2 md:me-24"
            >
              <img
                src={logo}
                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 me-2 md:me-3"
                alt="Logo"
              />
              <div className="self-center flex space-x-[0.05em]">
                {text.map((char, index) => (
                  <span
                    key={index}
                    className="text-lg md:text-xl lg:text-2xl font-semibold"
                    style={{
                      animation: `colorWave 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.15}s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
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
                  <img
                    src={profile}
                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                    alt="Profile"
                  />
                  {isDropdownOpen ? (
                    <IoMdArrowDropdownCircle className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
                  ) : (
                    <IoMdArrowDropupCircle className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
                  )}
                </button>
              </div>

              {isDropdownOpen && (
                <div
                  className="z-50 absolute right-0 mt-[170px] md:mt-[198px] lg:mt-[202px] w-40 md:w-44 lg:w-48 text-base list-none bg-[#1D372E] divide-y divide-white rounded-sm shadow-sm"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm" role="none">
                      {user ? user.fullName : "Admin"}
                    </p>
                    <p className="text-sm font-medium" role="none">
                      {user ? user.email : "admin@gmail.com"}
                    </p>
                  </div>

                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        to="profile"
                        className="block px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
                      >
                        User Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/logout"
                        className="block px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm hover:bg-gray-100 hover:text-[#2d2d2d] transition-colors duration-300 ease-in-out group"
                        role="menuitem"
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
