const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle client-side routing - Always return the main index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Check if dist directory exists
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('✅ dist directory found');
    
    // Check if index.html exists
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html found');
    } else {
      console.error('❌ WARNING: index.html not found in dist directory');
    }
    
    // List files in dist directory
    console.log('\nFiles in dist directory:');
    fs.readdirSync(distPath).forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.error('❌ WARNING: dist directory not found. Please build the application first.');
  }
});
