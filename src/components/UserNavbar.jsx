import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./UserNavbar.module.css";
import { KEYS, get } from "../services/storage";
import {
  FiHome,
  FiDollarSign,
  FiSend,
  FiGlobe,
  FiMap,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiCheckCircle,
  FiCreditCard,
  FiCalendar,
  FiHelpCircle,
  FiClock,
  FiBriefcase,
  FiPackage,
  FiX,
} from "react-icons/fi";

function UserNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visaApplications, setVisaApplications] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  /* ============================================================
     LOAD DATA FROM STORAGE
     ============================================================ */
  useEffect(() => {
    let isMounted = true;

    const loadData = () => {
      if (!isMounted) return;

      const currentUser = get(KEYS.CURRENT_USER) || null;
      setUser(currentUser);

      if (!currentUser?.id) {
        setNotifications([]);
        setBookings([]);
        setVisaApplications([]);
        return;
      }

      const allNotifs = get(KEYS.NOTIFICATIONS) || [];
      const allBookings = get(KEYS.BOOKINGS) || [];
      const allVisas = get(KEYS.VISA_APPLICATIONS) || [];

      setNotifications(
        Array.isArray(allNotifs) ?
          allNotifs.filter((n) => n.userId === currentUser.id)
        : [],
      );
      setBookings(
        Array.isArray(allBookings) ?
          allBookings.filter((b) => b.userId === currentUser.id)
        : [],
      );
      setVisaApplications(
        Array.isArray(allVisas) ?
          allVisas.filter((v) => v.userId === currentUser.id)
        : [],
      );
    };

    loadData();

    // Re-load when localStorage changes (other tabs) or window refocuses
    const handleStorage = (e) => {
      if (
        !e.key ||
        e.key === KEYS.NOTIFICATIONS ||
        e.key === KEYS.BOOKINGS ||
        e.key === KEYS.VISA_APPLICATIONS ||
        e.key === KEYS.CURRENT_USER
      ) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", loadData);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", loadData);
    };
  }, [location.pathname]);

  /* ============================================================
     DERIVED COUNTS
     ============================================================ */
  const unreadCount = notifications.filter((n) => !n.read).length;
  const bookingCount = bookings.length;
  const pendingVisasCount = visaApplications.filter(
    (v) => v.status !== "approved" && v.status !== "rejected",
  ).length;

  /* ============================================================
     CLICK OUTSIDE
     ============================================================ */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }

      if (
        mobileUserDropdownOpen &&
        mobileUserDropdownRef.current &&
        !mobileUserDropdownRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileUserButton}`)
      ) {
        setMobileUserDropdownOpen(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
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

  /* ============================================================
     SCROLL EFFECT
     ============================================================ */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ============================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
     ============================================================ */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ============================================================
     HANDLERS
     ============================================================ */
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
    localStorage.removeItem(KEYS.CURRENT_USER);
    navigate("/login");
  };

  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const getInitials = (name) => {
    if (!name) return "GU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatNotificationCount = (count) =>
    count > 99 ? "99+" : String(count);

  // Safe values if user hasn't loaded yet
  const displayName = user?.fullName || "Guest";
  const displayEmail = user?.email || "";

  /* ============================================================
     RENDER
     ============================================================ */
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

          {/* Desktop Navigation */}
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

            {/* Support */}
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
            <button
              className={styles.notificationBtn}
              onClick={handleNotificationClick}
              aria-label={
                unreadCount > 0 ?
                  `${unreadCount} unread notifications`
                : "Notifications"
              }>
              <FiBell className={styles.notificationIcon} />
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>
                  {formatNotificationCount(unreadCount)}
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
                  {getInitials(displayName)}
                </div>
                <span className={styles.userName}>
                  {displayName.split(" ")[0]}
                </span>
                <FiChevronDown className={styles.userDropdownIcon} />
              </button>

              <div className={styles.userDropdownMenu}>
                <div className={styles.userInfo}>
                  <div className={styles.dropdownAvatar}>
                    {getInitials(displayName)}
                  </div>
                  <div className={styles.userDetails}>
                    <div className={styles.dropdownName}>{displayName}</div>
                    <div className={styles.dropdownEmail}>{displayEmail}</div>
                    <span className={styles.verifiedBadge}>
                      <FiCheckCircle /> Verified
                    </span>
                  </div>
                </div>

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

          {/* Mobile Navigation */}
          <div className={styles.mobileNav}>
            <button
              className={styles.mobileNotificationBtn}
              onClick={handleNotificationClick}
              aria-label={
                unreadCount > 0 ?
                  `${unreadCount} unread notifications`
                : "Notifications"
              }>
              <FiBell className={styles.mobileNotificationIcon} />
              {unreadCount > 0 && (
                <span className={styles.mobileNotificationBadge}>
                  {formatNotificationCount(unreadCount)}
                </span>
              )}
            </button>

            <div
              ref={mobileUserDropdownRef}
              className={styles.mobileUserDropdown}>
              <button
                className={styles.mobileUserButton}
                onClick={toggleMobileUserDropdown}>
                <div className={styles.mobileUserAvatar}>
                  {getInitials(displayName)}
                </div>
              </button>

              {mobileUserDropdownOpen && (
                <div className={styles.mobileUserDropdownMenu}>
                  <div className={styles.mobileUserDropdownContent}>
                    <div className={styles.mobileUserInfo}>
                      <div className={styles.mobileDropdownAvatar}>
                        {getInitials(displayName)}
                      </div>
                      <div className={styles.mobileUserDetails}>
                        <div className={styles.mobileDropdownName}>
                          {displayName}
                        </div>
                        <div className={styles.mobileDropdownEmail}>
                          {displayEmail}
                        </div>
                        <span className={styles.verifiedBadge}>
                          <FiCheckCircle /> Verified
                        </span>
                      </div>
                    </div>

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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={styles.mobileMenuOverlay}
          onClick={() => setMobileMenuOpen(false)}>
          <div
            className={styles.mobileMenuContent}
            onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <button
                className={styles.mobileCloseBtn}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu">
                <FiX />
              </button>

              <div className={styles.mobileHeaderAvatar}>
                {getInitials(displayName)}
              </div>
              <div className={styles.mobileHeaderInfo}>
                <h3>{displayName}</h3>
                <p>{displayEmail}</p>
                <span className={styles.verifiedBadge}>
                  <FiCheckCircle /> Verified
                </span>
              </div>
            </div>

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
