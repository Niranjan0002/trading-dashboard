const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: Number,
  price: Number,
  totalAmount: Number,
  fees: Number,
  timestamp: { type: Date, default: Date.now },
  notes: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
