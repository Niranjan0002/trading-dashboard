// 5. MobileMenu.jsx
import React from 'react';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose, children }) => {
  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default MobileMenu;
