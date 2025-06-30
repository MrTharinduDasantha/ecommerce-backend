import { useState, useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import CountUp from "react-countup";
import WhyChooseUs from "../WhyChooseUs";
import visionImage from "../../assets/image-1.jpg";
import missionImage from "../../assets/image-2.jpg";
import valueImage from "../../assets/image-3.jpg";

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
      <div className="flex-1">
        <section className="container px-6 py-10 mx-auto text-black mt-28 bg-gradient-to-r from-[#5CAF90] via-[#7DCFB0] to-[#5CAF90] xl:px-20 xl:w-full">
          <Slide direction="up" triggerOnce>
            <div className="grid grid-cols-1 gap-6 text-center xl:grid-cols-4 xl:gap-8 xl:px-40">
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={15} duration={2} />+
                </p>
                <p className="text-sm">Years of Experience</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={99} duration={2} />%
                </p>
                <p className="text-sm">Satisfied Clients</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">
                  <CountUp end={98} duration={2} />+
                </p>
                <p className="text-sm">Expert Team Member</p>
              </div>
              <div className="p-2">
                <p className="text-[60px] text-[#1D372E] font-bold">7k+</p>
                <p className="text-sm">Projects Completed</p>
              </div>
            </div>
          </Slide>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={visionImage}
                    alt="Vision"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our vision</h3>
                <p className="text-gray-600 text-sm">
                  To be the most customer-centric online marketplace, offering
                  seamless shopping experiences with quality products,
                  innovation, and convenience.
                </p>
              </div>

              <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-300"></div>

              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={missionImage}
                    alt="Mission"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 text-sm">
                  Our mission is to empower customers with a diverse range of
                  high-quality products at competitive prices, ensuring a
                  hassle-free and secure shopping experience through innovation,
                  reliability, and exceptional service.
                </p>
              </div>

              <div className="hidden md:block absolute right-[32%] top-0 bottom-0 w-[1px] bg-gray-300"></div>

              <div className="text-center">
                <div className="mb-6 w-48 h-48 mx-auto">
                  <img
                    src={valueImage}
                    alt="Values"
                    className="w-full h-full object-contain border-2 border-[#5CAF90] p-4 rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our value</h3>
                <p className="text-gray-600 text-sm">
                  We prioritize customer satisfaction, quality, and trust.
                  Innovation, integrity, and transparency guide us, ensuring
                  fast service and sustainable practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WhyChooseUs />
      </div>
    </div>
  );
};

export default AboutUs;
