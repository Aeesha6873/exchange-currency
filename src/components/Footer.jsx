import React from "react";
import { Link } from "react-router-dom";
import {
  FiGlobe,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";
import "./footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <FiGlobe />
            <span>TravelFin</span>
          </div>
          <p className="footer-description">
            Fast, secure, and reliable travel and finance platform for
            individuals and businesses worldwide.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FiInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/exchange">Exchange</Link>
            </li>
            <li>
              <Link to="/rates">Exchange Rates</Link>
            </li>
            <li>
              <Link to="/calculator">Calculator</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Services</h3>
          <ul className="footer-links">
            <li>
              <Link to="/exchange">Exchange Currency</Link>
            </li>
            <li>
              <Link to="/travel-agency">Travel Agency</Link>
            </li>
            <li>
              <Link to="/flight">Book a Flight</Link>
            </li>
            <li>
              <Link to="/visa">Visa Services</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-links">
            <li>
              <Link to="/help">Help Center</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/help#faq">FAQ</Link>
            </li>
            <li>
              <Link to="/security">Security</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="copyright">
            &copy; {currentYear} TravelFin. All rights reserved.
          </div>
          <div className="legal-links">
            <Link to="/terms">Terms of Service</Link>
            <span className="separator">|</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
