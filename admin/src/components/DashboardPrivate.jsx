import { useEffect, useState } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { getProductTotal, getCategories } from "../api/product";
import { fetchCustomerCount } from "../api/customer";
import { getOrderCountByStatus } from "../api/orders";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPrivate = () => {
  // State for total products
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCustomers, setErrorCustomers] = useState(null);
  const [errorOrderStatus, setErrorOrderStatus] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);

  // Fetch total products
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await getProductTotal();
        setTotalProducts(response.totalProducts);
      } catch (error) {
        setErrorProducts("Failed to fetch total products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTotalProducts();
  }, []);

  // Fetch total customers
  useEffect(() => {
    const fetchTotalCustomers = async () => {
      try {
        const response = await fetchCustomerCount();
        setTotalCustomers(response.total);
      } catch (error) {
        setErrorCustomers("Failed to fetch total customers");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchTotalCustomers();
  }, []);

  // Fetch order status counts
  useEffect(() => {
    const fetchOrderStatusCounts = async () => {
      try {
        const response = await getOrderCountByStatus();
        setOrderStatusCounts(response);
      } catch (error) {
        setErrorOrderStatus("Failed to fetch order status counts");
      } finally {
        setLoadingOrderStatus(false);
      }
    };

    fetchOrderStatusCounts();
  }, []);

  // Fetch categories data
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await getCategories();
        setCategoriesData(response.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoriesData();
  }, []);
  
  // Prepare order status data for the Pie Chart
  const orderLabels = orderStatusCounts.map(item => item.Status);
  const orderDataValues = orderStatusCounts.map(item => item.count);
  
  // Order Status Breakdown (Pie Chart) Data
  const orderStatusData = {
    labels: orderLabels, 
    datasets: [
      {
        data: orderDataValues,
        backgroundColor: ["#FF5733", "#FFBF00", "#28A745", "#DC3545", "#7f0492"], 
      },
    ],
  };

  // Prepare data for Doughnut Chart using categoriesData
  const categoryLabels = categoriesData.map(category => category.Description);
  const categoryDataCounts = categoriesData.map(category => category.subCategoriesCount);
  
  // Category Revenue Data
  const categoryRevenueData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryDataCounts,
        backgroundColor: ["#FF5733", "#FFC300", "#28A745", "#2C3E50"],
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
  
  // Pending Shipments (Progress Bar)
  const totalOrders = 100;
  const pendingOrders = 20;

  // Chart options for responsiveness
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <section className="w-full max-w-7xl p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-md shadow-md mx-auto">
      <div className="space-y-6 md:space-y-8">
        {/* Stats Section */} 
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Products</h2>
            {loadingProducts ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">Loading...</p>
            ) : errorProducts ? (
              <p className="text-xl sm:text-2xl text-[#DC3545] font-bold">{errorProducts}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">{totalProducts}</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Customers</h2>
            {loadingCustomers ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">Loading...</p>
            ) : errorCustomers ? (
              <p className="text-xl sm:text-2xl text-[#DC3545] font-bold">{errorCustomers}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">{totalCustomers}</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">Pending Shipments</h2>
            <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">15</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Revenue</h2>
            <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">$5,000</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Order Status Breakdown */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D372E] mb-3 sm:mb-4">Order Status Breakdown</h2>
            <div className="w-full h-60 sm:h-64 flex items-center justify-center">
              {loadingOrderStatus ? (
                <p>Loading Order Status...</p>
              ) : (
                <Pie data={orderStatusData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Top Selling Products Chart */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D372E] mb-3 sm:mb-4">Top Selling Products</h2>
            <div className="w-full h-60 sm:h-64 flex items-center justify-center">
              <Bar 
                data={topSellingProductsData} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Pending Shipments */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center md:col-span-2 lg:col-span-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D372E] mb-3 sm:mb-4">Pending Shipments</h2>
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-[#5CAF90] h-4 rounded-full" 
                  style={{ width: `${(pendingOrders / totalOrders) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-[#5CAF90] mt-2">{pendingOrders} Pending out of {totalOrders} Orders</p>
            </div>
          </div> 

          
          {/* Category Revenue */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center md:col-span-2 lg:col-span-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#1D372E] mb-3 sm:mb-4">Category Breakdown</h2>
            <div className="w-full h-60 sm:h-64 flex items-center justify-center">
              {loadingCategories ? (
                <p>Loading Categories...</p>
              ) : (
                <Doughnut data={categoryRevenueData} options={chartOptions} />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default DashboardPrivate;