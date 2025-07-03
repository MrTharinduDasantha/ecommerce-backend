import { useState, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import CountUp from "react-countup";
import WhyChooseUs from "../WhyChooseUs";
import { fetchAboutUsSettings } from "../../api/setting";

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
      <div className="flex-1">
        <section className="container px-6 py-10 mx-auto text-black mt-28 bg-gradient-to-r from-[#5CAF90] via-[#7DCFB0] to-[#5CAF90] xl:px-20 xl:w-full">
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
                  <p className="text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </Slide>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Vision */}
              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={aboutUsData?.Vision_Image_Url || "/api/placeholder/300/300"}
                    alt="Vision"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {aboutUsData?.Vision_Title || "Our Vision"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {aboutUsData?.Vision_Description || "To be the most customer-centric online marketplace, offering seamless shopping experiences with quality products, innovation, and convenience."}
                </p>
              </div>

              <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-300"></div>

              {/* Mission */}
              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={aboutUsData?.Mission_Image_Url || "/api/placeholder/300/300"}
                    alt="Mission"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {aboutUsData?.Mission_Title || "Our Mission"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {aboutUsData?.Mission_Description || "Our mission is to empower customers with a diverse range of high-quality products at competitive prices, ensuring a hassle-free and secure shopping experience through innovation, reliability, and exceptional service."}
                </p>
              </div>

              <div className="hidden md:block absolute right-[32%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

              {/* Values */}
              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={aboutUsData?.Values_Image_Url || "/api/placeholder/300/300"}
                    alt="Values"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/300";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {aboutUsData?.Values_Title || "Our Values"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {aboutUsData?.Values_Description || "We prioritize customer satisfaction, quality, and trust. Innovation, integrity, and transparency guide us, ensuring fast service and sustainable practices."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs aboutUsData={aboutUsData} />
      </div>
    </div>
  );
};

export default AboutUs;
