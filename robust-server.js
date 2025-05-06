const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT_START = 3001; // Start with this port
const MAX_PORT_ATTEMPTS = 10; // Try up to 10 ports

// Check if the public directory exists and create it if needed
const publicDir = path.join(__dirname, 'client/public');
if (!fs.existsSync(publicDir)) {
  console.log(`Creating public directory: ${publicDir}`);
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple index.html file if it doesn't exist
const indexPath = path.join(publicDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.log(`Creating index.html: ${indexPath}`);
  const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Exchange</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0A0E17;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        header {
            background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 163, 255, 0.1));
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(0, 240, 255, 0.3);
        }
        nav {
            display: flex;
            justify-content: center;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.05);
        }
        nav a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            padding: 8px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        nav a:hover, nav a.active {
            background: rgba(0, 240, 255, 0.2);
        }
        main {
            flex: 1;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 240, 255, 0.2);
        }
        h1 {
            color: #00F0FF;
        }
        button {
            background: linear-gradient(135deg, #00F0FF, #00A3FF);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
        }
        button:hover {
            opacity: 0.9;
        }
        footer {
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(0, 240, 255, 0.1);
        }
    </style>
</head>
<body>
    <header>
        <h1>Crypto Exchange</h1>
    </header>

    <nav>
        <a href="/" class="active">Home</a>
        <a href="/trade">Trade</a>
        <a href="/wallet">Wallet</a>
        <a href="/history">History</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/login">Login</a>
    </nav>

    <main>
        <div class="card">
            <h2>Welcome to our Crypto Exchange</h2>
            <p>This is a simple static page. Click on the links above to navigate.</p>
        </div>

        <div class="card">
            <h2>Login</h2>
            <p>Click the button below to go to the Login page:</p>
            <button onclick="location.href='/login'">Login</button>
        </div>
    </main>

    <footer>
        &copy; 2025 Crypto Exchange
    </footer>


</body>
</html>`;
  fs.writeFileSync(indexPath, indexContent);
}

// Create a simple trade.html file if it doesn't exist
const tradePath = path.join(publicDir, 'trade.html');
if (!fs.existsSync(tradePath)) {
  console.log(`Creating trade.html: ${tradePath}`);
  const tradeContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trade - Crypto Exchange</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0A0E17;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        header {
            background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 163, 255, 0.1));
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(0, 240, 255, 0.3);
        }
        nav {
            display: flex;
            justify-content: center;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.05);
        }
        nav a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            padding: 8px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        nav a:hover, nav a.active {
            background: rgba(0, 240, 255, 0.2);
        }
        main {
            flex: 1;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 240, 255, 0.2);
        }
        h1 {
            color: #00F0FF;
        }
        .chart {
            width: 100%;
            height: 400px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        footer {
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-top: 1px solid rgba(0, 240, 255, 0.1);
        }
    </style>
</head>
<body>
    <header>
        <h1>Crypto Exchange</h1>
    </header>

    <nav>
        <a href="/">Home</a>
        <a href="/trade" class="active">Trade</a>
        <a href="/wallet">Wallet</a>
        <a href="/history">History</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/login">Login</a>
    </nav>

    <main>
        <h2>Trade BTC/USDT</h2>

        <div class="card">
            <div class="chart">
                <h3>Chart will be displayed here</h3>
            </div>

            <p>This is a simple trade page to test navigation. In a real application, this would contain trading charts, order books, and trading forms.</p>

            <button onclick="location.href='/'">Back to Home</button>
        </div>
    </main>

    <footer>
        &copy; 2025 Crypto Exchange
    </footer>
</body>
</html>`;
  fs.writeFileSync(tradePath, tradeContent);
}

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle API endpoints
  if (pathname === '/api/stats') {
    console.log('API stats endpoint called');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      volume: 452,
      liquidity: 1.2,
      pairs: 12345
    }));
    return;
  }



  // Serve static files
  let filePath;
  if (pathname === '/') {
    filePath = path.join(__dirname, 'client/public/index.html');
  } else if (pathname === '/trade') {
    filePath = path.join(__dirname, 'client/public/trade.html');
  } else {
    filePath = path.join(__dirname, 'client/public', pathname);
  }

  // Get the file extension
  const extname = path.extname(filePath);

  // Set the content type based on the file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);

      if (err.code === 'ENOENT') {
        // If the file doesn't exist, serve index.html for client-side routing
        fs.readFile(path.join(__dirname, 'client/public/index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - file found
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Function to try starting the server on different ports
function startServer(port, attempt = 1) {
  console.log(`Attempting to start server on port ${port} (attempt ${attempt}/${MAX_PORT_ATTEMPTS})...`);

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`API available at http://localhost:${port}/api/stats`);
    console.log(`Trade page available at http://localhost:${port}/trade`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use.`);

      if (attempt < MAX_PORT_ATTEMPTS) {
        // Try the next port
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort}...`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error(`Failed to find an available port after ${MAX_PORT_ATTEMPTS} attempts.`);
        process.exit(1);
      }
    } else {
      // Some other error
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

// Start the server with the initial port
startServer(PORT_START);
