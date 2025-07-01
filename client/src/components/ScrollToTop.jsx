import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event and set isVisible state
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollTop;
    setIsVisible(scrollTop > window.innerHeight);
  };

  // Add event listener to window
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <div className="fixed bottom-5 right-5">
        <button
          onClick={scrollToTop}
          className="bg-[#5CAF90] text-white rounded-full p-4 shadow-lg hover:bg-[#4a9a7d] transition-colors duration-300 cursor-pointer"
          title="Scroll to top"
        >
          <FaArrowUp className="text-lg" />
        </button>
      </div>
    )
  );
};

export default ScrollToTop;
