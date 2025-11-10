/*import { useState } from 'react';*/
import { Link } from 'react-router-dom';
import styles from './header.module.css';

const Header = ({ /*onSearch,*/ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  /*const [searchTerm,*/ /*setSearchTerm] = useState('');*/

  // Verificar se o usuário está logado
  const isLoggedIn = localStorage.getItem('user');
  const userName = isLoggedIn ? JSON.parse(isLoggedIn).name : null;

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (onSearch) {
  //     onSearch(searchTerm);
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.headerContent}>
        {/* Menu hamburger para mobile */}
        <button 
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span>Blog</span>
        </Link>

        {/* Barra de pesquisa
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Pesquisar posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </form> */}

        {/* Actions */}
        <div className={styles.actions}>
          {/* Toggle Dark Mode */}
          <button 
            className={styles.darkModeToggle}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              // Ícone Sol
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              // Ícone Lua
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Se Usuário logado */}
          {isLoggedIn ? (
            <div className={styles.userSection}>
              <div className={styles.userAvatar}>
                {userName?.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>{userName}</span>
              <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton} id='btnLogin'>Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
