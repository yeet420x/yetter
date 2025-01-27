import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoadingOverlay from './components/LoadingOverlay';
import './index.css';

const Root = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Show overlay for 15 seconds
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showOverlay && <LoadingOverlay />}
      <App />
    </>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Root />
); 