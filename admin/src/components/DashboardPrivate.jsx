import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { getProductTotal, getTopSoldProducts } from "../api/product";
import { fetchCustomerCount } from "../api/customer";
import { getOrderCountByStatus, getPendingDeliveryCount, getTotalRevenue, getMonthlyTotalRevenue } from "../api/orders";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const DashboardPrivate = () => {
  // State for stats
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingDeliveryCount, setPendingDeliveryCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // New state for monthly revenue
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingPendingDelivery, setLoadingPendingDelivery] = useState(true);
  const [loadingTotalRevenue, setLoadingTotalRevenue] = useState(true);
  const [loadingMonthlyRevenue, setLoadingMonthlyRevenue] = useState(true); // New loading state
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCustomers, setErrorCustomers] = useState(null);
  const [errorPendingDelivery, setErrorPendingDelivery] = useState(null);
  const [errorTotalRevenue, setErrorTotalRevenue] = useState(null);
  const [errorMonthlyRevenue, setErrorMonthlyRevenue] = useState(null); // New error state
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
  const [errorOrderStatus, setErrorOrderStatus] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [errorTopProducts, setErrorTopProducts] = useState(null);

  // Revenue chart data
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue",
        data: [],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx } = chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(92, 175, 144, 0.6)");
          gradient.addColorStop(1, "rgba(92, 175, 144, 0)");
          return gradient;
        },
        borderColor: "#5CAF90",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });

  // Chart options for the revenue chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(29, 55, 46, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: (value) => `$${value}`, // Add $ to y-axis labels
        },
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear'
      }
    }
  };

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

  // Fetch pending delivery count
  useEffect(() => {
    const fetchPendingDeliveryCount = async () => {
      try {
        const response = await getPendingDeliveryCount();
        setPendingDeliveryCount(response.pendingDeliveryCount);
      } catch (error) {
        setErrorPendingDelivery("Failed to fetch pending delivery count");
        console.error("Error fetching pending delivery count:", error);
      } finally {
        setLoadingPendingDelivery(false);
      }
    };

    fetchPendingDeliveryCount();
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

  // Fetch total revenue
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const response = await getTotalRevenue();
        setTotalRevenue(response.totalRevenue);
      } catch (error) {
        setErrorTotalRevenue("Failed to fetch total revenue");
      } finally {
        setLoadingTotalRevenue(false);
      }
    };

    fetchTotalRevenue();
  }, []);

  // Fetch monthly revenue
  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await getMonthlyTotalRevenue();
        setMonthlyRevenue(response);

        // Transform the API response for the chart
        const labels = response.map(item => {
          const [year, month] = item.month.split('-');
          return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
        });
        const data = response.map(item => parseFloat(item.monthly_revenue));

        setRevenueData({
          labels,
          datasets: [
            {
              label: "Revenue",
              data,
              fill: true,
              backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx } = chart;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(92, 175, 144, 0.6)");
                gradient.addColorStop(1, "rgba(92, 175, 144, 0)");
                return gradient;
              },
              borderColor: "#5CAF90",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        });
      } catch (error) {
        setErrorMonthlyRevenue("Failed to fetch monthly revenue");
      } finally {
        setLoadingMonthlyRevenue(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  // Fetch top selling products
  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await getTopSoldProducts();
        setTopSellingProducts(response.products);
      } catch (error) {
        setErrorTopProducts("Failed to fetch top selling products");
      } finally {
        setLoadingTopProducts(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // Order Status Chart Data
  const orderStatusData = {
    labels: orderStatusCounts.map(item => item.Status),
    datasets: [
      {
        data: orderStatusCounts.map(item => item.count),
        backgroundColor: ["#1D372E", "#346352", "#5CAF90", "#65C09E", "#78E5BC"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(29, 55, 46, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  return (
    <section className="w-full max-w-7xl p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-md shadow-md mx-auto">
      <div className="space-y-6 md:space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Products */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#5CAF90] transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#E6F3EF] opacity-60"></div>
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Products</h2>
            {loadingProducts ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold animate-pulse">Loading...</p>
            ) : errorProducts ? (
              <p className="text-xl sm:text-2xl text-red-500 font-bold">{errorProducts}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">{totalProducts}</p>
            )}
          </div>

          {/* Total Customers */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#5CAF90] transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#E6F3EF] opacity-60"></div>
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Customers</h2>
            {loadingCustomers ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold animate-pulse">Loading...</p>
            ) : errorCustomers ? (
              <p className="text-xl sm:text-2xl text-red-500 font-bold">{errorCustomers}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">{totalCustomers}</p>
            )}
          </div>

          {/* Pending Shipments */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#5CAF90] transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#E6F3EF] opacity-60"></div>
            <h2 className="text-lg font-semibold text-[#1D372E]">Pending Shipments</h2>
            {loadingPendingDelivery ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold animate-pulse">Loading...</p>
            ) : errorPendingDelivery ? (
              <p className="text-xl sm:text-2xl text-red-500 font-bold">{errorPendingDelivery}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">{pendingDeliveryCount}</p>
            )}
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-[#5CAF90] transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#E6F3EF] opacity-60"></div>
            <h2 className="text-lg font-semibold text-[#1D372E]">Total Revenue</h2>
            {loadingTotalRevenue ? (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold animate-pulse">Loading...</p>
            ) : errorTotalRevenue ? (
              <p className="text-xl sm:text-2xl text-red-500 font-bold">{errorTotalRevenue}</p>
            ) : (
              <p className="text-xl sm:text-2xl text-[#5CAF90] font-bold">${parseFloat(totalRevenue).toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white p-5 rounded-lg shadow-md border overflow-hidden transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-[#1D372E] mb-4">Revenue Overview</h2>
            <div className="w-full h-64">
              {loadingMonthlyRevenue ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 animate-pulse">Loading revenue data...</p>
                </div>
              ) : errorMonthlyRevenue ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{errorMonthlyRevenue}</p>
                </div>
              ) : (
                <Line data={revenueData} options={chartOptions} />
              )}
            </div>
          </div>
            {/* Top Selling Products */}
            <div className="bg-white p-5 rounded-lg shadow-md border overflow-hidden transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-[#1D372E] mb-4">Top Selling Products</h2>
            {loadingTopProducts ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 animate-pulse">Loading top products...</p>
              </div>
            ) : errorTopProducts ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{errorTopProducts}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-[#f1f8f5]">
                      <th className="py-3 px-4 text-left text-sm font-medium text-[#1D372E] border-b">ID</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-[#1D372E] border-b">Product Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-[#1D372E] border-b">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.map((product, index) => (
                      <tr 
                        key={product.idProduct}
                        className={`transition-colors duration-150 hover:bg-[#f8fdfb] ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[#f9fcfb]'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">{product.idProduct}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b font-medium">{product.Description}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-b">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 bg-[#e6f3ef] text-[#5CAF90] font-medium rounded-full">
                            {product.Sold_Qty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Order Status Chart */}
          <div className="bg-white p-5 rounded-lg shadow-md border overflow-hidden transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-[#1D372E] mb-4">Order Status Breakdown</h2>
            <div className="w-full h-64">
              {loadingOrderStatus ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 animate-pulse">Loading order status data...</p>
                </div>
              ) : errorOrderStatus ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{errorOrderStatus}</p>
                </div>
              ) : (
                <Doughnut data={orderStatusData} options={doughnutOptions} />
              )}
            </div>
          </div>


          {/* Pending Shipments Progress */}
          <div className="bg-white p-5 rounded-lg shadow-md border overflow-hidden transition-all duration-300 hover:shadow-lg h-50">
            <h2 className="text-lg font-bold text-[#1D372E] mb-4">Pending Shipments Progress</h2>
            {loadingPendingDelivery ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 animate-pulse">Loading shipment data...</p>
              </div>
            ) : errorPendingDelivery ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">{errorPendingDelivery}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-[#5CAF90] h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(pendingDeliveryCount / (orderStatusCounts.reduce((sum, item) => sum + item.count, 0) || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-500">
                  {pendingDeliveryCount} out of {orderStatusCounts.reduce((sum, item) => sum + item.count, 0)} orders pending
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPrivate;