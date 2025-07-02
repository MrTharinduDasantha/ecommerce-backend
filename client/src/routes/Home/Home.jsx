import React, { useEffect, useState } from "react";
import denim from "./denims.png";
import fruits from "./fruits.avif";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import {
  getCategories,
  getTopSellingCategories,
  getTopSoldProducts,
  getProducts,
} from "../../api/product";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { calculateDiscountPercentage } from "../../components/CalculateDiscount";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [topSellingCategories, setTopSellingCategories] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategories();
        let activeCategories = [];
        if (categoryData && categoryData.categories) {
          activeCategories = categoryData.categories.filter(
            (category) => category.Status === "active"
          );
          setCategories(activeCategories);
        } else {
          setError(
            "Unexpected category data structure: " +
              JSON.stringify(categoryData)
          );
        }

        const topSellingData = await getTopSellingCategories();
        if (topSellingData && topSellingData.categories) {
          const activeTopSellingCategories = topSellingData.categories.filter(
            (topCategory) => {
              return activeCategories.some(
                (activeCategory) =>
                  activeCategory.idProduct_Category ===
                  topCategory.idProduct_Category
              );
            }
          );
          setTopSellingCategories(activeTopSellingCategories);
        } else {
          setError(
            "Unexpected top-selling data structure: " +
              JSON.stringify(topSellingData)
          );
        }

        const topSoldData = await getTopSoldProducts();
        if (topSoldData && topSoldData.products) {
          setTopSoldProducts(topSoldData.products);
        } else {
          setError(
            "Unexpected top sold products data structure: " +
              JSON.stringify(topSoldData)
          );
        }

        const productsData = await getProducts();
        if (productsData && productsData.products) {
          const activeProducts = productsData.products.filter(
            (product) => product.Status === "active"
          );
          const newArrivalProducts = activeProducts.filter(
            (product) => product.History_Status === "new arrivals"
          );
          setNewArrivals(newArrivalProducts);
        } else {
          setError(
            "Unexpected products data structure: " +
              JSON.stringify(productsData)
          );
        }
      } catch (error) {
        console.error("Failed to load data:", error.message);
        setError(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div
      className="min-h-screen font-sans"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Hero Banner */}
      <div className="relative w-full">
        <img
          src={denim}
          alt="Top Jeans"
          className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[410px] object-cover"
        />
        <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <span className="text-2xl font-bold tracking-widest text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl">
            {/* Add text here if needed */}
          </span>
        </div>
      </div>

      {/* Main Categories */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-4 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">Main </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10">
          {categories.length !== 0 ? (
            categories.map((category) => (
              <Link
                key={category.idProduct_Category}
                to={`/AllCategories/${category.idProduct_Category}`}
                state={{ selectedCategoryId: category.idProduct_Category }}
                className="flex flex-col items-center p-2 rounded-md "
              >
                <img
                  src={category.Image_Icon_Url || fruits}
                  alt={`Category ${category.Description}`}
                  className="object-cover w-16 h-16 mb-2 rounded-full sm:w-20 sm:h-20"
                />
                <span className="text-xs sm:text-sm text-[#1D372E] text-center line-clamp-2">
                  {category.Description}
                </span>
              </Link>
            ))
          ) : (
            <div className="flex justify-center w-screen text-red-500 -mx-17">
              No categories found.
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">New </span>
          <span className="text-[#5CAF90]">Arrivals</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-6">
          Shop Online for New arrivals and offers
        </p>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
          {newArrivals.length !== 0 ? (
            newArrivals.slice(0, 5).map((product) => (
              <div
                key={product.idProduct}
                className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                onClick={() => handleProductClick(product.idProduct)}
              >
                <ProductCard
                  image={product.Main_Image_Url || fruits}
                  category={
                    product.subcategories?.[0]?.Description || "General"
                  }
                  title={product.Description}
                  price={product.Selling_Price}
                  oldPrice={product.Market_Price ? product.Market_Price : null}
                  historyStatus={product.History_Status}
                  activeDiscount={
                    product.discounts?.find((d) => d.Status === "active") ||
                    null
                  }
                  id={product.idProduct}
                  className="h-full"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 flex items-center justify-center">
              <p className="text-xl md:text-2xl font-bold text-gray-500">
                No Products Found.
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {newArrivals.length !== 0 &&
            newArrivals.slice(5, 10).map((product) => (
              <div
                key={product.idProduct}
                className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                onClick={() => handleProductClick(product.idProduct)}
              >
                <ProductCard
                  image={product.Main_Image_Url || fruits}
                  category={
                    product.subcategories?.[0]?.Description || "General"
                  }
                  title={product.Description}
                  price={product.Selling_Price}
                  oldPrice={product.Market_Price ? product.Market_Price : null}
                  historyStatus={product.History_Status}
                  activeDiscount={
                    product.discounts?.find((d) => d.Status === "active") ||
                    null
                  }
                  id={product.idProduct}
                  className="h-full"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">Top </span>
          <span className="text-[#5CAF90]">Sales</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-6">
          Shop Online for New arrivals and offers
        </p>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
          {topSoldProducts.slice(0, 5).map((product) => (
            <div
              key={product.idProduct}
              className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
              onClick={() => handleProductClick(product.idProduct)}
            >
              <ProductCard
                image={product.Main_Image_Url || fruits}
                category={product.Description}
                title={product.Long_Description || product.Description}
                price={product.Selling_Price}
                oldPrice={product.Market_Price ? product.Market_Price : null}
                historyStatus={product.History_Status}
                activeDiscount={
                  product.discounts?.find((d) => d.Status === "active") || null
                }
                id={product.idProduct}
                className="h-full"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {topSoldProducts.slice(5).map((product) => (
            <div
              key={product.idProduct}
              className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
              onClick={() => handleProductClick(product.idProduct)}
            >
              <ProductCard
                image={product.Main_Image_Url || fruits}
                category={product.Description}
                title={product.Long_Description || product.Description}
                price={product.Selling_Price}
                oldPrice={product.Market_Price ? product.Market_Price : null}
                historyStatus={product.History_Status}
                activeDiscount={
                  product.discounts?.find((d) => d.Status === "active") || null
                }
                id={product.idProduct}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Banner under Best Sellers */}
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 1"
              className="w-full h-[200px] sm:h-[300px] md:h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <span className="text-2xl font-bold tracking-widest text-gray-800 sm:text-4xl md:text-5xl"></span>
            </div>
          </div>
          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 2"
              className="w-full h-[200px] sm:h-[300px] md:h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <span className="text-2xl font-bold tracking-widest text-gray-800 sm:text-4xl md:text-5xl"></span>
            </div>
          </div>
        </div>
      </div>
      {/* Popular Categories */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-left sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">Popular </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>
        <p className="text-left text-sm sm:text-base text-[#636363] mb-6">
          Shop Online for New arrivals and offers
        </p>
        {/* First Row: 1st card width + 2nd card width = 3rd card width */}
        <div className="grid grid-cols-[1fr_1fr_2fr] gap-6 mb-8">
          {topSellingCategories.length !== 0 ? (
            topSellingCategories.slice(0, 3).map((category) => (
              <Link
                key={category.idProduct_Category}
                to={`/AllCategories/${category.idProduct_Category}`}
                state={{ selectedCategoryId: category.idProduct_Category }}
                className="group relative bg-white rounded-lg border border-[#5CAF90]/30 hover:border-[#5CAF90] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[300px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5CAF90]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col items-center justify-between h-full p-5">
                  <div className="z-10 flex-1 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1D372E] mb-2 group-hover:text-[#5CAF90] transition-colors duration-300 line-clamp-1">
                      {category.Category_Name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5E5E5E] line-clamp-3">
                      {category.Category_Description}
                    </p>
                    <span className="inline-block mt-3 text-sm font-medium text-[#5CAF90] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore Now →
                    </span>
                  </div>
                  <div className="relative mt-4">
                    <img
                      src={category.Image_Icon_Url || fruits}
                      alt={category.Category_Name}
                      className="object-cover transition-transform duration-300 transform rounded-sm w-30 h-30 group-hover:scale-105"
                    />
                    {/* Subtle Image Overlay */}
                    <div className="absolute inset-0 rounded-lg bg-[#1D372E]/5 group-hover:bg-[#1D372E]/10 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-red-500">No categories found.</div>
          )}
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
          {topSellingCategories.length !== 0 &&
            topSellingCategories.slice(3, 6).map((category) => (
              <Link
                key={category.idProduct_Category}
                to={`/AllCategories/${category.idProduct_Category}`}
                state={{ selectedCategoryId: category.idProduct_Category }}
                className="group relative bg-white rounded-lg border border-[#5CAF90]/30 hover:border-[#5CAF90] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[300px]"
              >
                {/* Background Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#5CAF90]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col items-center justify-between h-full p-5">
                  <div className="z-10 flex-1 text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1D372E] mb-2 group-hover:text-[#5CAF90] transition-colors duration-300 line-clamp-1">
                      {category.Category_Name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5E5E5E] line-clamp-3">
                      {category.Category_Description}
                    </p>
                    <span className="inline-block mt-3 text-sm font-medium text-[#5CAF90] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore Now →
                    </span>
                  </div>
                  <div className="relative mt-4">
                    <img
                      src={category.Image_Icon_Url || fruits}
                      alt={category.Category_Name}
                      className="object-cover transition-transform duration-300 transform rounded-sm w-30 h-30 group-hover:scale-105"
                    />
                    {/* Subtle Image Overlay */}
                    <div className="absolute inset-0 rounded-lg bg-[#1D372E]/5 group-hover:bg-[#1D372E]/10 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* How We Are Working */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">HOW WE ARE </span>
          <span className="text-[#5CAF90]">WORKING</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-8">
          We ensure a seamless shopping experience with a well-structured
          process. Here’s how we make your online shopping effortless and
          enjoyable
        </p>
        <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <Truck size={40} color="#FFFFFF" className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="mt-3 text-lg font-semibold sm:text-xl">
              Fast Delivery
            </h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">
              Get your orders quickly.
            </p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <RotateCcw
                size={40}
                color="#FFFFFF"
                className="sm:w-12 sm:h-12"
              />
            </div>
            <h3 className="mt-3 text-lg font-semibold sm:text-xl">
              24 Hours Return
            </h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">
              Hassle-free returns within 24 hours.
            </p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <ShieldCheck
                size={40}
                color="#FFFFFF"
                className="sm:w-12 sm:h-12"
              />
            </div>
            <h3 className="mt-3 text-lg font-semibold sm:text-xl">
              Secure Payment
            </h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">
              100% safe and secure transactions.
            </p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <Headphones
                size={40}
                color="#FFFFFF"
                className="sm:w-12 sm:h-12"
              />
            </div>
            <h3 className="mt-3 text-lg font-semibold sm:text-xl">
              Support 24/7
            </h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">
              We're here to help anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
