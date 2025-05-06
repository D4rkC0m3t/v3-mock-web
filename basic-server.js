const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Simple API endpoint
app.get('/api/hello', (req, res) => {
  console.log('Hello API called');
  res.json({ message: 'Hello from the server!' });
});

// Serve static files from the public directory
app.use(express.static('public'));

// Create a simple HTML response for the root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Basic Server</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        button { padding: 10px; margin: 10px 0; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>Basic Server is Running!</h1>
      <p>This is a simple server to test connectivity.</p>
      <button id="testApi">Test API</button>
      <div id="result"></div>

      <script>
        document.getElementById('testApi').addEventListener('click', async () => {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = '<p>Loading...</p>';
          
          try {
            const response = await fetch('/api/hello');
            const data = await response.json();
            resultDiv.innerHTML = '<p>Response:</p><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            resultDiv.innerHTML = '<p>Error: ' + error.message + '</p>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try accessing http://localhost:${PORT}/`);
});
