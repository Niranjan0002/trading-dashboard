// src/components/Dashboard/MarketOverview.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './MarketOverview.module.css';

const MarketOverview = ({ indices }) => {
  console.log(indices); // in MarketOverview
  return (
    <section className={styles.marketSection}>
      <h2 className={styles.sectionTitle}>Market Overview</h2>
      <div className={styles.indicesGrid}>
        {indices.map((index) => (
          <div key={index.name} className={styles.indexCard}>
            <div className={styles.cardHeader}>
              <div className={styles.indexInfo}>
                <p className={styles.indexName}>{index.name}</p>
                <p className={styles.indexValue}>{index.value}</p>
              </div>
              <div className={`${styles.trendIcon} ${styles[index.trend]}`}>
                {index.trend === 'up' ? 
                  <TrendingUp className={styles.icon} /> : 
                  <TrendingDown className={styles.icon} />
                }
              </div>
            </div>
            <div className={styles.changeInfo}>
              <span className={`${styles.changeValue} ${styles[index.trend]}`}>
                {index.change}
              </span>
              <span className={`${styles.changePercent} ${styles[index.trend]}`}>
                ({index.changePercent})
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketOverview;