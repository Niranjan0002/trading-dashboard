const Portfolio = require('../models/Portfolio');

// @desc Create new portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const { name, cashBalance } = req.body;

    const portfolio = await Portfolio.create({
      userId: req.user.userId, // 🔁 FIXED
      name,
      cashBalance,
      positions: [],
      totalValue: cashBalance,
      totalPnL: 0
    });

    res.status(201).json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get all portfolios for logged-in user
exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.userId }); // 🔁 FIXED
    res.json({ success: true, portfolios });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get single portfolio
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user.userId // 🔁 FIXED
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update portfolio
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, // 🔁 FIXED
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or unauthorized' });
    }

    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Delete portfolio
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId // 🔁 FIXED
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or unauthorized' });
    }

    res.json({ success: true, message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
