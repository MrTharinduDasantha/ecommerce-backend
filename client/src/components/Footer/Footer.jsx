import React, { useEffect, useState } from "react";
import googleplay from "./googleplay.png";
import appstore from "./appstore.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { fetchHeaderFooterSetting } from "../../api/setting";

const Footer = () => {
  const [footerSetting, setFooterSetting] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadFooterSetting() {
      try {
        const data = await fetchHeaderFooterSetting();
        setFooterSetting(data);
      } catch (e) {
        setFooterSetting(null);
      }
    }
    loadFooterSetting();
  }, []);

  // Fallbacks if not set
  const footerLinks =
    footerSetting?.Footer_Links && Array.isArray(footerSetting.Footer_Links)
      ? footerSetting.Footer_Links
      : [
          { text: "Terms and Conditions", url: "/terms-of-service" }, 
          { text: "Legal Policy", url: "/legal-policy" },
          { text: "Privacy Policy", url: "/privacy-policy" },
          { text: "Security Policy", url: "/security-policy" },
        ];
  const socialIcons =
    footerSetting?.Social_Icons && Array.isArray(footerSetting.Social_Icons)
      ? footerSetting.Social_Icons
      : [
          { platform: "Facebook", url: "#" },
          { platform: "Twitter", url: "#" },
          { platform: "Instagram", url: "#" },
          { platform: "LinkedIn", url: "#" },
          { platform: "YouTube", url: "#" },
        ];
  const countryBlocks =
    footerSetting?.Country_Blocks && Array.isArray(footerSetting.Country_Blocks)
      ? footerSetting.Country_Blocks
      : [
          {
            title: "SL:",
            address: "TechWave Solutions\n123 Main Street",
            hotline: "‪+94 112 345 678‬",
            email: "info@techwave.com",
            whatsapp: "‪+94 112 345 678‬",
          },
          {
            title: "USA:",
            address: "TechWave Solutions\n123 Main Street",
            hotline: "‪+1-859-215-0159‬",
            email: "lexingtonky.office@techwave.com",
          },
          {
            title: "UK:",
            address:
              "145-157 St John Street,\nLondon EC1V 4PY,\nUnited Kingdom",
            hotline: "‪+44-207-078-4149‬",
            email: "london.office@techwave.com",
          },
          {
            title: "AU:",
            address: "123 Collins Street,\nMelbourne VIC 3000,\nAustralia",
            hotline: "‪+61-3-9123-4567‬",
            email: "melbourne.office@techwave.com",
          },
        ];
  const copyright =
    footerSetting?.Footer_Copyright ||
    "© TechWave Solutions. Online Shopping for Customers Worldwide";

  // Map platform to icon
  const platformIcon = {
    Facebook: <FaFacebookF />,
    Twitter: <FaTwitter />,
    Instagram: <FaInstagram />,
    LinkedIn: <FaLinkedinIn />,
    YouTube: <FaYoutube />,
    WhatsApp: <FaWhatsapp />,
  };

  const whatsappIcon = socialIcons.find((icon) => icon.platform === "WhatsApp");
  const whatsappUrl = whatsappIcon ? whatsappIcon.url : null;

  return (
    <footer
      className="text-white px-4 md:px-6 py-10 md:py-12"
      style={{
        fontFamily: '"Poppins", sans-serif',
        backgroundColor: "#1D372E",
      }}
    >
      {/* Middle Section */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-lg md:text-xl text-white mb-3">
          JOIN THE HAPPY CROWD
        </h2>
        <p className="text-xs md:text-sm font-light text-white mb-4">
          Get New Arrivals and Exclusive Offers in Your Inbox
        </p>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm bg-white hover:bg-white text-[#5CAF90] px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition"
          >
            <FaWhatsapp className="text-base md:text-lg" /> Join Our Whatsapp
            Channel
          </a>
        ) : (
          <button className="text-xs md:text-sm bg-white hover:bg-white text-[#5CAF90] px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition">
            <FaWhatsapp className="text-base md:text-lg" /> Join Our Whatsapp
            Channel
          </button>
        )}
      </div>
      {/* Countries Section */}
      <div className="overflow-x-auto mb-10 px-2 sm:px-4 md:px-0 md:ml-50">
        <div className="flex flex-col sm:flex-row md:grid md:grid-cols-4 gap-6 min-w-[350px] md:min-w-0">
          {/* Country Blocks */}
          {countryBlocks.map((loc, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full sm:w-72 md:w-auto text-center md:text-left"
            >
              <h3 className="font-bold text-lg text-white mb-2">{loc.title}</h3>
              <p className="text-xs font-light text-white whitespace-pre-line">
                {loc.address}
              </p>
              {loc.hotline && (
                <p className="text-xs font-light text-white mt-2">
                  (Phone/Fax: {loc.hotline})
                </p>
              )}
              {loc.email && (
                <p className="text-xs font-light text-white">
                  Email:{" "}
                  <a
                    href={`mailto:${loc.email}`}
                    className="hover:underline text-white"
                  >
                    {loc.email}
                  </a>
                </p>
              )}
              {loc.whatsapp && (
                <p className="text-xs font-light text-white flex justify-center md:justify-start items-center gap-2 mt-2">
                  <FaWhatsapp className="text-white" />{" "}
                  <span>{loc.whatsapp}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Section - Responsive */}
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 md:gap-6 text-center px-4">
        {/* Links & Actions - Improved Design */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-6">
          <button className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 text-xs md:text-sm transition w-full md:w-auto shadow-sm">
            Sell with TechWave
          </button>
          <a href="#" className="hover:underline text-xs md:text-sm text-white w-full md:w-auto font-medium">
            Download <span className="font-semibold">TechWave App</span>
          </a>
          <div className="flex gap-2 justify-center w-full md:w-auto">
            <img
              src={googleplay}
              alt="Google Play"
              className="h-9 md:h-10 w-auto object-contain rounded shadow-sm border border-gray-200 bg-white"
              style={{ background: '#fff' }}
            />
            <img
              src={appstore}
              alt="App Store"
              className="h-9 md:h-10 w-auto object-contain rounded shadow-sm border border-gray-200 bg-white"
              style={{ background: '#fff' }}
            />
          </div>
        </div>

        {/* Footer Links - Responsive with mobile menu */}
        <div className="block md:hidden w-full mt-4">
          <button
            className="w-full flex justify-center items-center gap-2 py-2 bg-[#5CAF90] rounded text-white font-medium"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? "Hide Footer Links" : "Show Footer Links"}
          </button>
          {mobileMenuOpen && (
            <div className="flex flex-col items-center gap-2 mt-2">
              {footerLinks.map((link, idx) => (
                <a key={idx} href={link.url} className="hover:underline text-white text-xs">
                  {link.text}
                </a>
              ))}
              <div className="flex justify-center gap-3 mt-2">
                {socialIcons.map((icon, idx) => (
                  <a
                    key={idx}
                    href={icon.url}
                    aria-label={icon.platform}
                    className="border border-white rounded-full p-2 hover:bg-white hover:text-black transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {platformIcon[icon.platform] || icon.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:flex flex-wrap justify-center gap-4 text-xs text-gray-400 font-light">
          {footerLinks.map((link, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="hidden md:inline">|</span>}
              <a href={link.url} className="hover:underline text-white">
                {link.text}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center text-xs mt-4 text-white font-light">
        {copyright.includes("©") ? (
          <span dangerouslySetInnerHTML={{ __html: copyright }} />
        ) : (
          <>© {copyright}</>
        )}
      </div>
      {/* Social Icons - Desktop only */}
      <div className="hidden md:flex border-t border-white pt-6 mt-6 justify-center gap-4 text-sm">
        {socialIcons.map((icon, idx) => (
          <a
            key={idx}
            href={icon.url}
            aria-label={icon.platform}
            className={`border border-white rounded-full p-2 ${
              ["Facebook", "Instagram", "LinkedIn"].includes(icon.platform)
                ? "bg-white text-black hover:scale-105"
                : "hover:bg-white hover:text-black"
            } transition`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {platformIcon[icon.platform] || icon.platform}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;