const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Example API endpoint
app.post('/api/calculate', (req, res) => {
  const { method, params } = req.body;
  let result;

  try {
    console.log(`Calculating with method: ${method}, params:`, params);
    
    switch (method) {
      case 'add':
        result = params[0] + params[1];
        break;
      case 'subtract':
        result = params[0] - params[1];
        break;
      case 'multiply':
        result = params[0] * params[1];
        break;
      default:
        return res.status(400).json({ error: 'Unknown method' });
    }

    console.log(`Result: ${result}`);
    res.json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple stats API endpoint
app.get('/api/stats', (req, res) => {
  console.log('Stats API called');
  
  // Return some mock data
  res.json({
    volume: 452,
    liquidity: 1.2,
    pairs: 12345,
    test: 'OK'
  });
});

// Serve static files from the client build directory
const clientBuildPath = path.join(__dirname, '../client/dist');
console.log(`Client build path: ${clientBuildPath}`);

try {
  const fs = require('fs');
  if (fs.existsSync(clientBuildPath)) {
    console.log(`Serving static files from: ${clientBuildPath}`);
    app.use(express.static(clientBuildPath));
    
    // Handle client-side routing - serve index.html for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    console.log(`Client build directory not found: ${clientBuildPath}`);
    app.get('*', (req, res) => {
      res.send('Client build directory not found. Please build the client first.');
    });
  }
} catch (error) {
  console.error('Error setting up static files:', error);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
