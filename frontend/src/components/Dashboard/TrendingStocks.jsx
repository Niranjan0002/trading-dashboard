// 1. TrendingStocks.jsx
import React from 'react';
import StockCard from '../StockCard/StockCard';
import styles from './TrendingStocks.module.css';

const TrendingStocks = ({ stocks }) => {
  console.log(stocks); // in TrendingStocks
  return (
    <section className={styles.trendingSection}>
      <h2 className={styles.title}>Trending Stocks</h2>
      <div className={styles.grid}>
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </section>
  );
};

export default TrendingStocks;