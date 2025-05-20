import { Link } from 'react-router-dom';

const ProductCard = ({
  image,
  category,
  title,
  price,
  oldPrice,
  weight,
  discountName,
  discountAmount,
  id
}) => (
  <Link to={`/product-page/${id}`} className="block w-full h-full">
    <div className="rounded-lg bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow cursor-pointer w-full h-full flex flex-col">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[170px] object-cover rounded-lg"
          style={{
            objectPosition:
              title === 'Iphone 16 Pro Max' ? 'center 75%' :
              title === 'Letisara Handbag' ? 'center 15%' :
              'center'
          }}
        />
        <span className="absolute top-1 right-1 bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded">
          New
        </span>
        {(discountName || discountAmount) && (
          <div className="absolute top-4 left-4 bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded">
            {discountName} {discountAmount}
          </div>
        )}
      </div>
      <div className="mt-4 px-4">
        <p className="text-[11.11px] text-[#7A7A7A] mb-1">{category}</p>
        <h3 className="text-[13.33px] line-clamp-1 font-medium text-[#1D372E] leading-snug">
          {title}
        </h3>
        {weight && <p className="text-[11.11px] text-gray-400">{weight}</p>}
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-[16px] font-semibold text-[#5E5E5E]">{price}</span>
          {oldPrice && (
            <span className="text-[13.33px] text-[#CCCCCC] line-through">{oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;