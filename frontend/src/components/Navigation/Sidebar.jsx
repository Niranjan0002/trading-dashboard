// Sidebar.jsx
import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, Settings, PieChart } from 'lucide-react';
import styles from './Sidebar.module.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/' },
    { name: 'Portfolio', icon: PieChart, path: '/portfolio' },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { name: 'Alerts', icon: AlertCircle, path: '/alerts' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];


  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarContent}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>TradeDesk Pro</h1>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              className={`${styles.navItem} ${location.pathname === path ? styles.active : ''}`}
              onClick={onClose}
            >
              <Icon className={styles.navIcon} />
              <span className={styles.navText}>{name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;