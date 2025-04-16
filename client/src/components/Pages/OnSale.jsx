import React, { useState } from 'react';
import ClassicHandbags from '../../assets/OnSale/ClassicHandbags.jpg';
import DELLLaptop from '../../assets/OnSale/DELLLaptop.jpg';
import GucciHandbag from '../../assets/OnSale/GucciHandbag.jpg';
import Iphone16promax from '../../assets/OnSale/Iphone16promax.jpg';
import LeisaraHandbag from '../../assets/OnSale/LeisaraHandbag.jpg';
import MacbookAir from '../../assets/OnSale/MacbookAir.jpg';
import Microwave from '../../assets/OnSale/Microwave.jpg';
import NICHECoffeeMachine from '../../assets/OnSale/NICHECoffeeMachine.jpg';
import Refrigerator from '../../assets/OnSale/Refrigerator.jpg';
import ZARAHandbags from '../../assets/OnSale/ZARAHandbags.jpg';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import OnSaleBanner from '../OnSaleBanner';

const OnSale = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);

  const handleProductClick = (product) => {
    // Add the product to cart
    addToCart(product);
    
    // Add to the list of added products
    setAddedProducts(prev => [...prev, product]);
    
    // Show a success message or notification here if desired
  };

  const handleViewCart = () => {
    // Navigate to cart page with all added products
    navigate('/cart', { 
      state: { 
        source: 'on-sale',
        selectedProducts: addedProducts
      } 
    });
  };

  const products = [
    // First Row
    {
      id: 1,
      name: 'ZARA Handbags',
      image: ZARAHandbags,
      price: 'Rs. 5,500',
      weight: '1.6 kg',
      oldPrice: 'Rs. 6,000'
    },
    {
      id: 2,
      name: 'Iphone 16 Pro Max',
      image: Iphone16promax,
      price: 'Rs. 233,000',
      weight: '175 g',
      oldPrice: 'Rs. 300,000'
    },
    {
      id: 3,
      name: 'Classic Handbags',
      image: ClassicHandbags,
      price: 'Rs. 6,500',
      weight: '1.6 kg',
      oldPrice: 'Rs. 7,000',
    },
    {
      id: 4,
      name: 'Gucci Handbag',
      image: GucciHandbag,
      price: 'Rs. 10,000',
      weight: '1.4 kg',
      oldPrice: 'Rs. 18,000'
    },
    {
      id: 5,
      name: 'Microwave',
      image: Microwave,
      price: 'Rs. 15,000',
      weight: '1.9 kg',
      oldPrice: 'Rs. 20,000'
    },
    // Second Row
    {
      id: 6,
      name: 'Leisara Handbag',
      image: LeisaraHandbag,
      price: 'Rs. 4,500',
      weight: '1.5 kg',
      oldPrice: 'Rs. 5,500'
    },
    {
      id: 7,
      name: 'Macbook Air',
      image: MacbookAir,
      price: 'Rs. 200,000',
      weight: '1.4 kg',
      oldPrice: 'Rs. 250,000'
    },
    {
      id: 8,
      name: 'DELL Laptop',
      image: DELLLaptop,
      price: 'Rs. 150,000',
      weight: '1.6 kg',
      oldPrice: 'Rs. 200,000'
    },
    {
      id: 9,
      name: 'NICHE Coffee Machine',
      image: NICHECoffeeMachine,
      price: 'Rs. 25,000',
      weight: '1.5 kg',
      oldPrice: 'Rs. 30,000'
    },
    {
      id: 10,
      name: 'Refrigerator',
      image: Refrigerator,
      price: 'Rs. 35,000',
      weight: '204 kg',
      oldPrice: 'Rs. 45,000'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Banner */}
            <OnSaleBanner className="mb-4 sm:mb-6" />
            
            {/* Header with View Cart button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold">
                ON SALE PRODUCTS
              </h2>
              {addedProducts.length > 0 && (
                <button 
                  onClick={handleViewCart}
                  className="bg-[#5CAF90] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
                >
                  View Cart ({addedProducts.length})
                </button>
              )}
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="cursor-pointer hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard 
                    image={product.image}
                    category="On Sale"
                    title={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    weight={product.weight}
                    className="h-full" // Ensure cards take full height properly
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnSale;
