const express = require('express');
const router = express.Router();
const { getCurrentPrice, getTrendingStocks, getHistoricalData, getMultipleQuotes, getMarketIndices, getBatchPrices } = require('../services/marketDataService');
const { getUsageStats } = require('../utils/apiUsageTracker');

router.get('/quote/:symbol', async (req, res) => {
  try {
    const data = await getCurrentPrice(req.params.symbol);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/historical/:symbol', async (req, res) => {
  try {
    const { timeframe } = req.query;
    const data = await getHistoricalData(req.params.symbol, timeframe);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/batch-quotes', async (req, res) => {
  try {
    const { symbols } = req.query; // e.g. symbols=AAPL,MSFT,GOOGL

    if (!symbols) {
      return res.status(400).json({ success: false, message: 'No symbols provided' });
    }

    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const data = await getMultipleQuotes(symbolList);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/batch-prices', async (req, res) => {
  const { symbols } = req.query;
  const symbolList = symbols ? symbols.split(',').map(s => s.trim().toUpperCase()) : [];

  if (!symbolList.length) {
    return res.status(400).json({ success: false, message: 'No symbols provided' });
  }

  try {
    const data = await getBatchPrices(symbolList);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/indices', async (req, res) => {
  try {
    const data = await getMarketIndices();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const data = await getTrendingStocks();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/usage', (req, res) => {
  res.json({ success: true, usage: getUsageStats() });
});

module.exports = router;
