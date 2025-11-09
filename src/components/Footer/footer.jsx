import React from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <p> © {new Date().getFullYear()} - Flores & Códigos</p> 
        <p>🌱 Cultivando ideias com carinho.</p>
      </div>

      <div className={styles.social}>
        <span>Nossas redes sociais:</span>
        <div className={styles.icons}>
          <a href="#" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href="#" aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="#" aria-label="Youtube">
            <Youtube size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
