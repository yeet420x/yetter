import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import EntranceAnimation from './components/EntranceAnimation';
import './App.css';

const App: React.FC = () => {
  // Start with loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted, showing entrance animation');
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <EntranceAnimation onComplete={() => {
          console.log('Animation complete, setting loading false');
          setIsLoading(false);
        }} />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header with Logo */}
      <header className="app-header">
        <div className="logo-container">
          <img src="/images/luna.png" alt="Luna AI" className="logo-image" />
          <h1 className="logo-text">Luna AI</h1>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="app-main">
        <ChatInterface />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2024 Luna AI. Your Gothic AI Companion.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 