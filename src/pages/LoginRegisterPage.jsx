import React, { useState } from "react";
import styles from "./LoginRegisterPage.module.css";
import Art from "../assets/Art.png";
import LoginForm from "../components/Auth/LoginForm/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm/RegisterForm";

function RegisterPage() {
  const [showLogin, setShowLogin] = useState(true); 

  const handleShowRegister = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true); 
  };

  return (
    <div className={styles.container}>
      {/* Left Side */}
      <div className={styles.leftSide}>
        <div className={styles.centeredElement}>
          <img src={Art} alt="Spaceman" className={styles.image} />
        </div>
        <div className={styles.TextWrapper}>
        <div className={styles.welcomeMessage}>Welcome aboard my friend</div>
        <div className={styles.welcomeSubMessage}>
          just a couple of clicks and we start
        </div>
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
