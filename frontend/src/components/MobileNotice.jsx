import React, { useState, useEffect } from 'react';
import './styles/MobileNotice.css';

const MobileNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 430;
    // Don't show mobile notice since we have a proper mobile interface
    setIsVisible(false);

    // Update on resize
    const handleResize = () => {
      // Always keep mobile notice hidden
      setIsVisible(false);
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