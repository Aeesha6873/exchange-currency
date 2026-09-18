import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const { isAdmin, user, userRole, isLoading } = useAdminAuth();

  // Desktop collapse state (unchanged)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 👇 New: mobile drawer open/close state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 👇 isMobile now lives here and is passed to both navbar & sidebar
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1025 : false,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1025;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false); // close drawer when resizing up
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

  // Unified toggle — mobile opens the drawer, desktop collapses the rail
  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((v) => !v);
    } else {
      setIsSidebarCollapsed((v) => !v);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        userRole={userRole}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggle={setIsSidebarCollapsed}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`${styles.mainContent} ${
          isSidebarCollapsed && !isMobile ? styles.sidebarCollapsed : ""
        } ${isMobile ? styles.mobile : ""}`}>
        <AdminNavbar
          user={user}
          isMobile={isMobile}
          isSidebarOpen={isMobileOpen}
          onToggleSidebar={handleToggleSidebar}
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
