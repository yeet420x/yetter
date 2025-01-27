import { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import BackgroundText from './components/BackgroundText';
import EntranceAnimation from './components/EntranceAnimation';

function App() {
  const [showEntrance, setShowEntrance] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/audio/lonely.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    const handleFirstInteraction = () => {
      audioRef.current.play().catch(err => 
        console.log('Audio playback failed:', err)
      );
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAnimationComplete = () => {
    setShowEntrance(false);
    setTimeout(() => {
      setShowContent(true);
      // Try to play again after animation
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => 
          console.log('Audio playback failed after animation:', err)
        );
      }
    }, 100);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="App" onClick={() => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => 
          console.log('Audio playback failed on click:', err)
        );
      }
    }}>
      <div className="audio-hint">
        CLICK ANYWHERE FOR AUDIO
      </div>
      {showEntrance && (
        <EntranceAnimation onComplete={handleAnimationComplete} />
      )}
      <div className={`content ${showContent ? 'visible' : ''}`}>
        <div className="background-container">
          <BackgroundText />
        </div>
        <header className="header">
          <h1 className="luna-title">LUNA</h1>
        </header>
        <main className="main-content">
          <ChatInterface />
        </main>
        <footer className="footer">
          <div className="social-icons">
            <a href="https://t.me/LunAIonSOL" className="icon-link">
              <img src="/images/tg.svg" alt="Telegram" />
            </a>
            <a href="https://raydium.io/swap" className="icon-link">
              <img 
                src="/images/dex.svg" 
                alt="Dex" 
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </a>
            <a href="https://docs.lunai.com" className="icon-link">
              <img src="/images/gitbook.svg" alt="Gitbook" />
            </a>
            <a href="https://x.com/LunAIonSOL" className="icon-link">
              <img 
                src="/images/X.svg" 
                alt="X" 
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain'
                }}
              />
            </a>
          </div>
          <button 
            className="minimal-audio-toggle"
            onClick={toggleMute}
            aria-label="Toggle audio"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;