import React, { useState } from "react";
import styles from "./LoginRegisterPage.module.css";
import Art from "../assets/Art.png";
import LoginForm from "../components/Auth/LoginForm/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm/RegisterForm";

function RegisterPage() {
  const [showLogin, setShowLogin] = useState(true); // State to toggle between forms

  const handleShowRegister = () => {
    setShowLogin(false); // Show RegisterForm
  };

  const handleShowLogin = () => {
    setShowLogin(true); // Show LoginForm
  };

  return (
    <div className={styles.container}>
      {/* Left Side */}
      <div className={styles.leftSide}>
        <div className={styles.centeredElement}>
          <img src={Art} alt="Spaceman" className={styles.image} />
        </div>
        <div className={styles.welcomeMessage}>Welcome aboard my friend</div>
        <div className={styles.welcomeSubMessage}>
          Just a couple of clicks and we start
        </div>
      </div>

      {/* Right Side */}
      <div className={styles.rightSide}>
        {showLogin ? (
          <div>
            <LoginForm />
            <button
              className={styles.registerButton}
              onClick={handleShowRegister}
            >
              Register
            </button>
          </div>
        ) : (
          <div>
            <RegisterForm />
            <button className={styles.loginButton} onClick={handleShowLogin}>
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
