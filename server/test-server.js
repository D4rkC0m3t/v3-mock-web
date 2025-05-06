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

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple API endpoint for testing
app.get('/api/stats', (req, res) => {
  console.log('API stats endpoint called');

  // Data to return
  const data = {
    volume: 452,
    liquidity: 1.2,
    pairs: 12345,
    test: 'OK'
  };

  // Check if this is a JSONP request
  const callback = req.query.callback;
  if (callback) {
    console.log(`JSONP request with callback: ${callback}`);
    // Return JSONP response
    res.type('text/javascript');
    res.send(`${callback}(${JSON.stringify(data)})`);
  } else {
    // Return regular JSON response
    res.json(data);
  }
});

// Serve static files from the client build directory
const clientBuildPath = path.join(__dirname, '../client/dist');
console.log(`Checking client build path: ${clientBuildPath}`);
console.log(`Path exists: ${fs.existsSync(clientBuildPath)}`);

if (fs.existsSync(clientBuildPath)) {
  console.log(`Serving static files from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  // List files in the directory
  console.log('Files in client build directory:');
  fs.readdirSync(clientBuildPath).forEach(file => {
    console.log(` - ${file}`);
  });

  // Handle client-side routing - serve index.html for all other routes
  app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    console.log(`Sending file: ${indexPath}`);
    console.log(`File exists: ${fs.existsSync(indexPath)}`);
    res.sendFile(indexPath);
  });
} else {
  console.log(`Client build directory not found: ${clientBuildPath}`);

  // Create a simple HTML response
  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Running</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .error { color: red; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Server is running!</h1>
        <p>The server is running correctly, but the client build directory was not found.</p>
        <p class="error">Client build directory not found: ${clientBuildPath}</p>
        <p>Please build the client first with:</p>
        <pre>cd ../client && npm run build</pre>
        <p>API endpoints are still available:</p>
        <ul>
          <li><a href="/api/stats">/api/stats</a></li>
        </ul>
      </body>
      </html>
    `);
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/api/stats`);
  console.log(`Or visit http://localhost:${PORT}/ for the test page`);
});
