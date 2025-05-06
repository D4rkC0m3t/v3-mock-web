const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  console.log(`Creating public directory: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Serve static files from the public directory
app.use(express.static(publicDir));

// API endpoints
app.get('/api/stats', (_, res) => {
  res.json({
    volume: 452,
    liquidity: 1.2,
    pairs: 12345,
    test: 'OK'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User'
      },
      token: 'mock-jwt-token-123456789'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock signup
  res.json({
    user: {
      id: '123',
      email: email,
      name: 'New User'
    },
    token: 'mock-jwt-token-123456789'
  });
});

app.get('/api/auth/status', (req, res) => {
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/api/wallet/balance', (req, res) => {
  res.json({
    address: req.query.address || '0x1234567890abcdef',
    balances: [
      { symbol: 'ETH', amount: 2.45, value: 7840 },
      { symbol: 'USDT', amount: 1250, value: 1250 },
      { symbol: 'BTC', amount: 0.023, value: 974 }
    ]
  });
});

app.get('/api/wallet/transactions', (req, res) => {
  res.json({
    transactions: [
      { 
        hash: '0x123', 
        from: '0x1a2b3c', 
        to: '0x4d5e6f', 
        amount: '0.05', 
        token: 'ETH',
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      { 
        hash: '0x456', 
        from: '0x4d5e6f', 
        to: '0x1a2b3c', 
        amount: '100', 
        token: 'USDT',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'success'
      }
    ],
    pagination: {
      total: 2,
      page: 1,
      pages: 1
    }
  });
});

// Handle all other routes - serve index.html
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple server running on http://localhost:${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/api/stats`);
});
