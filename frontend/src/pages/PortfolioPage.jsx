// frontend/src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './PortfolioPage.module.css';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import BuyModal from '../components/Portfolio/BuyModal';
import SellModal from '../components/Portfolio/SellModal';
import { fetchPortfolio, updatePortfolio, getQuote } from '../services/portfolioService';
import { useAuth } from '../context/AuthContext';

const PortfolioPage = () => {
  const { user, token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!user?.defaultPortfolio) {
        console.error('No default portfolio ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchPortfolio(user.defaultPortfolio, token);

        const updatedPositions = await Promise.all(
          data.positions.map(async (pos) => {
            const quote = await getQuote(pos.symbol);
            return {
              ...pos,
              currentPrice: quote?.price || pos.currentPrice
            };
          })
        );

        setPortfolio(data);
        setHoldings(updatedPositions);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [user, token]);

  const handleBuy = async ({ symbol, quantity }) => {
    try {
      setLoading(true);
      const quote = await getQuote(symbol);
      const price = quote?.price || 0;
      if (!price) throw new Error('Price not available');

      const existing = holdings.find(h => h.symbol === symbol);
      const newHoldings = existing
        ? holdings.map(h => h.symbol === symbol
            ? {
                ...h,
                quantity: h.quantity + quantity,
                avgPrice: ((h.avgPrice * h.quantity + price * quantity) / (h.quantity + quantity)),
                currentPrice: price
              }
            : h)
        : [...holdings, {
            symbol,
            quantity,
            avgPrice: price,
            currentPrice: price,
            purchaseDate: new Date(),
            unrealizedPnL: 0,
            stopLossPercent: 0
          }];

      const updatedPortfolio = {
        ...portfolio,
        positions: newHoldings
      };

      const result = await updatePortfolio(user.defaultPortfolio, updatedPortfolio, token);
      setPortfolio(result);
      setHoldings(result.positions);
    } catch (err) {
      console.error('Buy failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async ({ symbol, quantity }) => {
    try {
      setLoading(true);
      const quote = await getQuote(symbol);
      const price = quote?.price || 0;
      if (!price) throw new Error('Price not available');

      const existing = holdings.find(h => h.symbol === symbol);
      if (!existing || existing.quantity < quantity) return alert('Invalid sell operation');

      const newHoldings = existing.quantity === quantity
        ? holdings.filter(h => h.symbol !== symbol)
        : holdings.map(h => h.symbol === symbol
            ? { ...h, quantity: h.quantity - quantity, currentPrice: price }
            : h);

      const updatedPortfolio = {
        ...portfolio,
        positions: newHoldings
      };

      const result = await updatePortfolio(user.defaultPortfolio, updatedPortfolio, token);
      setPortfolio(result);
      setHoldings(result.positions);
    } catch (err) {
      console.error('Sell failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.portfolioPage}>
      <h2 className={styles.title}>My Portfolio</h2>

      <div className={styles.actions}>
        <Button onClick={() => setShowBuyModal(true)}>Buy Stock</Button>
        <Button onClick={() => setShowSellModal(true)} variant="secondary">Sell Stock</Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.holdingsGrid}>
          {holdings.map((stock) => {
            const pl = ((stock.currentPrice - stock.avgPrice) * stock.quantity).toFixed(2);
            const isProfit = pl >= 0;

            return (
              <Card key={stock.symbol} className={styles.holdingCard}>
                <div className={styles.header}>
                  <h3 className={styles.symbol}>{stock.symbol}</h3>
                  <p className={styles.name}>{stock.name || '—'}</p>
                </div>
                <div className={styles.details}>
                  <p>Shares: {stock.quantity}</p>
                  <p>Buy Price: ${stock.avgPrice.toFixed(2)}</p>
                  <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
                  <p className={isProfit ? styles.profit : styles.loss}>
                    P/L: ${pl}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BuyModal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} onSubmit={handleBuy} />
      <SellModal isOpen={showSellModal} onClose={() => setShowSellModal(false)} onSubmit={handleSell} />
    </div>
  );
};

export default PortfolioPage;
