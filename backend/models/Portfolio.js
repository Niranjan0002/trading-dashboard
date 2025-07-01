const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  cashBalance: { type: Number, default: 0 },
  positions: [{
    symbol: String,
    quantity: Number,
    avgPrice: Number,
    currentPrice: Number,
    unrealizedPnL: Number,
    stopLossPercent: Number,
    purchaseDate: Date
  }],
  totalValue: Number,
  totalPnL: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
