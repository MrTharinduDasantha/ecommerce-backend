import React from 'react';
import GiftBundle from '../assets/RushDelivery/GiftBundle.jpg';
import MacaronsTreat from '../assets/RushDelivery/MacaronsTreat.jpg';
import RosyTreats from '../assets/RushDelivery/RosyTreats.jpg';
import LovelySpringBouquet from '../assets/RushDelivery/LovelySpringBouquet.jpg';
import SweetDelight from '../assets/RushDelivery/SweetDelight.jpg';
import CartierWatch from '../assets/RushDelivery/CartierWatch.jpg';
import ChanelPerfume from '../assets/RushDelivery/ChanelPerfume.jpg';
import CupidsKissesBox from '../assets/RushDelivery/CupidsKissesBox.jpg';
import ReindeerCup from '../assets/RushDelivery/ReindeerCup.jpg';
import SummerMistBouquet from '../assets/RushDelivery/SummerMistBouquet.jpg';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RushDeliveryBanner from '../components/RushDeliveryBanner';
// Update Rush
const RushDelivery = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate('/cart', { state: { source: 'rush-delivery' } });
  };

  const products = [
    // First Row
    {
      id: 1,
      name: 'Gift Bundle',
      image: GiftBundle,
      price: 'Rs. 4,000',
      weight: '1.5 kg'
    },
    {
      id: 2,
      name: 'Macarons Treat',
      image: MacaronsTreat,
      price: 'Rs. 3,500',
      weight: '500 g'
    },
    {
      id: 3,
      name: 'Rosy Treats',
      image: RosyTreats,
      price: 'Rs. 5,000',
      weight: '500 g'
    },
    {
      id: 4,
      name: 'Lovely Spring Bouquet',
      image: LovelySpringBouquet,
      price: 'Rs. 7,500',
      weight: '1.5 kg'
    },
    {
      id: 5,
      name: 'Sweet Delight',
      image: SweetDelight,
      price: 'Rs. 4,800',
      weight: '250 g'
    },
    // Second Row
    {
      id: 6,
      name: 'Cartier Watch',
      image: CartierWatch,
      price: 'Rs. 50,000',
      weight: '450 g'
    },
    {
      id: 7,
      name: 'Chanel Perfume',
      image: ChanelPerfume,
      price: 'Rs. 30,000',
      weight: '550 g'
    },
    {
      id: 8,
      name: 'Cupids Kisses Box',
      image: CupidsKissesBox,
      price: 'Rs. 5,000',
      weight: '500 g'
    },
    {
      id: 9,
      name: 'Reindeer Cup',
      image: ReindeerCup,
      price: 'Rs. 3,500',
      weight: '300 g'
    },
    {
      id: 10,
      name: 'Summer Mist Bouquet',
      image: SummerMistBouquet,
      price: 'Rs. 7,850',
      weight: '1.5 kg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <RushDeliveryBanner />
            <h2 className="text-[#000000] text-xl md:text-2xl font-semibold mb-6">RUSH DELIVERY OFFERS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
                  style={{ width: '220px', height: '290px' }}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[220px] h-[170px] object-cover"
                      style={{ width: '220px', height: '170px' }}
                    />
                    <span className="absolute top-4 right-4 bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded">
                      New
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] text-center">Rush Delivery</p>
                    <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] line-clamp-2 overflow-hidden text-center">
                      {product.name}
                    </h3>
                    <p className="text-[11.11px] text-gray-400 text-center">{product.weight}</p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="text-[16px] font-semibold text-[#5E5E5E]">{product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RushDelivery; 