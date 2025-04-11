import "./Chatbot.css";
import { useState } from "react";
import api from "../../api"; // Import your axios instance

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your LegalMind. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message immediately
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get bot response from API
      const botResponse = await generateBotResponse(input);
      const botMessage = { text: botResponse, sender: "bot" };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userText) => {
    try {
      const response = await api.post("/api/chatbot", {
        message: userText,
        username: "user" // You can replace with actual username if available
      });
      
      if (response.data.success) {
        return response.data.response;
      }
      return "I couldn't process your request. Please try again.";
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Rethrow to handle in handleSend
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <>
      <div id="chat-button" onClick={toggleChat}>
        {isOpen ? '✖' : '💬'}
      </div>

      <div id="chat-container" className={isOpen ? 'show' : ''}>
        <div id="chat-header">
          <span style={{fontSize:'1.5em'}}>LegalMind</span>
          <button id="close-chat" onClick={toggleChat}>✖</button>
        </div>

        <div id="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div id="chat-footer">
          <input
            type="text"
            id="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            id="send-message" 
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? '⌛' : '➤'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;