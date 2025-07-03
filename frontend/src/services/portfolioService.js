// src/services/portfolioService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchPortfolio = async (portfolioId, token) => {
  const response = await axios.get(`${API_URL}/portfolio/${portfolioId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.portfolio;
};

export const updatePortfolio = async (portfolioId, updatedData, token) => {
  const response = await axios.put(`${API_URL}/portfolio/${portfolioId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.portfolio;
};

export const getAllPortfolios = async (token) => {
  const response = await axios.get(`${API_URL}/portfolio`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.portfolios;
};

// ✅ NEW: Fetch latest stock price
export const getQuote = async (symbol) => {
  const response = await axios.get(`${API_URL}/market/quote/${symbol}`);
  return response.data.data;
};

