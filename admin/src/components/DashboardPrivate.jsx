import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import { Progress } from "reactstrap";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardPrivate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle sidebar visibility on screen size change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to set the correct state
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Revenue Trends (Line Chart) Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [3000, 4000, 3500, 5000, 7000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
        
      }
    ]
  };

  // Order Status Breakdown (Pie Chart) Data
  const orderStatusData = {
    labels: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#FF5733', '#FFBF00', '#28A745', '#DC3545'],
      }
    ]
  };

  // Top Selling Products (Bar Chart) Data
  const topSellingProductsData = {
    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
    datasets: [
      {
        label: 'Units Sold',
        data: [150, 120, 100, 80],
        backgroundColor: '#5CAF90',
      }
    ]
  };

  // Product Category Revenue (Donut Chart) Data
  const categoryRevenueData = {
    labels: ['Electronics', 'Clothing', 'Accessories', 'Home Appliances'],
    datasets: [
      {
        data: [40, 30, 15, 15],
        backgroundColor: ['#FF5733', '#FFC300', '#28A745', '#2C3E50'],
      }
    ]
  };

  // Pending Shipments (Progress Bar)
  const totalOrders = 100;
  const pendingOrders = 20;
  const progress = (pendingOrders / totalOrders) * 100;

  return (
    <section>
      <div className="flex h-screen bg-[#F4F4F4]">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 bg-[#FFFFFF] p-6">
          {/* Navbar */}
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

          <h1 className="mt-[50px] ml-[750px] text-[#000000] text-2xl font-semibold">Admin Dashboard</h1>

          {/* Dashboard Content */}
          <div className="mt-[50px] ml-[300px] bg-[#EEEEEE] p-4 mt-6 rounded-lg shadow-lg">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
              <div className="bg-[#FFFFFF] text-[#5CAF90] p-4 rounded-lg shadow-md w-[300px] h-[200px] ml-[100px]">
                <h2 className="mt-[50px] ml-[30px] text-lg">
                  <i className="fas fa-box-open mr-2"></i> Total Products
                </h2>
                <p className="ml-[100px] text-2xl font-bold">120</p>
              </div>
              <div className="bg-[#FFFFFF] text-[#5CAF90] p-4 rounded-lg shadow-md w-[300px] h-[200px] ml-[100px]">
                <h2 className="mt-[50px] ml-[50px] text-lg">
                  <i className="fas fa-box mr-2"></i> Total Orders
                </h2>
                <p className="ml-[110px] text-2xl font-bold">80</p>
              </div>
              <div className="bg-[#FFFFFF] text-[#5CAF90] p-4 rounded-lg shadow-md w-[300px] h-[200px] ml-[100px]">
                <h2 className="mt-[50px] ml-[20px] text-lg">
                  <i className="fas fa-truck-loading mr-2"></i> Pending Shipments
                </h2>
                <p className="ml-[110px] text-2xl font-bold">15</p>
              </div>
              <div className="bg-[#FFFFFF] text-[#5CAF90] p-4 rounded-lg shadow-md w-[300px] h-[200px] ml-[100px]">
                <h2 className="mt-[50px] ml-[50px] text-lg">
                  <i className="fas fa-dollar-sign mr-2"></i> Total Revenue
                </h2>
                <p className="ml-[90px] text-2xl font-bold">$5,000</p>
              </div>
            </div>
          </div>

          {/* Chart Section */}
       
<div className="grid grid-cols-1 gap-6 mt-4 ">
<h2 className="text-lg  font-semibold"><i className="fas fa-chart-line mr-2 ml-[800px] mt-[50px]"></i> Revenue Trends</h2>
  <div className="bg-[#F4F4F4] p-4 rounded-lg shadow-md w-[1170px] h-[300px] ml-[300px]">
    <Line className="ml-[300px] mt-[-12px]" data={revenueData} />
  </div>
  <h2 className="text-lg  font-semibold"><i className="fas fa-box ml-[800px] mt-[50px]"></i> Order Status Breakdown</h2>
  <div className="bg-[#F4F4F4] p-4 rounded-lg shadow-md w-[1170px] h-[500px] ml-[300px]">
    <Pie className="ml-[300px] mt-[-12px]" data={orderStatusData} />
  </div>
  <h2 className="text-lg   font-semibold"><i className="fas fa-box-open mr-2 ml-[800px] mt-[50px]"></i> Top Selling Products</h2>
  <div className="bg-[#F4F4F4] p-4 rounded-lg shadow-md w-[1170px] h-[500px] ml-[300px]">
    <Bar className="ml-[100px] mt-[-12px]" data={topSellingProductsData} />
  </div>
  <h2 className="text-lg  font-semibold"><i className="fas fa-cogs mr-2 ml-[800px] mt-[50px]"></i> Category Revenue</h2>
  <div className="bg-[#F4F4F4] p-4 rounded-lg shadow-md w-[1170px] h-[500px] ml-[300px]">
    <Doughnut className="ml-[300px] mt-[-12px]" data={categoryRevenueData} />
  </div>
  <h2 className="text-lg  font-semibold"><i className="fas fa-truck-loading mr-2 ml-[800px] mt-[50px]"></i> Pending Shipments</h2>
  <div className="bg-[#F4F4F4] p-4 rounded-lg shadow-md w-[1170px] h-[300px] ml-[300px]">
    <Progress value={progress} max={100} />
    <p>{pendingOrders} Pending Shipments</p>
  </div>
</div>

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default DashboardPrivate;
