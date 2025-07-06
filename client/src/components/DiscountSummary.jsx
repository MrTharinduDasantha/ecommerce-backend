import React from 'react';
import { calculateTotalDiscount } from './CalculateDiscount';
import { formatPrice } from './FormatPrice';

const DiscountSummary = ({ product, className = "", showDetails = true }) => {
  if (!product) return null;

  const discountInfo = calculateTotalDiscount(product);

  if (!discountInfo.hasDiscounts) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 ${className}`}>
      {/* Main Savings Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-green-800 flex items-center">
          💰 Your Total Savings
        </h3>
        <div className="text-right">
          <div className="text-lg font-bold text-green-800">
            {formatPrice(`LKR ${discountInfo.totalAmount.toFixed(2)}`)}
          </div>
          <div className="text-sm text-green-600">
            ({discountInfo.totalPercentage}% OFF)
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Breakdown */}
          <div className="space-y-2 mb-3">
            {discountInfo.activeDiscountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Active Discounts:</span>
                <span className="font-semibold text-green-800">
                  {formatPrice(`LKR ${discountInfo.activeDiscountAmount.toFixed(2)}`)}
                </span>
              </div>
            )}
            
            {discountInfo.marketDiscountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Market Price Savings:</span>
                <span className="font-semibold text-green-800">
                  {formatPrice(`LKR ${discountInfo.marketDiscountAmount.toFixed(2)}`)}
                </span>
              </div>
            )}
          </div>

          {/* Price Comparison */}
          <div className="bg-white rounded-lg p-3 border border-green-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Original Price:</span>
              <span className="text-sm line-through text-gray-500">
                {formatPrice(`LKR ${Math.max(discountInfo.marketPrice, discountInfo.originalPrice).toFixed(2)}`)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">Final Price:</span>
              <span className="text-lg font-bold text-green-800">
                {formatPrice(`LKR ${discountInfo.finalPrice.toFixed(2)}`)}
              </span>
            </div>
          </div>

          {/* Applied Discounts Details */}
          {discountInfo.discounts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <h4 className="text-sm font-semibold text-green-800 mb-2">
                Applied Discounts ({discountInfo.discounts.length}):
              </h4>
              {discountInfo.discounts.map((discount, index) => (
                <div key={index} className="flex justify-between items-center text-xs text-green-600 mb-1">
                  <span className="flex items-center">
                    {discount.type === 'event' ? '🎉' : '🏷️'}
                    <span className="ml-1">{discount.description}</span>
                  </span>
                  <span className="font-medium">
                    {discount.discountType === 'percentage' 
                      ? `${discount.discountValue}%` 
                      : formatPrice(`LKR ${discount.discountValue}`)
                    }
                    <span className="text-green-700 ml-1">
                      (-{formatPrice(`LKR ${discount.amount.toFixed(2)}`)})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscountSummary; 