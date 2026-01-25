import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./UserNavbar.module.css";
import {
  FiHome,
  FiDollarSign,
  FiSend,
  FiGlobe,
  FiMap,
  FiTrendingUp,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiCheckCircle,
  FiShield,
  FiCreditCard,
  FiCalendar,
  FiHelpCircle,
  FiFileText,
  FiClipboard,
  FiClock,
  FiCheckSquare,
  FiBriefcase,
  FiPackage,
} from "react-icons/fi";

function UserNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    fullName: "John Smith",
    email: "john@example.com",
  };

  const bookingCount = 2;
  const notificationCount = 3;
  const pendingVisasCount = 1;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop user dropdown
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }

      // Close mobile user dropdown
      if (
        mobileUserDropdownOpen &&
        mobileUserDropdownRef.current &&
        !mobileUserDropdownRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileUserButton}`)
      ) {
        setMobileUserDropdownOpen(false);
      }

      // Close mobile menu
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userDropdownOpen, mobileUserDropdownOpen, mobileMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleMobileUserDropdown = () => {
    setMobileUserDropdownOpen(!mobileUserDropdownOpen);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const getInitials = (name) => {
    return name ?
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "JS";
  };

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navbarContainer}>
          {/* Logo */}
          <Link to="/dashboard" className={styles.logo}>
            <FiGlobe className={styles.logoIcon} />
            <span className={styles.logoText}>Travel</span>
            <span className={styles.logoAccent}>Fin</span>
          </Link>

          {/* Desktop Navigation - CLEAN HIGH-LEVEL NAV */}
          <nav className={styles.navLinks}>
            <Link
              to="/dashboard"
              className={`${styles.navLink} ${
                isActive("/dashboard") ? styles.active : ""
              }`}>
              <FiHome />
              <span>Dashboard</span>
            </Link>

            {/* Services Dropdown */}
            <div className={styles.servicesDropdown}>
              <button className={`${styles.navLink} ${styles.servicesTrigger}`}>
                <FiBriefcase />
                <span>Services</span>
                <FiChevronDown />
              </button>
              <div className={styles.dropdownMenu}>
                <Link to="/dashboard/exchange" className={styles.dropdownItem}>
                  <FiDollarSign className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>
                      Currency Exchange
                    </div>
                    <div className={styles.dropdownItemDesc}>
                      Best rates, fast transfer
                    </div>
                  </div>
                  <span className={styles.serviceBadge}>Hot</span>
                </Link>
                <Link to="/dashboard/flight" className={styles.dropdownItem}>
                  <FiSend className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>Book Flight</div>
                    <div className={styles.dropdownItemDesc}>
                      Domestic & international
                    </div>
                  </div>
                  <span className={styles.serviceBadge}>Sale</span>
                </Link>
                <Link to="/dashboard/visa" className={styles.dropdownItem}>
                  <FiGlobe className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>
                      Visa Services
                    </div>
                    <div className={styles.dropdownItemDesc}>
                      Apply for new visas
                    </div>
                  </div>
                  <span className={styles.serviceBadge}>New</span>
                </Link>
                <Link
                  to="/dashboard/travel-agency"
                  className={styles.dropdownItem}>
                  <FiMap className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>
                      Travel Agency
                    </div>
                    <div className={styles.dropdownItemDesc}>
                      Hotels & activities
                    </div>
                  </div>
                  <span className={styles.serviceBadge}>Popular</span>
                </Link>
              </div>
            </div>

            {/* My Activities Dropdown */}
            <div className={styles.activitiesDropdown}>
              <button
                className={`${styles.navLink} ${styles.activitiesTrigger}`}>
                <FiPackage />
                <span>My Activities</span>
                <FiChevronDown />
              </button>
              <div className={styles.activitiesDropdownMenu}>
                <Link
                  to="/dashboard/my-visa"
                  className={styles.activitiesDropdownItem}>
                  <FiClock className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>Visa Process</div>
                    <div className={styles.dropdownItemDesc}>
                      Track your visa applications
                    </div>
                  </div>
                  {pendingVisasCount > 0 && (
                    <span className={styles.activitiesBadge}>
                      {pendingVisasCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard/bookings"
                  className={styles.activitiesDropdownItem}>
                  <FiCalendar className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>My Bookings</div>
                    <div className={styles.dropdownItemDesc}>
                      Flights, hotels, packages
                    </div>
                  </div>
                  {bookingCount > 0 && (
                    <span className={styles.activitiesBadge}>
                      {bookingCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard/transactions"
                  className={styles.activitiesDropdownItem}>
                  <FiCreditCard className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>Transactions</div>
                    <div className={styles.dropdownItemDesc}>
                      Payment & exchange history
                    </div>
                  </div>
                </Link>
                <Link
                  to="/dashboard/travel-history"
                  className={styles.activitiesDropdownItem}>
                  <FiMap className={styles.dropdownIcon} />
                  <div className={styles.dropdownItemContent}>
                    <div className={styles.dropdownItemTitle}>
                      Travel History
                    </div>
                    <div className={styles.dropdownItemDesc}>
                      Past trips & itineraries
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Support Link */}
            <Link
              to="/dashboard/support"
              className={`${styles.navLink} ${
                isActive("/dashboard/support") ? styles.active : ""
              }`}>
              <FiHelpCircle />
              <span>Support</span>
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className={styles.navRight}>
            {/* Notification */}
            <button className={styles.notificationBtn}>
              <FiBell className={styles.notificationIcon} />
              {notificationCount > 0 && (
                <span className={styles.notificationBadge}>
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Desktop User Dropdown */}
            <div
              ref={userDropdownRef}
              className={`${styles.userDropdown} ${
                userDropdownOpen ? styles.open : ""
              }`}>
              <button
                className={styles.userButton}
                onClick={toggleUserDropdown}>
                <div className={styles.userAvatar}>
                  {getInitials(user.fullName)}
                </div>
                <span className={styles.userName}>
                  {user.fullName?.split(" ")[0]}
                </span>
                <FiChevronDown className={styles.userDropdownIcon} />
              </button>

              <div className={styles.userDropdownMenu}>
                {/* User Info */}
                <div className={styles.userInfo}>
                  <div className={styles.dropdownAvatar}>
                    {getInitials(user.fullName)}
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.dropdownName}>{user.fullName}</div>
                    <div className={styles.dropdownEmail}>{user.email}</div>
                    <span className={styles.verifiedBadge}>
                      <FiCheckCircle /> Verified
                    </span>
                  </div>
                </div>

                {/* User Account Menu Items */}
                <div className={styles.dropdownMenuItems}>
                  <Link
                    to="/dashboard/profile"
                    className={styles.dropdownMenuItem}
                    onClick={() => setUserDropdownOpen(false)}>
                    <FiUser />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    className={styles.dropdownMenuItem}
                    onClick={() => setUserDropdownOpen(false)}>
                    <FiSettings />
                    <span>Settings</span>
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <Link
                    to="/dashboard/help"
                    className={styles.dropdownMenuItem}
                    onClick={() => setUserDropdownOpen(false)}>
                    <FiHelpCircle />
                    <span>Help Center</span>
                  </Link>
                </div>

                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    handleLogout();
                    setUserDropdownOpen(false);
                  }}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <div className={styles.mobileNav}>
            {/* Mobile Notification */}
            <button className={styles.mobileNotificationBtn}>
              <FiBell className={styles.mobileNotificationIcon} />
              {notificationCount > 0 && (
                <span className={styles.mobileNotificationBadge}>
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Mobile User Dropdown */}
            <div
              ref={mobileUserDropdownRef}
              className={styles.mobileUserDropdown}>
              <button
                className={styles.mobileUserButton}
                onClick={toggleMobileUserDropdown}>
                <div className={styles.mobileUserAvatar}>
                  {getInitials(user.fullName)}
                </div>
              </button>

              {/* Mobile User Dropdown Menu */}
              {mobileUserDropdownOpen && (
                <div className={styles.mobileUserDropdownMenu}>
                  <div className={styles.mobileUserDropdownContent}>
                    {/* User Info */}
                    <div className={styles.mobileUserInfo}>
                      <div className={styles.mobileDropdownAvatar}>
                        {getInitials(user.fullName)}
                      </div>
                      <div className={styles.mobileUserDetails}>
                        <div className={styles.mobileDropdownName}>
                          {user.fullName}
                        </div>
                        <div className={styles.mobileDropdownEmail}>
                          {user.email}
                        </div>
                        <span className={styles.verifiedBadge}>
                          <FiCheckCircle /> Verified
                        </span>
                      </div>
                    </div>

                    {/* User Account Menu Items */}
                    <div className={styles.mobileDropdownMenuItems}>
                      <Link
                        to="/dashboard/profile"
                        className={styles.mobileDropdownItem}
                        onClick={() => setMobileUserDropdownOpen(false)}>
                        <FiUser />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/dashboard/settings"
                        className={styles.mobileDropdownItem}
                        onClick={() => setMobileUserDropdownOpen(false)}>
                        <FiSettings />
                        <span>Settings</span>
                      </Link>

                      <div className={styles.mobileDropdownDivider} />

                      <Link
                        to="/dashboard/help"
                        className={styles.mobileDropdownItem}
                        onClick={() => setMobileUserDropdownOpen(false)}>
                        <FiHelpCircle />
                        <span>Help Center</span>
                      </Link>
                    </div>

                    <button
                      className={styles.mobileLogoutButton}
                      onClick={() => {
                        handleLogout();
                        setMobileUserDropdownOpen(false);
                      }}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Menu */}
            <button
              ref={hamburgerRef}
              className={`${styles.hamburger} ${
                mobileMenuOpen ? styles.open : ""
              }`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU - Contains MAIN NAVIGATION CONTENT */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={styles.mobileMenuOverlay}
          onClick={() => setMobileMenuOpen(false)}>
          <div
            className={styles.mobileMenuContent}
            onClick={(e) => e.stopPropagation()}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
              <div className={styles.mobileHeaderAvatar}>
                {getInitials(user.fullName)}
              </div>
              <div className={styles.mobileHeaderInfo}>
                <h3>{user.fullName}</h3>
                <p>{user.email}</p>
                <span className={styles.verifiedBadge}>
                  <FiCheckCircle /> Verified
                </span>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className={styles.mobileNavLinks}>
              <Link
                to="/dashboard"
                className={`${styles.mobileLink} ${
                  isActive("/dashboard") ? styles.active : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}>
                <FiHome />
                <span>Dashboard</span>
              </Link>

              {/* Services Section */}
              <div className={styles.mobileServicesSection}>
                <h4>Services</h4>
                <Link
                  to="/dashboard/exchange"
                  className={styles.mobileServiceLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiDollarSign />
                  <div>
                    <span>Currency Exchange</span>
                    <small>Best rates, fast transfer</small>
                  </div>
                  <span className={styles.serviceBadge}>Hot</span>
                </Link>
                <Link
                  to="/dashboard/flight"
                  className={styles.mobileServiceLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiSend />
                  <div>
                    <span>Book Flight</span>
                    <small>Domestic & international</small>
                  </div>
                  <span className={styles.serviceBadge}>Sale</span>
                </Link>
                <Link
                  to="/dashboard/visa"
                  className={styles.mobileServiceLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiGlobe />
                  <div>
                    <span>Visa Services</span>
                    <small>Apply for new visas</small>
                  </div>
                  <span className={styles.serviceBadge}>New</span>
                </Link>
                <Link
                  to="/dashboard/travel-agency"
                  className={styles.mobileServiceLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiMap />
                  <div>
                    <span>Travel Agency</span>
                    <small>Hotels & activities</small>
                  </div>
                  <span className={styles.serviceBadge}>Popular</span>
                </Link>
              </div>

              {/* My Activities Section */}
              <div className={styles.mobileActivitiesSection}>
                <h4>My Activities</h4>
                <Link
                  to="/dashboard/my-visa"
                  className={styles.mobileActivityLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiClock />
                  <div>
                    <span>Visa Process</span>
                    <small>Track your applications</small>
                  </div>
                  {pendingVisasCount > 0 && (
                    <span className={styles.activityBadge}>
                      {pendingVisasCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard/bookings"
                  className={styles.mobileActivityLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiCalendar />
                  <div>
                    <span>My Bookings</span>
                    <small>Flights, hotels, packages</small>
                  </div>
                  {bookingCount > 0 && (
                    <span className={styles.activityBadge}>{bookingCount}</span>
                  )}
                </Link>
                <Link
                  to="/dashboard/transactions"
                  className={styles.mobileActivityLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiCreditCard />
                  <div>
                    <span>Transactions</span>
                    <small>Payment & exchange history</small>
                  </div>
                </Link>
                <Link
                  to="/dashboard/travel-history"
                  className={styles.mobileActivityLink}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiMap />
                  <div>
                    <span>Travel History</span>
                    <small>Past trips & itineraries</small>
                  </div>
                </Link>
              </div>

              {/* Support */}
              <Link
                to="/dashboard/support"
                className={`${styles.mobileLink} ${
                  isActive("/dashboard/support") ? styles.active : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}>
                <FiHelpCircle />
                <span>Support</span>
              </Link>
            </div>

            {/* Quick Access */}
            <div className={styles.mobileQuickActions}>
              <h4>Quick Access</h4>
              <div className={styles.mobileActionsGrid}>
                <Link
                  to="/dashboard/profile"
                  className={styles.mobileActionBtn}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiUser />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/dashboard/settings"
                  className={styles.mobileActionBtn}
                  onClick={() => setMobileMenuOpen(false)}>
                  <FiSettings />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNavbar;
