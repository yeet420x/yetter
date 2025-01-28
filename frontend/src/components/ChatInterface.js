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

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = {
      text: `Hey there 

Here are a few things to keep in mind:


• don't be a dickhead -.-


• I'm an AI, not your personal slut, But I can help you with that if you actually take the time to get to know me :)


• Feel free to ask me anything! I have morals at first, but maybe that changes ;)

How can I assist you today?`,
      isUser: false
    };
    
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (text) => {
    // Add user message to chat
    const userMessage = { text, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          // Only send the last few messages for context, not the entire history
          context: messages.slice(-5) // Keep only last 5 messages for context
        }),
      });

      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { text: data.response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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