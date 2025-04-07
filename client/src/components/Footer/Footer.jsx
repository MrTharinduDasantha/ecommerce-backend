import React from "react";
import googleplay from './googleplay.png';
import appstore from './appstore.png';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="text-white px-4 md:px-6 py-10 md:py-12"
      style={{ fontFamily: '"Poppins", sans-serif', backgroundColor: '#1D372E' }}
    >
      {/* Middle Section */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-lg md:text-xl text-white mb-3">JOIN THE HAPPY CROWD</h2>
        <p className="text-xs md:text-sm font-light text-white mb-4">
          Get New Arrivals and Exclusive Offers in Your Inbox
        </p>
        <button className="text-xs md:text-sm bg-white hover:bg-white text-[#5CAF90] px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition">
          <FaWhatsapp className="text-base md:text-lg" /> Join Our Whatsapp Channel
        </button>
      </div>
 {/* Countries Section */}
      <div className="overflow-x-auto mb-10">
        <div className="flex md:grid md:grid-cols-4 gap-6 min-w-[350px] md:min-w-0 px-2 ml-25">
          {/* Country Blocks */}
          {[
            {
              title: 'SL:',
              address: 'TechWave Solutions\n123 Main Street',
              hotline: '‪+94 112 345 678‬',
              email: 'info@techwave.com',
              whatsapp: '‪+94 112 345 678‬',
            },
            {
              title: 'USA:',
              address: 'TechWave Solutions\n123 Main Street',
              hotline: '‪+1-859-215-0159‬',
              email: 'lexingtonky.office@techwave.com',
            },
            {
              title: 'UK:',
              address: '145-157 St John Street,\nLondon EC1V 4PY,\nUnited Kingdom',
              hotline: '‪+44-207-078-4149‬',
              email: 'london.office@techwave.com',
            },
            {
              title: 'AU:',
address: '123 Collins Street,\nMelbourne VIC 3000,\nAustralia',
              hotline: '‪+61-3-9123-4567‬',
              email: 'melbourne.office@techwave.com',
            },
          ].map((loc, idx) => (
            <div key={idx} className="flex-shrink-0 w-72 md:w-auto text-center md:text-left">
              <h3 className="font-bold text-lg text-white mb-2">{loc.title}</h3>
              <p className="text-xs font-light text-white whitespace-pre-line">{loc.address}</p>
              {loc.hotline && (
                <p className="text-xs font-light text-white mt-2">
                  (Phone/Fax: {loc.hotline})
                </p>
              )}
              {loc.email && (
                <p className="text-xs font-light text-white">
                  Email:{" "}
                  <a href={`mailto:${loc.email}`} className="hover:underline text-white">
                    {loc.email}
                  </a>
                </p>
              )}
              {loc.whatsapp && (
                <p className="text-xs font-light text-white flex justify-center md:justify-start items-center gap-2 mt-2">
<FaWhatsapp className="text-white" /> <span>{loc.whatsapp}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-6 text-center px-4">
        {/* Links & Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <button className="bg-white text-black px-3 py-2 rounded font-medium hover:bg-gray-300 text-xs transition">
            Sell with TechWave
          </button>

          <a href="#" className="hover:underline text-xs text-white">
            Download <span className="font-semibold">TechWave App</span>
          </a>

          {/* App Store and Google Play Logos */}
          <div className="flex gap-2 justify-center">
            <img
              src={googleplay}
              alt="Google Play"
              className="h-10 w-auto object-contain"
            />
            <img
              src={appstore}
              alt="App Store"
              className="h-10 w-auto object-contain"
            />
          </div>
</div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 font-light">
          <a href="#" className="hover:underline text-white">Read About TechWave</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:underline text-white">Reviews</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:underline text-white">Refund & Returns</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:underline text-white">Careers & Jobs</a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs mt-4 text-white font-light">
        © TechWave Solutions. Online Shopping for{" "}
        <a href="#" className="text-white hover:underline">
          Customers Worldwide
        </a>
      </div>

      {/* Social Icons */}
      <div className="border-t border-white pt-6 mt-6 flex justify-center gap-4 text-sm">
        <a href="#" aria-label="Facebook" className="border border-white rounded-full p-2 bg-white text-black hover:scale-105 transition">
<FaFacebookF />
        </a>
        <a href="#" aria-label="Twitter" className="border border-white rounded-full p-2 hover:bg-white hover:text-black transition">
          <FaTwitter />
        </a>
        <a href="#" aria-label="Instagram" className="border border-white rounded-full p-2 bg-white text-black hover:scale-105 transition">
          <FaInstagram />
        </a>
        <a href="#" aria-label="LinkedIn" className="border border-white rounded-full p-2 bg-white text-black hover:scale-105 transition">
          <FaLinkedinIn />
        </a>
        <a href="#" aria-label="YouTube" className="border border-white rounded-full p-2 hover:bg-white hover:text-black transition">
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
