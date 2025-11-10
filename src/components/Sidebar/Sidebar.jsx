import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";

export default function Sidebar({ isDarkMode }) {
  return (
    <aside className={`${styles.sidebar} ${isDarkMode ? styles.dark : ""}`}>
      <h3 className={styles.title}>Navegação</h3>

      <nav className={styles.menu}>
        <Link to="/" className={styles.link}>Todos os Posts</Link>
        <Link to="/create-post" className={styles.newPostButton}>+ Novo Post</Link>
        <Link to="/profile" className={styles.link}>Meu Perfil</Link>
      </nav>
    </aside>
  );
}
