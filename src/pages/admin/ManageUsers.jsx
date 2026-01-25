import React, { useState } from "react";
import {
  FiUser,
  FiLock,
  FiMail,
  FiBell,
  FiShield,
  FiDownload,
  FiSave,
  FiRefreshCw,
  FiKey,
  FiUsers,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiCheck,
  FiX,
  FiSettings,
  FiUpload,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import styles from "./ManageUsers.module.css";

const ManageUsers = () => {
  const [activeSection, setActiveSection] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // User data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@travel.com",
      role: "user",
      status: "active",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@travel.com",
      role: "admin",
      status: "active",
      lastActive: "Today",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david@flight.com",
      role: "user",
      status: "pending",
      lastActive: "Yesterday",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah@travel.com",
      role: "vip",
      status: "active",
      lastActive: "Today",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@exchange.com",
      role: "user",
      status: "inactive",
      lastActive: "1 week ago",
    },
  ]);

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    allowNewRegistrations: true,
    requireEmailVerification: true,
    requireAdminApproval: false,
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordStrength: "medium",
    maxLoginAttempts: "5",
    autoLockoutDuration: "30",
    profileVisibility: "public",
    deleteInactiveAccounts: "90",
    defaultUserRole: "user",
  });

  // Role management
  const [roles, setRoles] = useState([
    { id: "admin", name: "Administrator", permissions: ["all"], userCount: 1 },
    {
      id: "vip",
      name: "VIP User",
      permissions: ["premium_access", "priority_support"],
      userCount: 1,
    },
    {
      id: "user",
      name: "Regular User",
      permissions: ["basic_access"],
      userCount: 3,
    },
    { id: "viewer", name: "Viewer", permissions: ["read_only"], userCount: 0 },
  ]);

  const [newRole, setNewRole] = useState({ name: "", permissions: [] });

  // Filtered users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handlers
  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ?
        prev.filter((id) => id !== userId)
      : [...prev, userId],
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleDeleteUsers = () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Delete ${selectedUsers.length} selected user(s)?`)) {
      setUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.id)),
      );
      setSelectedUsers([]);
    }
  };

  const handleChangeUserRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
  };

  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ?
          { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user,
      ),
    );
  };

  const handleAddRole = () => {
    if (!newRole.name.trim()) return;
    const roleId = newRole.name.toLowerCase().replace(/\s+/g, "_");
    setRoles((prev) => [
      ...prev,
      {
        id: roleId,
        name: newRole.name,
        permissions: newRole.permissions,
        userCount: 0,
      },
    ]);
    setNewRole({ name: "", permissions: [] });
  };

  const handleDeleteRole = (roleId) => {
    if (roles.find((r) => r.id === roleId).userCount > 0) {
      alert("Cannot delete role with assigned users");
      return;
    }
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
  };

  const handleSettingChange = (setting, value) => {
    setSystemSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log("Saving settings:", systemSettings);
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (window.confirm("Reset all settings to default?")) {
      setSystemSettings({
        allowNewRegistrations: true,
        requireEmailVerification: true,
        requireAdminApproval: false,
        twoFactorAuth: false,
        sessionTimeout: "30",
        passwordStrength: "medium",
        maxLoginAttempts: "5",
        autoLockoutDuration: "30",
        profileVisibility: "public",
        deleteInactiveAccounts: "90",
        defaultUserRole: "user",
      });
    }
  };

  const handleExportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "users_export.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={styles.manageUsers}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <div className={styles.titleIcon}>
              <FiUsers />
            </div>
            User Management
          </h1>
          <p className={styles.subtitle}>
            Manage users, roles, and system settings
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navigationTabs}>
        <button
          className={`${styles.tab} ${activeSection === "users" ? styles.active : ""}`}
          onClick={() => setActiveSection("users")}>
          <FiUsers /> Users ({users.length})
        </button>
        <button
          className={`${styles.tab} ${activeSection === "roles" ? styles.active : ""}`}
          onClick={() => setActiveSection("roles")}>
          <FiKey /> Roles & Permissions
        </button>
        <button
          className={`${styles.tab} ${activeSection === "settings" ? styles.active : ""}`}
          onClick={() => setActiveSection("settings")}>
          <FiSettings /> System Settings
        </button>
      </div>

      {/* Users Management Section */}
      {activeSection === "users" && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.sectionActions}>
              {selectedUsers.length > 0 && (
                <button
                  className={styles.dangerBtn}
                  onClick={handleDeleteUsers}>
                  <FiTrash2 /> Delete ({selectedUsers.length})
                </button>
              )}
              <button
                className={styles.secondaryBtn}
                onClick={handleExportUsers}>
                <FiDownload /> Export
              </button>
              <button className={styles.primaryBtn}>
                <FiUser /> Add User
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {user.name.charAt(0)}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleChangeUserRole(user.id, e.target.value)
                        }
                        className={styles.roleSelect}>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.lastActive}>{user.lastActive}</div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionBtn} ${user.status === "active" ? styles.warning : styles.success}`}
                          onClick={() => handleToggleUserStatus(user.id)}
                          title={
                            user.status === "active" ? "Deactivate" : "Activate"
                          }>
                          {user.status === "active" ?
                            <FiX />
                          : <FiCheck />}
                        </button>
                        <button className={styles.actionBtn} title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className={styles.actionBtn} title="View">
                          <FiEye />
                        </button>
                        <button className={styles.actionBtn} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={styles.emptyState}>
              <FiUsers className={styles.emptyIcon} />
              <h3>No users found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}

      {/* Roles & Permissions Section */}
      {activeSection === "roles" && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Roles & Permissions</h2>
            <div className={styles.sectionActions}>
              <button className={styles.primaryBtn} onClick={handleAddRole}>
                + Add New Role
              </button>
            </div>
          </div>

          <div className={styles.rolesGrid}>
            {roles.map((role) => (
              <div key={role.id} className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <h3 className={styles.roleName}>{role.name}</h3>
                  <span className={styles.userCount}>
                    {role.userCount} users
                  </span>
                </div>
                <div className={styles.permissions}>
                  {role.permissions.map((perm, index) => (
                    <span key={index} className={styles.permissionBadge}>
                      {perm}
                    </span>
                  ))}
                </div>
                <div className={styles.roleActions}>
                  <button className={styles.secondaryBtn}>
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    className={styles.dangerBtn}
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={role.userCount > 0}>
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addRoleSection}>
            <h3 className={styles.sectionTitle}>Add New Role</h3>
            <div className={styles.addRoleForm}>
              <input
                type="text"
                placeholder="Role name"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className={styles.input}
              />
              <button className={styles.primaryBtn} onClick={handleAddRole}>
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings Section */}
      {activeSection === "settings" && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>System Settings</h2>
            <div className={styles.sectionActions}>
              <button
                className={styles.secondaryBtn}
                onClick={handleResetSettings}>
                <FiRefreshCw /> Reset to Default
              </button>
              <button
                className={styles.primaryBtn}
                onClick={handleSaveSettings}>
                <FiSave /> Save Settings
              </button>
            </div>
          </div>

          <div className={styles.settingsGrid}>
            {/* Registration Settings */}
            <div className={styles.settingsGroup}>
              <h3 className={styles.settingsTitle}>Registration Settings</h3>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>
                  Allow New Registrations
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={systemSettings.allowNewRegistrations}
                    onChange={(e) =>
                      handleSettingChange(
                        "allowNewRegistrations",
                        e.target.checked,
                      )
                    }
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>
                  Require Email Verification
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={systemSettings.requireEmailVerification}
                    onChange={(e) =>
                      handleSettingChange(
                        "requireEmailVerification",
                        e.target.checked,
                      )
                    }
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>Default User Role</div>
                <select
                  value={systemSettings.defaultUserRole}
                  onChange={(e) =>
                    handleSettingChange("defaultUserRole", e.target.value)
                  }
                  className={styles.select}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Security Settings */}
            <div className={styles.settingsGroup}>
              <h3 className={styles.settingsTitle}>Security Settings</h3>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>
                  Two-Factor Authentication
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={systemSettings.twoFactorAuth}
                    onChange={(e) =>
                      handleSettingChange("twoFactorAuth", e.target.checked)
                    }
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>
                  Session Timeout (minutes)
                </div>
                <input
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange("sessionTimeout", e.target.value)
                  }
                  className={styles.numberInput}
                  min="5"
                  max="1440"
                />
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>Max Login Attempts</div>
                <input
                  type="number"
                  value={systemSettings.maxLoginAttempts}
                  onChange={(e) =>
                    handleSettingChange("maxLoginAttempts", e.target.value)
                  }
                  className={styles.numberInput}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            {/* Account Management */}
            <div className={styles.settingsGroup}>
              <h3 className={styles.settingsTitle}>Account Management</h3>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>
                  Delete Inactive Accounts (days)
                </div>
                <input
                  type="number"
                  value={systemSettings.deleteInactiveAccounts}
                  onChange={(e) =>
                    handleSettingChange(
                      "deleteInactiveAccounts",
                      e.target.value,
                    )
                  }
                  className={styles.numberInput}
                  min="30"
                  max="365"
                />
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>Password Strength</div>
                <select
                  value={systemSettings.passwordStrength}
                  onChange={(e) =>
                    handleSettingChange("passwordStrength", e.target.value)
                  }
                  className={styles.select}>
                  <option value="low">Low (6+ characters)</option>
                  <option value="medium">
                    Medium (8+ with letters & numbers)
                  </option>
                  <option value="high">High (12+ with special chars)</option>
                </select>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className={styles.settingsGroup}>
              <h3 className={styles.settingsTitle}>Privacy Settings</h3>
              <div className={styles.settingRow}>
                <div className={styles.settingLabel}>Profile Visibility</div>
                <select
                  value={systemSettings.profileVisibility}
                  onChange={(e) =>
                    handleSettingChange("profileVisibility", e.target.value)
                  }
                  className={styles.select}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
