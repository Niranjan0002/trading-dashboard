const axios = require('axios');
const dayjs = require('dayjs');

const API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

const { incrementCallCount, canMakeCall } = require('../utils/apiUsageTracker');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory cache
const cache = new Map();

const getCached = (key) => {
  const data = cache.get(key);
  if (!data) return null;

  const { value, timestamp } = data;
  const now = Date.now();

  if (now - timestamp > parseInt(process.env.CACHE_DURATION || 60000)) {
    cache.delete(key);
    return null;
  }

  return value;
};

const setCached = (key, value) => {
  cache.set(key, { value, timestamp: Date.now() });
};

// ✅ Uses /prev to get latest closing price (Polygon Free)
async function getCurrentPrice(symbol) {
  const cacheKey = `price-${symbol.toUpperCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    if (!canMakeCall()) throw new Error('API call limit reached');

    const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/prev`;
    const response = await axios.get(url, {
      params: { apiKey: API_KEY }
    });

    incrementCallCount();

    const results = response.data.results;
    if (!results || results.length === 0) {
      throw new Error(`No data for ${symbol}`);
    }

    const price = results[0].c;

    const result = {
      symbol,
      price,
      timestamp: new Date().toISOString()
    };

    setCached(cacheKey, result);
    return result;
  } catch (err) {
    console.error(`❌ Failed to fetch current price for ${symbol}:`, err.message);
    throw new Error('API Error: Could not fetch quote');
  }
}

async function getHistoricalData(symbol, timeframe = '1D') {
  const cacheKey = `history-${symbol}-${timeframe}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let multiplier = 1;
  let timespan = 'day';
  let from, to;

  to = dayjs().format('YYYY-MM-DD');

  switch (timeframe) {
    case '1D': from = dayjs().subtract(3, 'day').format('YYYY-MM-DD'); break;
    case '1W': from = dayjs().subtract(7, 'day').format('YYYY-MM-DD'); break;
    case '1M': from = dayjs().subtract(1, 'month').format('YYYY-MM-DD'); break;
    case '1Y': from = dayjs().subtract(1, 'year').format('YYYY-MM-DD'); break;
    default: from = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
  }

  try {
    if (!canMakeCall()) throw new Error('API call limit reached');

    const url = `${BASE_URL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`;
    const response = await axios.get(url, {
      params: { apiKey: API_KEY }
    });

    incrementCallCount();

    const candles = response.data.results;
    if (!candles || candles.length === 0) throw new Error('No historical data found');

    const formatted = candles.map(item => ({
      timestamp: new Date(item.t).toISOString(),
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v
    }));

    const finalResult = timeframe === '1D'
      ? [formatted.at(-1)] // return latest single candle
      : formatted;

    setCached(cacheKey, finalResult);
    return finalResult;
  } catch (err) {
    console.error(`❌ Error fetching historical data for ${symbol}:`, err.message);
    throw new Error('API Error: Could not fetch historical data');
  }
}

async function getMultipleQuotes(symbols = []) {
  const results = [];
  for (let i = 0; i < symbols.length; i++) {
    try {
      const quote = await getCurrentPrice(symbols[i]);
      results.push(quote);
      await sleep(1200);
    } catch (err) {
      console.error(`Failed to get quote for ${symbols[i]}`);
    }
  }
  return results;
}

async function getMarketIndices() {
  const symbols = ['SPY', 'QQQ', 'DIA'];
  const results = [];

  for (const symbol of symbols) {
    try {
      const quote = await getCurrentPrice(symbol);
      results.push(quote);
      await sleep(1500); // space out API calls
    } catch (err) {
      console.error(`Failed to fetch index ${symbol}`);
    }
  }

  return results;
}

async function getTrendingStocks() {
  const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];
  const quotes = await getMultipleQuotes(symbols);

  const trending = quotes
    .filter(q => q && q.price)
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return trending;
}

module.exports = {
  getCurrentPrice,
  getHistoricalData,
  getMultipleQuotes,
  getMarketIndices,
  getBatchPrices: getMultipleQuotes,
  getTrendingStocks
};
