import React, { useState, useEffect, useCallback, useRef } from 'react';
import LunaVRMAvatar from './LunaVRMAvatar';
import './styles/ChatInterface.css';
import './styles/animations.css';

interface Message {
  text: string;
  sender: 'user' | 'luna';
}

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'wss://brgm9o3aaypdrt-8000.proxy.runpod.net/ws/chat';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isLunaSpeaking, setIsLunaSpeaking] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [isHappy, setIsHappy] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = useCallback(() => {
    try {
      const websocket = new WebSocket(WEBSOCKET_URL);
      
      websocket.onopen = () => {
        console.log('Connected to Luna');
        setIsConnected(true);
      };

      websocket.onclose = () => {
        console.log('Disconnected from Luna');
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        console.log('WebSocket error, Luna might be offline');
        setConnectionAttempted(true); // Mark that we tried to connect
      };

      setWs(websocket);
    } catch (error) {
      console.log('Failed to create WebSocket connection');
      setConnectionAttempted(true);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const checkForGreeting = (message: string): boolean => {
    const greetings = [
      'hi', 'hello', 'hey', 'hiya', 'greetings',
      'こんにちは', 'おはよう', 'こんばんは', // Japanese greetings
      'yo', 'sup', 'howdy'
    ];
    return greetings.some(greeting => 
      message.toLowerCase().includes(greeting.toLowerCase())
    );
  };

  const sendMessage = useCallback(() => {
    if (ws && input.trim() && isConnected) {
      const trimmedInput = input.trim();
      
      // Check if message is a greeting
      if (checkForGreeting(trimmedInput)) {
        setIsGreeting(true);
        // Reset greeting state after animation
        setTimeout(() => setIsGreeting(false), 1500);
      }

      ws.send(JSON.stringify({ message: trimmedInput }));
      setMessages(prev => [...prev, { text: trimmedInput, sender: 'user' }]);
      setInput('');
      setIsTyping(true);
    }
  }, [ws, input, isConnected]);

  const checkForPositiveMessage = (message: string): boolean => {
    const positiveWords = [
      'love', 'cute', 'amazing', 'wonderful', 'great',
      'thank', 'thanks', 'awesome', 'beautiful', 'sweet',
      'perfect', 'best', '❤️', '😊', '🥰'
    ];
    return positiveWords.some(word => 
      message.toLowerCase().includes(word.toLowerCase())
    );
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        setMessages(prev => [...prev, { text: response.message, sender: 'luna' }]);
        setIsTyping(false);
        setCurrentEmotion(determineEmotion(response.message));
        
        // Check if Luna received a positive message
        if (checkForPositiveMessage(response.message)) {
          setIsHappy(true);
          setTimeout(() => setIsHappy(false), 2000);
        }
      };
    }
  }, [ws]);

  const determineEmotion = (response: string): string => {
    if (response.includes('😊') || response.includes('happy')) return 'happy';
    if (response.includes('😢') || response.includes('sad')) return 'sad';
    if (response.includes('😠') || response.includes('angry')) return 'angry';
    if (response.includes('😮') || response.includes('surprised')) return 'surprised';
    return 'neutral';
  };

  return (
    <div className="chat-interface">
      <div className="chat-container">
        <div className="avatar-section">
          <LunaVRMAvatar 
            emotion={currentEmotion} 
            isSpeaking={isLunaSpeaking}
            isGreeting={isGreeting}
            isHappy={isHappy}
          />
        </div>
        <div className="messages-section">
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isConnected ? "Whisper into the void..." : "Awaiting connection..."}
              disabled={!isConnected}
            />
            <button 
              onClick={sendMessage}
              disabled={!isConnected || !input.trim()}
              className={!isConnected ? 'disabled' : ''}
            >
              Speak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 