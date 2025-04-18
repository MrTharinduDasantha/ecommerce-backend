import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForeverMineBouquetImage from '../../assets/ForYou/ForeverMineBouquet.jpg';
import LoveInBloomBouquet from '../../assets/ForYou/LoveInBloomBouquet.jpg';
import MeltMyHeart from '../../assets/ForYou/MeltMyHeart.jpg';
import TruffleTemptation from '../../assets/ForYou/TruffleTemptation.jpg';
import Anniversarypackage from '../../assets/ForYou/AnniversaryPackage.jpg';
import LovelyTreats from '../../assets/ForYou/LovelyTreats.jpg';
import SurpriseGift from '../../assets/ForYou/SurpriseGift.jpg';
import ChanelChance from '../../assets/ForYou/ChanelChance.jpg';
import ValentinesPackage from '../../assets/ForYou/ValentinesPackage.jpg';
import VersaceEros from '../../assets/ForYou/VersaceEros.jpg';
import { useCart } from '../../context/CartContext';
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import ForYouBanner from '../ForYouBanner';

const AllCategories = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);

  const handleProductClick = (product) => {
    // Format the product data before adding to cart
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price.replace('Rs. ', 'LKR '),
      quantity: 1,
      // Only add size property if it's not the Forever Mine Bouquet
      ...(product.id !== 1 && { size: product.size || null }),
      // Add color property for all products
      color: product.color || null
    };
    
    // Check if the product already exists in the cart
    const existingItemIndex = addedProducts.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update the existing item in the cart
      const updatedProducts = [...addedProducts];
      updatedProducts[existingItemIndex] = {
        ...updatedProducts[existingItemIndex],
        color: cartItem.color,
        ...(product.id !== 1 && { size: cartItem.size })
      };
      setAddedProducts(updatedProducts);
    } else {
      // Add the product to cart if it doesn't exist
      addToCart(cartItem);
      setAddedProducts(prev => [...prev, cartItem]);
    }
  };

  const handleViewCart = () => {
    // Navigate to cart page with all added products
    navigate('/cart', { 
      state: { 
        source: 'for-you',
        selectedProducts: addedProducts
      } 
    });
  };

  const products = [
    // First Row
    {
      id: 1,
      name: 'Forever Mine Bouquet',
      image: ForeverMineBouquetImage,
      price: 'Rs. 5,000',
      weight: '1.3 kg',
      oldPrice: 'Rs. 7,000',
      color: 'Black'  // Add default color
    },
    {
      id: 2,
      name: 'Anniversary Package',
      image: Anniversarypackage,
      price: 'Rs. 7,000',
      weight: '800 g',
      oldPrice: 'Rs. 9,000',
      color: 'Black'  // Add default color
    },
    {
      id: 3,
      name: 'Lovely Treats',
      image: LovelyTreats,
      price: 'Rs. 5,500',
      weight: '600 g',
      oldPrice: 'Rs. 6,000',
      color: 'Mixed'  // Add default color
    },
    {
      id: 4,
      name: 'Truffle Temptation',
      image: TruffleTemptation,
      price: 'Rs. 9,000',
      weight: '1.7 kg',
      oldPrice: 'Rs. 10,000',
      color: 'Black'  // Add default color
    },
    {
      id: 5,
      name: 'Surprise Gift',
      image: SurpriseGift,
      price: 'Rs. 5,500',
      weight: '1.5 kg',
      oldPrice: 'Rs. 7,000',
      color: 'Red'  // Add default color
    },
    // Second Row
    {
      id: 6,
      name: 'Chanel Chance',
      image: ChanelChance,
      price: 'Rs. 45,000',
      weight: '550 g',
      oldPrice: 'Rs. 55,000',
      color: 'Pink'  // Add default color
    },
    {
      id: 7,
      name: 'Valentines Package',
      image: ValentinesPackage,
      price: 'Rs. 10,000',
      weight: '1.7 kg',
      oldPrice: 'Rs. 15,000',
      color: 'Red'  // Add default color
    },
    {
      id: 8,
      name: 'Versace Eros',
      image: VersaceEros,
      price: 'Rs. 35,000',
      weight: '650 g',
      oldPrice: 'Rs. 45,000',
      color: 'Black'  // Add default color
    },
    {
      id: 9,
      name: 'Love In Bloom Bouquet',
      image: LoveInBloomBouquet,
      price: 'Rs. 7,500',
      weight: '1.5 kg',
      oldPrice: 'Rs. 8,500',
      color: 'Pink'  // Add default color
    },
    {
      id: 10,
      name: 'Melt My Heart',
      image: MeltMyHeart,
      price: 'Rs. 6,500',
      weight: '500 g',
      oldPrice: 'Rs. 7,500',
      color: 'Pink'  // Add default color
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
            <ForYouBanner className="mb-4 sm:mb-6" />
            
            {/* Header with View Cart button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold">
                CATEGORY 1
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
                  className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                >
                  <ProductCard 
                    image={product.image}
                    category="For You"
                    title={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    weight={product.weight}
                    id={product.id}
                    className="h-full"
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

export default AllCategories;


