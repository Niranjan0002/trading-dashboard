// 9. Button.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, disabled = false, variant = 'primary' }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;