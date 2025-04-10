import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Helper function to format numbers with commas
const formatPrice = (price) => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const OrderDetails = ({ cartItems, deliveryFee, orderInfo }) => {
  const navigate = useNavigate();

  // Calculate subtotal and discount for single quantity
  const subtotal = cartItems.reduce((sum, product) => sum + product.variants[0].price, 0);
  const discount = cartItems.reduce((sum, product) => {
    if (product.marketPrice > product.variants[0].price) {
      return sum + (product.marketPrice - product.variants[0].price);
    }
    return sum;
  }, 0);
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-[#E8E8E8]">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">
          <FaShoppingCart className="inline mr-2 text-[#5CAF90]" />
          Order <span className="text-[#5CAF90]">Details</span>
        </h2>
        
        {/* Order Items */}
        <div className="mt-4 space-y-4">
          {cartItems.map((product) => (
            <div
              key={`${product.id}-${product.variants.colorName || ''}-${product.variants.size ? product.variants.size[0] : ''}`}
              className="flex items-center space-x-4 bg-gray-100 rounded-lg p-3 cursor-pointer border border-[#E8E8E8]"
              onClick={() => navigate(`/product-page/${product.id}`)}
            >
              <img
                src={product.image}
                alt="Product"
                className="w-24 h-24 rounded object-cover" 
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{product.name}</p>
                <div className="mt-1 space-y-1">
                  {product.variants.size && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span>{" "}
                      {product.variants.size[0]}
                    </p>
                  )}
                  {product.variants.colorName && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Color:</span>{" "}
                      {product.variants.colorName}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Qty: 1
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-black font-semibold">
                    {formatPrice(product.variants[0].price)} LKR
                  </p>
                  {product.marketPrice > product.variants[0].price && (
                    <p className="text-gray-500 line-through text-sm">
                      {formatPrice(product.marketPrice)} LKR
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Totals */}
        <div className="space-y-3 border-t border-[#E8E8E8] pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)} LKR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="text-[#5CAF90]">-{formatPrice(discount)} LKR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">{formatPrice(deliveryFee)} LKR</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#E8E8E8] mt-2">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">{formatPrice(total)} LKR</span>
          </div>
        </div>
        
        {/* Order Info */}
        {orderInfo && (
          <div className="mt-4 bg-gray-100 border rounded-lg border-[#E8E8E8] p-4">
            <p className="text-gray-700">
              <strong>Order No:</strong> {orderInfo.orderNo}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Delivery Date:</strong> {orderInfo.deliveryDate}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Address:</strong> {orderInfo.address}
            </p>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-6 bg-gray-100 p-4 rounded-md border border-[#E8E8E8]">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Estimated Delivery:</span> 3-5 business days
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Return Policy:</span> 14 days return policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;