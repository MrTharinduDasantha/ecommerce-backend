import React, { useState } from 'react';
import RoseVelvetCake from '../../assets/RamadanOffers/RoseVelvetCake.jpg';
import ChocolateDelight from '../../assets/RamadanOffers/ChocolateDelight.jpg';
import BerryDelight from '../../assets/RamadanOffers/BerryDelight.jpg';
import CranberryDelight from '../../assets/RamadanOffers/CranberryDelight.jpg';
import WonderChocolateTreat from '../../assets/RamadanOffers/WonderChocolateTreat.jpg';
import WeddingCake from '../../assets/RamadanOffers/WeddingCake.jpg';
import StrawberryTreat from '../../assets/RamadanOffers/StrawberryTreat.jpg';
import FloralTouchDelight from '../../assets/RamadanOffers/FloralTouchDelight.jpg';
import BlueberrySponge from '../../assets/RamadanOffers/BlueberrySponge.jpg';
import FruitAndNuttyTreat from '../../assets/RamadanOffers/FruitAndNuttyTreat.jpg';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Banner from '../Banner';
import ProductCard from '../ProductCard';

const SeasonalOffers = () => {
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
        source: 'seasonal-offers',
        selectedProducts: addedProducts
      } 
    });
  };

  const products = [
    // First Row
    {
      id: 101,
      name: 'Rose Velvet Cake',
      image: RoseVelvetCake,
      price: 'Rs. 6,790',
      weight: '3.1 Lbs',
      oldPrice: 'Rs. 7,990'
    },
    {
      id: 102,
      name: 'Chocolate Delight',
      image: ChocolateDelight,
      price: 'Rs. 6,070',
      weight: '1.98 Lbs',
      oldPrice: 'Rs. 7,070'
    },
    {
      id: 103,
      name: 'Berry Delight',
      image: BerryDelight,
      price: 'Rs. 6,040',
      weight: '2.2 Lbs',
      oldPrice: 'Rs. 7,040'
    },
    {
      id: 104,
      name: 'Wonder Chocolate Treat',
      image: WonderChocolateTreat,
      price: 'Rs. 5,460',
      weight: '2.33 Lbs',
      oldPrice: 'Rs. 6,460'
    },
    {
      id: 105,
      name: 'Wedding Cake',
      image: WeddingCake,
      price: 'Rs. 6,650',
      weight: '1.88 Lbs',
      oldPrice: 'Rs. 7,650'
    },
    // Second Row
    {
      id: 106,
      name: 'Strawberry Treat',
      image: StrawberryTreat,
      price: 'Rs. 6,290',
      weight: '2.1 Lbs',
      oldPrice: 'Rs. 7,290'
    },
    {
      id: 107,
      name: 'Cranberry Delight',
      image: CranberryDelight,
      price: 'Rs. 5,970',
      weight: '2.3 Lbs',
      oldPrice: 'Rs. 6,970'
    },
    {
      id: 108,
      name: 'Floral Touch Delight',
      image: FloralTouchDelight,
      price: 'Rs. 6,140',
      weight: '2.5 Lbs',
      oldPrice: 'Rs. 7,140'
    },
    {
      id: 109,
      name: 'Blueberry Sponge',
      image: BlueberrySponge,
      price: 'Rs. 5,860',
      weight: '2.1 Lbs',
      oldPrice: 'Rs. 6,860'
    },
    {
      id: 110,
      name: 'Fruit & Nutty Treat',
      image: FruitAndNuttyTreat,
      price: 'Rs. 6,450',
      weight: '2.4 Lbs',
      oldPrice: 'Rs. 7,450'
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
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="cursor-pointer hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <ProductCard 
                    image={product.image}
                    category="Seasonal Offers"
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

export default SeasonalOffers; 