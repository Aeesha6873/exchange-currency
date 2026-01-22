// components/admin/AdminNavbar.jsx - FIXED & COOL DESIGN
import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiChevronDown,
  FiDollarSign,
  FiAirplay,
  FiPackage,
} from "react-icons/fi";
import styles from "./AdminNavbar.module.css";

function AdminNavbar({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "New customer registered",
      time: "5 min ago",
      unread: true,
      type: "user",
      icon: <FiUser />,
    },
    {
      id: 2,
      title: "Currency exchange completed",
      time: "1 hour ago",
      unread: true,
      type: "exchange",
      icon: <FiDollarSign />,
    },
    {
      id: 3,
      title: "Flight booking confirmed",
      time: "2 hours ago",
      unread: false,
      type: "flight",
      icon: <FiAirplay />,
    },
    {
      id: 4,
      title: "Travel package inquiry",
      time: "3 hours ago",
      unread: true,
      type: "travel",
      icon: <FiPackage />,
    },
  ];

  const userMenuItems = [
    { label: "My Profile", icon: <FiUser />, path: "/admin/profile" },
    { label: "Account Settings", icon: <FiUser />, path: "/admin/account" },
    {
      label: "Logout",
      icon: <FiUser />,
      path: "/logout",
      color: "var(--orange)",
    },
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "exchange":
        return "#10b981";
      case "flight":
        return "#3b82f6";
      case "travel":
        return "#f97316";
      default:
        return "#8b5cf6";
    }
  };

  return (
    <header className={styles.adminNavbar}>
      {/* Logo/Brand Section */}
      <div className={styles.brandSection}>
        <div className={styles.brandLogo}>
          <span className={styles.logoIcon}>💱✈️</span>
          <h1 className={styles.brandName}>TravelFin</h1>
        </div>
        <div className={styles.brandTagline}>Currency • Flights • Travel</div>
      </div>

      {/* Center Search Section */}
      <div className={styles.searchSection}>
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

      {/* Right Actions Section */}
      <div className={styles.actionsSection}>
        {/* Notifications */}
        <div className={styles.notificationContainer} ref={notificationRef}>
          <button
            className={`${styles.actionBtn} ${styles.notificationBtn} ${
              showNotifications ? styles.active : ""
            }`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
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
                    onClick={() => {
                      // Handle notification click
                      setShowNotifications(false);
                    }}>
                    <div
                      className={styles.notificationTypeIcon}
                      style={{
                        background: `${getNotificationColor(
                          notification.type
                        )}20`,
                      }}>
                      {notification.icon}
                    </div>
                    <div className={styles.notificationContent}>
                      <p className={styles.notificationTitle}>
                        {notification.title}
                      </p>
                      <div className={styles.notificationMeta}>
                        <span
                          className={styles.notificationType}
                          style={{
                            color: getNotificationColor(notification.type),
                          }}>
                          {notification.type.charAt(0).toUpperCase() +
                            notification.type.slice(1)}
                        </span>
                        <span className={styles.notificationTime}>
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    {notification.unread && (
                      <div
                        className={styles.unreadDot}
                        style={{
                          background: getNotificationColor(notification.type),
                        }}></div>
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
                        // Handle logout
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
