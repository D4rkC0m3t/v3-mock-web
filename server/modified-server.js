const express = require('express');
const path = require('path');
const cors = require("cors");
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Simple API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    volume: 452,
    liquidity: 1.2,
    pairs: 12345
  });
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
