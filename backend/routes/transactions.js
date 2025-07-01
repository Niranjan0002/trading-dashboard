const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/', auth, transactionController.createTransaction);
router.get('/:portfolioId', auth, transactionController.getTransactions);

module.exports = router;
