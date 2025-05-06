/**
 * Authentication Routes
 * This file contains all authentication-related routes
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://yumlimcvuwxjxqrypqwy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bWxpbWN2dXd4anhxcnlwcXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMDk5NTcsImV4cCI6MjA2MDc4NTk1N30.0r_eUU8cWVevUfq7bW2pB4E-0pfPr6g909Aj6wqQy2U';
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT secret for token signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For development/demo purposes, allow a test account
    if (email === 'test@example.com' && password === 'password') {
      const token = jwt.sign(
        { id: 'test-user-id', email: 'test@example.com' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        user: { id: 'test-user-id', email: 'test@example.com' },
        token,
        message: 'Login successful (test account)'
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: error.message });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: data.user,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Register with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: data.user,
      token,
      message: 'Signup successful'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router;
