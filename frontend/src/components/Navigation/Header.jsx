// src/components/Navigation/Header.jsx
import React from 'react';
import { Menu, Bell, User, Search, RefreshCw } from 'lucide-react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  onToggleSidebar, 
  onToggleTheme, 
  onRefresh, 
  loading, 
  darkMode 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <button 
            onClick={onToggleSidebar} 
            className={`${styles.menuButton} ${styles.mobileOnly}`}
            aria-label="Toggle sidebar"
          >
            <Menu className={styles.icon} />
          </button>
          
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search stocks..."
              className={styles.searchInput}
            />
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <button 
            onClick={onRefresh} 
            disabled={loading} 
            className={styles.iconButton}
            aria-label="Refresh data"
          >
            <RefreshCw className={`${styles.icon} ${loading ? styles.spinning : ''}`} />
          </button>
          
          <button 
            className={styles.iconButton}
            aria-label="View notifications"
          >
            <Bell className={styles.icon} />
          </button>
          
          <button 
            onClick={onToggleTheme} 
            className={styles.themeToggle}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
          
          <button 
            className={styles.iconButton}
            aria-label="User profile"
          >
            <User className={styles.icon} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;