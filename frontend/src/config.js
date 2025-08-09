const config = {
    // Use secure WebSocket in production, fallback to local in development
    WEBSOCKET_URL: process.env.NODE_ENV === 'production' 
        ? 'wss://yetter.onrender.com/ws/chat'
        : 'ws://localhost:8000/ws/chat',
};

export default config;