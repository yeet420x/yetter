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
      <header className="header">
        <h1>Luna AI</h1>
      </header>
      <div className="chat-wrapper">
        <ChatInterface />
      </div>
    </div>
  );
};

export default App; 