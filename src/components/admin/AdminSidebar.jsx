import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  FiCreditCard,
  FiPackage,
  FiBriefcase,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({ onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const sidebarRef = useRef(null);

  // Simplified menu items focusing on core functionality
  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          id: "dashboard",
          path: "/admin/dashboard",
          label: "Dashboard Overview",
          icon: <FiHome />,
          exact: true,
        },
      ],
    },
    {
      section: "Users",
      items: [
        {
          id: "users",
          path: "/admin/all-users",
          label: "All Users",
          icon: <FiUsers />,
        },
        {
          id: "user-management",
          path: "/admin/manage-users",
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
          path: "/admin/transactions",
          label: "Exchange Transactions",
          icon: <FiDollarSign />,
        },
        {
          id: "exchange-rates",
          path: "/admin/rates",
          label: "Exchange Rates",
          icon: <FiDollarSign />,
        },
      ],
    },
    {
      section: "visa",
      items: [
        {
          id: "visa",
          path: "/admin/visa",
          label: "Visa",
          icon: <FiDollarSign />,
        },
      ],
    },
    {
      section: "Flight Bookings",
      items: [
        {
          id: "flight-bookings",
          path: "/admin/flight-bookings",
          label: "All Bookings",
          icon: <FiCalendar />,
        },
        {
          id: "flights-management",
          path: "/admin/manage-flight",
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
          path: "/admin/tours",
          label: "Tours & Packages",
          icon: <FiPackage />,
        },
        {
          id: "bookings",
          path: "/admin/bookings",
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
          path: "/admin/admin-settings",
          label: "Settings",
          icon: <FiSettings />,
        },
      ],
    },
  ];

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      const newState = !isMobileOpen;
      setIsMobileOpen(newState);
      document.body.style.overflow = newState ? "hidden" : "";
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const handleCloseMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
      document.body.style.overflow = "";
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
      document.body.style.overflow = "";
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
        document.body.style.overflow = "";
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth < 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileMenuToggle}`) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileOpen]);

  const isMobile = window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          className={`${styles.mobileMenuToggle} ${
            isMobileOpen ? styles.active : ""
          }`}
          onClick={handleToggle}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="admin-sidebar">
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={handleCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="admin-sidebar"
        className={`${styles.adminSidebar} ${
          isCollapsed ? styles.collapsed : ""
        } ${isMobileOpen ? styles.mobileOpen : ""}`}
        aria-label="Admin Navigation">
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <FiGlobe />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className={styles.logoText}>
                <span className={styles.logoMain}>Admin</span>
                <span className={styles.logoSub}>Dashboard</span>
              </div>
            )}
          </div>

          {/* Desktop Toggle */}
          {!isMobile && (
            <button
              className={styles.desktopToggleBtn}
              onClick={handleToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && isMobileOpen && (
            <button
              className={styles.mobileCloseBtn}
              onClick={handleCloseMobile}
              aria-label="Close menu">
              <FiX />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.navSection}>
              {(!isCollapsed || isMobileOpen) && (
                <span className={styles.sectionLabel}>{section.section}</span>
              )}
              <div className={styles.navItems}>
                {section.items.map((item) => (
                  <div key={item.id} className={styles.navItemWrapper}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ""} ${
                          isCollapsed && !isMobileOpen ? styles.collapsed : ""
                        }`
                      }
                      onClick={handleCloseMobile}
                      end={item.exact}
                      data-tooltip={item.label}>
                      <span className={styles.navIcon}>{item.icon}</span>
                      {!isCollapsed || isMobileOpen ? (
                        <>
                          <span className={styles.navLabel}>{item.label}</span>
                        </>
                      ) : null}
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <button
            onClick={() => {
              onLogout();
              handleCloseMobile();
            }}
            className={styles.logoutBtn}
            aria-label="Logout">
            <FiLogOut />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
