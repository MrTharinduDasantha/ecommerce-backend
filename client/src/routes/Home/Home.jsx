import React, { useEffect, useState } from 'react';
import denim from './denims.png';
import fruits from './fruits.avif';
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { getCategories, getTopSellingCategories, getTopSoldProducts, getProducts } from '../../api/product';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, category, title, price, oldPrice, discountLabel, id }) => (
  <Link
    to={`/product-page/${id}`}
    className="bg-white border border-[#E8E8E8] hover:shadow-lg transition-shadow w-full h-[268px] max-w-[210px] mx-auto"
    style={{ aspectRatio: '220/290' }}
  >
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-[170px] object-cover "
        style={{ aspectRatio: '220/170' }}
      />
      <div className="absolute top-2 right-2 flex flex-col items-end">
        <span className="bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded mb-1">
          New
        </span>
        {discountLabel && discountLabel !== '0% OFF' && (
          <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded">
            {discountLabel}
          </span>
        )}
      </div>
    </div>
    <div className="mt-2 px-4 pb-4">
      <p className="text-[11px] text-[#7A7A7A] mb-1">{category}</p>
      <h3 className="text-[13px] font-medium text-[#1D372E] line-clamp-1">{title}</h3>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-[14px] font-semibold text-[#5E5E5E]">{price}</span>
        {oldPrice && (
          <span className="text-[12px] text-[#CCCCCC] line-through">{oldPrice}</span>
        )}
      </div>
    </div>
  </Link>
);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [topSellingCategories, setTopSellingCategories] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calculateDiscountPercentage = (oldPrice, currentPrice) => {
    if (!oldPrice || !currentPrice) return 0;
    const discount = ((parseFloat(oldPrice) - parseFloat(currentPrice)) / parseFloat(oldPrice)) * 100;
    return Math.round(discount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategories();
        if (categoryData && categoryData.categories) {
          setCategories(categoryData.categories);
        } else {
          setError("Unexpected category data structure: " + JSON.stringify(categoryData));
        }

        const topSellingData = await getTopSellingCategories();
        if (topSellingData && topSellingData.categories) {
          setTopSellingCategories(topSellingData.categories);
        } else {
          setError("Unexpected top-selling data structure: " + JSON.stringify(topSellingData));
        }

        const topSoldData = await getTopSoldProducts();
        if (topSoldData && topSoldData.products) {
          setTopSoldProducts(topSoldData.products);
        } else {
          setError("Unexpected top sold products data structure: " + JSON.stringify(topSoldData));
        }

        const productsData = await getProducts();
        if (productsData && productsData.products) {
          const newArrivalProducts = productsData.products.filter(
            (product) => product.History_Status === 'new arrivals'
          );
          setNewArrivals(newArrivalProducts);
        } else {
          setError("Unexpected products data structure: " + JSON.stringify(productsData));
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

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="font-sans min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Banner */}
      <div className="relative w-full">
        <img
          src={denim}
          alt="Top Jeans"
          className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[410px] object-cover"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest text-gray-800">
            {/* Add text here if needed */}
          </span>
        </div>
      </div>

      {/* Main Categories */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">Main </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4">
          {categories.map((category) => (
            <Link
              key={category.idProduct_Category}
              to={`/AllCategories/${category.idProduct_Category}`}
              state={{ selectedCategoryId: category.idProduct_Category }}
              className="flex flex-col items-center rounded-md p-2 "
            >
              <img
                src={category.Image_Icon_Url || fruits}
                alt={`Category ${category.Description}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full mb-2"
              />
              <span className="text-xs sm:text-sm text-[#1D372E] text-center line-clamp-2">
                {category.Description}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center">
          <span className="text-[#1D372E]">New </span>
          <span className="text-[#5CAF90]">Arrivals</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-6">
          Shop Online for New arrivals and offers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {newArrivals.slice(0, 5).map((product) => (
            <ProductCard
              key={product.idProduct}
              image={product.Main_Image_Url || fruits}
              category={product.subcategories?.[0]?.Description || 'General'}
              title={product.Description}
              price={`${product.Selling_Price} LKR`}
              oldPrice={product.Market_Price ? `${product.Market_Price} LKR` : null}
              discountLabel={
                product.Market_Price && product.Selling_Price
                  ? `${calculateDiscountPercentage(product.Market_Price, product.Selling_Price)}% OFF`
                  : null
              }
              id={product.idProduct}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newArrivals.slice(5, 10).map((product) => (
            <ProductCard
              key={product.idProduct}
              image={product.Main_Image_Url || fruits}
              category={product.subcategories?.[0]?.Description || 'General'}
              title={product.Description}
              price={`${product.Selling_Price} LKR`}
              oldPrice={product.Market_Price ? `${product.Market_Price} LKR` : null}
              discountLabel={
                product.Market_Price && product.Selling_Price
                  ? `${calculateDiscountPercentage(product.Market_Price, product.Selling_Price)}% OFF`
                  : null
              }
              id={product.idProduct}
            />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center">
          <span className="text-[#1D372E]">Top </span>
          <span className="text-[#5CAF90]">Sales</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-6">
          Shop Online for New arrivals and offers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {topSoldProducts.slice(0, 5).map((product) => (
            <ProductCard
              key={product.idProduct}
              image={product.Main_Image_Url || fruits}
              category={product.Description}
              title={product.Long_Description || product.Description}
              price={`${product.Selling_Price} LKR`}
              oldPrice={product.Market_Price ? `${product.Market_Price} LKR` : null}
              discountLabel={
                product.Market_Price && product.Selling_Price
                  ? `${calculateDiscountPercentage(product.Market_Price, product.Selling_Price)}% OFF`
                  : null
              }
              id={product.idProduct}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topSoldProducts.slice(5).map((product) => (
            <ProductCard
              key={product.idProduct}
              image={product.Main_Image_Url || fruits}
              category={product.Description}
              title={product.Long_Description || product.Description}
              price={`${product.Selling_Price} LKR`}
              oldPrice={product.Market_Price ? `${product.Market_Price} LKR` : null}
              discountLabel={
                product.Market_Price && product.Selling_Price
                  ? `${calculateDiscountPercentage(product.Market_Price, product.Selling_Price)}% OFF`
                  : null
              }
              id={product.idProduct}
            />
          ))}
        </div>
      </div>

      {/* Banner under Best Sellers */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 1"
              className="w-full h-[200px] sm:h-[300px] md:h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gray-800"></span>
            </div>
          </div>
          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 2"
              className="w-full h-[200px] sm:h-[300px] md:h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gray-800"></span>
            </div>
          </div>
        </div>
      </div>
{/* Popular Categories */}
<div className="container mx-auto px-4 py-8">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-left">
    <span className="text-[#1D372E]">Popular </span>
    <span className="text-[#5CAF90]">Categories</span>
  </h2>
  <p className="text-left text-sm sm:text-base text-[#636363] mb-6">
    Shop Online for New arrivals and offers
  </p>
  {/* First Row: 1st card width + 2nd card width = 3rd card width */}
  <div className="grid grid-cols-[1fr_1fr_2fr] gap-6 mb-8">
    {topSellingCategories.slice(0, 3).map((category) => (
      <Link
        key={category.idProduct_Category}
        to={`/AllCategories/${category.idProduct_Category}`}
        state={{ selectedCategoryId: category.idProduct_Category }}
        className="group relative bg-white rounded-lg border border-[#5CAF90]/30 hover:border-[#5CAF90] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[300px]"
      >

        <div className="absolute inset-0 bg-gradient-to-r from-[#5CAF90]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex flex-col items-center justify-between p-5 h-full">
          <div className="flex-1 z-10 text-center">
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
              className="w-30 h-30   object-cover rounded-sm transform group-hover:scale-105 transition-transform duration-300"
            />
            {/* Subtle Image Overlay */}
            <div className="absolute inset-0 rounded-lg bg-[#1D372E]/5 group-hover:bg-[#1D372E]/10 transition-all duration-300" />
          </div>
        </div>
      </Link>
    ))}
  </div>
 
  <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
    {topSellingCategories.slice(3, 6).map((category) => (
      <Link
        key={category.idProduct_Category}
        to={`/AllCategories/${category.idProduct_Category}`}
        state={{ selectedCategoryId: category.idProduct_Category }}
        className="group relative bg-white rounded-lg border border-[#5CAF90]/30 hover:border-[#5CAF90] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[300px]"
      >
        {/* Background Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5CAF90]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex flex-col items-center justify-between p-5 h-full">
          <div className="flex-1 z-10 text-center">
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
              className="w-30 h-30  object-cover rounded-sm transform group-hover:scale-105 transition-transform duration-300"
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
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-center">
          <span className="text-[#1D372E]">HOW WE ARE </span>
          <span className="text-[#5CAF90]">WORKING</span>
        </h2>
        <p className="text-center text-sm sm:text-base text-[#636363] mb-8">
          We ensure a seamless shopping experience with a well-structured process. Here’s how we make your online shopping effortless and enjoyable
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <Truck size={40} color="#FFFFFF" className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="font-semibold mt-3 text-lg sm:text-xl">Fast Delivery</h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">Get your orders quickly.</p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <RotateCcw size={40} color="#FFFFFF" className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="font-semibold mt-3 text-lg sm:text-xl">24 Hours Return</h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">Hassle-free returns within 24 hours.</p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <ShieldCheck size={40} color="#FFFFFF" className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="font-semibold mt-3 text-lg sm:text-xl">Secure Payment</h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">100% safe and secure transactions.</p>
          </div>
          <div className="hidden sm:block w-0.5 h-20 bg-[#B4B4B4]"></div>
          <div className="flex flex-col items-center text-center">
            <div className="p-3 sm:p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
              <Headphones size={40} color="#FFFFFF" className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="font-semibold mt-3 text-lg sm:text-xl">Support 24/7</h3>
            <p className="text-[#5E5E5E] text-sm sm:text-base">We're here to help anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;