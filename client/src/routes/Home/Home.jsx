import React, { useEffect, useState } from "react";
import denim from "./denims.png";
import fruits from "./fruits.avif";
import {
  getCategories,
  getTopSellingCategories,
  getTopSoldProducts,
  getProducts,
} from "../../api/product";
import ProductCard from "../../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import ReviewCard from "../../components/ReviewCard";
import { getActiveOrderReviews } from "../../api/review";
import { getCustomerById } from "../../api/customer";
import { fetchHomePageSettings } from "../../api/setting";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [topSellingCategories, setTopSellingCategories] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [customers, setCustomers] = useState({});
  const [homePageSettings, setHomePageSettings] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (homePageSettings?.Hero_Images) {
      const heroImages = Array.isArray(homePageSettings.Hero_Images)
        ? homePageSettings.Hero_Images
        : JSON.parse(homePageSettings.Hero_Images || "[]");

      if (heroImages.length > 0) {
        const interval = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [homePageSettings]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch home page settings
        try {
          const homePageData = await fetchHomePageSettings();
          setHomePageSettings(homePageData);
        } catch (homePageError) {
          console.error("Failed to load home page settings:", homePageError);
        }

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

  // Function to split title and color the last word
  const renderTitleWithColoredLastWord = (title) => {
    const words = title.split(" ");
    if (words.length <= 1) return title;

    const lastWord = words.pop();
    const restOfTitle = words.join(" ");

    return (
      <>
        <span className="text-[#1D372E]">{restOfTitle} </span>
        <span className="text-[#5CAF90]">{lastWord}</span>
      </>
    );
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

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getActiveOrderReviews();
      setReviews(data.reverse().slice(0, 6));
      const customerIds = [
        ...new Set(data.map((review) => review.customer_id)),
      ];
      const customerData = {};
      for (const customerId of customerIds) {
        try {
          const customer = await getCustomerById(customerId);
          customerData[customerId] = customer.Full_Name;
        } catch (error) {
          console.error(`Error fetching customer ${customerId}: ${error}`);
        }
      }
      setCustomers(customerData);
    };
    fetchReviews();
  }, []);

  console.log(customers);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;

  // Get hero images
  const heroImages = homePageSettings?.Hero_Images
    ? Array.isArray(homePageSettings.Hero_Images)
      ? homePageSettings.Hero_Images
      : JSON.parse(homePageSettings.Hero_Images || "[]")
    : [];

  // Get working items
  const workingItems = homePageSettings?.Working_Items
    ? Array.isArray(homePageSettings.Working_Items)
      ? homePageSettings.Working_Items
      : JSON.parse(homePageSettings.Working_Items || "[]")
    : [];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Hero Banner */}
      <div className="relative w-full">
        {heroImages.length > 0 ? (
          <>
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[490px] overflow-hidden">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Hero ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentSlide
                      ? "border-[#5CAF90] scale-110"
                      : "border-white/50 hover:border-[#5CAF90]"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[410px] bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">No hero images available</p>
              <p className="text-sm">
                Please configure hero images in admin settings
              </p>
            </div>
          </div>
        )}
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
                  product={product}
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
                  product={product}
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
                product={product}
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
                product={product}
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

      {/* Customer Reviews */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
          <span className="text-[#1D372E]">CUSTOMER </span>
          <span className="text-[#5CAF90]">REVIEWS</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-8">
          Hear from our happy customers—real stories of trust, satisfaction, and
          great experiences that reflect our commitment to quality service.
        </p>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => {
              const customer = customers[review.customer_id] || "User";
              const initials =
                customer
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase() || "U";
              return (
                <ReviewCard
                  key={review.review_id}
                  review={review}
                  customer={customer}
                  initials={initials}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No Reviews Yet</p>
        )}
      </div>

      {/* How We Are Working */}
      <div className="container px-4 py-8 mx-auto">
        {homePageSettings?.Working_Section_Title &&
        homePageSettings?.Working_Section_Description &&
        workingItems.length > 0 ? (
          <>
            <h2 className="mb-2 text-2xl font-semibold text-center sm:text-3xl md:text-4xl">
              <span className="text-[#1D372E]">
                {renderTitleWithColoredLastWord(
                  homePageSettings.Working_Section_Title
                )}
              </span>
            </h2>
            <p className="text-center text-sm sm:text-base text-[#636363] mb-8">
              {homePageSettings.Working_Section_Description}
            </p>
            <div className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
              {workingItems.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white w-20 h-20 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                    <p className="text-[#5E5E5E] text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <p className="text-lg font-medium mb-2">
                Working section not added yet.
              </p>
              <p className="text-sm">
                Please add the working section in admin settings
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
