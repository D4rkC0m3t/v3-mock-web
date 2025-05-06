# VDEX - Decentralized Cryptocurrency Exchange

VDEX is a modern, feature-rich decentralized cryptocurrency exchange platform with an intuitive user interface and powerful trading capabilities.

## Project Structure

The project is organized into two main directories:

- `client/` - Frontend React application
- `server/` - Backend Express API server

## Features

- 🚀 Real-time market data
- 💼 Secure wallet integration
- 📊 Advanced trading charts
- 📱 Responsive design for all devices
- 🔒 Enhanced security features
- 💸 Low trading fees

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vdex.git
   cd vdex
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the server:
   ```bash
   # In the server directory
   npm run dev
   ```

2. Start the client:
   ```bash
   # In the client directory
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

#### Production Mode

1. Build the client:
   ```bash
   # In the client directory
   npm run build
   ```

2. Start the server in production mode:
   ```bash
   # In the server directory
   npm start
   ```

## API Endpoints

The server provides the following API endpoints:

- `GET /api/stats` - Get exchange statistics
- `GET /api/market` - Get current market prices
- `GET /api/wallet` - Get user wallet information
- `GET /api/history` - Get transaction history

## Directory Structure

```
vdex/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── package.json        # Client dependencies
│
├── server/                 # Backend Express API
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── models/             # Data models
│   ├── middleware/         # Custom middleware
│   ├── index.js            # Server entry point
│   └── package.json        # Server dependencies
│
└── README.md               # Project documentation
```

## Technologies Used

### Frontend
- React
- TypeScript
- Material UI
- Framer Motion
- Recharts
- React Router

### Backend
- Node.js
- Express
- MongoDB (planned)
- JWT Authentication (planned)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with the development of VDEX
- Special thanks to the open-source community for providing the tools and libraries used in this project
