import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Handle client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');

  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    console.log(`Serving index.html for path: ${req.url}`);
    res.sendFile(indexPath);
  } else {
    console.error('Error: index.html not found in dist directory');
    res.status(404).send('Error: Application files not found. Please build the application first.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const PORT = 4003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);

  // Check if dist directory exists
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('dist directory found');

    // Check if index.html exists
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('index.html found');
    } else {
      console.error('WARNING: index.html not found in dist directory');
    }

    // List files in dist directory
    console.log('Files in dist directory:');
    fs.readdirSync(distPath).forEach(file => {
      console.log(`- ${file}`);
    });
  } else {
    console.error('WARNING: dist directory not found. Please build the application first.');
  }
});
