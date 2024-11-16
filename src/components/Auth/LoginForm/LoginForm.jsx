import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { validationForLoginForm } from "../../../utils/validationForm";
import { login } from "../../../services/auth";
import toast, { Toaster } from "react-hot-toast";
import viewIcon from "../../../assets/viewicon.png";
import hideIcon from "../../../assets/hideicon.png";
import emailIcon from "../../../assets/emailicon.png";
import lockIcon from "../../../assets/lockicon.png";

function LoginForm() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to the main page if token exists
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors } = validationForLoginForm(Email, Password);
    if (!valid) {
      setErrorMessages(errors);
      return;
    }
    setErrorMessages({ email: "", password: "" });
    try {
      const res = await login({ email: Email, password: Password });
      console.log("res", res);
      if (res.status === 200) {
        toast.success("Logged in successfully");
        const token = res.data.token;
        localStorage.setItem("token", token);
        navigate("/board");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      const errorMessage =
        error.response?.status === 400
          ? "Invalid email or password"
          : "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <div className={styles.title}>Login</div>

      {/* Email Input */}
      <div className={styles.inputContainer}>
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
          <img
            src={lockIcon}
            alt="Password Icon"
            className={styles.inputIcon}
          />
          <input
            type={showPassword ? "text" : "password"}
            className={styles.inputField}
            placeholder="Password"
            value={Password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessages({ ...errorMessages, password: "" });
            }}
          />
          <img
            src={showPassword ? hideIcon : viewIcon}
            alt={showPassword ? "Hide Icon" : "View Icon"}
            className={styles.inputIcon}
            style={{ right: "10px", left: "auto", cursor: "pointer" }}
            onClick={togglePasswordVisibility}
          />
        </div>
      </div>

      {/* Login Button */}
      <div className={styles.buttonWrapper}>
        <button className={styles.loginButton} onClick={handleSubmit}>
          Log in
        </button>
      </div>

      {/* Register Option */}
      <div className={styles.registerWrapper}>
        <span className={styles.registerText}>Have no account yet?</span>
      </div>
    </div>
  );
}

export default LoginForm;
