import React from "react";
import { motion } from "framer-motion";
import { FaCheck } from 'react-icons/fa';

function WhyChooseUs() {
  const features = [
    "High-quality Products",
    "Competitive Prices",
    "Seamless Shopping Experience",
    "Fast & Reliable Delivery",
    "Excellent Customer Support",
    "Secure Transactions"
  ];

  return (
    <>
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left side - Image */}
            <div className="w-full md:w-1/2">
              <img
                src="/src/assets/image-4.jpg"
                alt="Why Choose Us Illustration"
                className="w-[590px] h-[462.18px] object-contain rounded-lg mx-auto"
              />
            </div>

            {/* Right side - Features */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 w-[343px] h-[52px] flex items-center">
                Why Choose us ?
              </h2>
              <div className="space-y-4 w-[589.45px] h-[312px] overflow-y-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 pb-4">
                      <div className="flex-shrink-0 w-5 h-5 border border-[#5CAF90] rounded flex items-center justify-center">
                        <FaCheck className="text-xs text-[#5CAF90]" />
                      </div>
                      <span className="text-black text-sm">{feature}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Shopping Experience Section */}
      <div className="w-full h-[347px] bg-gradient-to-b from-[#5CAF90] to-[#E8F5F1] py-16 mt-16 mb-32 mx-auto">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-[#1D372E] mb-4">
            Click, buy, and enjoy—it's that simple!
          </h2>
          <p className="text-sm text-[#1D372E] mb-8 max-w-2xl mx-auto">
            Shopping has never been easier! With just a few clicks, you can explore a wide range of high-quality products, add your favorites to the cart, and check out seamlessly. Our secure payment system and fast delivery ensure a hassle-free shopping experience. No complications, no delays-just effortless shopping from the comfort of your home. Start browsing now and enjoy a smooth, enjoyable purchase journey!
          </p>
          <div className="flex justify-center">
            <button className="bg-[#5CAF90] text-white w-[250px] h-[50px] rounded-full text-sm font-medium hover:bg-[#1D372E] transition-duration-300 shadow-md flex items-center justify-center">
              <div className="w-[50px] h-[29px] flex items-center justify-center">
                Shop
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhyChooseUs; 