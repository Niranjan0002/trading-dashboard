// src/pages/AlertsPage.jsx
import React, { useState } from 'react';
import styles from './AlertsPage.module.css';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

const mockAlerts = [
  { id: 1, symbol: 'AAPL', condition: 'Above $160', active: true },
  { id: 2, symbol: 'TSLA', condition: 'Below $600', active: false }
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState(mockAlerts);

  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className={styles.alertsPage}>
      <h2 className={styles.title}>Alerts</h2>

      <div className={styles.actions}>
        <Button onClick={() => alert('Open Add Alert Modal')}>Add Alert</Button>
      </div>

      <div className={styles.alertList}>
        {alerts.map(alert => (
          <Card key={alert.id} className={styles.alertCard}>
            <div className={styles.alertContent}>
              <p><strong>{alert.symbol}</strong> - {alert.condition}</p>
              <Button
                onClick={() => toggleAlert(alert.id)}
                variant={alert.active ? 'primary' : 'secondary'}
              >
                {alert.active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
