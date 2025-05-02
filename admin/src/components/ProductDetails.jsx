import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getProduct, getProductSales } from "../api/product";
import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
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

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [salesInfo, setSalesInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productData = await getProduct(id);
        setProduct(productData.product);

        // Fetch product sales details
        const salesData = await getProductSales(id);
        setSalesInfo(salesData.salesInfo);
      } catch (error) {
        toast.error(error.message || "Failed to load product details");
        navigate("/dashboard/products/edit-product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/dashboard/products/edit-product");
  };

  if (loading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="alert alert-error">
            <span>Product not found</span>
          </div>
          <button onClick={handleBack} className="btn btn-primary mt-4">
            <FaArrowLeft className="mr-2" /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Prepare sales data for chart
  const salesData = {
    labels: salesInfo?.weeklySales.map((_, index) => `Week ${index + 1}`) || [],
    datasets: [
      {
        label: "Units Sold",
        data: salesInfo?.weeklySales.map((ws) => ws.unitsSold) || [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        yAxisID: "y",
      },
      {
        label: "Revenue",
        data: salesInfo?.weeklySales.map((ws) => ws.revenue) || [],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Units Sold",
        },
        ticks: {
          callback: function (value) {
            return Number.isInteger(value) ? value : Math.floor(value);
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Revenue (Rs.)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="btn btn-circle btn-sm bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
          >
            <FaArrowLeft className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Product Details
            </h2>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Additional Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Images Section */}
            <div className="card bg-white border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                  Images
                </h3>

                {/* Main Image */}
                <div className="mb-4 text-[#1D372E]">
                  <h4 className="font-medium text-sm mb-2">Main Image</h4>
                  {product.Main_Image_Url ? (
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={product.Main_Image_Url}
                        alt="Main"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-base-200 flex items-center justify-center">
                      <span className="text-sm opacity-70">No image</span>
                    </div>
                  )}
                </div>

                {/* Sub Images */}
                <div className="text-[#1D372E]">
                  <h4 className="font-medium text-sm mb-2">Sub Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {product.images?.length > 0 ? (
                      product.images.map((img) => (
                        <div
                          key={img.idProduct_Images}
                          className="aspect-square rounded-lg overflow-hidden"
                        >
                          <img
                            src={img.Image_Url}
                            alt="Sub"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 aspect-square rounded-lg flex items-center justify-center">
                        <span className="text-sm opacity-70">
                          No sub images
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm">Date Created</h4>
                    <p className="mt-1">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Time Created</h4>
                    <p className="mt-1">
                      {new Date(product.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details and Sales Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm">Main Description</h4>
                    <p className="mt-1">{product.Description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Brand</h4>
                    <p className="mt-1">{product.Brand_Name || "Other"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Market Price</h4>
                    <p className="mt-1">Rs. {product.Market_Price}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Selling Price</h4>
                    <p className="mt-1">Rs. {product.Selling_Price}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-sm">Sub Description</h4>
                    <p className="mt-1">
                      {product.Long_Description || "No sub description"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Categories */}
            <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                  Sub Categories
                </h3>
                {product.subcategories?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.subcategories.map((subCat) => (
                      <span
                        key={subCat.idSub_Category}
                        className="badge badge-primary px-3 py-4 bg-[#5CAF90] border-[#5CAF90]"
                      >
                        {subCat.Description}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-70">
                    No sub categories assigned
                  </p>
                )}
              </div>
            </div>

            {/* Variations */}
            <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                  Variations
                </h3>
                {product.variations?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-fixed min-w-[450px] text-center border border-[#1D372E] w-full">
                      <thead className="bg-[#EAFFF7] text-[#1D372E]">
                        <tr className="border-b border-[#1D372E]">
                          <th className="font-semibold w-[175px]">Color</th>
                          <th className="font-semibold w-[150px]">Size</th>
                          <th className="font-semibold w-[125px]">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#1D372E]">
                        {product.variations.map((variation) => (
                          <tr
                            key={variation.idProduct_Variations}
                            className="border-b border-[#1D372E]"
                          >
                            <td>
                              <div className="flex items-center justify-center gap-2">
                                {variation.Colour &&
                                  variation.Colour !== "No color selected" && (
                                    <div
                                      className="w-5 h-5 border border-base-300 rounded-md"
                                      style={{
                                        backgroundColor: variation.Colour,
                                      }}
                                    />
                                  )}
                                <span>{variation.Colour}</span>
                              </div>
                            </td>
                            <td>{variation.Size || "N/A"}</td>
                            <td>{variation.Qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm opacity-70">No variations available</p>
                )}
              </div>
            </div>

            {/* FAQs */}
            <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
              <div className="card-body p-4">
                <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                  Frequently Asked Questions
                </h3>
                {product.faqs?.length > 0 ? (
                  <div className="space-y-4">
                    {product.faqs.map((faq) => (
                      <div
                        key={faq.idFAQ}
                        className="card bg-white border border-[#1D372E]"
                      >
                        <div className="card-body p-3">
                          <h4 className="font-medium">Q: {faq.Question}</h4>
                          <p className="text-sm">A: {faq.Answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-70">No FAQs available</p>
                )}
              </div>
            </div>

            {/* Sales Information Section */}
            {salesInfo && (
              <div className="card bg-white text-[#1D372E] border border-[#1D372E]">
                <div className="card-body p-4">
                  <h3 className="card-title text-base font-semibold text-[#1D372E] mb-4">
                    Sales Information for {product.Description}
                  </h3>
                  {salesInfo.weeklySales.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium text-sm">
                          Total Units Sold (Last 30 Days)
                        </h4>
                        <p className="mt-1">
                          {salesInfo.totalUnitsSoldLast30Days}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          Total Revenue (Last 30 Days)
                        </h4>
                        <p className="mt-1">
                          Rs.{" "}
                          {parseFloat(salesInfo.totalRevenueLast30Days).toFixed(
                            2
                          )}
                        </p>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-medium text-sm mb-2">
                          Sales Trend (Last 30 Days)
                        </h4>
                        <div className="aspect-video">
                          <Line data={salesData} options={options} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm opacity-70">
                      No sales data available for the last 30 days
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
