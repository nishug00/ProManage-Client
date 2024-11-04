import React, { useState } from "react";
import styles from "./sidebar.module.css";
import codesandbox from "../../../assets/codesandbox.png";
import layoutIcon from "../../../assets/layouticon.png";
import databaseIcon from "../../../assets/databaseicon.png";
import settingsIcon from "../../../assets/settingsicon.png";
import logoutIcon from "../../../assets/logouticon.png";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleLogout = () => {
    setConfirmationModalOpen(true);
  };
  const handleCancel = () => {
    setConfirmationModalOpen(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarGroup}>
        <img src={codesandbox} alt="logo" className={styles.icon} />
        <div className={styles.sidebarTitle}>Pro Manage</div>
      </div>

      <div className={styles.sidebarGroup}>
        <div
          className={`${styles.sidebarOption} ${styles.boardOption}`}
          onClick={() => navigate("/board")}
        >
          <img src={layoutIcon} alt="board" className={styles.icon} />
          Board
        </div>
      </div>

      <div className={styles.sidebarGroup}>
        <div
          className={`${styles.sidebarOption} ${styles.analyticsOption}`}
          onClick={() => navigate("/analytics")}
        >
          <img src={databaseIcon} alt="analytics" className={styles.icon} />
          Analytics
        </div>
      </div>

      <div className={styles.sidebarGroup}>
        <div
          className={`${styles.sidebarOption} ${styles.settingsOption}`}
          onClick={() => navigate("/settings")}
        >
          <img src={settingsIcon} alt="settings" className={styles.icon} />
          Settings
        </div>
      </div>

      <div
        className={`${styles.sidebarOption} ${styles.logoutOption}`}
        onClick={handleLogout}
      >
        <img src={logoutIcon} alt="logout" className={styles.icon} />
        Log out
      </div>
      {isConfirmationModalOpen && (
        <>
          <div className={styles.overlay}></div>
          <div className={styles.confirmationModal}>
            <p className={styles.confirmationContent}>
              Are you sure you want to Logout?
            </p>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => navigate("/")}
                className={styles.confirmButton}
              >
                Yes, Logout
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
