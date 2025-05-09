import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle responsive sidebar behavior
  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    return null; // Prevent layout shift during hydration
  }

  return (
    <div className="min-h-screen bg-[#1D372E]">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <main className="pt-16 md:pl-64 transition-all duration-300 ease-in-out min-h-screen">
        <div className="p-4 md:p-6 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
