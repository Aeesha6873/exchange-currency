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
  FiActivity,
  FiHelpCircle,
  FiAward,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    setTimeout(() => {
      const savedSettings = JSON.parse(
        localStorage.getItem("userSettings")
      ) || {
        // Account Settings
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,

        // Privacy Settings
        profileVisibility: "public",
        showOnlineStatus: true,
        allowFriendRequests: true,
        dataSharing: true,

        // Security Settings
        twoFactorAuth: false,
        loginNotifications: true,
        sessionTimeout: 30,
        passwordUpdateReminder: 90,

        // Notification Preferences
        bookingConfirmation: true,
        paymentReceipts: true,
        exchangeRateAlerts: true,
        promotionalOffers: false,
        newsletter: true,

        // Data Management
        autoDeleteOldData: false,
        deleteDataAfter: 365,
        exportDataFormat: "csv",
        backupFrequency: "weekly",

        // Travel Preferences
        defaultCurrency: "USD",
        preferredAirlines: ["Delta", "United"],
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
    { id: "general", label: "General", icon: <FiSettings />, color: "#10b981" },
    { id: "security", label: "Security", icon: <FiShield />, color: "#ef4444" },
    { id: "privacy", label: "Privacy", icon: <FiEye />, color: "#3b82f6" },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell />,
      color: "#f59e0b",
    },
    { id: "data", label: "Data", icon: <FiDatabase />, color: "#8b5cf6" },
  ];

  const seatPreferences = [
    { id: "window", name: "Window" },
    { id: "aisle", name: "Aisle" },
    { id: "middle", name: "Middle" },
    { id: "exit", name: "Exit Row" },
  ];

  const mealPreferences = [
    { id: "vegetarian", name: "Vegetarian" },
    { id: "vegan", name: "Vegan" },
    { id: "halal", name: "Halal" },
    { id: "kosher", name: "Kosher" },
    { id: "gluten", name: "Gluten-Free" },
  ];

  const quickActions = [
    {
      id: 1,
      label: "Privacy Policy",
      icon: <FiEye />,
      path: "/privacy",
      description: "View our privacy practices",
      color: "var(--green)",
    },
    {
      id: 2,
      label: "Help Center",
      icon: <FiHelpCircle />,
      path: "/help",
      description: "Get support and answers",
      color: "var(--orange)",
    },
    {
      id: 3,
      label: "Terms of Service",
      icon: <FiAward />,
      path: "/terms",
      description: "Read our terms and conditions",
      color: "var(--dark-green)",
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
        showOnlineStatus: true,
        allowFriendRequests: true,
        dataSharing: true,
        twoFactorAuth: false,
        loginNotifications: true,
        sessionTimeout: 30,
        passwordUpdateReminder: 90,
        bookingConfirmation: true,
        paymentReceipts: true,
        exchangeRateAlerts: true,
        promotionalOffers: false,
        newsletter: true,
        autoDeleteOldData: false,
        deleteDataAfter: 365,
        exportDataFormat: "csv",
        backupFrequency: "weekly",
        defaultCurrency: "USD",
        preferredAirlines: ["Delta", "United"],
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
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert(
        "Account deletion requested. You will receive a confirmation email."
      );
    }
  };

  const togglePreferredAirline = (airline) => {
    const currentAirlines = settings.preferredAirlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter((a) => a !== airline)
      : [...currentAirlines, airline];
    handleSelect("preferredAirlines", newAirlines);
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
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Settings</h1>
              <p className={styles.heroSubtitle}>
                Manage your account preferences and security settings
              </p>
            </div>
            <div className={styles.heroActions}>
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

          {/* Settings Tabs */}
          <div className={styles.settingsTabs}>
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderBottomColor: activeTab === tab.id ? tab.color : "",
                }}>
                <div className={styles.tabContent}>
                  {tab.icon}
                  <span className={styles.tabLabel}>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Balanced Layout */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === "general" && (
                <div className={styles.tabPanel}>
                  {/* Account Settings */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiUser /> Account Settings
                    </h3>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Email Notifications
                          </div>
                          <div className={styles.labelDescription}>
                            Receive important updates via email
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle("emailNotifications")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>SMS Alerts</div>
                          <div className={styles.labelDescription}>
                            Get security alerts via SMS
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.smsNotifications}
                            onChange={() => handleToggle("smsNotifications")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Push Notifications
                          </div>
                          <div className={styles.labelDescription}>
                            Receive real-time updates in browser
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={() => handleToggle("pushNotifications")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Travel Preferences */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiSettings /> Travel Preferences
                    </h3>
                    <div className={styles.settingsGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Seat Preference
                        </label>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.formSelect}
                            value={settings.seatPreference}
                            onChange={(e) =>
                              handleSelect("seatPreference", e.target.value)
                            }>
                            {seatPreferences.map((seat) => (
                              <option key={seat.id} value={seat.id}>
                                {seat.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronRight className={styles.selectArrow} />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Meal Preference
                        </label>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.formSelect}
                            value={settings.mealPreference}
                            onChange={(e) =>
                              handleSelect("mealPreference", e.target.value)
                            }>
                            {mealPreferences.map((meal) => (
                              <option key={meal.id} value={meal.id}>
                                {meal.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronRight className={styles.selectArrow} />
                        </div>
                      </div>
                    </div>

                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>Auto Check-in</div>
                          <div className={styles.labelDescription}>
                            Automatically check-in for flights 24 hours before
                            departure
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.autoCheckin}
                            onChange={() => handleToggle("autoCheckin")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>Price Alerts</div>
                          <div className={styles.labelDescription}>
                            Receive alerts when flight/hotel prices drop
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.priceAlerts}
                            onChange={() => handleToggle("priceAlerts")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Airlines */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiSettings /> Preferred Airlines
                    </h3>
                    <div className={styles.airlineOptions}>
                      <div className={styles.airlineGrid}>
                        {[
                          "Delta",
                          "United",
                          "American",
                          "Southwest",
                          "JetBlue",
                          "Alaska",
                        ].map((airline) => (
                          <label key={airline} className={styles.airlineOption}>
                            <input
                              type="checkbox"
                              checked={settings.preferredAirlines?.includes(
                                airline
                              )}
                              onChange={() => togglePreferredAirline(airline)}
                            />
                            <span className={styles.airlineLabel}>
                              {airline}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className={styles.tabPanel}>
                  {/* Security Settings */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiShield /> Security Settings
                    </h3>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Two-Factor Authentication
                          </div>
                          <div className={styles.labelDescription}>
                            Add an extra layer of security to your account
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={() => handleToggle("twoFactorAuth")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Login Notifications
                          </div>
                          <div className={styles.labelDescription}>
                            Get alerts for new device logins
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.loginNotifications}
                            onChange={() => handleToggle("loginNotifications")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.settingsGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Session Timeout
                        </label>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.formSelect}
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                              handleSelect(
                                "sessionTimeout",
                                parseInt(e.target.value)
                              )
                            }>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                            <option value={0}>Never (not recommended)</option>
                          </select>
                          <FiChevronRight className={styles.selectArrow} />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Password Update Reminder
                        </label>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.formSelect}
                            value={settings.passwordUpdateReminder}
                            onChange={(e) =>
                              handleSelect(
                                "passwordUpdateReminder",
                                parseInt(e.target.value)
                              )
                            }>
                            <option value={30}>Every 30 days</option>
                            <option value={60}>Every 60 days</option>
                            <option value={90}>Every 90 days</option>
                            <option value={180}>Every 6 months</option>
                            <option value={0}>Never remind</option>
                          </select>
                          <FiChevronRight className={styles.selectArrow} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connected Devices */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiSmartphone /> Connected Devices
                    </h3>
                    <div className={styles.devicesList}>
                      <div className={styles.deviceItem}>
                        <div className={styles.deviceInfo}>
                          <div className={styles.deviceName}>
                            <FiSmartphone /> iPhone 14 Pro
                          </div>
                          <div className={styles.deviceDetails}>
                            New York, USA • Today, 10:30 AM
                          </div>
                        </div>
                        <div className={styles.deviceActions}>
                          <button className={styles.deviceActionButton}>
                            Current
                          </button>
                          <button className={styles.deviceActionButton}>
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                      <div className={styles.deviceItem}>
                        <div className={styles.deviceInfo}>
                          <div className={styles.deviceName}>
                            <FiSmartphone /> MacBook Pro
                          </div>
                          <div className={styles.deviceDetails}>
                            San Francisco, USA • Yesterday, 14:20
                          </div>
                        </div>
                        <div className={styles.deviceActions}>
                          <button className={styles.deviceActionButton}>
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className={styles.viewAllDevicesButton}>
                      View All Devices
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className={styles.tabPanel}>
                  {/* Privacy Settings */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiEye /> Privacy Settings
                    </h3>
                    <div className={styles.privacyOptions}>
                      <div className={styles.optionGroup}>
                        <label className={styles.optionLabel}>
                          Profile Visibility
                        </label>
                        <div className={styles.radioGroup}>
                          <label className={styles.radioItem}>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="public"
                              checked={settings.profileVisibility === "public"}
                              onChange={(e) =>
                                handleSelect(
                                  "profileVisibility",
                                  e.target.value
                                )
                              }
                            />
                            <div className={styles.radioContent}>
                              <span className={styles.radioLabel}>Public</span>
                              <span className={styles.radioDescription}>
                                Anyone can see your profile and activity
                              </span>
                            </div>
                          </label>
                          <label className={styles.radioItem}>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value="private"
                              checked={settings.profileVisibility === "private"}
                              onChange={(e) =>
                                handleSelect(
                                  "profileVisibility",
                                  e.target.value
                                )
                              }
                            />
                            <div className={styles.radioContent}>
                              <span className={styles.radioLabel}>Private</span>
                              <span className={styles.radioDescription}>
                                Only you can see your profile and activity
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className={styles.toggleList}>
                        <div className={styles.toggleItem}>
                          <div className={styles.toggleLabel}>
                            <div className={styles.labelTitle}>
                              Show Online Status
                            </div>
                            <div className={styles.labelDescription}>
                              Let others see when you're online
                            </div>
                          </div>
                          <label className={styles.toggleSwitch}>
                            <input
                              type="checkbox"
                              checked={settings.showOnlineStatus}
                              onChange={() => handleToggle("showOnlineStatus")}
                            />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>

                        <div className={styles.toggleItem}>
                          <div className={styles.toggleLabel}>
                            <div className={styles.labelTitle}>
                              Allow Friend Requests
                            </div>
                            <div className={styles.labelDescription}>
                              Allow others to send you connection requests
                            </div>
                          </div>
                          <label className={styles.toggleSwitch}>
                            <input
                              type="checkbox"
                              checked={settings.allowFriendRequests}
                              onChange={() =>
                                handleToggle("allowFriendRequests")
                              }
                            />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>

                        <div className={styles.toggleItem}>
                          <div className={styles.toggleLabel}>
                            <div className={styles.labelTitle}>
                              Data Sharing
                            </div>
                            <div className={styles.labelDescription}>
                              Allow anonymized data sharing for improvements
                            </div>
                          </div>
                          <label className={styles.toggleSwitch}>
                            <input
                              type="checkbox"
                              checked={settings.dataSharing}
                              onChange={() => handleToggle("dataSharing")}
                            />
                            <span className={styles.toggleSlider}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Privacy */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiActivity /> Activity Privacy
                    </h3>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Show Recent Bookings
                          </div>
                          <div className={styles.labelDescription}>
                            Display your recent travel bookings on profile
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.showRecentBookings || true}
                            onChange={() => handleToggle("showRecentBookings")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Show Exchange History
                          </div>
                          <div className={styles.labelDescription}>
                            Display your currency exchange history on profile
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.showExchangeHistory || true}
                            onChange={() => handleToggle("showExchangeHistory")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Show Loyalty Points
                          </div>
                          <div className={styles.labelDescription}>
                            Display your loyalty points and status
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.showLoyaltyPoints || true}
                            onChange={() => handleToggle("showLoyaltyPoints")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className={styles.tabPanel}>
                  {/* Email Preferences */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiMail /> Email Preferences
                    </h3>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Booking Confirmations
                          </div>
                          <div className={styles.labelDescription}>
                            Receive booking confirmation emails
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.bookingConfirmation}
                            onChange={() => handleToggle("bookingConfirmation")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Payment Receipts
                          </div>
                          <div className={styles.labelDescription}>
                            Receive payment confirmation emails
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.paymentReceipts}
                            onChange={() => handleToggle("paymentReceipts")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Exchange Rate Alerts
                          </div>
                          <div className={styles.labelDescription}>
                            Receive alerts when exchange rates change
                            significantly
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.exchangeRateAlerts}
                            onChange={() => handleToggle("exchangeRateAlerts")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Promotional Offers
                          </div>
                          <div className={styles.labelDescription}>
                            Receive special offers, discounts, and promotions
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.promotionalOffers}
                            onChange={() => handleToggle("promotionalOffers")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>Newsletter</div>
                          <div className={styles.labelDescription}>
                            Receive weekly travel and finance newsletter
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.newsletter}
                            onChange={() => handleToggle("newsletter")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Preferences */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiMail /> Marketing Preferences
                    </h3>
                    <div className={styles.toggleList}>
                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Marketing Emails
                          </div>
                          <div className={styles.labelDescription}>
                            Receive promotional offers and updates
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.marketingEmails}
                            onChange={() => handleToggle("marketingEmails")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.toggleItem}>
                        <div className={styles.toggleLabel}>
                          <div className={styles.labelTitle}>
                            Personalized Recommendations
                          </div>
                          <div className={styles.labelDescription}>
                            Get travel and booking recommendations based on your
                            activity
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={
                              settings.personalizedRecommendations || true
                            }
                            onChange={() =>
                              handleToggle("personalizedRecommendations")
                            }
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className={styles.tabPanel}>
                  {/* Data Management */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiDatabase /> Data Management
                    </h3>
                    <div className={styles.dataOptions}>
                      <div className={styles.dataAction}>
                        <div className={styles.dataActionInfo}>
                          <FiDownload className={styles.dataActionIcon} />
                          <div>
                            <div className={styles.dataActionTitle}>
                              Export Your Data
                            </div>
                            <div className={styles.dataActionDescription}>
                              Download all your data in{" "}
                              {settings.exportDataFormat.toUpperCase()} format
                            </div>
                          </div>
                        </div>
                        <button
                          className={styles.dataActionButton}
                          onClick={handleExportData}>
                          Export Now
                        </button>
                      </div>

                      <div className={styles.dataAction}>
                        <div className={styles.dataActionInfo}>
                          <FiTrash2 className={styles.dataActionIcon} />
                          <div>
                            <div className={styles.dataActionTitle}>
                              Delete Old Data
                            </div>
                            <div className={styles.dataActionDescription}>
                              Automatically delete data older than{" "}
                              {settings.deleteDataAfter} days
                            </div>
                          </div>
                        </div>
                        <label className={styles.toggleSwitch}>
                          <input
                            type="checkbox"
                            checked={settings.autoDeleteOldData}
                            onChange={() => handleToggle("autoDeleteOldData")}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>

                      <div className={styles.dataAction}>
                        <div className={styles.dataActionInfo}>
                          <FiActivity className={styles.dataActionIcon} />
                          <div>
                            <div className={styles.dataActionTitle}>
                              Auto Backup
                            </div>
                            <div className={styles.dataActionDescription}>
                              Backup your data {settings.backupFrequency}
                            </div>
                          </div>
                        </div>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.formSelect}
                            value={settings.backupFrequency}
                            onChange={(e) =>
                              handleSelect("backupFrequency", e.target.value)
                            }>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="never">Never</option>
                          </select>
                          <FiChevronRight className={styles.selectArrow} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Management */}
                  <div className={styles.settingsCard}>
                    <h3 className={styles.cardTitle}>
                      <FiTrash2 /> Account Management
                    </h3>
                    <div className={styles.accountActions}>
                      <div className={styles.accountAction}>
                        <div className={styles.accountActionInfo}>
                          <div className={styles.accountActionTitle}>
                            Delete Account
                          </div>
                          <div className={styles.accountActionDescription}>
                            Permanently delete your account and all associated
                            data
                          </div>
                        </div>
                        <button
                          className={styles.deleteAccountButton}
                          onClick={handleDeleteAccount}>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Balanced Layout */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    style={{ borderLeftColor: action.color }}>
                    <div
                      className={styles.quickActionIcon}
                      style={{ color: action.color }}>
                      {action.icon}
                    </div>
                    <div className={styles.quickActionContent}>
                      <div className={styles.quickActionTitle}>
                        {action.label}
                      </div>
                      <div className={styles.quickActionDescription}>
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Summary */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Active Settings</h3>
              <div className={styles.settingsSummary}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Notifications</div>
                  <div className={styles.summaryValue}>
                    {settings.emailNotifications ? "Email" : "Off"} •{" "}
                    {settings.pushNotifications ? "Push" : "Off"}
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Security</div>
                  <div className={styles.summaryValue}>
                    {settings.twoFactorAuth ? "2FA On" : "2FA Off"}
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Travel Preferences</div>
                  <div className={styles.summaryValue}>
                    {settings.seatPreference} •{" "}
                    {settings.autoCheckin ? "Auto" : "Manual"}
                  </div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Data Backup</div>
                  <div className={styles.summaryValue}>
                    {settings.backupFrequency}
                  </div>
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
