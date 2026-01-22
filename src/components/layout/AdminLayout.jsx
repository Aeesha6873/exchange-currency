// components/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      <main
        className={`${styles.mainContent} ${
          isSidebarCollapsed ? styles.expanded : ""
        }`}>
        <AdminHeader
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
