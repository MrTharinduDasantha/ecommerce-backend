import React, { useState, useEffect } from 'react';
import { Slide } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import WhyChooseUs from '../../components/WhyChooseUs';
import { fetchAboutUsSettings } from '../../api/setting';

//About Us Page
const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [aboutUsData, setAboutUsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAboutUsData = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutUsSettings();
        setAboutUsData(data);
      } catch (err) {
        console.error("Error loading About Us data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAboutUsData();
  }, []);

  // Parse JSON fields if they exist
  const statistics = aboutUsData?.Statistics ? JSON.parse(aboutUsData.Statistics) : [];
  const features = aboutUsData?.Features ? JSON.parse(aboutUsData.Features) : [];

  // Default fallback data for when no data is available
  const defaultStatistics = [
    { value: "15", label: "Years of Experience", suffix: "+" },
    { value: "99", label: "Satisfied Clients", suffix: "%" },
    { value: "98", label: "Expert Team Member", suffix: "+" },
    { value: "7k", label: "Projects Completed", suffix: "+" }
  ];

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

  if (error) {
    console.warn("About Us data not available, using default content");
  }

  const displayStatistics = statistics.length > 0 ? statistics : defaultStatistics;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 mt-[108px]">
        
        {/* Statistics Section */}
        <section className="container px-6 py-10 mx-auto text-black mt-28 bg-[#5CAF90] xl:px-20 xl:w-full">
          <Slide direction="up" triggerOnce>
            <div className="grid grid-cols-1 gap-6 text-center xl:grid-cols-4 xl:gap-8 xl:px-40">
              {displayStatistics.map((stat, index) => (
                <div key={index} className="p-2">
                  <p className="text-[60px] text-[#1D372E] font-bold">
                    {!isNaN(stat.value) ? (
                      <CountUp end={parseInt(stat.value)} duration={2} />
                    ) : (
                      stat.value
                    )}
                    {stat.suffix || ""}
                  </p>
                  <p className="text-sm text-[#525252]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Slide>
        </section>

        {/* Vision, Mission, Values Section */}
        <section className="py-2 sm:py-3 md:py-10 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-1 sm:px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-6 relative">
              
              {/* Vision */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={aboutUsData?.Vision_Image_Url || "/api/placeholder/300/300"}
                    alt="Vision"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">
                  {aboutUsData?.Vision_Title || "Our Vision"}
                </h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  {aboutUsData?.Vision_Description || "To be the most customer-centric online marketplace, offering seamless shopping experiences with quality products, innovation, and convenience."}
                </p>
              </div>

              <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-300"></div>

              {/* Mission */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={aboutUsData?.Mission_Image_Url || "/api/placeholder/300/300"}
                    alt="Mission"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">
                  {aboutUsData?.Mission_Title || "Our Mission"}
                </h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  {aboutUsData?.Mission_Description || "Our mission is to empower customers with a diverse range of high-quality products at competitive prices, ensuring a hassle-free and secure shopping experience through innovation, reliability, and exceptional service."}
                </p>
              </div>

              <div className="hidden md:block absolute right-[32%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

              {/* Values */}
              <div className="text-center">
                <div className="mb-1 sm:mb-2 md:mb-4 w-12 h-12 sm:w-16 sm:h-16 md:w-48 md:h-48 mx-auto">
                  <img 
                    src={aboutUsData?.Values_Image_Url || "/api/placeholder/300/300"}
                    alt="Values"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-1 sm:p-2 md:p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-2xl font-bold mb-0.5 sm:mb-1 md:mb-2">
                  {aboutUsData?.Values_Title || "Our Values"}
                </h3>
                <p className="text-gray-600 text-[8px] sm:text-[10px] md:text-sm">
                  {aboutUsData?.Values_Description || "We prioritize customer satisfaction, quality, and trust. Innovation, integrity, and transparency guide us, ensuring fast service and sustainable practices."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs aboutUsData={aboutUsData} />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
