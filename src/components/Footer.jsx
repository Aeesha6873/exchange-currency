import React from "react";
import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <i className="fas fa-money-bill-wave"></i>
            <span>Currency</span>
          </div>
          <p className="footer-description">
            Fast, secure, and reliable currency exchange platform for
            individuals and businesses worldwide.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/exchange">Exchange</a>
            </li>
            <li>
              <a href="/rates">Exchange Rates</a>
            </li>
            <li>
              <a href="/calculator">Calculator</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Services</h3>
          <ul className="footer-links">
            <li>
              <a href="/personal">Exchange Currency</a>
            </li>
            <li>
              <a href="/personal">Travel Agency</a>
            </li>
            <li>
              <a href="/personal">Book a flight</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-links">
            <li>
              <a href="/help">Help Center</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/security">Security</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="copyright">
            &copy; {currentYear} Currency. All rights reserved.
          </div>
          <div className="legal-links">
            <a href="/terms">Terms of Service</a>
            <span className="separator">|</span>
            <a href="/privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
