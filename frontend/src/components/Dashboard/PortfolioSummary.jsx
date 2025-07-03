// src/components/Dashboard/PortfolioSummary.jsx
import React from 'react';
import { Plus, Minus, TrendingUp } from 'lucide-react';
import styles from './PortfolioSummary.module.css';

const PortfolioSummary = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };
  console.log(data); // in PortfolioSummary
  return (
    <section className={styles.portfolioSection}>
      <h2 className={styles.sectionTitle}>Portfolio Summary</h2>
      <div className={styles.portfolioCard}>
        <div className={styles.metricsGrid}>
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Total Value</p>
            <p className={styles.metricValue}>
              {formatCurrency(data.totalValue)}
            </p>
          </div>
          
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Day Change</p>
            <p className={`${styles.metricValue} ${styles.positive}`}>
              +{formatCurrency(data.dayChange)}
            </p>
            <p className={`${styles.metricSubtext} ${styles.positive}`}>
              (+{data.dayChangePercent}%)
            </p>
          </div>
          
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Cash Balance</p>
            <p className={styles.metricValue}>
              {formatCurrency(data.cashBalance)}
            </p>
          </div>
          
          <div className={styles.metric}>
            <p className={styles.metricLabel}>Positions</p>
            <p className={styles.metricValue}>
              {formatNumber(data.positions)}
            </p>
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={`${styles.actionButton} ${styles.buyButton}`}>
            <Plus className={styles.buttonIcon} />
            Buy Stock
          </button>
          <button className={`${styles.actionButton} ${styles.sellButton}`}>
            <Minus className={styles.buttonIcon} />
            Sell Stock
          </button>
          <button className={`${styles.actionButton} ${styles.viewButton}`}>
            <TrendingUp className={styles.buttonIcon} />
            View Performance
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSummary;