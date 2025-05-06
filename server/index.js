/**
 * Main Server Index
 * This file serves as the entry point for the server application
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve static files from the client build directory
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  console.log(`Serving static files from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));
  
  // Handle client-side routing - serve index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.log(`Client build directory not found: ${clientBuildPath}`);
  console.log('Only API routes will be available');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start the server with port fallback mechanism
function startServer(port, maxAttempts = 5, attempt = 1) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < maxAttempts) {
        console.log(`Port ${port} is busy, trying port ${port + 1}...`);
        startServer(port + 1, maxAttempts, attempt + 1);
      } else {
        console.error(`Failed to find an available port after ${maxAttempts} attempts.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

// Start the server
startServer(PORT);

module.exports = app; // Export for testing
