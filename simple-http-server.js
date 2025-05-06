const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle API request
  if (req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from the server!' }));
    return;
  }

  // Handle particles.js configuration API request
  if (req.url === '/api/particles-config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      "particles": {
        "number": {
          "value": 100,
          "density": {
            "enable": true,
            "value_area": 1000
          }
        },
        "color": {
          "value": ["#FF3333", "#33FF66"]  // Red and green colors
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.7,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3.5,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 2,
            "size_min": 0.3,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 180,
          "color": "#33FF66",  // Green connections
          "opacity": 0.5,
          "width": 1.2
        },
        "move": {
          "enable": true,
          "speed": 3,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "bounce",
          "bounce": true,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "bubble"
          },
          "onclick": {
            "enable": true,
            "mode": "repulse"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 200,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 250,
            "size": 6,
            "duration": 2,
            "opacity": 1,
            "speed": 3,
            "color": "#FF3333"
          },
          "repulse": {
            "distance": 300,
            "duration": 1
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    }));
    return;
  }

  // Handle root request
  if (req.url === '/' || req.url === '/index.html') {
    // Serve the particles-demo.html file
    const filePath = path.join(__dirname, 'particles-demo.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error('Error reading particles-demo.html:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error loading particles-demo.html: ${err.message}`);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    });
    return;
  }

  // Handle requests for external resources (CSS, JS, etc.)
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|svg)$/)) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error(`Error reading file ${req.url}:`, err);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${req.url}`);
        return;
      }

      // Set the appropriate content type
      let contentType = 'text/plain';
      if (req.url.endsWith('.css')) contentType = 'text/css';
      else if (req.url.endsWith('.js')) contentType = 'application/javascript';
      else if (req.url.endsWith('.png')) contentType = 'image/png';
      else if (req.url.endsWith('.jpg') || req.url.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (req.url.endsWith('.gif')) contentType = 'image/gif';
      else if (req.url.endsWith('.svg')) contentType = 'image/svg+xml';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
    return;
  }

  // Handle 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Try accessing http://localhost:${PORT}/`);
});
