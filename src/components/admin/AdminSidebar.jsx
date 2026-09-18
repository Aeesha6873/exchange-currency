import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiGlobe,
  FiPackage,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({
  onLogout,
  isCollapsed,
  onToggle,
  isMobile,
  isMobileOpen,
  onCloseMobile,
}) {
  const [expandedSections, setExpandedSections] = useState({});
  const location = useLocation();
  const sidebarRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastPathRef = useRef(location.pathname);

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

  const toggleSection = (name) => {
    if (!isCollapsed && !isMobile) {
      setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }));
    }
  };

  const handleNavClick = () => {
    if (isMobile && isMobileOpen) onCloseMobile();
  };

  /* ---------- swipe to close (mobile only) ---------- */
  useEffect(() => {
    if (!isMobile || !isMobileOpen) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - touchStartX.current;
      const diffY = Math.abs(touchY - touchStartY.current);
      if (diffX < -50 && diffY < 50) onCloseMobile();
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile, isMobileOpen, onCloseMobile]);

  /* ---------- escape key closes (mobile only) ---------- */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isMobileOpen) onCloseMobile();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen, onCloseMobile]);

  /* ---------- lock body scroll while drawer is open ---------- */
  useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMobileOpen]);

  /* ---------- auto-close when route actually changes ---------- */
  useEffect(() => {
    if (lastPathRef.current !== location.pathname) {
      lastPathRef.current = location.pathname;
      if (isMobile && isMobileOpen) onCloseMobile();
    }
  }, [location.pathname, isMobile, isMobileOpen, onCloseMobile]);

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="admin-sidebar"
        className={`${styles.adminSidebar} ${
          !isMobile && isCollapsed ? styles.collapsed : ""
        } ${isMobileOpen ? styles.mobileOpen : ""}`}
        aria-label="Admin Navigation">
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <FiGlobe />
            </div>
            {(!isCollapsed || isMobileOpen || !isMobile) && (
              <div className={styles.logoText}>
                <span className={styles.logoMain}>TravelFin</span>
                <span className={styles.logoSub}>Admin Panel</span>
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              className={styles.desktopToggleBtn}
              onClick={() => onToggle(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isCollapsed ?
                <FiChevronRight />
              : <FiChevronLeft />}
            </button>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navContent}>
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.navSection}>
                {(!isCollapsed || isMobileOpen || !isMobile) && (
                  <div
                    className={styles.sectionHeader}
                    onClick={() => toggleSection(section.section)}>
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
                        onClick={handleNavClick}
                        end={item.path === "dashboard"}>
                        <span className={styles.navIcon}>{item.icon}</span>
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
            {(!isCollapsed || isMobileOpen || !isMobile) && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Super Admin</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (isMobile && isMobileOpen) onCloseMobile();
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
