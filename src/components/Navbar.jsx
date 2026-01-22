import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./navbar.module.css";
import {
  FiGlobe,
  FiChevronDown,
  FiLogIn,
  FiUserPlus,
  FiDollarSign,
  FiMap,
  FiSend,
} from "react-icons/fi";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setScrolled(true);

        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setHidden(true);
        } else {
          setHidden(false);
        }
      } else {
        setScrolled(false);
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      if (window.innerWidth > 992 && menuOpen) {
        setMenuOpen(false);
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lastScrollY, menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? "hidden" : "auto";
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    document.body.style.overflow = "auto";
  };

  const toggleServices = (e) => {
    e.stopPropagation();
    setServicesOpen(!servicesOpen);
  };

  const handleServiceClick = () => {
    setServicesOpen(false);
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  const isActive = (path) => {
    return location.pathname === path ? styles.active : "";
  };

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        hidden ? styles.hidden : ""
      }`}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <FiGlobe className={styles.logoIcon} />
          <span className={styles.logoText}>Travel</span>
          <span className={styles.logoAccent}>Fin</span>
        </Link>

        {/* Desktop Links */}
        <nav className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive("/")}`}
            style={{ "--item-index": 1 }}
            onClick={closeMenu}>
            Home
          </Link>

          {/* Services Dropdown */}
          <div className={styles.servicesDropdown}>
            <button
              className={`${styles.navLink} ${
                styles.servicesTrigger
              } ${isActive("/services")}`}
              style={{ "--item-index": 2 }}>
              Services
              <FiChevronDown className={styles.servicesTriggerIcon} />
            </button>
            <div className={styles.dropdownMenu}>
              <Link
                to="/exchange"
                className={styles.dropdownItem}
                onClick={handleServiceClick}>
                <FiDollarSign className={styles.dropdownItemIcon} /> Currency
                Exchange
              </Link>
              <Link
                to="/visa"
                className={styles.dropdownItem}
                onClick={handleServiceClick}>
                <FiDollarSign className={styles.dropdownItemIcon} /> Visa
              </Link>
              <Link
                to="/travel-agency"
                className={styles.dropdownItem}
                onClick={handleServiceClick}>
                <FiMap className={styles.dropdownItemIcon} /> Travel Agency
              </Link>
              <Link
                to="/flight"
                className={styles.dropdownItem}
                onClick={handleServiceClick}>
                <FiSend className={styles.dropdownItemIcon} /> Book Flight
              </Link>
            </div>
          </div>

          <Link
            to="/rates"
            className={`${styles.navLink} ${isActive("/rates")}`}
            style={{ "--item-index": 3 }}
            onClick={closeMenu}>
            Rates
          </Link>
          <Link
            to="/about"
            className={`${styles.navLink} ${isActive("/about")}`}
            style={{ "--item-index": 4 }}
            onClick={closeMenu}>
            About
          </Link>
          <Link
            to="/contact"
            className={`${styles.navLink} ${isActive("/contact")}`}
            style={{ "--item-index": 5 }}
            onClick={closeMenu}>
            Contact
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className={styles.navButtons}>
          <Link
            to="/login"
            className={`${styles.btn} ${styles.login}`}
            style={{ "--item-index": 6 }}
            onClick={closeMenu}>
            <FiLogIn /> Login
          </Link>
          <Link
            to="/register"
            className={`${styles.btn} ${styles.register}`}
            style={{ "--item-index": 7 }}
            onClick={closeMenu}>
            <FiUserPlus /> Register
          </Link>
        </div>

        {/* Hamburger */}
        <div
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={handleMenuToggle}
          role="button"
          aria-label="Toggle menu"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleMenuToggle()}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}>
        <Link to="/" className={styles.mobileLink} onClick={closeMenu}>
          Home
        </Link>

        {/* Mobile Services Dropdown */}
        <div className={styles.mobileServicesSection}>
          <button
            className={styles.mobileServicesTrigger}
            onClick={toggleServices}
            aria-expanded={servicesOpen}>
            Services
            <FiChevronDown
              style={{
                transform: servicesOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>

          {servicesOpen && (
            <div className={styles.mobileServicesDropdown}>
              <Link
                to="/exchange"
                className={styles.mobileServiceItem}
                onClick={handleServiceClick}>
                <FiDollarSign className={styles.mobileServiceItemIcon} />{" "}
                Currency Exchange
              </Link>
              <Link
                to="/travel-agency"
                className={styles.mobileServiceItem}
                onClick={handleServiceClick}>
                <FiMap className={styles.mobileServiceItemIcon} /> Travel Agency
              </Link>
              <Link
                to="/flight"
                className={styles.mobileServiceItem}
                onClick={handleServiceClick}>
                <FiSend className={styles.mobileServiceItemIcon} /> Book Flight
              </Link>
            </div>
          )}
        </div>

        <Link to="/about" className={styles.mobileLink} onClick={closeMenu}>
          About
        </Link>
        <Link to="/contact" className={styles.mobileLink} onClick={closeMenu}>
          Contact
        </Link>
        <Link
          to="/login"
          className={`${styles.mobileBtn} ${styles.login}`}
          onClick={closeMenu}>
          <FiLogIn /> Login
        </Link>
        <Link
          to="/register"
          className={`${styles.mobileBtn} ${styles.register}`}
          onClick={closeMenu}>
          <FiUserPlus /> Register
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
