import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestApp from './TestApp.tsx'
import ErrorBoundary from './components/ui/ErrorBoundary'

console.log('%c[VDEX] Initializing application...', 'color: #00F0FF; font-weight: bold');

const rootElement = document.getElementById('root');
console.log('%c[VDEX] Root element status:', 'color: #00F0FF', rootElement ? 'Found' : 'Not found');

if (!rootElement) {
  console.error('%c[VDEX] Critical Error: Root element not found!', 'color: #FF4444; font-weight: bold');
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #0A0E17;
      color: white;
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    ">
      <h1 style="color: #FF4444;">Application Error</h1>
      <p>The application failed to initialize. Please ensure your HTML contains a root element.</p>
      <button onclick="window.location.reload()" style="
        margin-top: 20px;
        padding: 10px 20px;
        background: #00F0FF;
        border: none;
        border-radius: 5px;
        color: #0A0E17;
        cursor: pointer;
      ">Reload Page</button>
    </div>
  `;
  throw new Error('Root element not found');
}

try {
  const root = createRoot(rootElement);
  console.log('%c[VDEX] React root created successfully', 'color: #00F0FF');

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <TestApp />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('%c[VDEX] Initial render completed', 'color: #00F0FF');

  // Add performance monitoring
  console.log('%c[VDEX] Application initialized', 'color: #00F0FF');

} catch (error) {
  console.error('%c[VDEX] Critical Error:', 'color: #FF4444; font-weight: bold', error);

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #0A0E17;
      color: white;
      font-family: Arial, sans-serif;
      padding: 20px;
      text-align: center;
    ">
      <h1 style="color: #FF4444;">Rendering Error</h1>
      <p>The application encountered an error while rendering.</p>
      <pre style="
        background: rgba(255,68,68,0.1);
        padding: 15px;
        border-radius: 5px;
        max-width: 100%;
        overflow-x: auto;
        margin: 20px 0;
      ">${errorMessage}</pre>
      <button onclick="window.location.reload()" style="
        padding: 10px 20px;
        background: #00F0FF;
        border: none;
        border-radius: 5px;
        color: #0A0E17;
        cursor: pointer;
      ">Reload Page</button>
    </div>
  `;
}
