// src/components/Dashboard/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Navigation/Header';
import Sidebar from '../Navigation/Sidebar';
import MarketOverview from './MarketOverview';
import PortfolioSummary from './PortfolioSummary';
import TrendingStocks from './TrendingStocks';
import styles from './DashboardLayout.module.css';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <div className={styles.mainContent}>
        <Header 
          onToggleSidebar={toggleSidebar}
          onToggleTheme={toggleTheme}
          onRefresh={handleRefresh}
          loading={loading}
          darkMode={darkMode}
        />

        <main className={styles.dashboardMain}>
          {location.pathname === '/' ? (
            <>
              {/* Market Overview */}
              <MarketOverview indices={[
                { name: 'S&P 500', value: '4,185.47', change: '+28.15', changePercent: '+0.68%', trend: 'up' },
                { name: 'NASDAQ', value: '12,965.34', change: '+95.73', changePercent: '+0.74%', trend: 'up' },
                { name: 'DOW', value: '33,875.40', change: '-45.22', changePercent: '-0.13%', trend: 'down' }
              ]} />

              <PortfolioSummary data={{
                totalValue: 125750.00,
                dayChange: 1250.75,
                dayChangePercent: 1.01,
                cashBalance: 5000.00,
                positions: 12
              }} />

              <TrendingStocks stocks={[
                { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.15, changePercent: 1.45, trend: 'up' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: -15.30, changePercent: -0.55, trend: 'down' },
                { symbol: 'MSFT', name: 'Microsoft Corp.', price: 310.45, change: 8.75, changePercent: 2.90, trend: 'up' },
                { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.60, change: -12.40, changePercent: -4.81, trend: 'down' },
                { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3280.15, change: 45.20, changePercent: 1.40, trend: 'up' },
                { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 420.85, change: 18.95, changePercent: 4.71, trend: 'up' }
              ]} />
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;