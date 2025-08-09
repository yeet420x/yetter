import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/ChatInterface.css';
import config from '../config';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const connectWebSocket = useCallback(() => {
    // Clean up any existing connection
    if (ws) {
      try {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close(1000, "Cleanup before reconnect");
        }
      } catch (e) {
        console.error('Error closing existing connection:', e);
      }
      setWs(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }

    console.log('Creating new WebSocket connection');
    setConnectionStatus('connecting');
    const socket = new WebSocket(config.WEBSOCKET_URL);
    
    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setWs(socket);
      setConnectionStatus('connected');
    };

    socket.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.message) {
          setMessages(prev => [...prev, { text: response.message, sender: 'luna' }]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
        setMessages(prev => [...prev, { text: "omg bestie my brain just glitched 🖤", sender: 'luna' }]);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket Disconnected:', event.code, event.reason);
      
      // Clean up the current socket
      setIsConnected(false);
      setWs(null);
      setConnectionStatus('disconnected');
      
      // Attempt reconnect for any non-normal closure
      if (event.code !== 1000 && event.code !== 1001) {
        console.log('Scheduling reconnect...');
        setConnectionStatus('reconnecting');
        setTimeout(() => {
          console.log('Attempting reconnect...');
          connectWebSocket();
        }, 3000);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
      setMessages(prev => [...prev, { text: "brb bestie, my wifi is being weird 🖤", sender: 'luna' }]);
    };
  }, []); // Remove ws from dependencies to avoid circular dependency

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      connectWebSocket();
    }

    return () => {
      mounted = false;
      if (ws) {
        try {
          if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            ws.close(1000, "Component unmounting");
          }
        } catch (e) {
          console.error('Error closing WebSocket on unmount:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = {
      text: "omg hi bestie! 🖤 just vibing and listening to some music, wanna chat?",
      sender: "luna"
    };
    
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Check if WebSocket is ready
    if (ws && ws.readyState === WebSocket.OPEN && isConnected) {
      try {
        const message = { message: input.trim() };
        ws.send(JSON.stringify(message));
        setMessages(prev => [...prev, { text: input.trim(), sender: 'user' }]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { text: "omg bestie my message got lost 🖤", sender: 'luna' }]);
        // Try to reconnect on error
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      }
    } else {
      console.log('WebSocket not ready. State:', ws?.readyState, 'Connected:', isConnected, 'Status:', connectionStatus);
      
      // Add user message anyway
      setMessages(prev => [...prev, { text: input.trim(), sender: 'user' }]);
      setInput('');
      
      // Show appropriate message based on connection status
      if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
        setMessages(prev => [...prev, { text: "brb bestie, trying to reconnect 🖤", sender: 'luna' }]);
      } else if (connectionStatus === 'error' || connectionStatus === 'disconnected') {
        setMessages(prev => [...prev, { text: "omg bestie the connection is being weird rn 🖤", sender: 'luna' }]);
        // Try to reconnect
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      } else {
        setMessages(prev => [...prev, { text: "brb bestie, trying to reconnect 🖤", sender: 'luna' }]);
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      }
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-box">
        <div className="connection-status">
          <span className={`status-indicator ${connectionStatus}`}>
            {getConnectionStatusText()}
          </span>
        </div>
        <div className="messages-area">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender}`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={isConnected ? "Say something don't be shy :D" : "Awaiting connection..."}
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
        <img src={process.env.PUBLIC_URL + '/images/Luna.png'} alt="Luna" />
      </div>
    </div>
  );
}

export default ChatInterface; 