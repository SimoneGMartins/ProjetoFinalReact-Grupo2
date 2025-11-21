import { Outlet } from "react-router-dom"; 
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";


export default function MainLayout({ isDarkMode, toggleDarkMode }) {

  
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