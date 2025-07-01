const express = require('express');
const router = express.Router();
const { getCurrentPrice } = require('../services/marketDataService');

router.get('/quote/:symbol', async (req, res) => {
  try {
    const data = await getCurrentPrice(req.params.symbol);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
