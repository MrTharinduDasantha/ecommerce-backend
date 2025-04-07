const RushDeliveryBanner = () => {
  return (
    <div className="relative overflow-hidden bg-[#5CAF90] h-40 w-full mb-6">
      {/* Content */}
      <div className="relative z-10 p-6 ml-4">
        <h1 className="text-[#1D372E] text-3xl font-semibold mb-2">
          Rush Delivery Service At Asipiya
        </h1>
        <p className="text-[#1D372E] text-base italic opacity-80 max-w-3xl">
          Need your items delivered quickly? Our rush delivery service ensures your orders reach you in record time. Perfect for last-minute gifts and urgent needs.
        </p>
      </div>

      {/* Decorative yellow shape */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-[#1D372E] opacity-20 rounded-full transform translate-x-1/3 -translate-y-3/4" />
    </div>
  );
};

export default RushDeliveryBanner; 

