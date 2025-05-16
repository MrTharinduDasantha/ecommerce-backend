import React, { useEffect, useState } from 'react';
import denim from './denims.png';
import fruits from './fruits.avif';
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { getCategories, getTopSellingCategories, getTopSoldProducts, getProducts } from '../../api/product';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, category, title, price, oldPrice, discountLabel, id }) => (
  <Link
    to={`/product-page/${id}`}
    className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow w-full max-w-[220px]"
  >
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-[170px] object-cover"
      />
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-1">
        <span className="bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded mb-1">
          New
        </span>
        {discountLabel && (
          <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded">
            {discountLabel}
          </span>
        )}
      </div>
    </div>
    <div className="mt-4 px-4">
      <p className="text-[11.11px] mb-1 text-[#7A7A7A]">{category}</p>
      <h3 className="text-[13.33px] font-medium leading-snug text-[#1D372E] line-clamp-2">{title}</h3>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-[16px] font-semibold text-[#5E5E5E]">{price}</span>
        {oldPrice && (
          <span className="text-[13.33px] text-gray-400 line-through">{oldPrice}</span>
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
    <div className="font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Top Banner */}
      <div className="relative">
        <img 
          src={denim} 
          alt="Top Jeans" 
          className="w-full h-[410px] object-cover sm:h-[300px] md:h-[350px]" 
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-gray-800">
            {/* Banner Text */}
          </span>
        </div>
      </div>

      {/* Main Categories */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">Main </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4 justify-center">
          {categories.map((category) => (
            <Link
              key={category.idProduct_Category}
              to={`/AllCategories/${category.idProduct_Category}`}
              state={{ selectedCategoryId: category.idProduct_Category }} 
              className="flex flex-col items-center rounded-md p-4 hover:shadow-lg transition"
            >
              <img
                src={category.Image_Icon_Url || fruits}
                alt={`Category ${category.Description}`}
                className="w-20 h-20 object-cover rounded-full mb-2"
              />
              <span className="text-[13.33px] text-[#1D372E] text-center line-clamp-2">{category.Description}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">New </span>
          <span className="text-[#5CAF90]">Arrivals</span>
        </h2>
        <p className="text-center mb-8 text-[#636363] text-base">
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
        {/* Next set of new arrivals */}
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
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">Best </span>
          <span className="text-[#5CAF90]">Sellers</span>
        </h2>
        <p className="text-center mb-8 text-[#636363] text-base">
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
        {/* Remaining top sold products */}
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

      {/* Banner with 2 images */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[denim, denim].map((imgSrc, index) => (
            <div key={index} className="relative">
              <img
                src={imgSrc}
                alt={`Banner ${index + 1}`}
                className="w-full h-[364px] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* How We Are Working */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">HOW WE ARE </span>
          <span className="text-[#5CAF90]">WORKING</span>
        </h2>
        <p className="text-center mb-15 text-[#636363] text-base max-w-3xl mx-auto">
          We ensure a seamless shopping experience with a well-structured process. 
          Here’s how we make your online shopping effortless and enjoyable
        </p>
      </div>

      {/* Support Section */}
      <div className="flex flex-col md:flex-row items-center justify-center p-4 mb-16 space-y-8 md:space-y-0 md:space-x-6">
        {/* Support Item */}
        {[
          { icon: <Truck size={50} />, title: "Fast Delivery", desc: "Get your orders quickly." },
          { icon: <RotateCcw size={50} />, title: "24 Hours Return", desc: "Hassle-free returns within 24 hours." },
          { icon: <ShieldCheck size={50} />, title: "Secure Payment", desc: "100% safe and secure transactions." },
          { icon: <Headphones size={50} />, title: "Support 24/7", desc: "We're here to help anytime." },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center max-w-xs px-4">
            <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-[19.22px] mb-2">{item.title}</h3>
            <p className="text-[#5E5E5E] text-[16px]">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;