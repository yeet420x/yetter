import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/ChatInterface.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket('wss://hcycfuvviw7fmk-8000.proxy.runpod.net/ws/chat');
    
    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setWs(socket);
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        setMessages(prev => [...prev, { text: response.message, sender: 'luna' }]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      setWs(null);
      setTimeout(connectWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (ws && input.trim() && isConnected) {
      const message = { message: input.trim() };
      ws.send(JSON.stringify(message));
      setMessages(prev => [...prev, { text: input.trim(), sender: 'user' }]);
      setInput('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-box">
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isConnected ? "Whisper to LUNA..." : "Connecting..."}
            className="message-input"
            disabled={!isConnected}
          />
          <button 
            className="speak-button" 
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
          >
            SPEAK
          </button>
        </div>
      </div>
      <div className="luna-avatar">
        <img src="/images/luna.png" alt="Luna" />
      </div>
    </div>
  );
}

export default ChatInterface; 