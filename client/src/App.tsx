import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// Import Home component
import Home from './Home';

// Import components
import { MainLayout, ErrorBoundary } from './components';

// Home page wrapper with layout
const HomeWithLayout = (): React.ReactElement => {
  return (
    <MainLayout navbarType="standard">
      <Home />
    </MainLayout>
  );
};

function App(): React.ReactElement {
  console.log('App component rendering');

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomeWithLayout />} />
          <Route path="*" element={<HomeWithLayout />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
