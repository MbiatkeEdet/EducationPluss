// components/ui/ChatInterface.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/api';
import { cleanMessageForDisplay, extractUserContent } from '@/lib/messageUtils';

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [messageSent, setMessageSent] = useState(false);
  const messagesEndRef = useRef(null);

  // Enhanced system context function
  const getEnhancedSystemContext = () => {
    let enhancedContext = systemContext || '';
    
    if (!formatInstructions) {
      enhancedContext += `

RESPONSE FORMATTING GUIDELINES:
- Use proper Markdown formatting in all responses
- For code snippets, use triple backticks with the language identifier (e.g., \`\`\`html, \`\`\`jsx, \`\`\`css)
- For important points, use **bold** formatting
- For lists, use proper Markdown bullet points or numbered lists
- For hierarchical content, use proper heading levels (# for main headings, ## for subheadings)`;
    } else {
      enhancedContext += "\n\n" + formatInstructions;
    }
    
    return enhancedContext;
  };
  
  useEffect(() => {
    if (currentChatId) {
      fetchChatHistory();
    } else if (initialMessage && systemContext) {
      setChatHistory([
        { role: 'system', content: getEnhancedSystemContext(), timestamp: Date.now() }
      ]);
    }
  }, [currentChatId, systemContext]);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, streamingMessage]);

  useEffect(() => {
    if (initialMessage && !messageSent) {
      const fakeEvent = { preventDefault: () => {} };
      handleSendMessage(fakeEvent, initialMessage);
      setMessageSent(true);
    }
  }, [initialMessage]);

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
      const cleanedMessages = response.data.messages.map(msg => {
        if (msg.role === 'user') {
          return {
            ...msg,
            content: extractUserContent(msg.content)
          };
        }
        return msg;
      });
      setChatHistory(cleanedMessages);
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

    const displayMessage = extractUserContent(userMessage);
    
    // Add user message to chat history immediately
    const newUserMessage = {
      role: 'user',
      content: displayMessage,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setError(null);
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');
    
    // Add empty assistant message for streaming
    setChatHistory(prev => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true
    }]);

    try {
      const chatData = await apiClient.sendMessageStream(
        userMessage,
        currentChatId,
        aiProvider || 'deepseek',
        model || 'deepseek-chat',
        needsSystemContext ? getEnhancedSystemContext() : undefined,
        feature,
        subFeature,
        // onChunk callback - IMPROVED VERSION
        (chunk, fullResponse) => {
          console.log('Streaming chunk received:', chunk); // Add debugging
          setStreamingMessage(fullResponse);
          
          // Update the streaming message in chat history more efficiently
          setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessageIndex = newHistory.length - 1;
            
            if (lastMessageIndex >= 0 && newHistory[lastMessageIndex].role === 'assistant') {
              newHistory[lastMessageIndex] = {
                ...newHistory[lastMessageIndex],
                content: fullResponse,
                streaming: true
              };
            }
            return newHistory;
          });
        },
        // onComplete callback
        (completeData, fullResponse) => {
          console.log('Streaming complete:', fullResponse); // Add debugging
          setCurrentChatId(completeData.chat._id);
          
          // Final update with complete response
          setChatHistory(prev => {
            const newHistory = [...prev];
            const lastMessageIndex = newHistory.length - 1;
            
            if (lastMessageIndex >= 0 && newHistory[lastMessageIndex].role === 'assistant') {
              newHistory[lastMessageIndex] = {
                ...newHistory[lastMessageIndex],
                content: fullResponse,
                streaming: false
              };
            }
            return newHistory;
          });
          
          setIsStreaming(false);
          setStreamingMessage('');
          
          if (onAiResponse) {
            onAiResponse(fullResponse);
          }
        },
        // onError callback
        (error) => {
          console.error('Streaming error:', error); // Add debugging
          setError(error.message);
          setIsStreaming(false);
          setStreamingMessage('');
          
          // Remove the empty assistant message on error
          setChatHistory(prev => prev.slice(0, -1));
        }
      );
      
    } catch (error) {
      console.error('Send message error:', error);
      setError(error.message);
      setIsStreaming(false);
      setStreamingMessage('');
      
      // Remove the empty assistant message on error
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (!showChat) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory
          .filter(msg => msg.role !== 'system') // Don't display system messages
          .map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              <div className="whitespace-pre-wrap break-words">
                {msg.role === 'assistant' ? (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: cleanMessageForDisplay(msg.content) 
                    }} 
                  />
                ) : (
                  msg.content
                )}
                {msg.streaming && (
                  <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">AI is responding...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">Thinking...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
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
      
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading || isStreaming}
          />
          <button
            type="submit"
            disabled={isLoading || isStreaming || !message.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isStreaming ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}