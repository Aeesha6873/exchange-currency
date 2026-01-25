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
  FiCreditCard,
  FiShield,
  FiBell,
  FiSave,
  FiEdit2,
  FiCamera,
  FiCheck,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiSettings,
  FiLock,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiDollarSign,
  FiMap,
  FiSend,
  FiCheckCircle,
  FiKey,
  FiSmartphone,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import {
  MdFlight,
  MdSecurity,
  MdVerifiedUser,
  MdWifiPassword,
  MdCompareArrows,
} from "react-icons/md";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem("currentUser")) ||
        JSON.parse(localStorage.getItem("registeredUser")) ||
        JSON.parse(localStorage.getItem("user")) || {
          fullName: "Alex Johnson",
          email: "alex.johnson@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001",
          dateOfBirth: "1990-05-15",
          nationality: "United States",
          profileImage: null,
          joinDate: "2023-01-15",
          isVerified: true,
          isPhoneVerified: true,
          isEmailVerified: true,
        };

      setUser(userData);
      setLoading(false);
    }, 800);
  }, []);

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
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
        nationality: user.nationality || "",
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);

  const stats = {
    totalTrips: 3,
    countriesVisited: 2,
    totalSpent: "$1,850.00",
    loyaltyPoints: 450,
    rank: "Silver",
    exchangeCount: 5,
    bookingCount: 3,
  };

  const recentActivities = [
    {
      id: 1,
      action: "Booked flight to Tokyo",
      date: "Today",
      icon: <MdFlight />,
      color: "#10b981",
    },
    {
      id: 2,
      action: "Exchanged $500 to EUR",
      date: "Yesterday",
      icon: <MdCompareArrows />,
      color: "#3b82f6",
    },
    {
      id: 3,
      action: "Added new payment method",
      date: "2 days ago",
      icon: <FiCreditCard />,
      color: "#8b5cf6",
    },
  ];

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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...passwordData,
      [name]: value,
    };
    setPasswordData(newData);

    if (name === "new") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let message = "Very weak";
    let color = "#ef4444";
    let width = "25%";

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
    } else {
      width = "0%";
    }

    setPasswordStrength({ score, message, color, width });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFormData = {
          ...formData,
          profileImage: reader.result,
        };
        setFormData(updatedFormData);

        const updatedUser = { ...user, profileImage: reader.result };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("registeredUser", JSON.stringify(updatedUser));

    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePasswordUpdate = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.new.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }

    alert("Password updated successfully!");
    setPasswordData({ current: "", new: "", confirm: "" });
    setPasswordStrength({
      score: 0,
      message: "Very weak",
      color: "#ef4444",
      width: "0%",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const getInitials = (name) => {
    return name ?
        name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "AJ";
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
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

      {/* Stats */}
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

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column - Main Content */}
          <div className={styles.leftColumn}>
            {/* Profile Card */}
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
                        {new Date(user.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
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
                        {user.nationality}
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
                    : <div className={styles.fieldValue}>{user.address}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
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

            {/* Tab Content */}
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
                              }}></div>
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

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            {/* Quick Actions */}
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

            {/* Recent Activity */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiCalendar /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>{activity.icon}</div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityText}>
                        {activity.action}
                      </div>
                      <div className={styles.activityTime}>{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
