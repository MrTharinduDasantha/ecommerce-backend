import { Link } from "react-router-dom";
import { formatPrice } from "./FormatPrice";
import { calculateTotalDiscount, getBestDiscountLabel, getFinalPrice } from "./CalculateDiscount";

const ProductCard = ({
  image,
  category,
  title,
  price,
  oldPrice,
  id,
  historyStatus,
  activeDiscount,
  product // Full product object with discounts and eventDiscounts
}) => {
  // Create product object for discount calculation
  const productForCalculation = product || {
    id,
    Selling_Price: price,
    Market_Price: oldPrice,
    discounts: activeDiscount ? [activeDiscount] : [],
    eventDiscounts: []
  };

  // Calculate total discount information
  const discountInfo = calculateTotalDiscount(productForCalculation);
  const finalPrice = discountInfo.finalPrice;
  const bestDiscountLabel = getBestDiscountLabel(productForCalculation);

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
          {bestDiscountLabel && (
            <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
              {bestDiscountLabel}
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
            {discountInfo.hasDiscounts && discountInfo.marketPrice > discountInfo.originalPrice && (
              <div className="text-[13.33px] text-[#5E5E5E] line-through font-semibold">
                {formatPrice(`LKR ${discountInfo.marketPrice.toFixed(2)}`)}
              </div>
            )}
            <div className="text-[14px] font-semibold text-black">
              {formatPrice(`LKR ${finalPrice.toFixed(2)}`)}
            </div>
            {discountInfo.activeDiscountAmount > 0 && (
              <div className="text-[11px] text-green-600 font-medium">
                Save LKR {discountInfo.activeDiscountAmount.toFixed(2)}
              </div>
            )}
            {discountInfo.discounts.length > 0 && (
              <div className="text-[10px] text-blue-600">
                {discountInfo.discounts.length} discount{discountInfo.discounts.length > 1 ? 's' : ''} applied
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;