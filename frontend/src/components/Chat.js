const ws = new WebSocket('ws://localhost:8000/ws/chat');

ws.onopen = () => {
    console.log('Connected to chat server');
    setConnectionStatus('connected');
};

ws.onclose = () => {
    console.log('Disconnected from chat server');
    setConnectionStatus('disconnected');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    setConnectionStatus('error');
};

ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    // Handle response...
}; 