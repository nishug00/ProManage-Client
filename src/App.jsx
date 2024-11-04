import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { ToastContainer } from "react-toastify"; // Import ToastContainer
// import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import RegisterPage from "./pages/LoginRegisterPage";
import Board from "./components/Dashboard/Board/board";
import Analytics from "./components/Dashboard/Analytics/analytics";
import Settings from "./components/Dashboard/Settings/settings";
import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/board" element={<Board />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <Toaster
        position="bottom-right" // Position of the toast
        reverseOrder={false} // Order of toasts
        gutter={8} // Space between toasts
        toastOptions={{
          // Default options for all toasts
          duration: 2000, // Duration in milliseconds
          style: {
            background: "#fff",
            color: "#000",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
