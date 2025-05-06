const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cors = require("cors");
const { swapTokens, transferToken } = require("./blockchain");
const supabase = require("./supabase-config");
const Transaction = require("./models/Transaction");
const KYC = require("./models/KYC");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/dist')));


// Initialize Supabase
console.log("Supabase initialized");

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Signup Endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected Route Example
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);
    if (error) throw error;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swap Endpoint
app.post("/api/swap", async (req, res) => {
  try {
    const { tokenIn, tokenOut, amountIn, userAddress } = req.body;
    const txResult = await swapTokens(tokenIn, tokenOut, amountIn);

    await Transaction.create({
      txHash: txResult.hash,
      from: userAddress,
      to: "DEX",
      amount: amountIn,
      token: tokenIn,
      status: txResult.status,
      gasUsed: txResult.gasUsed,
      blockNumber: txResult.blockNumber
    });

    res.json(txResult);
  } catch (error) {
    console.error('Swap endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Transfer Endpoint
app.post("/api/transfer", async (req, res) => {
  try {
    const { tokenAddress, recipient, amount, userAddress } = req.body;
    const txResult = await transferToken(tokenAddress, recipient, amount);

    await Transaction.create({
      txHash: txResult.hash,
      from: userAddress,
      to: recipient,
      amount: amount,
      token: tokenAddress,
      status: txResult.status,
      gasUsed: txResult.gasUsed,
      blockNumber: txResult.blockNumber
    });

    res.json(txResult);
  } catch (error) {
    console.error('Transfer endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// KYC Verification Endpoint
app.post('/api/kyc/submit', authenticateToken, async (req, res) => {
  try {
    const { idType, idNumber, fullName, dateOfBirth, address } = req.body;

    const kycData = await KYC.create({
      userId: req.user.id,
      idType,
      idNumber,
      fullName,
      dateOfBirth,
      address,
      status: 'pending'
    });

    res.json(kycData);
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get KYC Status
app.get('/api/kyc/status', authenticateToken, async (req, res) => {
  try {
    const kycData = await KYC.findOne({ userId: req.user.id });
    res.json(kycData || { status: 'not_submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Account Details
app.get('/api/account/details', authenticateToken, async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(req.user.id);
    if (error) throw error;

    const transactions = await Transaction.find({ $or: [{ from: user.id }, { to: user.id }] })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      recentTransactions: transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Account Settings
app.put('/api/account/settings', authenticateToken, async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: req.body.settings
    });

    if (error) throw error;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove saveTransaction function as it's now handled by Transaction model

// Get Wallet Balance
app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
  try {
    const { address } = req.query;
    const balances = await Promise.all([
      // Add calls to blockchain.js to fetch token balances
      // Example: getTokenBalance(address, tokenAddress)
    ]);

    res.json({
      address,
      balances
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Transaction History
app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
  try {
    const { address, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({
      $or: [{ from: address }, { to: address }]
    })
    .sort({ blockNumber: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Transaction.countDocuments({
      $or: [{ from: address }, { to: address }]
    });

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statistics endpoint
app.get('/api/stats', (_, res) => {
  res.json({
    volume: 452,
    liquidity: 1.2,
    pairs: 12345
  });
});

// Add a catch-all route at the end to handle client-side routing
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));