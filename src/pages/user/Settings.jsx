import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";
import {
  FiSettings,
  FiBell,
  FiEye,
  FiLock,
  FiMail,
  FiUser,
  FiSave,
  FiShield,
  FiSmartphone,
  FiDatabase,
  FiTrash2,
  FiHelpCircle,
  FiAward,
  FiDownload,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const savedSettings = JSON.parse(
        localStorage.getItem("userSettings"),
      ) || {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        profileVisibility: "public",
        twoFactorAuth: false,
        loginNotifications: true,
        sessionTimeout: 30,
        bookingConfirmation: true,
        paymentReceipts: true,
        exchangeRateAlerts: true,
        promotionalOffers: false,
        newsletter: true,
        autoDeleteOldData: false,
        exportDataFormat: "csv",
        backupFrequency: "weekly",
        defaultCurrency: "USD",
        seatPreference: "window",
        mealPreference: "vegetarian",
        autoCheckin: true,
        priceAlerts: true,
      };
      setSettings(savedSettings);
      setLoading(false);
    }, 500);
  }, []);

  const settingsTabs = [
    { id: "general", label: "General", icon: <FiSettings /> },
    { id: "security", label: "Security", icon: <FiShield /> },
    { id: "privacy", label: "Privacy", icon: <FiEye /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "data", label: "Data", icon: <FiDatabase /> },
  ];

  const quickActions = [
    {
      id: 1,
      label: "Privacy Policy",
      icon: <FiEye />,
      description: "View our privacy practices",
    },
    {
      id: 2,
      label: "Help Center",
      icon: <FiHelpCircle />,
      description: "Get support and answers",
    },
    {
      id: 3,
      label: "Terms of Service",
      icon: <FiAward />,
      description: "Read our terms and conditions",
    },
  ];

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setHasChanges(false);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      const defaultSettings = {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        profileVisibility: "public",
        twoFactorAuth: false,
        loginNotifications: true,
        sessionTimeout: 30,
        bookingConfirmation: true,
        paymentReceipts: true,
        exchangeRateAlerts: true,
        promotionalOffers: false,
        newsletter: true,
        autoDeleteOldData: false,
        exportDataFormat: "csv",
        backupFrequency: "weekly",
        defaultCurrency: "USD",
        seatPreference: "window",
        mealPreference: "vegetarian",
        autoCheckin: true,
        priceAlerts: true,
      };
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const handleExportData = () => {
    alert("Exporting your data...");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      alert(
        "Account deletion requested. You will receive a confirmation email.",
      );
    }
  };

  if (loading || !settings) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your account preferences and security settings
          </p>
        </div>
        <div className={styles.headerActions}>
          {hasChanges && (
            <div className={styles.unsavedChanges}>
              <FiAlertCircle /> Unsaved changes
            </div>
          )}
          <button className={styles.saveButton} onClick={handleSave}>
            <FiSave /> Save Changes
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={`${styles.statItem} ${styles.statNotifications}`}>
          <span className={styles.statNumber}>
            {settings.emailNotifications ? "On" : "Off"}
          </span>
          <span className={styles.statLabel}>Email Notifications</span>
        </div>
        <div className={`${styles.statItem} ${styles.statSecurity}`}>
          <span className={styles.statNumber}>
            {settings.twoFactorAuth ? "2FA On" : "2FA Off"}
          </span>
          <span className={styles.statLabel}>Security</span>
        </div>
        <div className={`${styles.statItem} ${styles.statPrivacy}`}>
          <span className={styles.statNumber}>
            {settings.profileVisibility === "public" ? "Public" : "Private"}
          </span>
          <span className={styles.statLabel}>Privacy</span>
        </div>
        <div className={`${styles.statItem} ${styles.statBackup}`}>
          <span className={styles.statNumber}>{settings.backupFrequency}</span>
          <span className={styles.statLabel}>Backup</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Tabs */}
            <div className={styles.tabs}>
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
                  onClick={() => setActiveTab(tab.id)}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === "general" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiUser /> Account Settings
                    </h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Email Notifications
                        </div>
                        <div className={styles.settingDescription}>
                          Receive important updates via email
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() => handleToggle("emailNotifications")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>SMS Alerts</div>
                        <div className={styles.settingDescription}>
                          Get security alerts via SMS
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={() => handleToggle("smsNotifications")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Push Notifications
                        </div>
                        <div className={styles.settingDescription}>
                          Receive real-time updates in browser
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={() => handleToggle("pushNotifications")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiShield /> Security Settings
                    </h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Two-Factor Authentication
                        </div>
                        <div className={styles.settingDescription}>
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={() => handleToggle("twoFactorAuth")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Login Notifications
                        </div>
                        <div className={styles.settingDescription}>
                          Get alerts for new device logins
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.loginNotifications}
                          onChange={() => handleToggle("loginNotifications")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Session Timeout
                        </div>
                        <div className={styles.settingDescription}>
                          Automatically log out after inactivity
                        </div>
                      </div>
                      <select
                        className={styles.select}
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleSelect(
                            "sessionTimeout",
                            parseInt(e.target.value),
                          )
                        }>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiEye /> Privacy Settings
                    </h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Profile Visibility
                        </div>
                        <div className={styles.settingDescription}>
                          Control who can see your profile
                        </div>
                      </div>
                      <select
                        className={styles.select}
                        value={settings.profileVisibility}
                        onChange={(e) =>
                          handleSelect("profileVisibility", e.target.value)
                        }>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>Data Sharing</div>
                        <div className={styles.settingDescription}>
                          Allow anonymized data sharing for improvements
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.dataSharing}
                          onChange={() => handleToggle("dataSharing")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiBell /> Notification Preferences
                    </h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Booking Confirmations
                        </div>
                        <div className={styles.settingDescription}>
                          Receive booking confirmation emails
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.bookingConfirmation}
                          onChange={() => handleToggle("bookingConfirmation")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Payment Receipts
                        </div>
                        <div className={styles.settingDescription}>
                          Receive payment confirmation emails
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.paymentReceipts}
                          onChange={() => handleToggle("paymentReceipts")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Exchange Rate Alerts
                        </div>
                        <div className={styles.settingDescription}>
                          Receive alerts when exchange rates change
                          significantly
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.exchangeRateAlerts}
                          onChange={() => handleToggle("exchangeRateAlerts")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Promotional Offers
                        </div>
                        <div className={styles.settingDescription}>
                          Receive special offers and promotions
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.promotionalOffers}
                          onChange={() => handleToggle("promotionalOffers")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiDatabase /> Data Management
                    </h3>
                  </div>

                  <div className={styles.settingsList}>
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Export Your Data
                        </div>
                        <div className={styles.settingDescription}>
                          Download all your data in CSV format
                        </div>
                      </div>
                      <button
                        className={styles.exportButton}
                        onClick={handleExportData}>
                        <FiDownload /> Export
                      </button>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Auto Delete Old Data
                        </div>
                        <div className={styles.settingDescription}>
                          Automatically delete data older than 365 days
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={settings.autoDeleteOldData}
                          onChange={() => handleToggle("autoDeleteOldData")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Backup Frequency
                        </div>
                        <div className={styles.settingDescription}>
                          How often to backup your data
                        </div>
                      </div>
                      <select
                        className={styles.select}
                        value={settings.backupFrequency}
                        onChange={(e) =>
                          handleSelect("backupFrequency", e.target.value)
                        }>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingTitle}>
                          Delete Account
                        </div>
                        <div className={styles.settingDescription}>
                          Permanently delete your account and all data
                        </div>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={handleDeleteAccount}>
                        <FiTrash2 /> Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button key={action.id} className={styles.quickAction}>
                    <div className={styles.quickActionIcon}>{action.icon}</div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                    <FiChevronRight className={styles.quickActionArrow} />
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Summary */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Active Settings</h3>
              <div className={styles.settingsSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Notifications:</span>
                  <span className={styles.summaryValue}>
                    {settings.emailNotifications ? "Email" : "Off"} •{" "}
                    {settings.pushNotifications ? "Push" : "Off"}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Security:</span>
                  <span className={styles.summaryValue}>
                    {settings.twoFactorAuth ? "2FA On" : "2FA Off"}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Privacy:</span>
                  <span className={styles.summaryValue}>
                    {settings.profileVisibility === "public" ?
                      "Public"
                    : "Private"}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Backup:</span>
                  <span className={styles.summaryValue}>
                    {settings.backupFrequency}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Settings */}
            <div className={styles.sidebarCard}>
              <div className={styles.resetCard}>
                <FiAlertCircle className={styles.resetIcon} />
                <h4 className={styles.resetTitle}>Reset All Settings</h4>
                <p className={styles.resetDescription}>
                  Reset all settings to their default values
                </p>
                <button className={styles.resetButton} onClick={handleReset}>
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
