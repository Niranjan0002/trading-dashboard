const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

// @desc Create a transaction (buy/sell)
exports.createTransaction = async (req, res) => {
  try {
    const { portfolioId, symbol, type, quantity, price, fees, notes } = req.body;

    const totalAmount = quantity * price + (fees || 0);

    const transaction = await Transaction.create({
      userId: req.userId,
      portfolioId,
      symbol,
      type,
      quantity,
      price,
      totalAmount,
      fees: fees || 0,
      timestamp: new Date(),
      notes
    });

    // Optional: Update cash balance and position logic here

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get all transactions for a portfolio
exports.getTransactions = async (req, res) => {
  try {
    const portfolioId = req.params.portfolioId;

    const transactions = await Transaction.find({
      userId: req.userId,
      portfolioId
    }).sort({ timestamp: -1 });

    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
