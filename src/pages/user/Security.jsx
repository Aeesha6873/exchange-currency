import React, { useState } from "react";
import styles from "./Security.module.css";
import {
  FiShield,
  FiLock,
  FiKey,
  FiSmartphone,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

function Security() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows 10",
      location: "New York, USA",
      ip: "192.168.1.100",
      lastActive: "2 hours ago",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone 13",
      location: "San Francisco, USA",
      ip: "192.168.1.101",
      lastActive: "1 day ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on MacBook Pro",
      location: "London, UK",
      ip: "192.168.1.102",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Validate and change password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // API call to change password
    console.log("Changing password...");
    alert("Password changed successfully!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      // Generate backup codes
      const codes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substr(2, 8).toUpperCase()
      );
      setBackupCodes(codes);
    } else {
      setBackupCodes([]);
    }
  };

  const handleRevokeSession = (sessionId) => {
    setActiveSessions((sessions) =>
      sessions.filter((session) => session.id !== sessionId)
    );
  };

  const handleRevokeAllSessions = () => {
    if (window.confirm("Are you sure you want to log out from all devices?")) {
      setActiveSessions([activeSessions[0]]); // Keep only current session
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.securityContainer}>
      {/* Hero Section */}
      <div className={styles.securityHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.securityTitle}>
            <FiShield /> Security
          </h1>
          <p className={styles.securitySubtitle}>
            Manage your account security and privacy settings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Password Section */}
            <div className={styles.securitySection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <FiLock /> Change Password
                </h3>
                <div className={styles.passwordStrength}>
                  <span className={styles.strengthLabel}>
                    Password Strength:
                  </span>
                  <span className={styles.strengthValueStrong}>Strong</span>
                </div>
              </div>

              <form
                onSubmit={handleChangePassword}
                className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={styles.passwordToggle}>
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={styles.passwordToggle}>
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <div className={styles.passwordRequirements}>
                    <div
                      className={
                        passwordForm.newPassword.length >= 8
                          ? styles.requirementMet
                          : styles.requirement
                      }>
                      At least 8 characters
                    </div>
                    <div
                      className={
                        /[A-Z]/.test(passwordForm.newPassword)
                          ? styles.requirementMet
                          : styles.requirement
                      }>
                      One uppercase letter
                    </div>
                    <div
                      className={
                        /[0-9]/.test(passwordForm.newPassword)
                          ? styles.requirementMet
                          : styles.requirement
                      }>
                      One number
                    </div>
                    <div
                      className={
                        /[^A-Za-z0-9]/.test(passwordForm.newPassword)
                          ? styles.requirementMet
                          : styles.requirement
                      }>
                      One special character
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Confirm New Password
                  </label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className={styles.formInput}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={styles.passwordToggle}>
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {passwordForm.newPassword && passwordForm.confirmPassword && (
                    <div className={styles.passwordMatch}>
                      {passwordForm.newPassword ===
                      passwordForm.confirmPassword ? (
                        <span className={styles.matchSuccess}>
                          <FiCheck /> Passwords match
                        </span>
                      ) : (
                        <span className={styles.matchError}>
                          <FiX /> Passwords don't match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className={styles.changePasswordButton}>
                  Change Password
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className={styles.securitySection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <FiKey /> Two-Factor Authentication
                </h3>
                <div className={styles.twoFactorStatus}>
                  <span
                    className={
                      twoFactorEnabled
                        ? styles.statusEnabled
                        : styles.statusDisabled
                    }>
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className={styles.twoFactorContent}>
                <div className={styles.twoFactorInfo}>
                  <p>
                    Add an extra layer of security to your account by enabling
                    two-factor authentication. You'll need to enter a
                    verification code from your phone when signing in.
                  </p>
                  <div className={styles.securityBenefit}>
                    <FiCheck /> Protects your account from unauthorized access
                  </div>
                  <div className={styles.securityBenefit}>
                    <FiCheck /> Required for sensitive actions like withdrawals
                  </div>
                  <div className={styles.securityBenefit}>
                    <FiCheck /> Works with authenticator apps like Google
                    Authenticator
                  </div>
                </div>

                <div className={styles.twoFactorToggle}>
                  <div className={styles.toggleLabel}>
                    <span className={styles.toggleTitle}>
                      Two-Factor Authentication
                    </span>
                    <span className={styles.toggleDescription}>
                      {twoFactorEnabled
                        ? "Currently protecting your account"
                        : "Add an extra layer of security"}
                    </span>
                  </div>
                  <label className={styles.toggleSwitchLarge}>
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={handleToggleTwoFactor}
                    />
                    <span className={styles.toggleSliderLarge}></span>
                  </label>
                </div>

                {twoFactorEnabled && backupCodes.length > 0 && (
                  <div className={styles.backupCodes}>
                    <h4 className={styles.backupTitle}>Backup Codes</h4>
                    <p className={styles.backupWarning}>
                      ⚠️ Save these codes in a safe place. Each code can only be
                      used once.
                    </p>
                    <div className={styles.codesGrid}>
                      {backupCodes.map((code, index) => (
                        <div key={index} className={styles.codeItem}>
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={downloadBackupCodes}
                      className={styles.downloadCodesButton}>
                      <FiDownload /> Download Backup Codes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Sessions */}
            <div className={styles.securitySection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <FiSmartphone /> Active Sessions
                </h3>
                <button
                  onClick={handleRevokeAllSessions}
                  className={styles.revokeAllButton}>
                  Log Out All Devices
                </button>
              </div>

              <div className={styles.sessionsList}>
                {activeSessions.map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionDevice}>
                        <div className={styles.deviceIcon}>💻</div>
                        <div>
                          <div className={styles.deviceName}>
                            {session.device}
                          </div>
                          <div className={styles.sessionDetails}>
                            <span className={styles.sessionLocation}>
                              {session.location}
                            </span>
                            <span className={styles.sessionIp}>
                              IP: {session.ip}
                            </span>
                            <span className={styles.sessionTime}>
                              {session.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      {session.current && (
                        <span className={styles.currentSession}>
                          Current Session
                        </span>
                      )}
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className={styles.revokeButton}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Security Tips */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiShield /> Security Tips
              </h3>
              <div className={styles.tipsList}>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Use a unique password for each account
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Enable two-factor authentication
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Review active sessions regularly
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Update passwords every 90 days
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Avoid using public Wi-Fi for sensitive tasks
                  </div>
                </div>
                <div className={styles.tipItem}>
                  <FiCheck className={styles.tipIcon} />
                  <div className={styles.tipContent}>
                    Keep your devices and apps updated
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Security Activity */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiClock /> Recent Activity
              </h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <FiCheckCircle className={styles.activityIcon} />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Password changed successfully
                    </div>
                    <div className={styles.activityTime}>2 hours ago</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <FiSmartphone className={styles.activityIcon} />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      New device login detected
                    </div>
                    <div className={styles.activityTime}>1 day ago</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <FiKey className={styles.activityIcon} />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Two-factor authentication enabled
                    </div>
                    <div className={styles.activityTime}>3 days ago</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <FiShield className={styles.activityIcon} />
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>
                      Security settings updated
                    </div>
                    <div className={styles.activityTime}>1 week ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FiShield /> Quick Actions
              </h3>
              <div className={styles.quickActions}>
                <button className={styles.quickAction}>
                  <FiDownload className={styles.quickActionIcon} />
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>
                      Export Security Logs
                    </div>
                    <div className={styles.quickActionDescription}>
                      Download your security activity history
                    </div>
                  </div>
                </button>
                <button className={styles.quickAction}>
                  <FiSmartphone className={styles.quickActionIcon} />
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>
                      Device Management
                    </div>
                    <div className={styles.quickActionDescription}>
                      Manage trusted devices
                    </div>
                  </div>
                </button>
                <button className={styles.quickAction}>
                  <FiKey className={styles.quickActionIcon} />
                  <div className={styles.quickActionContent}>
                    <div className={styles.quickActionTitle}>
                      Recovery Options
                    </div>
                    <div className={styles.quickActionDescription}>
                      Set up account recovery methods
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
