import React, { useState, useContext } from "react";
import styles from "./RegisterForm.module.css";
import { validationForRegisterForm } from "../../../utils/validationForm";
import { AppContext } from "../../../context/AppContext";
import { registerUser } from "../../../services/auth";
// import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import viewIcon from "../../../assets/viewicon.png";
import hideIcon from "../../../assets/hideicon.png";
import emailIcon from "../../../assets/emailicon.png";
import lockIcon from "../../../assets/lockicon.png";
import userIcon from "../../../assets/usericon.png";

function RegisterForm() {
  const { setUser } = useContext(AppContext);
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submission started");

    // Perform client-side validation
    const { valid, errorMessages } = validationForRegisterForm(
      Username,
      Email,
      Password,
      ConfirmPassword
    );
    console.log("Validation result:", { valid, errorMessages });
    setErrorMessages(errorMessages);

    if (valid) {
      console.log("Validation passed. Attempting to register user...");
      try {
        const response = await registerUser({
          username: Username,
          email: Email,
          password: Password,
          confirmPassword: ConfirmPassword,
        });
        toast.success("User registered successfully!");

        // Wait for 2 seconds before reloading
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } else {
      console.log("Validation failed. Errors:", errorMessages);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className={styles.registerFormContainer}>
      <div className={styles.title}>Register</div>
      <div className={styles.inputContainer}>
        {/* Username Input */}
        <div className={styles.inputWrapper}>
          <img src={userIcon} alt="User Icon" className={styles.inputIcon} />
          <input
            type="text"
            className={styles.inputField}
            placeholder="Name"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div className={styles.inputWrapper}>
          <img src={emailIcon} alt="Email Icon" className={styles.inputIcon} />
          <input
            type="email"
            className={styles.inputField}
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className={styles.inputWrapper}>
          <img src={lockIcon} alt="Lock Icon" className={styles.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            className={styles.inputField}
            placeholder="Password"
            value={Password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessages({ ...errorMessages, password: "" }); // Reset error if any
            }}
          />
          <img
            src={showPassword ? hideIcon : viewIcon}
            alt={showPassword ? "Hide Icon" : "View Icon"}
            className={styles.inputIcon}
            style={{ right: "10px", left: "auto", cursor: "pointer" }}
            onClick={togglePasswordVisibility}
          />
          {errorMessages.password && (
            <div style={{ color: "red" }}>{errorMessages.password}</div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className={styles.inputWrapper}>
          <img src={lockIcon} alt="Lock Icon" className={styles.inputIcon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={styles.inputField}
            placeholder="Confirm Password"
            value={ConfirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessages({ ...errorMessages, confirmpassword: "" }); // Reset error if any
            }}
          />
          <img
            src={showConfirmPassword ? hideIcon : viewIcon}
            alt={showConfirmPassword ? "Hide Icon" : "View Icon"}
            className={styles.inputIcon}
            style={{ right: "10px", left: "auto", cursor: "pointer" }}
            onClick={toggleConfirmPasswordVisibility}
          />
          {errorMessages.confirmpassword && (
            <div style={{ color: "red" }}>{errorMessages.confirmpassword}</div>
          )}
        </div>
      </div>
      {/* Register Button */}
      <div className={styles.buttonWrapper}>
        <button className={styles.registerButton} onClick={handleSubmit}>
          Register
        </button>
      </div>

      {/* Login Option */}
      <div className={styles.loginWrapper}>
        <span className={styles.loginText}>Have an account?</span>
      </div>
    </div>
  );
}

export default RegisterForm;
