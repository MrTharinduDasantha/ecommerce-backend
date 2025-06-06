import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import {
  TbMenu2,
  TbX,
  TbBell,
  TbChevronDown,
  TbUser,
  TbLogout,
  TbSettings,
} from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import profile from "../assets/userprofile.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const text = "Admin Panel".split("");
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useNotifications();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b border-emerald-950 bg-[#1D372E] transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <style>{`
        @keyframes colorWave {
          0%, 100% { color: white; }
          50% { color: #5CAF90; }
        }
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-sm md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <TbX className="h-5 w-5" />
            ) : (
              <TbMenu2 className="h-5 w-5" />
            )}
          </button>

          <Link
            to="/dashboard/dashboard-private"
            className="flex items-center gap-2"
          >
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-md bg-[#5CAF90] text-primary-content relative">
              <IoSettingsSharp
                className="h-4 w-4 text-white absolute animate-slow-spin"
                style={{ animation: "slow-spin 4s linear infinite" }}
              />
            </div>
            <span className="font-semibold text-lg">
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

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <Link
              to="/dashboard/notifications"
              className="btn btn-ghost hover:bg-[#1D372E] btn-circle"
            >
              <div className="indicator">
                <TbBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="badge badge-sm badge-primary text-white indicator-item">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* User menu */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost hover:bg-[#1D372E] btn-sm flex items-center gap-2 rounded-full pr-2 pl-0"
            >
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    src={profile}
                    className="w-7 h-7 rounded-full"
                    alt="Profile"
                  />
                </div>
              </div>
              <span className="hidden md:inline-block text-sm font-medium">
                {user ? user.fullName : "Admin"}
              </span>
              <TbChevronDown className="h-4 w-4 opacity-50" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content text-xs md:text-sm z-[1] menu p-2 shadow bg-[#1D372E] border border-emerald-950 rounded-box w-56 mt-4"
            >
              <li className="menu-title text-xs md:text-sm text-white">
                My Account
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 hover:bg-[#5CAF90]"
                >
                  <TbUser className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 hover:bg-[#5CAF90]"
                >
                  <TbSettings className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Settings</span>
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-error"
                >
                  <TbLogout className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
