import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./UserNavbar.module.css";
import {
  FiGlobe,
  FiChevronDown,
  FiHome,
  FiDollarSign,
  FiMap,
  FiSend,
  FiUser,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiBell,
  FiTrendingUp,
  FiCalendar,
  FiPackage,
  FiHelpCircle,
  FiShield,
} from "react-icons/fi";

function UserNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")) || {
    fullName: "User Name",
    email: "user@example.com",
  };

  // Mock data
  const bookingCount = 2;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown if clicked outside
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.userButton}`)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [userDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileServices = () => {
    setMobileServicesOpen(!mobileServicesOpen);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
  };

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
    closeAllMenus();
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? styles.active : "";
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link to="/dashboard" className={styles.logo} onClick={closeAllMenus}>
          <FiGlobe className={styles.logoIcon} />
          <span className={styles.logoText}>Travel</span>
          <span className={styles.logoAccent}>Fin</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.navLinks}>
          <Link
            to="/dashboard"
            className={`${styles.navLink} ${isActive("/dashboard")}`}
            onClick={closeAllMenus}>
            <FiHome className={styles.navLinkIcon} />
            Dashboard
          </Link>

          {/* Services Dropdown */}
          <div className={styles.servicesDropdown}>
            <button
              className={`${styles.navLink} ${
                styles.servicesTrigger
              } ${isActive("/dashboard/services")}`}>
              <FiPackage className={styles.navLinkIcon} />
              Services
              <FiChevronDown className={styles.servicesTriggerIcon} />
            </button>

            <div className={styles.dropdownMenu}>
              <Link
                to="/dashboard/exchange"
                className={styles.dropdownItem}
                onClick={closeAllMenus}>
                <FiDollarSign className={styles.dropdownItemIcon} />
                <div>
                  <div className={styles.dropdownItemTitle}>
                    Currency Exchange
                  </div>
                  <div className={styles.dropdownItemDesc}>
                    Best rates, fast transfer
                  </div>
                </div>
                <span className={styles.serviceBadge}>Hot</span>
              </Link>
              <Link
                to="/dashboard/visa"
                className={styles.dropdownItem}
                onClick={closeAllMenus}>
                <FiDollarSign className={styles.dropdownItemIcon} />
                <div>
                  <div className={styles.dropdownItemTitle}>Visa</div>
                  <div className={styles.dropdownItemDesc}>
                    Best rates, fast transfer
                  </div>
                </div>
                <span className={styles.serviceBadge}>Hot</span>
              </Link>

              <Link
                to="/dashboard/travel-agency"
                className={styles.dropdownItem}
                onClick={closeAllMenus}>
                <FiMap className={styles.dropdownItemIcon} />
                <div>
                  <div className={styles.dropdownItemTitle}>Travel Agency</div>
                  <div className={styles.dropdownItemDesc}>
                    Hotels, tours, packages
                  </div>
                </div>
                <span className={styles.serviceBadge}>New</span>
              </Link>

              <Link
                to="/dashboard/flight"
                className={styles.dropdownItem}
                onClick={closeAllMenus}>
                <FiSend className={styles.dropdownItemIcon} />
                <div>
                  <div className={styles.dropdownItemTitle}>Book Flight</div>
                  <div className={styles.dropdownItemDesc}>
                    Domestic & international
                  </div>
                </div>
                <span className={styles.serviceBadge}>Sale</span>
              </Link>
            </div>
          </div>

          <Link
            to="/dashboard/transactions"
            className={`${styles.navLink} ${isActive(
              "/dashboard/transactions"
            )}`}
            onClick={closeAllMenus}>
            <FiTrendingUp className={styles.navLinkIcon} />
            History
          </Link>

          <Link
            to="/dashboard/bookings"
            className={`${styles.navLink} ${isActive("/dashboard/bookings")}`}
            onClick={closeAllMenus}>
            <FiCalendar className={styles.navLinkIcon} />
            Bookings
            {bookingCount > 0 && (
              <span className={styles.bookingBadge}>{bookingCount}</span>
            )}
          </Link>
        </nav>

        {/* Desktop Right Side */}
        <div className={styles.navRight}>
          <div className={styles.quickActions}>
            {/* Notification Icon Only (No Dropdown) */}
            <div className={styles.notificationWrapper}>
              <button className={styles.notificationBtn}>
                <FiBell className={styles.notificationIcon} />
              </button>
            </div>
          </div>

          {/* User Dropdown - Desktop */}
          <div
            ref={userDropdownRef}
            className={`${styles.userDropdown} ${
              userDropdownOpen ? styles.open : ""
            }`}>
            <button className={styles.userButton} onClick={toggleUserDropdown}>
              <div className={styles.userAvatar}>
                {getInitials(user.fullName)}
              </div>
              <span className={styles.userName}>
                {user.fullName?.split(" ")[0] || "User"}
              </span>
              <FiChevronDown className={styles.userDropdownIcon} />
            </button>

            {userDropdownOpen && (
              <div className={styles.userDropdownMenu}>
                <div className={styles.userInfo}>
                  <div className={styles.dropdownAvatar}>
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <div className={styles.dropdownName}>{user.fullName}</div>
                    <div className={styles.dropdownEmail}>{user.email}</div>
                  </div>
                </div>

                <div className={styles.dropdownDivider}></div>

                <Link
                  to="/dashboard/profile"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiUser className={styles.dropdownMenuIcon} />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/dashboard/bookings"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiCalendar className={styles.dropdownMenuIcon} />
                  <span>My Bookings</span>
                  <span className={styles.countBadge}>{bookingCount}</span>
                </Link>
                <Link
                  to="/dashboard/my-visa"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiCalendar className={styles.dropdownMenuIcon} />
                  <span>Visa</span>
                  <span className={styles.countBadge}>{bookingCount}</span>
                </Link>

                <Link
                  to="/dashboard/transactions"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiTrendingUp className={styles.dropdownMenuIcon} />
                  <span>Transactions</span>
                </Link>

                <div className={styles.dropdownDivider}></div>

                <Link
                  to="/dashboard/settings"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiSettings className={styles.dropdownMenuIcon} />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/dashboard/security"
                  className={styles.dropdownMenuItem}
                  onClick={closeAllMenus}>
                  <FiShield className={styles.dropdownMenuIcon} />
                  <span>Security</span>
                </Link>

                <div className={styles.dropdownDivider}></div>

                <button onClick={handleLogout} className={styles.logoutButton}>
                  <FiLogOut className={styles.dropdownMenuIcon} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={styles.mobileNav}>
          {/* Mobile Notification Icon Only */}
          <button className={styles.mobileNotificationBtn}>
            <FiBell className={styles.mobileNotificationIcon} />
          </button>

          {/* Mobile User Button */}
          <button
            className={styles.mobileUserButton}
            onClick={toggleUserDropdown}>
            <div className={styles.mobileUserAvatar}>
              {getInitials(user.fullName)}
            </div>
          </button>

          {/* Hamburger Menu */}
          <button
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

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.active : ""
        }`}
        onClick={closeAllMenus}>
        {/* Navigation Links */}
        <Link
          to="/dashboard"
          className={styles.mobileLink}
          onClick={closeAllMenus}>
          <FiHome className={styles.mobileLinkIcon} />
          Dashboard
        </Link>

        {/* Services Dropdown */}
        <div className={styles.mobileServicesSection}>
          <button
            className={styles.mobileServicesTrigger}
            onClick={(e) => {
              e.stopPropagation();
              toggleMobileServices();
            }}>
            <FiPackage className={styles.mobileLinkIcon} />
            Services
            <FiChevronDown
              style={{
                marginLeft: "auto",
                transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>

          {mobileServicesOpen && (
            <div className={styles.mobileServicesDropdown}>
              <Link
                to="/dashboard/exchange"
                className={styles.mobileServiceItem}
                onClick={closeAllMenus}>
                <FiDollarSign />
                Currency Exchange
              </Link>
              <Link
                to="/dashboard/visa"
                className={styles.mobileServiceItem}
                onClick={closeAllMenus}>
                <FiDollarSign />
                Visa
              </Link>
              <Link
                to="/dashboard/travel-agency"
                className={styles.mobileServiceItem}
                onClick={closeAllMenus}>
                <FiMap />
                Travel Agency
              </Link>
              <Link
                to="/dashboard/flight"
                className={styles.mobileServiceItem}
                onClick={closeAllMenus}>
                <FiSend />
                Book Flight
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/dashboard/transactions"
          className={styles.mobileLink}
          onClick={closeAllMenus}>
          <FiTrendingUp className={styles.mobileLinkIcon} />
          History
        </Link>

        <Link
          to="/dashboard/bookings"
          className={styles.mobileLink}
          onClick={closeAllMenus}>
          <FiCalendar className={styles.mobileLinkIcon} />
          Bookings
          {bookingCount > 0 && (
            <span className={styles.bookingBadge}>{bookingCount}</span>
          )}
        </Link>

        {/* User Section */}
        <div className={styles.mobileUserSection}>
          <div className={styles.mobileUserInfo}>
            <div className={styles.mobileUserAvatar}>
              {getInitials(user.fullName)}
            </div>
            <div>
              <div className={styles.mobileUserName}>{user.fullName}</div>
              <div className={styles.mobileUserEmail}>{user.email}</div>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className={styles.mobileMenuItem}
            onClick={closeAllMenus}>
            <FiUser /> My Profile
          </Link>

          <Link
            to="/dashboard/settings"
            className={styles.mobileMenuItem}
            onClick={closeAllMenus}>
            <FiSettings /> Settings
          </Link>

          <Link
            to="/dashboard/security"
            className={styles.mobileMenuItem}
            onClick={closeAllMenus}>
            <FiShield /> Security
          </Link>

          <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default UserNavbar;
