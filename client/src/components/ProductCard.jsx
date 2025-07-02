import { Link } from "react-router-dom";
import { formatPrice } from "./FormatPrice";

const ProductCard = ({
  image,
  category,
  title,
  price,
  oldPrice,
  id,
  historyStatus,
  activeDiscount 
}) => {
  // Calculate the actual price after applying active discount
  const calculateDiscountedPrice = () => {
    if (!activeDiscount) return price;
    
    if (activeDiscount.Discount_Type === "fixed") {
      return price - parseFloat(activeDiscount.Discount_Value);
    } else if (activeDiscount.Discount_Type === "percentage") {
      return price * (1 - parseFloat(activeDiscount.Discount_Value) / 100);
    }
    return price;
  };

  const discountedPrice = calculateDiscountedPrice();
  
  // Calculate the discount percentage based on oldPrice and discountedPrice
  const calculateActualDiscountPercentage = () => {
    if (!oldPrice || oldPrice <= discountedPrice) return "0 % OFF";
    
    const discount = ((oldPrice - discountedPrice) / oldPrice) * 100;
    return `${Math.round(discount)} % OFF`;
  };

  const actualDiscountLabel = oldPrice ? calculateActualDiscountPercentage() : "0% OFF";

  return (
    <Link to={`/product-page/${id}`} className="block w-full h-full">
      <div className="rounded-lg bg-white relative border border-[#E8E8E8] hover:shadow-lg transition-shadow cursor-pointer w-full h-full flex flex-col">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-[180px] object-cover rounded-lg"
          />
          {historyStatus === "new arrivals" && (
            <span className="absolute  top-1 left-1 bg-[#5CAF90] text-white text-[10px] px-2 py-0.5 rounded">
              New
            </span>
          )}
          {actualDiscountLabel !== "0 % OFF" && (
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
              {actualDiscountLabel}
            </div>
          )}
        </div>
        <div className="mt-3 px-4 text-center">
          <p className="text-[11.11px] text-[#7A7A7A]  font-bold text-center ">
            {category}
          </p>
          <h3 className="text-[13.33px] line-clamp-1 font-bold text-[#1D372E] leading-snug">
            {title}
          </h3>

          <div className="mb-2">
            {oldPrice && (
              <div className="text-[13.33px] text-[#5E5E5E] line-through font-semibold">
                {formatPrice(oldPrice)}
              </div>
            )}
            <div className="text-[14px] font-semibold text-black">
              {formatPrice(discountedPrice)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;