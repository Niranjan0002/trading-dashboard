const { getBatchPrices } = require('../services/marketDataService');

const TRACKED_SYMBOLS = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN'];

function simulatePrice(quote) {
  const changePercent = (Math.random() * 0.01) - 0.005;
  const newPrice = quote.price * (1 + changePercent);
  return {
    ...quote,
    price: parseFloat(newPrice.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

function startMarketSocket(io) {
  setInterval(async () => {
    try {
      const quotes = await getBatchPrices(TRACKED_SYMBOLS);
      const simulated = quotes
        .filter(q => q && q.price)
        .map(simulatePrice);

      io.to('market-data').emit('market-data', simulated);

      simulated.forEach(item => {
        io.to(`symbol-${item.symbol}`).emit('price-update', item);
      });

      console.log(`📡 Emitted simulated market-data to ${simulated.length} symbols`);
    } catch (err) {
      console.error('❌ Error broadcasting market data:', err.message);
    }
  }, parseInt(process.env.MARKET_UPDATE_INTERVAL || 60000));
}

module.exports = { startMarketSocket };
