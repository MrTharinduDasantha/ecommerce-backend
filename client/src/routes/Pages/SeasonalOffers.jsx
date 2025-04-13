import React from 'react';
import RoseVelvetCake from '../assets/RamadanOffers/RoseVelvetCake.jpg';
import ChocolateDelight from '../assets/RamadanOffers/ChocolateDelight.jpg';
import BerryDelight from '../assets/RamadanOffers/BerryDelight.jpg';
import CranberryDelight from '../assets/RamadanOffers/CranberryDelight.jpg';
import WonderChocolateTreat from '../assets/RamadanOffers/WonderChocolateTreat.jpg';
import WeddingCake from '../assets/RamadanOffers/WeddingCake.jpg';
import StrawberryTreat from '../assets/RamadanOffers/StrawberryTreat.jpg';
import FloralTouchDelight from '../assets/RamadanOffers/FloralTouchDelight.jpg';
import BlueberrySponge from '../assets/RamadanOffers/BlueberrySponge.jpg';
import FruitAndNuttyTreat from '../assets/RamadanOffers/FruitAndNuttyTreat.jpg';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar/Navbar';
import Banner from '../components/Banner';
// Update seasonal Offer Page 
const SeasonalOffers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    addToCart(product);
    navigate('/cart', { state: { source: 'ramadan' } });
  };

  const products = [
    // First Row
    {
      id: 1,
      name: 'Rose Velvet Cake',
      image: RoseVelvetCake,
      price: 'Rs. 6,790',
      weight: '3.1 Lbs'
    },
    {
      id: 2,
      name: 'Chocolate Delight',
      image: ChocolateDelight,
      price: 'Rs. 6,070',
      weight: '1.98 Lbs'
    },
    {
      id: 3,
      name: 'Berry Delight',
      image: BerryDelight,
      price: 'Rs. 6,040',
      weight: '2.2 Lbs'
    },
    {
      id: 4,
      name: 'Wonder Chocolate Treat',
      image: WonderChocolateTreat,
      price: 'Rs. 5,460',
      weight: '2.33 Lbs'
    },
    {
      id: 5,
      name: 'Wedding Cake',
      image: WeddingCake,
      price: 'Rs. 6,650',
      weight: '1.88 Lbs'
    },
    // Second Row
    {
      id: 6,
      name: 'Strawberry Treat',
      image: StrawberryTreat,
      price: 'Rs. 6,290',
      weight: '2.1 Lbs'
    },
    {
      id: 7,
      name: 'Cranberry Delight',
      image: CranberryDelight,
      price: 'Rs. 5,970',
      weight: '2.3 Lbs'
    },
    {
      id: 8,
      name: 'Floral Touch Delight',
      image: FloralTouchDelight,
      price: 'Rs. 6,140',
      weight: '2.5 Lbs'
    },
    {
      id: 9,
      name: 'Blueberry Sponge',
      image: BlueberrySponge,
      price: 'Rs. 5,860',
      weight: '2.1 Lbs'
    },
    {
      id: 10,
      name: 'Fruit & Nutty Treat',
      image: FruitAndNuttyTreat,
      price: 'Rs. 6,450',
      weight: '2.4 Lbs'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Banner />
            <h2 className="text-[#1D372E] text-xl md:text-2xl font-semibold mb-6">TOP SEASONAL OFFERS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ width: '220px', height: '290px' }}
                  onClick={() => handleProductClick(product)}
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
                    <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] text-center">Seasonal Offers</p>
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

export default SeasonalOffers; 