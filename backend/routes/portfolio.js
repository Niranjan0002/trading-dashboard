const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/', auth, portfolioController.createPortfolio);
router.get('/', auth, portfolioController.getPortfolios);
router.get('/:id', auth, portfolioController.getPortfolioById);
router.put('/:id', auth, portfolioController.updatePortfolio);
router.delete('/:id', auth, portfolioController.deletePortfolio);

module.exports = router;
