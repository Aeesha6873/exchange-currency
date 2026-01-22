// layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const { isAdmin, user, userRole } = useAdminAuth();

  if (!isAdmin) {
    return null; // The hook will redirect automatically
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />
      <div className={styles.mainContent}>
        <AdminNavbar user={user} />
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
