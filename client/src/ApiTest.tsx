import React, { useState, useEffect } from 'react';

const ApiTest: React.FC = () => {
  const [directData, setDirectData] = useState<any>(null);
  const [proxiedData, setProxiedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test direct connection
      const directResponse = await fetch('http://localhost:3001/api/stats');
      const directResult = await directResponse.json();
      setDirectData(directResult);
      
      // Test proxied connection
      const proxiedResponse = await fetch('/api/stats');
      const proxiedResult = await proxiedResponse.json();
      setProxiedData(proxiedResult);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('API test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '8px',
      color: 'white'
    }}>
      <h2>API Connection Test</h2>
      <button 
        onClick={testApi}
        style={{
          background: 'linear-gradient(90deg, #FF3333, #33FF66)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(255, 51, 51, 0.2)', 
          padding: '15px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Error</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
          <p>Troubleshooting steps:</p>
          <ol>
            <li>Make sure the server is running on port 3001</li>
            <li>Check that the Vite proxy is configured correctly in vite.config.js</li>
            <li>Verify CORS is enabled in the server</li>
          </ol>
        </div>
      )}
      
      {directData && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Direct Connection Result (http://localhost:3001/api/stats)</h3>
          <pre style={{ 
            backgroundColor: 'rgba(51, 255, 102, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(directData, null, 2)}
          </pre>
        </div>
      )}
      
      {proxiedData && (
        <div>
          <h3>Proxied Connection Result (/api/stats)</h3>
          <pre style={{ 
            backgroundColor: 'rgba(51, 255, 102, 0.1)', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(proxiedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
