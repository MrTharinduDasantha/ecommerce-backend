import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../utills/chartConfig";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPrivate = () => {
  // Revenue Trends (Line Chart) Data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [3000, 4000, 3500, 5000, 7000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Order Status Breakdown (Pie Chart) Data
  const orderStatusData = {
    labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#FF5733", "#FFBF00", "#28A745", "#DC3545"],
      },
    ],
  };

  // Top Selling Products (Bar Chart) Data
  const topSellingProductsData = {
    labels: ["Product 1", "Product 2", "Product 3", "Product 4"],
    datasets: [
      {
        label: "Units Sold",
        data: [150, 120, 100, 80],
        backgroundColor: "#5CAF90",
      },
    ],
  };

  // Product Category Revenue (Doughnut Chart) Data
  const categoryRevenueData = {
    labels: ["Electronics", "Clothing", "Accessories", "Home Appliances"],
    datasets: [
      {
        data: [40, 30, 15, 15],
        backgroundColor: ["#FF5733", "#FFC300", "#28A745", "#2C3E50"],
      },
    ],
  };

  // Pending Shipments (Progress Bar)
  const totalOrders = 100;
  const pendingOrders = 20;

  return (
    <section className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      <div className="space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">
              Total Products
            </h2>
            <p className="text-2xl text-[#5CAF90] font-bold">120</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">
              Total Orders
            </h2>
            <p className="text-2xl text-[#5CAF90] font-bold">80</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">
              Pending Shipments
            </h2>
            <p className="text-2xl text-[#5CAF90] font-bold">15</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">
              Total Revenue
            </h2>
            <p className="text-2xl text-[#5CAF90] font-bold">$5,000</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* First Row */}
          <div>
            <h2 className="text-xl font-bold text-center text-[#1D372E] mb-4">
              Revenue Trends
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <Line data={revenueData} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-center text-[#1D372E] mb-4">
              Order Status Breakdown
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <Pie data={orderStatusData} />
            </div>
          </div>

          {/* Second Row */}
          <div>
            <h2 className="text-xl font-bold text-center text-[#1D372E] mb-4">
              Top Selling Products
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <Bar data={topSellingProductsData} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-center text-[#1D372E] mb-4">
              Category Revenue
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <Doughnut data={categoryRevenueData} />
            </div>
          </div>
        </div>

        {/* Pending Shipments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-center text-[#1D372E] mb-4">
            Pending Shipments
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-md mx-auto">
            <progress
              className="progress progress-primary w-full"
              value={pendingOrders}
              max={totalOrders}
            />
            <p className="text-center text-[#5CAF90] mt-2">
              {pendingOrders} Pending Shipments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPrivate;
