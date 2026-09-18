import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiSave,
  FiGlobe,
  FiDollarSign,
  FiCreditCard,
  FiBell,
  FiShield,
  FiMail,
  FiUser,
  FiDatabase,
  FiActivity,
  FiCheck,
} from "react-icons/fi";
import styles from "./AdminSettings.module.css";

const SETTINGS_KEY = "adminSettings";

const defaultSettings = {
  general: {
    siteName: "TravelFin",
    siteUrl: "https://travelfin.com",
    timezone: "UTC+0",
    dateFormat: "YYYY-MM-DD",
    currency: "USD",
    language: "English",
  },
  exchange: {
    baseCurrency: "USD",
    autoUpdate: true,
    updateInterval: 15,
    markup: 1.5,
    commission: 0.5,
    minAmount: 10,
    maxAmount: 10000,
  },
  payment: {
    enabledMethods: ["credit_card", "bank_transfer", "digital_wallet"],
    stripeEnabled: true,
    paypalEnabled: true,
    autoConfirm: false,
    holdPeriod: 24,
  },
  notifications: {
    emailNotifications: true,
    adminAlerts: true,
    bookingConfirmation: true,
    paymentAlerts: true,
    exchangeAlerts: true,
    newsletter: false,
  },
  security: {
    twoFactor: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    ipWhitelist: "",
    passwordExpiry: 90,
  },
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(() =>
    read(SETTINGS_KEY, defaultSettings),
  );
  const [saved, setSaved] = useState(false);

  // Merge stored settings over defaults so new keys always exist
  useEffect(() => {
    const stored = read(SETTINGS_KEY, null);
    if (stored) {
      const merged = { ...defaultSettings };
      Object.keys(defaultSettings).forEach((section) => {
        merged[section] = { ...defaultSettings[section], ...stored[section] };
      });
      setSettings(merged);
    }
  }, []);

  const tabs = [
    { id: "general", label: "General", icon: <FiGlobe /> },
    { id: "exchange", label: "Exchange", icon: <FiDollarSign /> },
    { id: "payment", label: "Payment", icon: <FiCreditCard /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "security", label: "Security", icon: <FiShield /> },
    { id: "email", label: "Email", icon: <FiMail /> },
    { id: "users", label: "Users", icon: <FiUser /> },
    { id: "database", label: "Database", icon: <FiDatabase /> },
  ];

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetSettings = () => {
    if (!window.confirm("Reset all settings to default?")) return;
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  };

  /* ---------------- Tab content ---------------- */

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>General Settings</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Site Name</label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) =>
                    handleInputChange("general", "siteName", e.target.value)
                  }
                  className={styles.settingInput}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Site URL</label>
                <input
                  type="text"
                  value={settings.general.siteUrl}
                  onChange={(e) =>
                    handleInputChange("general", "siteUrl", e.target.value)
                  }
                  className={styles.settingInput}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) =>
                    handleInputChange("general", "timezone", e.target.value)
                  }
                  className={styles.settingSelect}>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC+1">UTC+1 (CET)</option>
                  <option value="UTC-5">UTC-5 (EST)</option>
                  <option value="UTC-8">UTC-8 (PST)</option>
                </select>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Date Format</label>
                <select
                  value={settings.general.dateFormat}
                  onChange={(e) =>
                    handleInputChange("general", "dateFormat", e.target.value)
                  }
                  className={styles.settingSelect}>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Default Currency</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) =>
                    handleInputChange("general", "currency", e.target.value)
                  }
                  className={styles.settingSelect}>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                </select>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Language</label>
                <select
                  value={settings.general.language}
                  onChange={(e) =>
                    handleInputChange("general", "language", e.target.value)
                  }
                  className={styles.settingSelect}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "exchange":
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Exchange Settings</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Base Currency</label>
                <select
                  value={settings.exchange.baseCurrency}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "baseCurrency",
                      e.target.value,
                    )
                  }
                  className={styles.settingSelect}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Auto Update Rates</span>
                  <div className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.exchange.autoUpdate}
                      onChange={(e) =>
                        handleInputChange(
                          "exchange",
                          "autoUpdate",
                          e.target.checked,
                        )
                      }
                    />
                    <span className={styles.toggleTrack}></span>
                  </div>
                </label>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Update Interval (min)
                </label>
                <input
                  type="number"
                  value={settings.exchange.updateInterval}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "updateInterval",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="5"
                  max="60"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Markup Percentage (%)
                </label>
                <input
                  type="number"
                  value={settings.exchange.markup}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "markup",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className={styles.settingInput}
                  step="0.1"
                  min="0"
                  max="10"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Commission (%)</label>
                <input
                  type="number"
                  value={settings.exchange.commission}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "commission",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className={styles.settingInput}
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Minimum Amount</label>
                <input
                  type="number"
                  value={settings.exchange.minAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "minAmount",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="1"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>Maximum Amount</label>
                <input
                  type="number"
                  value={settings.exchange.maxAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "exchange",
                      "maxAmount",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="100"
                />
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Payment Settings</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Enable Stripe</span>
                  <div className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.payment.stripeEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "stripeEnabled",
                          e.target.checked,
                        )
                      }
                    />
                    <span className={styles.toggleTrack}></span>
                  </div>
                </label>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>Enable PayPal</span>
                  <div className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.payment.paypalEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "paypalEnabled",
                          e.target.checked,
                        )
                      }
                    />
                    <span className={styles.toggleTrack}></span>
                  </div>
                </label>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>
                    Auto Confirm Payments
                  </span>
                  <div className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.payment.autoConfirm}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "autoConfirm",
                          e.target.checked,
                        )
                      }
                    />
                    <span className={styles.toggleTrack}></span>
                  </div>
                </label>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Payment Hold Period (hours)
                </label>
                <input
                  type="number"
                  value={settings.payment.holdPeriod}
                  onChange={(e) =>
                    handleInputChange(
                      "payment",
                      "holdPeriod",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="1"
                  max="72"
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Notifications</h3>
            <div className={styles.settingsGrid}>
              {[
                ["emailNotifications", "Email Notifications"],
                ["adminAlerts", "Admin Alerts"],
                ["bookingConfirmation", "Booking Confirmation"],
                ["paymentAlerts", "Payment Alerts"],
                ["exchangeAlerts", "Exchange Alerts"],
                ["newsletter", "Newsletter"],
              ].map(([key, label]) => (
                <div className={styles.settingItem} key={key}>
                  <label className={styles.toggleLabel}>
                    <span className={styles.toggleText}>{label}</span>
                    <div className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={settings.notifications[key]}
                        onChange={(e) =>
                          handleInputChange(
                            "notifications",
                            key,
                            e.target.checked,
                          )
                        }
                      />
                      <span className={styles.toggleTrack}></span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "security":
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Security</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.toggleLabel}>
                  <span className={styles.toggleText}>
                    Two-Factor Authentication
                  </span>
                  <div className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "twoFactor",
                          e.target.checked,
                        )
                      }
                    />
                    <span className={styles.toggleTrack}></span>
                  </div>
                </label>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "sessionTimeout",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="5"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "maxLoginAttempts",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="1"
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "passwordExpiry",
                      parseInt(e.target.value, 10) || 0,
                    )
                  }
                  className={styles.settingInput}
                  min="0"
                />
              </div>

              <div className={`${styles.settingItem} ${styles.fullWidth}`}>
                <label className={styles.settingLabel}>
                  IP Whitelist (comma-separated)
                </label>
                <input
                  type="text"
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    handleInputChange("security", "ipWhitelist", e.target.value)
                  }
                  className={styles.settingInput}
                  placeholder="e.g. 192.168.1.1, 10.0.0.1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>
              {tabs.find((t) => t.id === activeTab)?.label} Settings
            </h3>
            <div className={styles.comingSoonBox}>
              <FiActivity className={styles.comingSoonIcon} />
              <p className={styles.comingSoonText}>
                This section is under development and will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.settings}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiSettings className={styles.titleIcon} />
            Settings
          </h1>
          <p className={styles.subtitle}>
            Configure your platform settings and preferences
          </p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.resetBtn} onClick={handleResetSettings}>
            Reset Defaults
          </button>
          <button className={styles.saveBtn} onClick={handleSaveSettings}>
            <FiSave />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className={styles.settingsLayout}>
        <div className={styles.settingsSidebar}>
          <div className={styles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <FiCheck className={styles.activeIcon} />
                )}
              </button>
            ))}
          </div>

          <div className={styles.systemInfo}>
            <div className={styles.infoTitle}>
              <FiActivity />
              System Status
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Version</span>
              <span className={styles.infoValue}>v2.4.1</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Backup</span>
              <span className={styles.infoValue}>Today, 02:00</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Storage</span>
              <span className={styles.infoValue}>1.2 / 10 GB</span>
            </div>
          </div>
        </div>

        <div className={styles.settingsContent}>
          {renderTabContent()}

          <div className={styles.settingsActions}>
            <button className={styles.actionBtnSecondary}>
              Test Email Config
            </button>
            <button className={styles.actionBtnSecondary}>Clear Cache</button>
            <button className={styles.actionBtnSecondary}>
              View System Logs
            </button>
            <button className={styles.actionBtnSecondary}>
              Backup Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
