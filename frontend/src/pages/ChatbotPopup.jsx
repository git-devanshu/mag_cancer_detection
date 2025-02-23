import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import "../styles/ChatbotPopup.css";

function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const togglePopup = () => setIsOpen(!isOpen);

  async function sendMessage() {
    if (!userInput.trim()) return;
    
    const newMessage = {
      sender: "user",
      text: userInput,
      isHtml: false
    };
    setMessages(prev => [...prev, newMessage]);
    
    setMessages(prev => [...prev, { 
      sender: "bot", 
      text: "...", 
      isHtml: false, 
      isLoading: true 
    }]);
    
    const currentInput = userInput;
    setUserInput("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "HTTP-Referer": "https://www.sitename.com",
          "X-Title": "SiteName",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: currentInput }],
        }),
      });
      
      const data = await res.json();
      const markdownText = data.choices?.[0]?.message?.content || "No response received.";
      
      setMessages(prev => [
        ...prev.filter(msg => !msg.isLoading),
        { 
          sender: "bot", 
          text: marked.parse(markdownText), 
          isHtml: true 
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(msg => !msg.isLoading),
        { 
          sender: "bot", 
          text: `Error: ${error.message}`, 
          isHtml: false 
        }
      ]);
    }
  }

  return (
    <>
      {/* Updated toggle button with pulse animation */}
      <button 
        className={`chatbot-toggle-btn ${!isOpen ? "pulse" : ""}`} 
        onClick={togglePopup}
      >
        Ask me questions!
      </button>

      <div className={`chatbot-popup ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <h5>ChatBot</h5>
          <button className="close-btn" onClick={togglePopup}>×</button>
        </div>
        
        <div className="chatbot-body">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              {message.isHtml ? (
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              ) : (
                <div className="message-content">
                  {message.text}
                  {message.isLoading && (
                    <div className="typing-indicator">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-footer">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default ChatbotPopup;
