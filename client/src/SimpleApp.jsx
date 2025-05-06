import { useState } from 'react';

function SimpleApp() {
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callCalculateApi = async (method, a, b) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          params: [a, b],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error calling API:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>React + Node Example</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Calculator API</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => callCalculateApi('add', 5, 7)}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Add 5 + 7
          </button>
          <button 
            onClick={() => callCalculateApi('subtract', 10, 3)}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Subtract 10 - 3
          </button>
          <button 
            onClick={() => callCalculateApi('multiply', 4, 6)}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Multiply 4 * 6
          </button>
        </div>
        
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {result !== null && !loading && !error && (
          <p>Result: <strong>{result}</strong></p>
        )}
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Stats API</h2>
        <button 
          onClick={fetchStats}
          disabled={loading}
          style={{ padding: '8px 16px', marginBottom: '20px' }}
        >
          Fetch Stats
        </button>
        
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {stats && !loading && !error && (
          <div>
            <h3>Stats:</h3>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleApp;
