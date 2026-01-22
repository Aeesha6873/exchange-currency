// components/admin/AdminHeader.jsx
import React, { useState } from "react";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiChevronDown,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import styles from "./AdminHeader.module.css";

function AdminHeader({ onToggleSidebar, isSidebarCollapsed }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "New Booking",
      message: "John booked flight to Paris",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Currency Exchange",
      message: "Large USD to EUR transaction",
      time: "15 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "$2,500 received from Sarah",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerLeft}>
        <button
          className={styles.sidebarToggle}
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }>
          <FiMenu />
        </button>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search transactions, bookings, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>
      </div>

      <div className={styles.headerRight}>
        {/* Notifications */}
        <div className={styles.notificationWrapper}>
          <button
            className={styles.notificationBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications">
            <FiBell />
            <span className={styles.notificationBadge}>3</span>
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h4>Notifications</h4>
                <span className={styles.notificationCount}>3 new</span>
              </div>

              <div className={styles.notificationList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.unread ? styles.unread : ""
                    }`}>
                    <div className={styles.notificationContent}>
                      <h5>{notification.title}</h5>
                      <p>{notification.message}</p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.viewAllBtn}>
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className={styles.userMenuWrapper}>
          <button
            className={styles.userMenuBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu">
            <div className={styles.userAvatar}>
              <FiUser />
            </div>
            <span className={styles.userName}>Admin</span>
            <FiChevronDown className={styles.chevron} />
          </button>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userInfo}>
                <div className={`${styles.userAvatar} ${styles.large}`}>
                  <FiUser />
                </div>
                <div>
                  <h4>Administrator</h4>
                  <p>admin@travelfin.com</p>
                </div>
              </div>

              <div className={styles.userMenuList}>
                <button className={styles.userMenuItem}>
                  <FiUser />
                  <span>My Profile</span>
                </button>
                <button className={styles.userMenuItem}>
                  <FiSettings />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
