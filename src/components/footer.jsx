import React from "react";
import './style.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about" className="footer-link"><i className="fas fa-info-circle"></i> About</a></li>
              <li><a href="/careers" className="footer-link"><i className="fas fa-briefcase"></i> Careers</a></li>
              <li><a href="/brand-center" className="footer-link"><i className="fas fa-tshirt"></i> Brand Center</a></li>
              <li><a href="/blog" className="footer-link"><i className="fas fa-blog"></i> Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="/help-center" className="footer-link"><i className="fas fa-question-circle"></i> Help Center</a></li>
              <li><a href="/discord" className="footer-link"><i className="fab fa-discord"></i> Discord Server</a></li>
              <li><a href="https://twitter.com" className="footer-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a></li>
              <li><a href="https://facebook.com" className="footer-link" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i> Facebook</a></li>
              <li><a href="/contact-us" className="footer-link"><i className="fas fa-envelope"></i> Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="/legal" className="footer-link"><i className="fas fa-balance-scale"></i> Legal</a></li>
              <li><a href="/privacy-policy" className="footer-link"><i className="fas fa-shield-alt"></i> Privacy Policy</a></li>
              <li><a href="/licensing" className="footer-link"><i className="fas fa-copyright"></i> Licensing</a></li>
              <li><a href="/terms-conditions" className="footer-link"><i className="fas fa-file-contract"></i> Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Download</h4>
            <ul>
              <li><a href="/download-ios" className="footer-link"><i className="fab fa-app-store-ios"></i> iOS</a></li>
              <li><a href="/download-android" className="footer-link"><i className="fab fa-google-play"></i> Android</a></li>
              <li><a href="/download-windows" className="footer-link"><i className="fab fa-windows"></i> Windows</a></li>
              <li><a href="/download-macos" className="footer-link"><i className="fab fa-apple"></i> MacOS</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <a href="https://facebook.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
