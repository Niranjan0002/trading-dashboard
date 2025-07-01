require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');
};

const seed = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing old data...');
    await User.deleteMany();
    await Portfolio.deleteMany();
    await Transaction.deleteMany();

    console.log('👤 Creating sample users...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.insertMany([
      {
        email: 'niranjan@example.com',
        password: hashedPassword,
        firstName: 'Niranjan',
        lastName: 'B',
        preferences: { theme: 'dark', notifications: true }
      },
      {
        email: 'trader@example.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Trader',
        preferences: { theme: 'light', notifications: false }
      }
    ]);

    console.log('💼 Creating portfolios...');
    const portfolios = await Portfolio.insertMany([
      {
        userId: users[0]._id,
        name: 'Niranjan Portfolio',
        cashBalance: 20000,
        positions: [{
          symbol: 'AAPL',
          quantity: 10,
          avgPrice: 140,
          currentPrice: 160,
          unrealizedPnL: 200,
          stopLossPercent: 5,
          purchaseDate: new Date()
        }],
        totalValue: 21600,
        totalPnL: 200
      },
      {
        userId: users[1]._id,
        name: 'Alice Portfolio',
        cashBalance: 15000,
        positions: [],
        totalValue: 15000,
        totalPnL: 0
      }
    ]);

    console.log('💳 Creating transactions...');
    await Transaction.insertMany([
      {
        userId: users[0]._id,
        portfolioId: portfolios[0]._id,
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: 140,
        totalAmount: 1400,
        fees: 5,
        timestamp: new Date(),
        notes: 'Initial buy'
      },
      {
        userId: users[1]._id,
        portfolioId: portfolios[1]._id,
        symbol: 'TSLA',
        type: 'BUY',
        quantity: 5,
        price: 700,
        totalAmount: 3500,
        fees: 0,
        timestamp: new Date(),
        notes: 'First Tesla trade'
      }
    ]);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
