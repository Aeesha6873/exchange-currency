import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiGlobe,
  FiPackage,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({ onLogout, isCollapsed, onToggle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const navRef = useRef(null);
  const hamburgerRef = useRef(null); // Added ref for hamburger button
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1025;
      setIsMobile(mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          id: "dashboard",
          path: "dashboard",
          label: "Dashboard Overview",
          icon: <FiHome />,
        },
      ],
    },
    {
      section: "Users",
      items: [
        {
          id: "users",
          path: "all-users",
          label: "All Users",
          icon: <FiUsers />,
        },
        {
          id: "user-management",
          path: "manage-users",
          label: "Manage Users",
          icon: <FiUsers />,
        },
      ],
    },
    {
      section: "Currency Exchange",
      items: [
        {
          id: "exchange-transactions",
          path: "transactions",
          label: "Exchange Transactions",
          icon: <FiDollarSign />,
        },
        {
          id: "exchange-rates",
          path: "rates",
          label: "Exchange Rates",
          icon: <FiDollarSign />,
        },
      ],
    },
    {
      section: "Visa",
      items: [
        {
          id: "visa",
          path: "visa",
          label: "Visa Applications",
          icon: <FiGlobe />,
        },
      ],
    },
    {
      section: "Flight Bookings",
      items: [
        {
          id: "flight-bookings",
          path: "flight-bookings",
          label: "All Bookings",
          icon: <FiCalendar />,
        },
        {
          id: "flights-management",
          path: "manage-flight",
          label: "Manage Flights",
          icon: <FiBriefcase />,
        },
      ],
    },
    {
      section: "Travel Agency",
      items: [
        {
          id: "tours-packages",
          path: "tours",
          label: "Tours & Packages",
          icon: <FiPackage />,
        },
        {
          id: "bookings",
          path: "bookings",
          label: "Travel Bookings",
          icon: <FiGlobe />,
        },
      ],
    },
    {
      section: "Management",
      items: [
        {
          id: "settings",
          path: "admin-settings",
          label: "Settings",
          icon: <FiSettings />,
        },
      ],
    },
  ];

  // FIXED: Prevent event propagation
  const handleToggle = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    console.log("Toggle clicked, current state:", isMobileOpen);

    if (isMobile) {
      const willOpen = !isMobileOpen;
      console.log("Will open:", willOpen);

      setIsMobileOpen(willOpen);

      if (willOpen) {
        document.body.classList.add(styles.sidebarOpen);
        setIsClosing(false);
      } else {
        closeMobileMenu();
      }
    } else {
      onToggle(!isCollapsed);
    }
  };

  // FIXED: Mobile menu close with proper cleanup
  const closeMobileMenu = () => {
    console.log("Closing mobile menu");
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileOpen(false);
      setIsClosing(false);
      document.body.classList.remove(styles.sidebarOpen);
    }, 50);
  };

  // FIXED: Improved navigation handler for mobile
  const handleNavClick = (e, path) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("Nav clicked - Path:", path, "Is mobile:", isMobile);

    // Close mobile menu if open
    if (isMobile && isMobileOpen) {
      console.log("Closing mobile menu");
      closeMobileMenu();
    }

    // Navigate to the target path
    setTimeout(() => {
      navigate(`/admin/${path}`);
    }, 100);
  };

  const toggleSection = (sectionName) => {
    if (!isCollapsed && !isMobile) {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionName]: !prev[sectionName],
      }));
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      closeMobileMenu();
    }
  }, [location.pathname]);

  // FIXED: Better click outside detection for mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("Click outside detected");

      // Don't close if clicking the hamburger button
      if (hamburgerRef.current && hamburgerRef.current.contains(event.target)) {
        console.log("Clicked hamburger, not closing");
        return;
      }

      if (
        isMobile &&
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        console.log("Closing sidebar from outside click");
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, isMobileOpen]);

  // Handle swipe to close on mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isMobile || !isMobileOpen) return;

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - touchStartX.current;
      const diffY = Math.abs(touchY - touchStartY.current);

      // Only close if horizontal swipe and minimal vertical movement
      if (diffX < -50 && diffY < 50) {
        closeMobileMenu();
      }
    };

    if (isMobile && isMobileOpen) {
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile, isMobileOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMobileOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileOpen]);

  useEffect(() => {
    console.log("Mobile state updated:", { isMobile, isMobileOpen, isClosing });
  }, [isMobile, isMobileOpen, isClosing]);

  return (
    <>
      {isMobile && (
        <button
          ref={hamburgerRef}
          className={`${styles.mobileMenuToggle} ${isMobileOpen ? styles.active : ""}`}
          onClick={handleToggle}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}>
          {isMobileOpen ?
            <FiX />
          : <FiMenu />}
        </button>
      )}

      {/* Mobile overlay - Only show when menu is open */}
      {isMobile && isMobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={(e) => {
            e.stopPropagation();
            closeMobileMenu();
          }}
          aria-hidden="true"
          style={{
            animation:
              isClosing ? "fadeOut 0.2s ease-out" : "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="admin-sidebar"
        className={`${styles.adminSidebar} ${
          !isMobile && isCollapsed ? styles.collapsed : ""
        } ${isMobileOpen ? styles.mobileOpen : ""} ${
          isClosing ? styles.closing : ""
        }`}
        aria-label="Admin Navigation"
        style={{
          transform:
            isMobile ?
              isMobileOpen ? "translateX(0)"
              : "translateX(-100%)"
            : isCollapsed ? "translateX(0)"
            : "translateX(0)",
          transition:
            isClosing ? "transform 0.2s ease-out" : "transform 0.3s ease-out",
        }}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <FiGlobe />
            </div>
            {/* FIXED: Show logo text on mobile when sidebar is open */}
            {(!isCollapsed || isMobileOpen || !isMobile) && (
              <div className={styles.logoText}>
                <span className={styles.logoMain}>TravelFin</span>
                <span className={styles.logoSub}>Admin Panel</span>
              </div>
            )}
          </div>

          {/* FIXED: Only show desktop toggle on non-mobile */}
          {!isMobile && (
            <button
              className={styles.desktopToggleBtn}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(!isCollapsed);
              }}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ?
                <FiChevronRight />
              : <FiChevronLeft />}
            </button>
          )}
        </div>

        <nav
          ref={navRef}
          className={styles.sidebarNav}
          onClick={(e) => e.stopPropagation()}>
          <div className={styles.navContent}>
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.navSection}>
                {/* FIXED: Show section header when not collapsed OR on mobile when open */}
                {(!isCollapsed || isMobileOpen || !isMobile) && (
                  <div
                    className={styles.sectionHeader}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection(section.section);
                    }}>
                    <span className={styles.sectionLabel}>
                      {section.section}
                    </span>
                    {section.items.length > 1 && !isMobile && !isCollapsed && (
                      <span className={styles.sectionToggle}>
                        {expandedSections[section.section] ?
                          <FiChevronUp />
                        : <FiChevronDown />}
                      </span>
                    )}
                  </div>
                )}
                <div className={styles.navItems}>
                  {section.items.map((item) => (
                    <div key={item.id} className={styles.navItemWrapper}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                        onClick={(e) => handleNavClick(e, item.path)}
                        end={item.path === "dashboard"}>
                        <span className={styles.navIcon}>{item.icon}</span>
                        {/* FIXED: Show label when not collapsed OR on mobile when open */}
                        {(!isCollapsed || isMobileOpen || !isMobile) && (
                          <span className={styles.navLabel}>{item.label}</span>
                        )}
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>A</div>
            {/* FIXED: Show user details when not collapsed OR on mobile when open */}
            {(!isCollapsed || isMobileOpen || !isMobile) && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Super Admin</span>
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isMobile && isMobileOpen) {
                closeMobileMenu();
              }
              setTimeout(() => onLogout(), 100);
            }}
            className={styles.logoutBtn}
            aria-label="Logout">
            <FiLogOut />

            {(!isCollapsed || isMobileOpen || !isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
