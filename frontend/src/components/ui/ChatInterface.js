// components/ui/ChatInterface.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/api'; // Adjust the import based on your project structure

export default function ChatInterface({ 
  initialMessage = '', 
  chatId = null,
  aiProvider = null, 
  model = null,
  placeholder = 'Type your message...',
  systemContext = '',
  showChat = true
}) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (currentChatId) {
      fetchChatHistory();
    } else if (initialMessage && systemContext) {
      // For new chats with system context, add it silently
      setChatHistory([
        { role: 'system', content: systemContext, timestamp: Date.now() }
      ]);
    }
  }, [currentChatId]);
  
  useEffect(() => {
    // Scroll to bottom of chat whenever history changes
    scrollToBottom();
  }, [chatHistory]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getChat(currentChatId);
      setChatHistory(response.data.messages);
    } catch (err) {
      setError("Failed to load chat history");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && !initialMessage) return;
    
    const userMessage = message.trim() || initialMessage;
    
    // Add user message to chat history immediately for UI feedback
    const updatedChatHistory = [...chatHistory, { 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now()
    }];
    
    setChatHistory(updatedChatHistory);
    setMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.sendMessage(
        userMessage, 
        currentChatId,
        aiProvider,
        model
      );
      
      // Update with the server response
      setCurrentChatId(response.data.chat._id);
      setChatHistory(response.data.chat.messages);
    } catch (err) {
      // If error, keep the user message but show error
      setError("Failed to get AI response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      {showChat && (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {chatHistory.filter(msg => msg.role !== 'system').map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      msg.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp && formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            disabled={isLoading || (!message.trim() && !initialMessage)}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}