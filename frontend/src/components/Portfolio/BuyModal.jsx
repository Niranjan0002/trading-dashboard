// src/components/Portfolio/BuyModal.jsx
import React, { useState } from 'react';
import styles from './BuyModal.module.css';
import Button from '../Common/Button';
import Card from '../Common/Card';

const BuyModal = ({ isOpen, onClose, onSubmit }) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !quantity) return;

    const formData = {
      symbol: symbol.toUpperCase(),
      quantity: parseFloat(quantity)
    };

    onSubmit(formData);
    setSymbol('');
    setQuantity('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <Card className={styles.modalCard}>
        <h3 className={styles.modalTitle}>Buy Stock</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <Button type="submit">Confirm Buy</Button>
            <Button onClick={onClose} variant="secondary">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BuyModal;
