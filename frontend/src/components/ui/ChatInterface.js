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
  showChat = true,
  onAiResponse = null
}) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [messageSent, setMessageSent] = useState(false);
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

  useEffect(() => {
    // When initialMessage changes and is not empty, automatically send it
    if (initialMessage && !messageSent) {
      // Send the message to the backend - pass the actual initialMessage directly
      const fakeEvent = { preventDefault: () => {} };
      handleSendMessage(fakeEvent, initialMessage); // Pass initialMessage explicitly
      setMessageSent(true);
    }
  }, [initialMessage]);

  // Reset messageSent when initialMessage changes to empty
  useEffect(() => {
    if (!initialMessage) {
      setMessageSent(false);
    }
  }, [initialMessage]);
  
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
  
  const handleSendMessage = async (e, explicitMessage = null) => {
    e.preventDefault();
    
    // Use the explicit message if provided, otherwise use the input field value
    const userMessage = explicitMessage || message.trim();
    
    if (!userMessage) return;
    
    // For display purposes, extract just user content when the message includes a system prompt
    let displayMessage = userMessage;
    
    // Check for common patterns in study tools and writing help sections
    const prefixesToStrip = [
      "Please help me organize these notes into a well-structured study guide:\n\n",
      "Please summarize this content for study purposes:\n\n",
      "Please create a mind map based on this content:\n\n",
      "Please explain these concepts in a simple, clear way:\n\n",
      "Please create study flashcards from this content. Format them exactly as specified in your instructions:\n\n",
      "Please help me paraphrase the following text: ",
      "I need help with my research on ",
      "I need help writing an essay about "
    ];
    
    // Strip prefix if it exists
    for (const prefix of prefixesToStrip) {
      if (userMessage.startsWith(prefix)) {
        displayMessage = userMessage.substring(prefix.length);
        break;
      }
    }
    
    // Add user message to chat history immediately for UI feedback
    const updatedChatHistory = [...chatHistory, { 
      role: 'user', 
      content: displayMessage, // Use cleaned display message
      timestamp: Date.now(),
      originalContent: userMessage // Store original for API calls
    }];
    
    setChatHistory(updatedChatHistory);
    setMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.sendMessage(
        userMessage, // Send the full original message to API
        currentChatId,
        aiProvider,
        model
      );
      
      // Update with the server response
      setCurrentChatId(response.data.chat._id);
      setChatHistory(response.data.chat.messages);
      
      // Pass the response back to the parent component
      if (response && onAiResponse) {
        onAiResponse(response.data.aiResponse);
      }
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