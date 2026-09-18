import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiShield,
  FiBell,
  FiSave,
  FiEdit2,
  FiCamera,
  FiSettings,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMap,
  FiCheckCircle,
  FiKey,
  FiAlertCircle,
} from "react-icons/fi";
import { MdFlight, MdWifiPassword, MdCompareArrows } from "react-icons/md";
import {
  authApi,
  profileApi,
  bookingsApi,
  transactionsApi,
} from "../../services/api";

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    nationality: "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Very weak",
    color: "#ef4444",
    width: "0%",
  });

  useEffect(() => {
    const current = authApi.getCurrentUser();
    if (!current) {
      navigate("/login");
      return;
    }

    (async () => {
      const [me, bookings, transactions] = await Promise.all([
        profileApi.get(current.id),
        bookingsApi.list(current.id),
        transactionsApi.list(current.id),
      ]);

      setUser(me);
      setFormData({
        fullName: me.fullName || "",
        email: me.email || "",
        phone: me.phone || "",
        address: me.address || "",
        dateOfBirth: me.dateOfBirth || "",
        nationality: me.nationality || "",
        profileImage: me.profileImage || null,
      });

      setStats({
        totalTrips: bookings.length,
        exchangeCount: transactions.length,
        bookingCount: bookings.length,
        loyaltyPoints: me.loyaltyPoints ?? 0,
      });

      const feed = [
        ...transactions.slice(0, 2).map((t) => ({
          id: t.id,
          action: `Exchanged ${t.fromAmount} ${t.fromCurrency} to ${t.toCurrency}`,
          date: t.date,
          icon: <MdCompareArrows />,
          color: "#3b82f6",
        })),
        ...bookings.slice(0, 3).map((b) => ({
          id: b.id,
          action: `Booked ${b.type} to ${b.destination}`,
          date: b.bookingDate,
          icon: <MdFlight />,
          color: "#10b981",
        })),
      ].slice(0, 3);

      setRecentActivities(feed);
      setLoading(false);
    })();
  }, [navigate]);

  const quickActions = [
    {
      id: 1,
      label: "Currency Exchange",
      icon: <MdCompareArrows />,
      path: "/dashboard/exchange",
      description: "Convert currencies instantly",
    },
    {
      id: 2,
      label: "Travel Agency",
      icon: <FiMap />,
      path: "/dashboard/travel-agency",
      description: "Hotels, tours, packages",
    },
    {
      id: 3,
      label: "Book Flight",
      icon: <MdFlight />,
      path: "/dashboard/flight",
      description: "Domestic & international",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (name === "new") calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let message = "Very weak";
    let color = "#ef4444";
    let width = "0%";
    if (score === 4) {
      message = "Strong";
      color = "#10b981";
      width = "100%";
    } else if (score === 3) {
      message = "Good";
      color = "#3b82f6";
      width = "75%";
    } else if (score === 2) {
      message = "Fair";
      color = "#f59e0b";
      width = "50%";
    } else if (score === 1) {
      message = "Weak";
      color = "#ef4444";
      width = "25%";
    }

    setPasswordStrength({ score, message, color, width });
  };

  const togglePasswordVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const updated = await profileApi.update(user.id, {
        profileImage: reader.result,
      });
      setUser(updated);
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const updated = await profileApi.update(user.id, formData);
    setUser(updated);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.new.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    await profileApi.update(user.id, { password: passwordData.new });
    alert("Password updated successfully!");
    setPasswordData({ current: "", new: "", confirm: "" });
    setPasswordStrength({
      score: 0,
      message: "Very weak",
      color: "#ef4444",
      width: "0%",
    });
  };

  const getInitials = (name) =>
    name ?
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AJ";

  if (loading || !user || !stats) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>
            Manage your personal information and account settings
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.editButton} ${
              isEditing ? styles.cancelButton : ""
            }`}
            onClick={() => setIsEditing(!isEditing)}>
            <FiEdit2 /> {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={`${styles.statItem} ${styles.statTrips}`}>
          <span className={styles.statNumber}>{stats.totalTrips}</span>
          <span className={styles.statLabel}>Total Trips</span>
        </div>
        <div className={`${styles.statItem} ${styles.statExchange}`}>
          <span className={styles.statNumber}>{stats.exchangeCount}</span>
          <span className={styles.statLabel}>Exchanges</span>
        </div>
        <div className={`${styles.statItem} ${styles.statBooking}`}>
          <span className={styles.statNumber}>{stats.bookingCount}</span>
          <span className={styles.statLabel}>Bookings</span>
        </div>
        <div className={`${styles.statItem} ${styles.statPoints}`}>
          <span className={styles.statNumber}>{stats.loyaltyPoints}</span>
          <span className={styles.statLabel}>Loyalty Points</span>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.leftColumn}>
            <div className={styles.profileCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <FiUser /> Personal Information
                </h3>
                {isEditing && (
                  <button onClick={handleSave} className={styles.saveButton}>
                    <FiSave /> Save Changes
                  </button>
                )}
              </div>

              <div className={styles.profileSection}>
                <div className={styles.profileImageWrapper}>
                  <div className={styles.profileImageContainer}>
                    {formData.profileImage ?
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    : <div className={styles.profileInitials}>
                        {getInitials(user.fullName)}
                      </div>
                    }
                    <label className={styles.imageUploadButton}>
                      <FiCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.imageUploadInput}
                      />
                    </label>
                  </div>
                  <div className={styles.profileStatus}>
                    <div className={styles.profileStatusItem}>
                      <FiMail className={styles.statusIcon} />
                      <div>
                        <div className={styles.statusLabel}>Email</div>
                        <div className={styles.statusValue}>{user.email}</div>
                        <div className={styles.statusVerified}>
                          <FiCheckCircle /> Verified
                        </div>
                      </div>
                    </div>
                    <div className={styles.profileStatusItem}>
                      <FiPhone className={styles.statusIcon} />
                      <div>
                        <div className={styles.statusLabel}>Phone</div>
                        <div className={styles.statusValue}>{user.phone}</div>
                        <div className={styles.statusVerified}>
                          <FiCheckCircle /> Verified
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoField}>
                    <label className={styles.fieldLabel}>
                      <FiUser />
                      <span>Full Name</span>
                    </label>
                    {isEditing ?
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                        placeholder="Enter your full name"
                      />
                    : <div className={styles.fieldValue}>{user.fullName}</div>}
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.fieldLabel}>
                      <FiCalendar />
                      <span>Date of Birth</span>
                    </label>
                    {isEditing ?
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                      />
                    : <div className={styles.fieldValue}>
                        {user.dateOfBirth ?
                          new Date(user.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "—"}
                      </div>
                    }
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.fieldLabel}>
                      <FiGlobe />
                      <span>Nationality</span>
                    </label>
                    {isEditing ?
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className={styles.fieldInput}
                        placeholder="Enter nationality"
                      />
                    : <div className={styles.fieldValue}>
                        {user.nationality || "—"}
                      </div>
                    }
                  </div>

                  <div className={styles.infoField}>
                    <label className={styles.fieldLabel}>
                      <FiMapPin />
                      <span>Address</span>
                    </label>
                    {isEditing ?
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={styles.fieldTextarea}
                        placeholder="Enter your address"
                        rows="2"
                      />
                    : <div className={styles.fieldValue}>
                        {user.address || "—"}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "overview" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("overview")}>
                <FiUser /> Personal Info
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "security" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("security")}>
                <FiShield /> Security
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "preferences" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("preferences")}>
                <FiSettings /> Preferences
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "security" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiKey /> Password Management
                    </h3>
                  </div>

                  <div className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <FiLock /> Current Password
                      </label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="current"
                          value={passwordData.current}
                          onChange={handlePasswordChange}
                          className={styles.formInput}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className={styles.eyeButton}>
                          {showPassword.current ?
                            <FiEyeOff />
                          : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <MdWifiPassword /> New Password
                      </label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="new"
                          value={passwordData.new}
                          onChange={handlePasswordChange}
                          className={styles.formInput}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className={styles.eyeButton}>
                          {showPassword.new ?
                            <FiEyeOff />
                          : <FiEye />}
                        </button>
                      </div>

                      {passwordData.new && (
                        <div className={styles.passwordStrengthMeter}>
                          <div className={styles.strengthHeader}>
                            <span>Password Strength:</span>
                            <span
                              className={styles.strengthText}
                              style={{ color: passwordStrength.color }}>
                              {passwordStrength.message}
                            </span>
                          </div>
                          <div className={styles.strengthBar}>
                            <div
                              className={styles.strengthFill}
                              style={{
                                width: passwordStrength.width,
                                backgroundColor: passwordStrength.color,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <FiLock /> Confirm New Password
                      </label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirm"
                          value={passwordData.confirm}
                          onChange={handlePasswordChange}
                          className={styles.formInput}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className={styles.eyeButton}>
                          {showPassword.confirm ?
                            <FiEyeOff />
                          : <FiEye />}
                        </button>
                      </div>

                      {passwordData.confirm && (
                        <div className={styles.passwordMatch}>
                          {passwordData.new === passwordData.confirm ?
                            <span className={styles.matchSuccess}>
                              <FiCheckCircle /> Passwords match
                            </span>
                          : <span className={styles.matchError}>
                              <FiAlertCircle /> Passwords don't match
                            </span>
                          }
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handlePasswordUpdate}
                      className={styles.updateButton}
                      disabled={
                        !passwordData.current ||
                        !passwordData.new ||
                        !passwordData.confirm ||
                        passwordData.new !== passwordData.confirm
                      }>
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                      <FiBell /> Notification Preferences
                    </h3>
                  </div>

                  <div className={styles.preferencesList}>
                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <div className={styles.preferenceTitle}>
                          Email Notifications
                        </div>
                        <div className={styles.preferenceDescription}>
                          Receive updates and receipts via email
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <div className={styles.preferenceTitle}>SMS Alerts</div>
                        <div className={styles.preferenceDescription}>
                          Important security alerts via SMS
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input type="checkbox" />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.preferenceInfo}>
                        <div className={styles.preferenceTitle}>
                          Promotional Offers
                        </div>
                        <div className={styles.preferenceDescription}>
                          Special deals and travel offers
                        </div>
                      </div>
                      <label className={styles.switch}>
                        <input type="checkbox" defaultChecked />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Quick Actions</h3>
              <div className={styles.quickActions}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickAction}
                    onClick={() => navigate(action.path)}>
                    <div className={styles.quickActionIcon}>{action.icon}</div>
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

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiCalendar /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                {recentActivities.length === 0 ?
                  <p style={{ color: "#64748b", fontSize: 14 }}>
                    No recent activity.
                  </p>
                : recentActivities.map((activity) => (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>{activity.icon}</div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityText}>
                          {activity.action}
                        </div>
                        <div className={styles.activityTime}>
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
