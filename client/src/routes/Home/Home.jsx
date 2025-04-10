import React from 'react';
import denim from './denims.png';
import fruits from './fruits.avif';
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { motion } from 'framer-motion';

const categories = [
  { name: 'Fruits', items: 12 },
  { name: 'Bakery', items: 8 },
  { name: 'Vegetables', items: 15 },
  { name: 'Dairy', items: 10 },
  { name: 'Snacks', items: 20 },
  { name: 'Beverages', items: 25 },
  { name: 'Frozen', items: 5 },
  { name: 'Health', items: 18 },
  { name: 'Bakery', items: 12 },
  { name: 'Meat', items: 8 },
];

const Home = () => {
  return (
    <div className="font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      <div className="relative">
      <img 
        src={denim} 
        alt="Top Jeans" 
        className="w-full h-[410px] object-cover sm:h-[300px] md:h-[350px] lg:h-[410px] " 
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

  {/* Responsive Grid Layout */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {categories.map((category, index) => (
      <div
        key={index}
        className="flex flex-col items-center border border-[#E8E8E8] rounded-md p-4 transition-shadow hover:shadow-md"
      >
        <img
          src={fruits}
          alt={`Category ${category.name}`}
          className="w-24 h-24 object-cover rounded-md mb-2"
        />
        <span className="text-[16px] text-[#1D372E]">{category.name}</span>
        <span className="text-[13.33px] text-[#7A7A7A]">{category.items} items</span>
      </div>
    ))}
  </div>
</div>


<div className="container mx-auto py-8">
  <h2 className="text-[39.81px] font-semibold mb-[-5px] text-center">
    <span className="text-[#1D372E]">New </span>
    <span className="text-[#5CAF90]">Arrivals</span>
  </h2>
  <p className="text-center text-[16px] text-[#636363] mb-8">
    Shop Online for New arrivals and offers
  </p>

  {/* First Grid Section */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
    <ProductCard
      image={fruits}
      category="Snack"
      title="500g 3in1 Cashew Nuts Gift Pack in Plastic Container – Box"
      price="1000.00 LKR"
      oldPrice="1200.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Health"
      title="Mixed Dry Fruits Premium Quality 1kg Pack"
      price="2500.00 LKR"
      oldPrice="3000.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Health"
      title="Premium Almonds 500g Pack"
      price="1500.00 LKR"
      oldPrice="1800.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Snack"
      title="Organic Walnuts 250g"
      price="2000.00 LKR"
      oldPrice="2200.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Snack"
      title="Pistachios Roasted & Salted 500g"
      price="3000.00 LKR"
      oldPrice="3500.00 LKR"
    />
  </div>

  {/* Second Grid Section */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    <ProductCard
      image={fruits}
      category="Snack"
      title="Chia Seeds Premium Quality 250g"
      price="900.00 LKR"
      oldPrice="1100.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Health"
      title="Sunflower Seeds Organic 300g"
      price="800.00 LKR"
      oldPrice="1000.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Health"
      title="Flax Seeds Roasted 500g"
      price="700.00 LKR"
      oldPrice="950.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Snack"
      title="Dried Cranberries Sweetened 250g"
      price="1200.00 LKR"
      oldPrice="1400.00 LKR"
    />
    <ProductCard
      image={fruits}
      category="Snack"
      title="Hazelnuts Raw 300g"
      price="2200.00 LKR"
      oldPrice="1200.00 LKR"
    />
  </div>
</div>


      <div className="relative mt-12">
        <img
          src={denim}
          alt="Top Jeans"
          className="w-full h-[410px] object-cover"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-6xl font-bold tracking-widest text-gray-800"></span>
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

        {/* Row 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          <ProductCard
            image={fruits}
            category="Snack"
            title="500g 3in1 Cashew Nuts Gift Pack in Plastic Container – Box"
            price="1000.00 LKR"
            oldPrice="1200.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Health"
            title="Mixed Dry Fruits Premium Quality 1kg Pack"
            price="2500.00 LKR"
            oldPrice="3000.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Health"
            title="Premium Almonds 500g Pack"
            price="1500.00 LKR"
            oldPrice="1800.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Snack"
            title="Organic Walnuts 250g"
            price="2000.00 LKR"
            oldPrice="2200.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Snack"
            title="Pistachios Roasted & Salted 500g"
            price="3000.00 LKR"
            oldPrice="3500.00 LKR"
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <ProductCard
            image={fruits}
            category="Snack"
            title="Chia Seeds Premium Quality 250g"
            price="900.00 LKR"
            oldPrice="1100.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Health"
            title="Sunflower Seeds Organic 300g"
            price="800.00 LKR"
            oldPrice="1000.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Health"
            title="Flax Seeds Roasted 500g"
            price="700.00 LKR"
            oldPrice="950.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Snack"
            title="Dried Cranberries Sweetened 250g"
            price="1200.00 LKR"
            oldPrice="1400.00 LKR"
          />
          <ProductCard
            image={fruits}
            category="Snack"
            title="Hazelnuts Raw 300g"
            price="2200.00 LKR"
            oldPrice="1200.00 LKR"
          />
        </div>
      </div>
   {/* Banner under New Arrivals with 2 Images */}
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

<div className="container mx-auto py-8">
  <h2 className="text-[39.81px] font-semibold mb-0 text-left">
    <span className="text-[#1D372E]">Popular </span>
    <span className="text-[#5CAF90]">Category</span>
  </h2>
  <p className="text-left text-[16px] text-[#636363] mb-8">
    Shop Online for New arrivals and offers
  </p>

{/* Card Section */}
<div className="grid grid-cols-3 gap-75 ">
  {/* First Card (Now the third card moved to first position) */}
  <div className="bg-white p-8 rounded-lg w-150 h-65 border border-[#5CAF90] flex items-center justify-between ">
    <div className="flex-1">
      <h3 className="text-[19.20px] font-semibold mb-1 text-[#1D372E]">Electronics & Gadgets</h3>
      <p className="text-[13.33px] text-[#5E5E5E] mb-4">Latest smartphones, laptops, and smart devices for your tech needs.</p>
    </div>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md" />
  </div>

  {/* Second Card (Electronics & Gadgets moved here, remains unchanged) */}
  <div className="bg-white p-4 rounded-lg w-72 h-65 border border-[#5CAF90] ml-155">
    <h3 className="text-[19.20px] font-semibold mb-0 text-[#1D372E] text-left">Fashion & Apparel</h3>
    <p className="text-[13.33px] text-[#5E5E5E] mb-2">Trendy clothing, footwear, and accessories for men, women, and kids.</p>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md pl-7" />
  </div>

  {/* Third Card (Now the first card moved to third position) */}
  <div className="bg-white p-4 rounded-lg w-72 h-65 border border-[#5CAF90] ">
    <h3 className="text-[19.20px] font-semibold mb-0 text-[#1D372E] text-left">Electronics & Gadgets</h3>
    <p className="text-[13.33px] text-[#5E5E5E] mb-5">Latest smartphones, laptops, and smart devices for your tech needs.</p>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md pl-7" />
  </div>
</div>

<br/>
{/* Next Row */}
<div className="grid grid-cols-3 gap-75 ">
  {/* First Card */}
  <div className="bg-white p-4 rounded-lg w-72 h-65 border border-[#5CAF90] ">
    <h3 className="text-[19.20px] font-semibold mb-0 text-[#1D372E] text-left">Electronics & Gadgets</h3>
    <p className="text-[13.33px] text-[#5E5E5E] mb-5">Latest smartphones, laptops, and smart devices for your tech needs.</p>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md pl-7" />
  </div>

  {/* Second Card */}
  <div className="bg-white p-4 rounded-lg w-72 h-65 border border-[#5CAF90] ">
    <h3 className="text-[19.20px] font-semibold mb-0 text-[#1D372E] text-left">Fashion & Apparel</h3>
    <p className="text-[13.33px] text-[#5E5E5E] mb-2">Trendy clothing, footwear, and accessories for men, women, and kids.</p>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md pl-7" />
  </div>

  {/* Third Card */}
  <div className="bg-white p-8 rounded-lg w-150 h-65 border border-[#5CAF90] flex items-center justify-between">
    <div className="flex-1">
      <h3 className="text-[19.20px] font-semibold mb-0 text-[#1D372E]">Electronics & Gadgets</h3>
      <p className="text-[13.33px] text-[#5E5E5E] mb-1">Latest smartphones, laptops, and smart devices for your tech needs.</p>
    </div>
    <img src={fruits} alt="Card Image" className="w-auto h-28 object-cover rounded-md" />
  </div>
</div>

<div className="container mx-auto py-8 ml-80">
        <h2 className="text-[39.81px] font-semibold mb-0 text-center">
          <span className="text-[#1D372E]">HOW WE ARE </span>
          <span className="text-[#5CAF90]">WORKING</span>
        </h2>
        <p className="text-center text-[16px] text-[#636363] mb-8">
        we ensure a seamless shopping experience with a well-structured process. Here’s how we make your online shopping effortless and enjoyable
        </p>

</div>
</div>
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

  <div className="w-0.5 h-25 bg-[#B4B4B4] "></div>

  <div className="flex flex-col items-center">
    <div className="p-4 rounded-full border border-[#5CAF90] bg-[#5CAF90] text-white">
      <Headphones size={50} color="#FFFFFF" />
    </div>
    <h3 className="font-semibold mt-3 text-[19.22px]">Support 24/7</h3>
    <p className="text-[#5E5E5E] text-[16px]">We're here to help anytime.</p>
  </div>
</div>


</div>
</div>
    
  );
};

const ProductCard = ({ image, category, title, price, oldPrice }) => (
  <div
    className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
    style={{ width: '220px', height: '290px' }} // Set fixed size for the card
  >
    <div className="relative ">
      <img
        src={image}
        alt={title}
        className="w-[220] h-[170px] object-cover  "
        style={{ width: '220', height: '170px' }} // Explicitly set image size to 192x170px
      />
      <span className="absolute top-4 right-4 bg-[#5CAF90] text-white text-[8px]  px-2 py-0.5 rounded">
        New
      </span>
    </div>
    <div className="mt-4">
      <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">{category}</p>
      <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] line-clamp-2 overflow-hidden pl-4">{title}</h3>
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">{price}</span>
        <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">{oldPrice}</span>
      </div>
    </div>
  </div>
);

export default Home;







