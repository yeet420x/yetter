import React, { useState } from 'react';
import './styles/MobileNotice.css';

const MobileNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mobile-notice">
      <div className="notice-content">
        <p>For the best experience, consider using Desktop Mode in your browser</p>
        <div className="notice-buttons">
          <button onClick={() => setIsVisible(false)} className="dismiss-btn">
            Continue on Mobile
          </button>
          <a href="?desktop=1" className="desktop-btn">
            Switch to Desktop
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileNotice; 