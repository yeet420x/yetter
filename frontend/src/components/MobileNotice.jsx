import React, { useState, useEffect } from 'react';
import './styles/MobileNotice.css';

const MobileNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 430;
    setIsVisible(isMobile);

    // Update on resize
    const handleResize = () => {
      setIsVisible(window.innerWidth <= 430);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mobile-notice">
      <div className="notice-content">
        <p>For the best experience:</p>
        <ol className="instructions">
          <li>Open your browser menu (⋮)</li>
          <li>Check "Desktop site" or "Request desktop site"</li>
          <li>Refresh the page</li>
        </ol>
        <button onClick={() => setIsVisible(false)} className="dismiss-btn">
          Continue on Mobile
        </button>
      </div>
    </div>
  );
};

export default MobileNotice; 