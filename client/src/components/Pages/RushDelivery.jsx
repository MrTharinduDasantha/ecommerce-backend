import React, { useState } from 'react';
import GiftBundle from '../../assets/RushDelivery/GiftBundle.jpg';
import MacaronsTreat from '../../assets/RushDelivery/MacaronsTreat.jpg';
import RosyTreats from '../../assets/RushDelivery/RosyTreats.jpg';
import LovelySpringBouquet from '../../assets/RushDelivery/LovelySpringBouquet.jpg';
import SweetDelight from '../../assets/RushDelivery/SweetDelight.jpg';
import CartierWatch from '../../assets/RushDelivery/CartierWatch.jpg';
import ChanelPerfume from '../../assets/RushDelivery/ChanelPerfume.jpg';
import CupidsKissesBox from '../../assets/RushDelivery/CupidsKissesBox.jpg';
import ReindeerCup from '../../assets/RushDelivery/ReindeerCup.jpg';
import SummerMistBouquet from '../../assets/RushDelivery/SummerMistBouquet.jpg';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import RushDeliveryBanner from '../RushDeliveryBanner';
import ProductCard from '../ProductCard';

const RushDelivery = () => {
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
        source: 'rush-delivery',
        selectedProducts: addedProducts
      } 
    });
  };

  const products = [
    // First Row
    {
      id: 1,
      name: 'Gift Bundle',
      image: GiftBundle,
      price: 'Rs. 4,000',
      weight: '1.5 kg',
      oldPrice: 'Rs. 5,000'
    },
    {
      id: 2,
      name: 'Macarons Treat',
      image: MacaronsTreat,
      price: 'Rs. 3,500',
      weight: '500 g',
      oldPrice: 'Rs. 4,500'
    },
    {
      id: 3,
      name: 'Rosy Treats',
      image: RosyTreats,
      price: 'Rs. 5,000',
      weight: '500 g',
      oldPrice: 'Rs. 6,000'
    },
    {
      id: 4,
      name: 'Lovely Spring Bouquet',
      image: LovelySpringBouquet,
      price: 'Rs. 7,500',
      weight: '1.5 kg',
      oldPrice: 'Rs. 8,500'
    },
    {
      id: 5,
      name: 'Sweet Delight',
      image: SweetDelight,
      price: 'Rs. 4,800',
      weight: '250 g',
      oldPrice: 'Rs. 5,800'
    },
    // Second Row
    {
      id: 6,
      name: 'Cartier Watch',
      image: CartierWatch,
      price: 'Rs. 50,000',
      weight: '450 g',
      oldPrice: 'Rs. 55,000'
    },
    {
      id: 7,
      name: 'Chanel Perfume',
      image: ChanelPerfume,
      price: 'Rs. 30,000',
      weight: '550 g',
      oldPrice: 'Rs. 35,000'
    },
    {
      id: 8,
      name: 'Cupids Kisses Box',
      image: CupidsKissesBox,
      price: 'Rs. 5,000',
      weight: '500 g',
      oldPrice: 'Rs. 6,000'
    },
    {
      id: 9,
      name: 'Reindeer Cup',
      image: ReindeerCup,
      price: 'Rs. 3,500',
      weight: '300 g',
      oldPrice: 'Rs. 4,500'
    },
    {
      id: 10,
      name: 'Summer Mist Bouquet',
      image: SummerMistBouquet,
      price: 'Rs. 7,850',
      weight: '1.5 kg',
      oldPrice: 'Rs. 8,850'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            <RushDeliveryBanner />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#000000] text-2xl font-semibold">RUSH DELIVERY OFFERS</h2>
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
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="cursor-pointer hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard 
                    image={product.image}
                    category="Rush Delivery"
                    title={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    weight={product.weight}
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

export default RushDelivery; 