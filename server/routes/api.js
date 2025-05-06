/**
 * API Routes
 * This file contains all API routes for the application
 */

const express = require('express');
const router = express.Router();
const path = require('path');

// Stats endpoint - returns exchange statistics
router.get('/stats', (req, res) => {
  console.log('API stats endpoint called');
  res.json({
    volume: 452,
    liquidity: 1.2,
    pairs: 12345
  });
});



// Market data endpoint - returns current market prices
router.get('/market', (req, res) => {
  console.log('API market endpoint called');
  res.json({
    markets: [
      { symbol: 'BTC/USDT', price: 65432.10, change: 2.5 },
      { symbol: 'ETH/USDT', price: 3456.78, change: 1.2 },
      { symbol: 'SOL/USDT', price: 123.45, change: 5.7 },
      { symbol: 'ADA/USDT', price: 0.45, change: -0.8 },
      { symbol: 'DOT/USDT', price: 6.78, change: 3.2 }
    ]
  });
});

// User wallet endpoint - returns user wallet data (mock data for now)
router.get('/wallet', (req, res) => {
  console.log('API wallet endpoint called');

  // In a real app, this would be authenticated and return real user data
  res.json({
    balances: [
      { currency: 'BTC', amount: 0.25, value_usd: 16358.02 },
      { currency: 'ETH', amount: 5.5, value_usd: 19012.29 },
      { currency: 'USDT', amount: 10000, value_usd: 10000 }
    ],
    total_value_usd: 45370.31
  });
});

// Transaction history endpoint - returns user transaction history (mock data)
router.get('/history', (req, res) => {
  console.log('API history endpoint called');

  // In a real app, this would be authenticated and return real user data
  res.json({
    transactions: [
      { id: 'tx1', type: 'buy', symbol: 'BTC/USDT', amount: 0.1, price: 64500, timestamp: '2023-05-01T10:30:00Z' },
      { id: 'tx2', type: 'sell', symbol: 'ETH/USDT', amount: 2.5, price: 3400, timestamp: '2023-05-02T14:25:00Z' },
      { id: 'tx3', type: 'buy', symbol: 'SOL/USDT', amount: 20, price: 120, timestamp: '2023-05-03T09:15:00Z' }
    ]
  });
});

// Particles.js configuration endpoint - returns configuration for the particles.js background
router.get('/particles-config', (req, res) => {
  console.log('API particles-config endpoint called');

  res.json({
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
        "width": 1.2,
        "shadow": {
          "enable": true,
          "blur": 5,
          "color": "#33FF66"
        }
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
  });
});

// Serve the particles-demo.html file
router.get('/particles-demo', (req, res) => {
  console.log('API particles-demo endpoint called');
  res.sendFile(path.join(__dirname, '../../particles-demo.html'));
});

module.exports = router;
