import { Outlet } from "react-router-dom"; 
import { useState, useEffect } from "react";
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  return (
    <div className={`${styles.layout} ${isDarkMode ? styles.dark : ""}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <div className={styles.contentArea}>
        <Sidebar isDarkMode={isDarkMode} />
        
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}