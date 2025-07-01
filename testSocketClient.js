const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);

  // Subscribe to market symbols
  socket.emit('subscribe-market-data', ['AAPL', 'TSLA']);

  // Listen to broadcasted market data
  socket.on('market-data', (data) => {
    console.log('📡 Market Data:', data);
  });

  socket.on('price-update', (data) => {
    console.log(`💹 ${data.symbol}: ${data.price}`);
  });
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
