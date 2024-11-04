import React, { useState, useEffect } from "react";
import "@vscode/codicons/dist/codicon.css"; // Import Codicons CSS
import styles from "./settings.module.css";
import Sidebar from "../Sidebar/sidebar";
import userIcon from "../../../assets/usericon.png";
import emailIcon from "../../../assets/emailicon.png";
import passwordIcon from "../../../assets/lockicon.png";
import viewIcon from "../../../assets/viewicon.png";
import hideIcon from "../../../assets/hideicon.png";
import { fetchUserDetails, updateUser } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const Settings = () => {
  const [username, setUsername] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [userid, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUserDetailsFromApi = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userDetails = await fetchUserDetails(token);
          const { userid, username, email } = userDetails;
          setUserId(userid);
          setCurrentUsername(username); // Set the original username
          setCurrentEmail(email); // Set the original email
          setUsername(username); // Set editable username
          setUpdateEmail(email); // Set editable email
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.error("Token is null");
      }
    };

    fetchUserDetailsFromApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare userData based on fields filled for update
    const userData = { userid };
    if (username && username !== currentUsername) userData.username = username;
    if (updateEmail && updateEmail !== currentEmail)
      userData.updateEmail = updateEmail;
    if (oldPassword && newPassword) {
      userData.oldPassword = oldPassword;
      userData.newPassword = newPassword;
    }

    // Determine fields to update, allowing both password fields together
    const fieldsToUpdate = Object.keys(userData).filter(
      (key) => key !== "userid"
    );
    const isPasswordUpdate = oldPassword && newPassword;
    if (fieldsToUpdate.length > 1 && !isPasswordUpdate) {
      toast.error("Please update only one field at a time.", {
        position: "bottom-right",
      });
      return;
    }

    console.log("Final userData to submit:", userData);

    try {
      await updateUser(userData);
      setOldPassword("");
      setNewPassword("");
      toast.success("User information updated successfully", {
        position: "bottom-right",
      });
      // Redirect if necessary
      navigate("/");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user", {
        position: "bottom-right",
      });
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.subHeader}>
          <div className={styles.SettingsTitle}>Settings</div>
        </div>
        <div className={styles.updateFormContainer}>
          {/* Username Input */}
          <div className={styles.inputWrapper}>
            <img src={userIcon} alt="User Icon" className={styles.inputImage} />
            <input
              type="text"
              className={styles.inputField}
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className={styles.inputWrapper}>
            <img
              src={emailIcon}
              alt="Email Icon"
              className={styles.inputImage}
            />
            <input
              type="email"
              className={styles.inputField}
              placeholder="Update Email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
            />
          </div>

          {/* Old Password Input */}
          <div>
            {/* Old Password Input */}
            <div className={styles.inputWrapper}>
              <img
                src={passwordIcon}
                alt="Password Icon"
                className={styles.inputImage}
              />
              <input
                type={showOldPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <img
                src={showOldPassword ? hideIcon : viewIcon}
                alt={showOldPassword ? "Hide Icon" : "View Icon"}
                className={styles.inputImage}
                style={{ right: "10px", left: "auto", cursor: "pointer" }}
                onClick={toggleOldPasswordVisibility}
              />
            </div>

            {/* New Password Input */}
            <div className={styles.inputWrapper}>
              <img
                src={passwordIcon}
                alt="Password Icon"
                className={styles.inputImage}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <img
                src={showNewPassword ? hideIcon : viewIcon}
                alt={showNewPassword ? "Hide Icon" : "View Icon"}
                className={styles.inputImage}
                style={{ right: "10px", left: "auto", cursor: "pointer" }}
                onClick={toggleNewPasswordVisibility}
              />
            </div>
          </div>
          {/* Update Button */}
          <div className={styles.buttonWrapper}>
            <button className={styles.updateButton} onClick={handleSubmit}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
