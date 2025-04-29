




















import React, { useEffect, useState } from 'react';
import denim from './denims.png';
import fruits from './fruits.avif';
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { getCategories, getTopSellingCategories, getTopSoldProducts, getProducts } from '../../api/product';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, category, title, price, oldPrice, discountLabel, id }) => (
  <Link to={`/product-page/${id}`} className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow" style={{ width: '220px', height: '290px' }}>
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-[220px] h-[170px] object-cover"
        style={{ width: '220', height: '170px' }}
      />
      <div className="absolute top-4 right-4 flex flex-col items-end">
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
    <div className="mt-4">
      <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">{category}</p>
      <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] line-clamp-2 overflow-hidden pl-4">{title}</h3>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">{price}</span>
        {oldPrice && (
          <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">{oldPrice}</span>
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="relative">
        <img 
          src={denim} 
          alt="Top Jeans" 
          className="w-full h-[410px] object-cover sm:h-[300px] md:h-[350px] lg:h-[410px]" 
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest text-gray-800">
            {/* Text goes here */}
          </span>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <h2 className="text-[39.81px] font-semibold mb-4 text-center">
          <span className="text-[#1D372E]">Main </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-4">
          {categories.map((category) => (
            <Link
              key={category.idProduct_Category}
              to={`/AllCategories/${category.idProduct_Category}`}
              state={{ selectedCategoryId: category.idProduct_Category }} 
              className="flex flex-col items-center rounded-md p-4"
            >
              <img
                src={category.Image_Icon_Url || fruits}
                alt={`Category ${category.Description}`}
                className="w-20 h-20 object-cover rounded-full mb-2"
              />
              <span className="text-[13.33px] text-[#1D372E] text-center">{category.Description}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-2">
        <h2 className="text-[39.81px] font-semibold mb-[-5px] text-center">
          <span className="text-[#1D372E]">New </span>
          <span className="text-[#5CAF90]">Arrivals</span>
        </h2>
        <p className="text-center text-[16px] text-[#636363] mb-8">
          Shop Online for New arrivals and offers
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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

      <div className="container mx-auto py-8">
        <h2 className="text-[39.81px] font-semibold mb-0 text-center">
          <span className="text-[#1D372E]">Best </span>
          <span className="text-[#5CAF90]">Sellers</span>
        </h2>
        <p className="text-center text-[16px] text-[#636363] mb-8">
          Shop Online for New arrivals and offers
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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


      {/* Banner under Best Sellers with 2 Images */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 1"
              className="w-full h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-6xl font-bold tracking-widest text-gray-800"></span>
            </div>
          </div>

          <div className="relative">
            <img
              src={denim}
              alt="Banner Image 2"
              className="w-full h-[364px] object-cover rounded-[10px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-6xl font-bold tracking-widest text-gray-800"></span>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto py-8">
        <h2 className="text-[39.81px] font-semibold mb-0 text-left">
          <span className="text-[#1D372E]">Popular </span>
          <span className="text-[#5CAF90]">Categories</span>
        </h2>
        <p className="text-left text-[16px] text-[#636363] mb-8">
          Shop Online for New arrivals and offers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSellingCategories.slice(0, 3).map((category) => (
            <Link
              key={category.idProduct_Category}
              to={`/AllCategories/${category.idProduct_Category}`}
              state={{ selectedCategoryId: category.idProduct_Category }} 
              className="bg-white p-4 rounded-lg border border-[#5CAF90] flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-[19.20px] font-semibold mb-1 text-[#1D372E]">{category.Category_Name}</h3>
                <p className="text-[13.33px] text-[#5E5E5E] mb-4">{category.Category_Description}</p>
              </div>
              <img
                src={category.Image_Icon_Url || fruits}
                alt={category.Category_Name}
                className="w-28 h-28 object-cover rounded-md"
              />
            </Link>
          ))}
        </div>

        <br />

        {/* Next Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSellingCategories.slice(3, 6).map((category) => (
            <Link
              key={category.idProduct_Category}
              to={`/AllCategories/${category.idProduct_Category}`}
              state={{ selectedCategoryId: category.idProduct_Category }} 
              className="bg-white p-4 rounded-lg border border-[#5CAF90] flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-[19.20px] font-semibold mb-1 text-[#1D372E]">{category.Category_Name}</h3>
                <p className="text-[13.33px] text-[#5E5E5E] mb-4">{category.Category_Description}</p>
              </div>
              <img
                src={category.Image_Icon_Url || fruits}
                alt={category.Category_Name}
                className="w-28 h-28 object-cover rounded-md"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-8">
        <h2 className="text-[39.81px] font-semibold mb-0 text-center">
          <span className="text-[#1D372E]">HOW WE ARE </span>
          <span className="text-[#5CAF90]">WORKING</span>
        </h2>
        <p className="text-center text-[16px] text-[#636363] mb-8">
          We ensure a seamless shopping experience with a well-structured process. Here’s how we make your online shopping effortless and enjoyable
        </p>
      </div>

      <div className="flex items-center justify-between p-4 mt-[-60px] mb-[60px]">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
            <Truck size={50} color="#FFFFFF" />
          </div>
          <h3 className="font-semibold mt-3 text-[19.22px]">Fast Delivery</h3>
          <p className="text-[#5E5E5E] text-[16px]">Get your orders quickly.</p>
        </div>

        <div className="w-0.5 h-25 bg-[#B4B4B4]"></div>

        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
            <RotateCcw size={50} color="#FFFFFF" />
          </div>
          <h3 className="font-semibold mt-3 text-[19.22px]">24 Hours Return</h3>
          <p className="text-[#5E5E5E] text-[16px]">Hassle-free returns within 24 hours.</p>
        </div>

        <div className="w-0.5 h-25 bg-[#B4B4B4]"></div>

        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
            <ShieldCheck size={50} color="#FFFFFF" />
          </div>
          <h3 className="font-semibold mt-3 text-[19.22px]">Secure Payment</h3>
          <p className="text-[#5E5E5E] text-[16px]">100% safe and secure transactions.</p>
        </div>

        <div className="w-0.5 h-25 bg-[#B4B4B4]"></div>

        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
            <Headphones size={50} color="#FFFFFF" />
          </div>
          <h3 className="font-semibold mt-3 text-[19.22px]">Support 24/7</h3>
          <p className="text-[#5E5E5E] text-[16px]">We're here to help anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;