import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const { isAdmin, user, userRole, isLoading } = useAdminAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/login");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    navigate("/login");
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

      {/* Main content area with proper spacing */}
      <div
        className={`${styles.mainContent} ${
          isSidebarCollapsed && !isMobile ? styles.sidebarCollapsed : ""
        } ${isMobile ? styles.mobile : ""}`}>
        <AdminNavbar
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <div className={styles.contentWrapper}>
          <div className={styles.contentArea}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
