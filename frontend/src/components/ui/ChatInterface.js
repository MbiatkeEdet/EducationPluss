// components/ui/ChatInterface.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/api'; // Adjust the import based on your project structure
import { cleanMessageForDisplay } from '@/lib/messageUtils';

export default function ChatInterface({ 
  initialMessage = '', 
  chatId = null,
  aiProvider = null, 
  model = null,
  placeholder = 'Type your message...',
  systemContext = '',
  showChat = true,
  onAiResponse = null,
  formatInstructions = '',
  feature = null,
  subFeature = null        
}) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [messageSent, setMessageSent] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Enhance the system context with formatting instructions based on tool type
  const getEnhancedSystemContext = () => {
    // Base context
    let enhancedContext = systemContext;
    
    // Add generic formatting instructions if none provided specifically
    if (!formatInstructions) {
      enhancedContext += `

RESPONSE FORMATTING GUIDELINES:
- Use proper Markdown formatting in all responses
- For code snippets, use triple backticks with the language identifier (e.g., \`\`\`html, \`\`\`jsx, \`\`\`css)
- For important points, use **bold** formatting
- For lists, use proper Markdown bullet points or numbered lists
- For hierarchical content, use proper heading levels (# for main headings, ## for subheadings)`;
    } else {
      // Add custom format instructions if provided
      enhancedContext += "\n\n" + formatInstructions;
    }
    
    return enhancedContext;
  };
  
  useEffect(() => {
    if (currentChatId) {
      fetchChatHistory();
    } else if (initialMessage && systemContext) {
      // For new chats with system context, add it silently with enhanced formatting
      setChatHistory([
        { role: 'system', content: getEnhancedSystemContext(), timestamp: Date.now() }
      ]);
    }
  }, [currentChatId, systemContext]);
  
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
    
    const userMessage = explicitMessage || message.trim();
    if (!userMessage) return;

    // Replace the existing cleanUserMessage function with the imported utility
    const displayMessage = cleanMessageForDisplay(userMessage);
    
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
    
    // If this is first message and we have system context, ensure it's enhanced
    const needsSystemContext = !currentChatId && 
      !chatHistory.some(msg => msg.role === 'system' && msg.content.includes(getEnhancedSystemContext()));
    
    try {
      const response = await apiClient.sendMessage(
        userMessage,
        currentChatId,
        aiProvider,
        model,
        needsSystemContext ? getEnhancedSystemContext() : undefined,
        feature,      // Pass feature
        subFeature    // Pass subFeature
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