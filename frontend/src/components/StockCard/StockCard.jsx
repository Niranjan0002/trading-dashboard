// 3. StockCard.jsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './StockCard.module.css';

const StockCard = ({ stock }) => {
  const { symbol, name, price, change, changePercent, trend } = stock;
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`${styles.card} ${trend === 'up' ? styles.up : styles.down}`}>
      <div className={styles.header}>
        <h3 className={styles.symbol}>{symbol}</h3>
        <p className={styles.name}>{name}</p>
      </div>
      <div className={styles.priceSection}>
        <p className={styles.price}>${price.toFixed(2)}</p>
        <div className={styles.change}>
          <TrendIcon className={styles.icon} />
          <span>{change.toFixed(2)} ({changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;

