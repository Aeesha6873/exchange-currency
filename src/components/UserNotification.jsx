// components/UserNotification.jsx - Fixed
import React from "react";
import {
  FiBell,
  FiCheck,
  FiX,
  FiClock,
  FiDollarSign,
  FiSend,
  FiMap,
  FiChevronRight,
} from "react-icons/fi";
import styles from "./UserNotification.module.css";

const UserNotification = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllAsRead,
  onNotificationClick,
  onDeleteNotification,
  isMobile = false,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "exchange":
        return <FiDollarSign />;
      case "flight":
        return <FiSend />;
      case "travel":
        return <FiMap />;
      default:
        return <FiBell />;
    }
  };

  const handleContainerClick = (e) => {
    // Don't propagate clicks from inside the notification dropdown
    e.stopPropagation();
  };

  const handleItemClick = (notification, e) => {
    e.stopPropagation();
    onNotificationClick(notification);
  };

  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    onDeleteNotification(id);
  };

  const handleMarkAllAsReadClick = (e) => {
    e.stopPropagation();
    onMarkAllAsRead();
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`${styles.notificationDropdown} ${
        isMobile ? styles.mobile : styles.desktop
      }`}
      onClick={handleContainerClick}
      style={isMobile ? {} : {}} // Ensure desktop version doesn't get mobile styles
    >
      <div className={styles.notificationHeader}>
        <div className={styles.notificationHeaderContent}>
          <h3 className={styles.notificationTitle}>Notifications</h3>
          {unreadCount > 0 && (
            <span className={styles.unreadCountBadge}>{unreadCount}</span>
          )}
        </div>
        <div className={styles.notificationActions}>
          {unreadCount > 0 && (
            <button
              className={styles.markAllButton}
              onClick={handleMarkAllAsReadClick}>
              Mark all read
            </button>
          )}
          <button
            className={styles.closeButton}
            onClick={handleCloseClick}
            aria-label="Close notifications">
            <FiX />
          </button>
        </div>
      </div>

      <div className={styles.notificationList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <FiBell className={styles.emptyIcon} />
            </div>
            <p className={styles.emptyTitle}>No notifications yet</p>
            <p className={styles.emptySubtitle}>
              We'll notify you when something arrives
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.read ? styles.unread : ""
              }`}
              onClick={(e) => handleItemClick(notification, e)}
              data-type={notification.type} // Make sure this is set
            >
              <div className={styles.notificationIconWrapper}>
                <div className={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </div>
                {!notification.read && <div className={styles.unreadDot}></div>}
              </div>

              <div className={styles.notificationContent}>
                <h4 className={styles.notificationItemTitle}>
                  {notification.title}
                </h4>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <div className={styles.notificationMeta}>
                  <FiClock className={styles.timeIcon} />
                  <span className={styles.notificationTime}>
                    {notification.time}
                  </span>
                </div>
              </div>

              <div className={styles.notificationItemActions}>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteClick(notification.id, e)}
                  title="Delete"
                  aria-label="Delete notification">
                  <FiX />
                </button>
                <FiChevronRight className={styles.arrowIcon} />
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className={styles.notificationFooter}>
          <button
            className={styles.viewAllButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              // Navigate to all notifications page
            }}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNotification;
