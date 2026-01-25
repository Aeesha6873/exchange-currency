import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const { isAdmin, user, userRole } = useAdminAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        userRole={userRole}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div
        className={`${styles.mainContent} ${
          isSidebarCollapsed ? styles.sidebarCollapsed : ""
        }`}>
        <AdminNavbar
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
