const config = {
    // Default to localhost for development
    WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws/chat',
};

export default config;