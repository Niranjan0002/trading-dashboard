const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
    defaultPortfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
