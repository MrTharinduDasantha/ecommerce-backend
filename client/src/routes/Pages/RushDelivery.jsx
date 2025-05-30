import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import RushDeliveryBanner from '../../components/RushDeliveryBanner';
import ProductCard from '../../components/ProductCard';

const RushDelivery = () => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product-page/${product.id}`, {
      state: {
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          weight: product.weight
        }
      }
    });
  };

  const products = [
    {
      id: 1,
      name: 'Gift Bundle',
      image: '/assets/RushDelivery/GiftBundle.jpg',
      price: 'LKR 4,000',
      weight: '1.5 kg'
    },
    {
      id: 2,
      name: 'Macarons Treat',
      image: '/assets/RushDelivery/MacaronsTreat.jpg',
      price: 'LKR 3,500',
      weight: '500 g'
    },
    {
      id: 3,
      name: 'Rosy Treats',
      image: '/assets/RushDelivery/RosyTreats.jpg',
      price: 'LKR 5,000',
      weight: '500 g'
    },
    {
      id: 4,
      name: 'Lovely Spring Bouquet',
      image: '/assets/RushDelivery/LovelySpringBouquet.jpg',
      price: 'LKR 7,500',
      weight: '1.5 kg'
    },
    {
      id: 5,
      name: 'Sweet Delight',
      image: '/assets/RushDelivery/SweetDelight.jpg',
      price: 'LKR 4,800',
      weight: '250 g'
    },
    {
      id: 6,
      name: 'Cartier Watch',
      image: '/assets/RushDelivery/CartierWatch.jpg',
      price: 'LKR 50,000',
      weight: '450 g'
    },
    {
      id: 7,
      name: 'Chanel Perfume',
      image: '/assets/RushDelivery/ChanelPerfume.jpg',
      price: 'LKR 30,000',
      weight: '550 g'
    },
    {
      id: 8,
      name: 'Cupids Kisses Box',
      image: '/assets/RushDelivery/CupidsKissesBox.jpg',
      price: 'LKR 5,000',
      weight: '500 g'
    },
    {
      id: 9,
      name: 'Reindeer Cup',
      image: '/assets/RushDelivery/ReindeerCup.jpg',
      price: 'LKR 3,500',
      weight: '300 g'
    },
    {
      id: 10,
      name: 'Summer Mist Bouquet',
      image: '/assets/RushDelivery/SummerMistBouquet.jpg',
      price: 'LKR 7,850',
      weight: '1.5 kg'
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
            <RushDeliveryBanner />
            <h2 className="text-[#000000] text-xl md:text-2xl font-semibold mb-6">RUSH DELIVERY OFFERS</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                >
                  <ProductCard
                    image={product.image}
                    category="Rush Delivery"
                    title={product.name}
                    price={product.price}
                    weight={product.weight}
                    id={product.id}
                    onProductClick={() => handleProductClick(product)}
                    className="h-full"
                  />
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