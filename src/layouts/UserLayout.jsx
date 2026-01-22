import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserNavbar from "../components/UserNavbar";
import styles from "./UserLayout.module.css";

export default function UserLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <div className={styles.wrapper}>
      <UserNavbar />
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}
