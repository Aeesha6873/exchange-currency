import { Outlet } from "react-router-dom";
import UserSidebar from "../user/UserSidebar/UserSidebar";
import UserNavbar from "../user/UserNavbar/UserNavbar";
import styles from "./UserLayout.module.css";

const UserLayout = ({ onLogout, userData }) => {
  return (
    <div className={styles.userLayout}>
      <UserSidebar />
      <div className={styles.mainContent}>
        <UserNavbar userData={userData} onLogout={onLogout} />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
