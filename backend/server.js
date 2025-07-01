// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Security Middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate Limiting (apply after basic middleware)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); // ✅ No trailing slash


// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trading-dashboard';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);

    mongoose.connection.on('error', err => console.error('❌ MongoDB error:', err));
    mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
    mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected'));

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Test + Dev Routes
const devTestRoutes = require('./routes/devTest');
app.use('/api/dev', devTestRoutes);

const marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const portfolioRoutes = require('./routes/portfolio');
app.use('/api/portfolio', portfolioRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  const dbStatus = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.json({
    status: 'OK',
    database: {
      status: dbStatus[mongoose.connection.readyState],
      name: mongoose.connection.name || 'N/A'
    },
    server: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Simple connection test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend connected!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io Events
io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join-user-room', userId => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('join-portfolio-room', portfolioId => {
    socket.join(`portfolio-${portfolioId}`);
    console.log(`💼 Portfolio ${portfolioId} joined room`);
  });

  socket.on('subscribe-market-data', symbols => {
    socket.join('market-data');
    console.log(`📈 Subscribed to market data:`, symbols);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

const { startMarketSocket } = require('./sockets/marketSocket');
startMarketSocket(io); // 💥 start broadcasting

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Handle Unknown Routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('✅ Database disconnected');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Make io accessible globally
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}/api`);
});

module.exports = { app, server, io };
