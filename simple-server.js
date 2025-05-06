const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the particles-standalone.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'particles-standalone.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to see the particles effect`);
});
