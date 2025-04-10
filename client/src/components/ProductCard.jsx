import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, category, title, price, oldPrice, weight, id }) => (
  <Link to={`/product-page/${id}`} className="block">
    <div 
      className="bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow cursor-pointer"
      style={{ width: '220px', height: '290px' }}
    >
      <div className="relative mt-2">
        <img 
          src={image} 
          alt={title} 
          className="w-[220px] h-[170px] object-cover"
          style={{ 
            width: '220px', 
            height: '170px',
            objectPosition: title === 'Iphone 16 Pro Max' ? 'center 75%' : title === 'Letisara Handbag' ? 'center 15%' : 'center'
          }}
        />
        <span className="absolute top-4 right-4 bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded">
          New
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">{category}</p>
        <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] line-clamp-2 overflow-hidden pl-4">{title}</h3>
        {weight && <p className="text-[11.11px] text-gray-400 pl-4">{weight}</p>}
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">{price}</span>
          <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">{oldPrice}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard; 