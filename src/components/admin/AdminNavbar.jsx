import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiChevronDown,
  FiDollarSign,
  FiAirplay,
  FiPackage,
  FiMenu,
  FiChevronRight,
  FiGlobe,
  FiHome,
  FiSettings,
  FiMessageSquare,
} from "react-icons/fi";
import styles from "./AdminNavbar.module.css";

function AdminNavbar({ user, isSidebarCollapsed, onToggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const quickMenuRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1025);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New customer registered",
      time: "5 min ago",
      unread: true,
      type: "user",
      icon: <FiUser />,
      color: "#10b981",
    },
    {
      id: 2,
      title: "Currency exchange completed",
      time: "1 hour ago",
      unread: true,
      type: "exchange",
      icon: <FiDollarSign />,
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "Flight booking confirmed",
      time: "2 hours ago",
      unread: false,
      type: "flight",
      icon: <FiAirplay />,
      color: "#f97316",
    },
    {
      id: 4,
      title: "Travel package inquiry",
      time: "3 hours ago",
      unread: true,
      type: "travel",
      icon: <FiPackage />,
      color: "#8b5cf6",
    },
    {
      id: 5,
      title: "Visa application approved",
      time: "5 hours ago",
      unread: false,
      type: "visa",
      icon: <FiGlobe />,
      color: "#ec4899",
    },
  ];

  const userMenuItems = [
    { label: "My Profile", icon: <FiUser />, path: "/admin/profile" },
    {
      label: "Account Settings",
      icon: <FiSettings />,
      path: "/admin/settings",
    },
    {
      label: "Help & Support",
      icon: <FiMessageSquare />,
      path: "/admin/support",
    },
    {
      label: "Logout",
      icon: <FiUser />,
      path: "/logout",
      color: "#ef4444",
    },
  ];

  const quickActions = [
    { label: "New Exchange", icon: <FiDollarSign />, color: "#10b981" },
    { label: "Book Flight", icon: <FiAirplay />, color: "#3b82f6" },
    { label: "Create Package", icon: <FiPackage />, color: "#f59e0b" },
    { label: "Add User", icon: <FiUser />, color: "#8b5cf6" },
    { label: "View Reports", icon: <FiHome />, color: "#ec4899" },
    { label: "System Settings", icon: <FiSettings />, color: "#6b7280" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        quickMenuRef.current &&
        !quickMenuRef.current.contains(event.target)
      ) {
        setShowQuickMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const handleQuickAction = (action) => {
    console.log("Quick action:", action);
    setShowQuickMenu(false);
  };

  return (
    <header className={styles.adminNavbar}>
      {/* Left Section - Toggle & Brand */}
      <div className={styles.leftSection}>
        <div className={styles.brandSection}>
          <div className={styles.brandLogo}>
            <h1 className={styles.brandName}>TravelFin</h1>
          </div>
          <div className={styles.brandTagline}>Admin Dashboard</div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className={styles.centerSection}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search transactions, bookings, customers..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className={styles.rightSection}>
        {/* Quick Actions */}
        <div className={styles.quickActionsContainer} ref={quickMenuRef}>
          <button
            className={`${styles.actionBtn} ${styles.quickActionsBtn} ${
              showQuickMenu ? styles.active : ""
            }`}
            onClick={() => {
              setShowQuickMenu(!showQuickMenu);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            aria-label="Quick actions">
            <span className={styles.quickActionsIcon}>⚡</span>
            <span className={styles.quickActionsText}>Quick Actions</span>
          </button>

          {showQuickMenu && (
            <div className={styles.quickActionsDropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Quick Actions</h3>
              </div>
              <div className={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={styles.quickActionItem}
                    onClick={() => handleQuickAction(action.label)}
                    style={{ "--action-color": action.color }}>
                    <div className={styles.quickActionIcon}>{action.icon}</div>
                    <span className={styles.quickActionLabel}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className={styles.notificationContainer} ref={notificationRef}>
          <button
            className={`${styles.actionBtn} ${styles.notificationBtn} ${
              showNotifications ? styles.active : ""
            }`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              setShowQuickMenu(false);
            }}
            aria-label="Notifications">
            <FiBell className={styles.notificationIcon} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className={styles.markAllRead}
                    onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className={styles.notificationList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.unread ? styles.unread : ""
                    }`}
                    onClick={() => setShowNotifications(false)}>
                    <div
                      className={styles.notificationTypeIcon}
                      style={{ background: `${notification.color}20` }}>
                      {notification.icon}
                    </div>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationTitle}>
                        {notification.title}
                      </p>
                      <div className={styles.notificationMeta}>
                        <span
                          className={styles.notificationType}
                          style={{ color: notification.color }}>
                          {notification.type}
                        </span>
                        <span className={styles.notificationTime}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    {notification.unread && (
                      <div
                        className={styles.unreadDot}
                        style={{ background: notification.color }}></div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.dropdownFooter}>
                <button className={styles.viewAllBtn}>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={styles.userProfileContainer} ref={userMenuRef}>
          <button
            className={`${styles.userProfileBtn} ${
              showUserMenu ? styles.active : ""
            }`}
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowQuickMenu(false);
            }}
            aria-label="User menu">
            <div className={styles.avatar}>
              {user?.fullName?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() ||
                "A"}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.fullName?.split(" ")[0] || "Admin"}
              </span>
              <span className={styles.userRole}>
                {user?.role || "Administrator"}
              </span>
            </div>
            <FiChevronDown
              className={`${styles.chevron} ${
                showUserMenu ? styles.rotated : ""
              }`}
            />
          </button>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {user?.fullName?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "A"}
                </div>
                <div className={styles.dropdownUserInfo}>
                  <h4>{user?.fullName || "Administrator"}</h4>
                  <p>{user?.email || "admin@travelfin.com"}</p>
                </div>
              </div>

              <div className={styles.userDropdownMenu}>
                {userMenuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.path}
                    className={styles.dropdownItem}
                    style={item.color ? { color: item.color } : {}}
                    onClick={(e) => {
                      if (item.label === "Logout") {
                        e.preventDefault();
                        console.log("Logout clicked");
                      }
                      setShowUserMenu(false);
                    }}>
                    <span className={styles.dropdownIcon}>{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
