import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ParticlesBackground from './components/ParticlesBackground';
import CustomCursor from './components/CustomCursor';
import ApiTest from './ApiTest';
import Login from './Login';

// Home component
const Home: React.FC = () => {
  const [showApiTest, setShowApiTest] = useState(false);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Custom Cursor */}
      <CustomCursor />

      <div style={{
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        padding: '2rem',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          VDEX - Your Crypto Wallet
        </h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          Secure. Beautiful. Powerful.
        </h2>
        <p style={{
          fontSize: '1rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Manage and exchange your crypto securely from your desktop or mobile device.
          Experience the next generation of digital asset management.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button style={{
            background: 'linear-gradient(90deg, #FF3333, #33FF66)',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 24px',
            borderRadius: '4px',
            border: 'none',
            width: '220px',
            cursor: 'pointer'
          }}>
            Download VDEX
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              backgroundColor: 'transparent',
              color: '#33FF66',
              fontWeight: 'bold',
              padding: '10px 24px',
              borderRadius: '4px',
              border: '1px solid #33FF66',
              width: '220px',
              cursor: 'pointer'
            }}
          >
            Login / Connect Wallet
          </button>
        </div>

        <button
          onClick={() => setShowApiTest(!showApiTest)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {showApiTest ? 'Hide API Test' : 'Show API Test'}
        </button>

        {showApiTest && <ApiTest />}
      </div>
    </div>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Dashboard component (placeholder)
const Dashboard: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      color: 'white',
      background: '#0A0E17',
      minHeight: '100vh'
    }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        style={{
          backgroundColor: 'rgba(255, 51, 51, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

// Main App component with routing
const TestApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AuthLayout><Dashboard /></AuthLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default TestApp;
