import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Banner from '../Banner';
import ProductCard from '../ProductCard';
import { seasonalProducts } from '../SeasonalProducts';

const SeasonalOffers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);

  const handleProductClick = (product) => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product) => {
    // Add the product to cart
    addToCart(product);
    
    // Add to the list of added products
    setAddedProducts(prev => [...prev, product]);
  };

  const handleViewCart = () => {
    // Navigate to cart page with all added products
    navigate('/cart', { 
      state: { 
        source: 'seasonal-offers',
        selectedProducts: addedProducts
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            <Banner />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold">TOP SEASONAL OFFERS</h2>
              {addedProducts.length > 0 && (
                <button 
                  onClick={handleViewCart}
                  className="bg-[#5CAF90] text-white px-4 py-2 rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                >
                  View Cart ({addedProducts.length})
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {seasonalProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="cursor-pointer hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard 
                    image={product.image}
                    category={product.category}
                    title={product.name}
                    price={`Rs. ${product.sellingPrice.toLocaleString()}`}
                    oldPrice={`Rs. ${product.marketPrice.toLocaleString()}`}
                    weight={product.variants[0].size}
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

export default SeasonalOffers; 