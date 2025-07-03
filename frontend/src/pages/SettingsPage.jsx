// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import styles from './SettingsPage.module.css';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const toggleNotifications = () => setNotifications(!notifications);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={styles.settingsPage}>
      <h2 className={styles.title}>Settings</h2>

      <div className={styles.section}>
        <Card>
          <h3>Theme</h3>
          <Button onClick={toggleTheme}>
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </Card>

        <Card>
          <h3>Notifications</h3>
          <Button onClick={toggleNotifications}>
            {notifications ? 'Disable' : 'Enable'} Notifications
          </Button>
        </Card>

        <Card>
          <h3>Account Info</h3>
          <p>Name: Niranjan</p>
          <p>Email: niranjan@example.com</p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
