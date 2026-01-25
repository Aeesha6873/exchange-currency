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
  FiPackage,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({ onLogout, isCollapsed, onToggle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const location = useLocation();
  const sidebarRef = useRef(null);
  const navRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1025;
      setIsMobile(mobile);
      if (mobile) {
        onToggle(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, [onToggle]);

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
      section: "Visa",
      items: [
        {
          id: "visa",
          path: "/admin/visa",
          label: "Visa Applications",
          icon: <FiGlobe />,
        },
        {
          id: "visa-processing",
          path: "/admin/visa-processing",
          label: "Visa Processing",
          icon: <FiBriefcase />,
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
        {
          id: "airline-partners",
          path: "/admin/airlines",
          label: "Airline Partners",
          icon: <FiGlobe />,
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
        {
          id: "destinations",
          path: "/admin/destinations",
          label: "Destinations",
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
        {
          id: "staff-management",
          path: "/admin/staff",
          label: "Staff Management",
          icon: <FiUsers />,
        },
      ],
    },
  ];

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
      document.body.style.overflow = !isMobileOpen ? "hidden" : "";
    } else {
      onToggle(!isCollapsed);
    }
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
    document.body.style.overflow = "";
  };

  const toggleSection = (sectionName) => {
    if (!isCollapsed && !isMobile) {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionName]: !prev[sectionName],
      }));
    }
  };

  // Set active section based on current route
  useEffect(() => {
    const currentSection = menuItems.find((section) =>
      section.items.some((item) => location.pathname.startsWith(item.path)),
    );
    if (currentSection) {
      setActiveSection(currentSection.section);
      if (!expandedSections[currentSection.section]) {
        setExpandedSections((prev) => ({
          ...prev,
          [currentSection.section]: true,
        }));
      }
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      handleCloseMobile();
    }
  }, [location.pathname, isMobile]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileMenuToggle}`)
      ) {
        handleCloseMobile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, isMobileOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isMobileOpen) {
        handleCloseMobile();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileOpen]);

  return (
    <>
      {isMobile && (
        <button
          className={`${styles.mobileMenuToggle}`}
          onClick={handleToggle}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}>
          {isMobileOpen ?
            <FiX />
          : <FiMenu />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={handleCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
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
            {(!isCollapsed || isMobile) && (
              <div className={styles.logoText}>
                <span className={styles.logoMain}>TravelFin</span>
                <span className={styles.logoSub}>Admin Panel</span>
              </div>
            )}
          </div>

          {/* Desktop toggle - only on desktop */}
          {!isMobile && (
            <button
              className={styles.desktopToggleBtn}
              onClick={handleToggle}
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
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}>
          <div className={styles.navContent}>
            {menuItems.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={`${styles.navSection} ${
                  activeSection === section.section ? styles.activeSection : ""
                }`}>
                {(!isCollapsed || isMobile) && (
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
                <div
                  className={`${styles.navItems} ${
                    (
                      !isCollapsed &&
                      !isMobile &&
                      !expandedSections[section.section] &&
                      section.items.length > 1
                    ) ?
                      styles.collapsedItems
                    : ""
                  }`}>
                  {section.items.map((item) => (
                    <div key={item.id} className={styles.navItemWrapper}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `${styles.navLink} ${isActive ? styles.active : ""} ${
                            !isMobile && isCollapsed ? styles.collapsed : ""
                          }`
                        }
                        onClick={isMobile ? handleCloseMobile : undefined}
                        end={item.exact}>
                        <span className={styles.navIcon}>{item.icon}</span>
                        {(!isCollapsed || isMobile) && (
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
            <div className={styles.userAvatar}>
              <span>A</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Super Admin</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onLogout();
              handleCloseMobile();
            }}
            className={styles.logoutBtn}
            aria-label="Logout">
            <FiLogOut />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
