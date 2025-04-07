import React from "react";
import { useParams } from "react-router-dom";
import Review from "../../Components/NavBar/Review";

// Import product images
import bloom from './bloom.jpg';
import belt from './belt.jpg';
import lipstick from './lipstic.jpg';
import bag from './bag.webp';
import watch from './watch.jpg';

// Import brand images
import prada from './prada.webp';
import ck from './ck.png';
import loreal from './loreal.jpg';
import gucci from './gucci.jpg';
import lv from './lv.jpg';
import nike from './nike.jpg';

const BrandDetails = () => {
  const { name } = useParams();

  const brands = [
    { name: "PRADA", description: "Prada is an iconic luxury fashion house known for its handbags, shoes, and accessories. Founded in 1913 by Mario Prada, it is one of the leading brands in the global fashion industry.", logo: prada, votes: 4.7, totalVotes: 160 },
    { name: "LOREAL PARIS", description: "L'Oréal Paris is a French multinational cosmetics and beauty company founded in 1909. It is known for its skincare, haircare, make-up, and fragrance products, being one of the largest beauty brands in the world.", logo: loreal, votes: 4.5, totalVotes: 180 },
    { name: "CALVIN KLEIN", description: "Calvin Klein is a renowned American fashion brand founded in 1968, recognized for its minimalist aesthetic and iconic collections, including fragrances, clothing, and accessories.", logo: ck, votes: 4.6, totalVotes: 200 },
    { name: "GUCCI", description: "Gucci, founded in 1921 by Guccio Gucci, is an Italian luxury fashion brand known for its leather goods, clothing, and accessories. It’s one of the world's most valuable and recognized brands.", logo: gucci, votes: 4.8, totalVotes: 250 },
    { name: "NIKE", description: "Nike is an American multinational corporation that designs, manufactures, and sells sportswear, footwear, and equipment. Founded in 1964 by Bill Bowerman and Phil Knight, it is the largest supplier of athletic shoes in the world.", logo: nike, votes: 4.9, totalVotes: 300 },
    { name: "LOUIS VUITTON", description: "Louis Vuitton is a French luxury fashion house founded in 1854. It is best known for its high-end handbags, luggage, and fashion accessories. Louis Vuitton is one of the most valuable luxury brands globally.", logo: lv, votes: 4.7, totalVotes: 220 },
  ];

  const selectedBrand = brands.find((brand) => brand.name === name);

  if (!selectedBrand) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Brand not found!
      </div>
    );
  }

  const products = [
    { name: "Bloom Perfume", category: "Fragrance", image: bloom, price: 120, oldPrice: 150 },
    { name: "Gucci Belt", category: "Accessories", image: belt, price: 200, oldPrice: 250 },
    { name: "Gucci Handbag", category: "Luxury Bags", image: bag, price: 2500, oldPrice: 2800 },
    { name: "Gucci Watch", category: "Watches", image: watch, price: 1500, oldPrice: 1800 },
    { name: "Gucci Lipstick", category: "Beauty", image: lipstick, price: 35, oldPrice: 50 },
  ];

  const topGucciProducts = [
    { itemNo: 1, orderName: "Gucci Belt", price: 200 },
    { itemNo: 2, orderName: "Gucci Handbag", price: 2500 },
    { itemNo: 3, orderName: "Gucci Watch", price: 1500 },
    { itemNo: 4, orderName: "Gucci Lipstick", price: 35 },
    { itemNo: 5, orderName: "Bloom Perfume", price: 120 },
  ];

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[39.81px] text-[#1D372E] font-semibold mb-6 text-left">
        {selectedBrand.name}
      </h2>

      <div className="bg-white rounded-md p-6 flex flex-col md:flex-row items-center max-w-3xl mx-auto md:max-w-full relative ">
        <div className="flex-shrink-0 w-40">
          <img src={selectedBrand.logo} alt={selectedBrand.name} className="w-full h-auto object-contain rounded-lg" />
        </div>

        <div className="md:flex-1 px-6 text-left">
          <p className="text-[16px] md:text-[19.2px] text-[#5E5E5E]">
            {selectedBrand.description}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg  relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
              style={{ width: '220px', height: '290px' }} // Set fixed size for the card
            >
              <div className="relative ">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[220px] h-[170px] object-cover" // Set border radius to 20px
                  style={{ width: '220px', height: '170px' }} // Explicitly set image size to 192x170px
                />
                 <span className="absolute top-4 right-4 bg-[#5CAF90] text-white text-[8px]  px-2 py-0.5 rounded">
                 New
                 </span>
              </div>
              <div className="mt-4">
                <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">{product.category}</p>
                <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] pl-4">{product.name}</h3>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">${product.price}</span>
                  <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">${product.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Gucci Products Section with Border */}
      <div className="mt-12 border border-[#E8E8E8] rounded-[15px] p-6">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-center">Top GUCCI Products</h3>
        <table className="min-w-full rounded-[15px] overflow-hidden">
          <thead>
            <tr>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Item No</th>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Order Name</th>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Price</th>
            </tr>
          </thead>
          <tbody>
            {topGucciProducts.map((product, index) => (
              <tr key={index} className="text-center">
                <td className={`py-2 px-4 h-[45px] ${index !== topGucciProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF] border-r border-gray-300`}>
                  {product.itemNo}
                </td>
                <td className={`py-2 px-4 ${index !== topGucciProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF] border-r border-gray-300`}>
                  {product.orderName}
                </td>
                <td className={`py-2 px-4 ${index !== topGucciProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF]`}>
                  ${product.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br/>
      <br/>
      <Review/>
    </div>
  );
};

export default BrandDetails;
