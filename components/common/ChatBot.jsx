import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import '../styles/Chatbot.css';

// Chatbot Configuration
const chatData = {
  botName: "Booking Bot",
  initialMessage: "Hi! Welcome to our Restaurant. How can I help you today?",
  options: [
    { id: 1, text: "Book a table", handler: "bookTable" },
    { id: 2, text: "Check my booking status", handler: "bookingStatus" },
    { id: 3, text: "Restaurant hours", handler: "hours" },
    { id: 4, text: "Available tables", handler: "availableTables" },
    { id: 5, text: "Cancel my booking", handler: "cancelBooking" }
  ]
};

const ChatBot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: chatData.initialMessage, timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');

  // Simulate fetching user status
  const fetchUserStatus = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user && user.hasBooking ? `You have a table booked for ${user.bookingDate}.` : "You don't have any active bookings.");
      }, 1000);
    });
  };

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        { type: 'user', text: inputText, timestamp: new Date() }
      ]);
      setInputText('');
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            type: 'bot', 
            text: "How can I help you with that?", 
            timestamp: new Date() 
          }
        ]);
      }, 1000);
    }
  };

  const handleOptionClick = async (option) => {
    setMessages([
      ...messages,
      { type: 'user', text: option.text, timestamp: new Date() }
    ]);

    setTimeout(async () => {
      let responseText = "";
      switch (option.handler) {
        case "bookTable":
          responseText = "I can assist you with booking a table. Please provide the number of people and preferred time.";
          break;
        case "bookingStatus":
          const status = await fetchUserStatus();
          responseText = status;
          break;
        case "hours":
          responseText = "We are open from 9 AM to 9 PM every day.";
          break;
        case "availableTables":
          responseText = "We currently have tables available for lunch and dinner.";
          break;
        case "cancelBooking":
          responseText = "I can assist you with canceling your booking. Please confirm your booking details.";
          break;
        default:
          responseText = "How can I assist you?";
      }

      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          text: responseText, 
          timestamp: new Date() 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      <button 
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>{chatData.botName}</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="options-container">
            {chatData.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="option-button"
              >
                {option.text}
              </button>
            ))}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write a message..."
              className="message-input"
            />
            <button
              onClick={handleSend}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
