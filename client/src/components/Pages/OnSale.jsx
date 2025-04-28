import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ProductCard from '../ProductCard';
import OnSaleBanner from '../OnSaleBanner';
import { onSaleProducts, seasonalOffersProducts, rushDeliveryProducts, ForYouProducts } from '../Products';

const OnSale = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);

  const handleProductClick = (product) => {
    // Navigate to product detail page with the correct route
    navigate(`/product-page/${product.id}`, { 
      state: { 
        product: product,
        source: 'on-sale'
      } 
    });
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
        source: 'on-sale',
        selectedProducts: addedProducts
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-2 py-4 sm:py-6 lg:py-8 flex-grow">
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
              {[...onSaleProducts, ...seasonalOffersProducts, ...rushDeliveryProducts, ...ForYouProducts].map((product) => {
                const hasDiscount = product.marketPrice > product.sellingPrice;
                return (
                  <div 
                    key={product.id} 
                    className="cursor-pointer hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                    onClick={() => handleProductClick(product)}
                  >
                    <ProductCard 
                      image={product.image}
                      category={product.category}
                      title={product.name}
                      price={`Rs. ${product.sellingPrice.toLocaleString()}`}
                      oldPrice={hasDiscount ? `Rs. ${product.marketPrice.toLocaleString()}` : ''}
                      discountName={product.discountName || (
                        product.category === 'Seasonal Offers' ? 'Seasonal Discounts' :
                        product.category === 'Rush Delivery' ? 'Rush Discounts' :
                        product.category === 'For You' ? 'For You Discounts' :
                        'Sale Discounts'
                      )}
                      discountAmount={hasDiscount ? `Save Rs. ${(product.marketPrice - product.sellingPrice).toLocaleString()}` : ''}
                      className="h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnSale;
