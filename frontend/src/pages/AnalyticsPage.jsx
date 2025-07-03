// src/pages/AnalyticsPage.jsx
import React from 'react';
import styles from './AnalyticsPage.module.css';
import Card from '../components/Common/Card';

const AnalyticsPage = () => {
  return (
    <div className={styles.analyticsPage}>
      <h2 className={styles.title}>Portfolio Analytics</h2>

      <div className={styles.grid}>
        <Card className={styles.chartCard}>
          <h3>Portfolio Performance (Line Chart)</h3>
          <div className={styles.chartPlaceholder}>[Line Chart]</div>
        </Card>

        <Card className={styles.chartCard}>
          <h3>Asset Allocation</h3>
          <div className={styles.chartPlaceholder}>[Pie Chart]</div>
        </Card>

        <Card className={styles.statsCard}>
          <h3>Risk Metrics</h3>
          <ul>
            <li>Sharpe Ratio: 1.25</li>
            <li>Max Drawdown: -8.3%</li>
            <li>Beta: 0.95</li>
          </ul>
        </Card>

        <Card className={styles.chartCard}>
          <h3>Profit/Loss Distribution</h3>
          <div className={styles.chartPlaceholder}>[Histogram]</div>
        </Card>

        <Card className={styles.chartCard}>
          <h3>Top 5 Holdings</h3>
          <div className={styles.chartPlaceholder}>[Bar Chart]</div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;