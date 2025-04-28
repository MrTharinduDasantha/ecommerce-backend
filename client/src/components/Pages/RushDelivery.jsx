import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import RushDeliveryBanner from '../RushDeliveryBanner';
import { rushDeliveryProducts } from '../Products';

const RushDelivery = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);

  const handleProductClick = (product) => {
    // Navigate to product page
    navigate(`/product-page/${product.id}`, {
      state: { 
        product: product,
        source: 'rush-delivery'
      }
    });
  };

  const handleViewCart = () => {
    // Navigate to cart page with all added products
    navigate('/cart', { 
      state: { 
        source: 'rush-delivery',
        selectedProducts: addedProducts
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-2 py-8 flex-grow">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            <RushDeliveryBanner />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#1D372E] text-2xl font-semibold">RUSH DELIVERY OFFERS</h2>
              {addedProducts.length > 0 && (
                <button 
                  onClick={handleViewCart}
                  className="bg-[#5CAF90] text-white px-4 py-2 rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                >
                  View Cart ({addedProducts.length})
                </button>
              )}
            </div>

            {/* Products Section */}
            <div className="mt-12">
              <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {rushDeliveryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
                    style={{ width: '220px', height: '290px' }}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[220px] h-[170px] object-cover"
                      />
                      <span className="absolute top-4 right-3 bg-[#5CAF90] text-white text-[11.11px] px-2 py-0.5 rounded">
                        New
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">
                        Rush Delivery
                      </p>
                      <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] pl-4">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">
                          Rs. {product.sellingPrice.toLocaleString()}
                        </span>
                        {product.marketPrice > product.sellingPrice && (
                          <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">
                            Rs. {product.marketPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 pl-4">
                        <span className="text-[12px] text-[#5CAF90] font-medium">
                          {product.discountName || 'Rush Discounts'}
                        </span>
                        <span className="text-[12px] text-[#5CAF90] ml-2">
                          Save Rs. {(product.marketPrice - product.sellingPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RushDelivery; 