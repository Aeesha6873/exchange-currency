import React, { useState } from "react";
import {
  FiUser,
  FiSettings,
  FiLock,
  FiMail,
  FiBell,
  FiShield,
  FiDownload,
  FiUpload,
  FiSave,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiKey,
  FiUsers,
  FiGlobe,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import styles from "./ManageUsers.module.css";

const ManageUsers = () => {
  // Control panel states
  const [activeControl, setActiveControl] = useState("account");
  const [userSettings, setUserSettings] = useState({
    // Account settings
    allowNewRegistrations: true,
    requireEmailVerification: true,
    allowProfileUpdates: true,

    // Security settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordStrength: "medium",

    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,

    // Privacy settings
    profileVisibility: "public",
    dataSharing: false,
    deleteInactiveAccounts: "90",

    // System settings
    defaultUserRole: "user",
    maxLoginAttempts: "5",
    autoLockoutDuration: "30",
  });

  const handleSettingChange = (setting, value) => {
    setUserSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const controlCards = [
    {
      id: "account",
      title: "Account Management",
      description:
        "Control user registration, verification, and profile settings",
      icon: <FiUser />,
      className: "user",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Configure password policies, 2FA, and session management",
      icon: <FiLock />,
      className: "lock",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage email, push, and system notifications",
      icon: <FiBell />,
      className: "notification",
    },
    {
      id: "privacy",
      title: "Privacy Controls",
      description: "Configure user privacy and data sharing settings",
      icon: <FiShield />,
      className: "security",
    },
    {
      id: "communication",
      title: "Communication",
      description: "Email templates, bulk messaging, and announcement settings",
      icon: <FiMail />,
      className: "mail",
    },
    {
      id: "export",
      title: "Data Management",
      description: "Export user data, backups, and data retention policies",
      icon: <FiDownload />,
      className: "export",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Password policy updated",
      time: "2 hours ago",
      icon: <FiKey />,
    },
    {
      id: 2,
      title: "New registration settings applied",
      time: "Yesterday",
      icon: <FiUsers />,
    },
    {
      id: 3,
      title: "Email verification required enabled",
      time: "2 days ago",
      icon: <FiMail />,
    },
    {
      id: 4,
      title: "Session timeout increased to 60 minutes",
      time: "1 week ago",
      icon: <FiGlobe />,
    },
  ];

  const handleSaveSettings = () => {
    console.log("Saving user settings:", userSettings);
    alert("User management settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (window.confirm("Reset all settings to default?")) {
      setUserSettings({
        allowNewRegistrations: true,
        requireEmailVerification: true,
        allowProfileUpdates: true,
        twoFactorAuth: false,
        sessionTimeout: "30",
        passwordStrength: "medium",
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        profileVisibility: "public",
        dataSharing: false,
        deleteInactiveAccounts: "90",
        defaultUserRole: "user",
        maxLoginAttempts: "5",
        autoLockoutDuration: "30",
      });
    }
  };

  const renderSettings = () => {
    switch (activeControl) {
      case "account":
        return (
          <div className={styles.settingsGrid}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Allow New User Registrations
              </label>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.allowNewRegistrations}
                  onChange={(e) =>
                    handleSettingChange(
                      "allowNewRegistrations",
                      e.target.checked
                    )
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Require Email Verification
              </label>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.requireEmailVerification}
                  onChange={(e) =>
                    handleSettingChange(
                      "requireEmailVerification",
                      e.target.checked
                    )
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Allow Profile Updates
              </label>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.allowProfileUpdates}
                  onChange={(e) =>
                    handleSettingChange("allowProfileUpdates", e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Default User Role</label>
              <select
                value={userSettings.defaultUserRole}
                onChange={(e) =>
                  handleSettingChange("defaultUserRole", e.target.value)
                }
                className={styles.settingSelect}>
                <option value="user">Regular User</option>
                <option value="vip">VIP User</option>
                <option value="premium">Premium User</option>
              </select>
            </div>
          </div>
        );

      case "security":
        return (
          <div className={styles.settingsGrid}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Enable Two-Factor Authentication
              </label>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.twoFactorAuth}
                  onChange={(e) =>
                    handleSettingChange("twoFactorAuth", e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={userSettings.sessionTimeout}
                onChange={(e) =>
                  handleSettingChange("sessionTimeout", e.target.value)
                }
                className={styles.settingInput}
                min="5"
                max="1440"
              />
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Password Strength</label>
              <select
                value={userSettings.passwordStrength}
                onChange={(e) =>
                  handleSettingChange("passwordStrength", e.target.value)
                }
                className={styles.settingSelect}>
                <option value="low">Low (6+ characters)</option>
                <option value="medium">
                  Medium (8+ with letters & numbers)
                </option>
                <option value="high">High (12+ with special characters)</option>
              </select>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Maximum Login Attempts
              </label>
              <input
                type="number"
                value={userSettings.maxLoginAttempts}
                onChange={(e) =>
                  handleSettingChange("maxLoginAttempts", e.target.value)
                }
                className={styles.settingInput}
                min="1"
                max="10"
              />
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className={styles.settingsGrid}>
            <div className={styles.settingRow}>
              <div className={styles.settingText}>
                <div className={styles.settingName}>Email Notifications</div>
                <div className={styles.settingDescription}>
                  Send system notifications via email
                </div>
              </div>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange("emailNotifications", e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingText}>
                <div className={styles.settingName}>Push Notifications</div>
                <div className={styles.settingDescription}>
                  Enable browser push notifications
                </div>
              </div>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.pushNotifications}
                  onChange={(e) =>
                    handleSettingChange("pushNotifications", e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>

            <div className={styles.settingRow}>
              <div className={styles.settingText}>
                <div className={styles.settingName}>Marketing Emails</div>
                <div className={styles.settingDescription}>
                  Send promotional and marketing emails
                </div>
              </div>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={userSettings.marketingEmails}
                  onChange={(e) =>
                    handleSettingChange("marketingEmails", e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.settingsGrid}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>
                Select a control panel to manage settings
              </label>
              <p className={styles.controlDescription}>
                Each control panel contains specific settings for managing
                different aspects of user management.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.manageUsers}>
      {/* Header with your green colors */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <div className={styles.titleIcon}>
              <FiSettings />
            </div>
            Manage User Settings
          </h1>
          <p className={styles.subtitle}>
            Configure system-wide user management settings and controls
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Control Panels</h2>
          <div className={styles.panelActions}>
            <button className={styles.panelBtn}>
              <FiUpload /> Import Settings
            </button>
            <button className={`${styles.panelBtn} ${styles.primary}`}>
              <FiDownload /> Export All Settings
            </button>
          </div>
        </div>

        {/* Control Cards Grid */}
        <div className={styles.controlGrid}>
          {controlCards.map((card) => (
            <div
              key={card.id}
              className={`${styles.controlCard} ${
                activeControl === card.id ? styles.active : ""
              }`}
              onClick={() => setActiveControl(card.id)}>
              <div
                className={`${styles.controlIcon} ${styles[card.className]}`}>
                {card.icon}
              </div>
              <h3 className={styles.controlTitle}>{card.title}</h3>
              <p className={styles.controlDescription}>{card.description}</p>
            </div>
          ))}
        </div>

        {/* Settings Section */}
        <div className={styles.settingsSection}>
          <h3 className={styles.settingsHeader}>
            {controlCards.find((c) => c.id === activeControl)?.title ||
              "Settings"}
          </h3>
          {renderSettings()}
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <h3 className={styles.settingsHeader}>Recent Changes</h3>
          <div className={styles.activityList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>{activity.icon}</div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionBtn} ${styles.reset}`}
            onClick={handleResetSettings}>
            <FiRefreshCw /> Reset to Default
          </button>
          <button
            className={`${styles.actionBtn} ${styles.save}`}
            onClick={handleSaveSettings}>
            <FiSave /> Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
