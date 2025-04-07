import React, { useState, useEffect } from 'react';
import { Slide } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyChooseUs from '../components/WhyChooseUs';
import saleBanner from '../assets/sale-banner.jpg';
import visionImage from '../assets/image-1.jpg';
import missionImage from '../assets/image-2.jpg';
import valueImage from '../assets/image-3.jpg';

//About Us Page
const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <img
          src="/klogo.webp"
          alt="Loading..."
          className="w-[200px] h-auto animate-bounce"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 mt-[108px]">
        <div className="w-full flex justify-center">
          <img 
            src={saleBanner} 
            alt="Sale Banner" 
            className="w-full h-[100px] sm:h-[120px] md:h-[410px] object-cover"
          />
        </div>

        {/* Statistics Section */}
        <section className="container px-6 py-10 mx-auto text-black mt-28 bg-[#5CAF90] xl:px-20 xl:w-full">
          <Slide direction="up" triggerOnce>
            <div className="grid grid-cols-1 gap-6 text-center xl:grid-cols-4 xl:gap-8 xl:px-40">
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={15} duration={2} />+
                </p>
                <p className="text-sm text-[#525252]">Years of Experience</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={99} duration={2} />%
                </p>
                <p className="text-sm text-[#525252]">Satisfied Clients</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={98} duration={2} />+
                </p>
                <p className="text-sm text-[#525252]">Expert Team Member</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  7k+
                </p>
                <p className="text-sm text-[#525252]">Projects Completed</p>
              </div>
            </div>
          </Slide>
        </section>

        <section className="py-2 sm:py-3 md:py-10 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-1 sm:px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6 relative">
              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={visionImage}
                    alt="Vision"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">Our Vision</h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  To be the most customer-centric online marketplace, offering seamless shopping 
                  experiences with quality products, innovation, and convenience.
                </p>
              </div>

              <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-300"></div>

              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={missionImage}
                    alt="Mission"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">Our Mission</h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  Our mission is to empower customers with a diverse range of high-quality products at 
                  competitive prices, ensuring a hassle-free and secure shopping experience through 
                  innovation, reliability, and exceptional service.
                </p>
              </div>

              <div className="hidden md:block absolute right-[32%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={valueImage}
                    alt="Values"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">Our Value</h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  We prioritize customer satisfaction, quality, and trust. Innovation, integrity, and 
                  transparency guide us, ensuring fast service and sustainable practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
