// components/ui/ChatInterface.jsx - Modern Streaming Implementation
"use client";

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import apiClient from '@/lib/api';
import { cleanMessageForDisplay, extractUserContent } from '@/lib/messageUtils';
import '@/styles/streaming.css';

export default function ChatInterface({ 
  initialMessage = '', 
  chatId = null,
  aiProvider = null, 
  model = null,
  placeholder = 'Type your message...',
  systemContext = '',
  showChat = true,
  showInput = true,
  hideAiResponse = false,
  onAiResponse = null,
  formatInstructions = '',
  feature = null,
  subFeature = null        
}) {
  // Simplified state management - only essential states
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [processedInitialMessage, setProcessedInitialMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Enhanced system context function with clean formatting
  const getEnhancedSystemContext = () => {
    let enhancedContext = systemContext || '';
    
    if (!formatInstructions) {
      enhancedContext += `

RESPONSE FORMATTING GUIDELINES:
- Use proper Markdown formatting in all responses
- For code snippets, use triple backticks with the language identifier (e.g., \`\`\`html, \`\`\`jsx, \`\`\`css)
- For important points, use **bold** formatting
- For lists, use proper Markdown bullet points or numbered lists
- For hierarchical content, use proper heading levels (# for main headings, ## for subheadings)
- Structure your response clearly with proper spacing and organization
- Use tables when presenting structured data
- Use blockquotes for important notes or callouts`;
    } else {
      enhancedContext += "\n\n" + formatInstructions;
    }
    
    return enhancedContext;
  };
  // Initialize chat history and system context
  useEffect(() => {
    if (currentChatId) {
      fetchChatHistory();
    } else if (systemContext) {
      setChatHistory([
        { role: 'system', content: getEnhancedSystemContext(), timestamp: Date.now() }
      ]);
    }
  }, [currentChatId, systemContext]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle initial message processing
  useEffect(() => {
    if (initialMessage && initialMessage !== processedInitialMessage) {
      console.log('Processing initial message:', initialMessage);
      setProcessedInitialMessage(initialMessage);
      
      // Process the initial message immediately
      const fakeEvent = { preventDefault: () => {} };
      handleSendMessage(fakeEvent, initialMessage);
    }
  }, [initialMessage]);

  // Reset processed message when initialMessage is cleared
  useEffect(() => {
    if (!initialMessage) {
      setProcessedInitialMessage('');
    }
  }, [initialMessage]);

  // Initialize socket connection with clean status tracking
  useEffect(() => {
    let reconnectTimeout;
    
    const initializeConnection = async () => {
      try {
        setConnectionStatus('connecting');
        await apiClient.initializeSocket();
        setSocketConnected(true);
        setConnectionStatus('connected');
        console.log('WebSocket connected successfully');
      } catch (error) {
        console.error('Socket connection failed:', error);
        setSocketConnected(false);
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeout = setTimeout(() => {
          if (!socketConnected) {
            console.log('Attempting to reconnect...');
            initializeConnection();
          }
        }, 3000);
      }
    };

    initializeConnection();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      apiClient.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };
  
  const fetchChatHistory = async () => {
    try {
      setIsProcessing(true);
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
      setIsProcessing(false);
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
    setIsProcessing(true);
    
    // Add empty assistant message that will be populated by streaming chunks
    const streamingMessageId = Date.now();
    const streamingMessage = {
      id: streamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      isThinking: true // Start with "thinking" state
    };
    setChatHistory(prev => [...prev, streamingMessage]);

    const needsSystemContext = currentChatId === null || chatHistory.length === 0;

    try {
      if (socketConnected) {
        // Use WebSocket for real-time streaming - simplified implementation
        await apiClient.sendMessageSocket({
          content: userMessage,
          chatId: currentChatId,
          aiProvider: aiProvider || 'deepseek',
          model: model || 'deepseek-chat',
          systemContext: needsSystemContext ? getEnhancedSystemContext() : undefined,
          feature,
          subFeature
        }, {
          onStarted: (data) => {
            console.log('Chat started:', data);
            setError(null);
          },
          onInfo: (data) => {
            console.log('Chat info:', data);
            setCurrentChatId(data.chatId);
          },
          onChunk: (data) => {
            // DIRECT CHUNK DISPLAY - no simulation, no delays
            const content = data.content || data.fullContent || '';
            const fullContent = data.fullContent || content;
            
            console.log('Received chunk:', { content, fullContent });
            
            // Update the streaming message immediately with real chunk data
            setChatHistory(prev => {
              const newHistory = [...prev];
              const messageIndex = newHistory.findIndex(msg => msg.id === streamingMessageId);
              
              if (messageIndex >= 0) {
                newHistory[messageIndex] = {
                  ...newHistory[messageIndex],
                  content: fullContent,
                  isStreaming: true,
                  isThinking: false, // Switch from thinking to typing when first chunk arrives
                  isTyping: fullContent.length > 0
                };
              }
              return newHistory;
            });
          },
          onComplete: (data) => {
            console.log('Chat complete:', data);
            
            // Final update with complete response
            setChatHistory(prev => {
              const newHistory = [...prev];
              const messageIndex = newHistory.findIndex(msg => msg.id === streamingMessageId);
              
              if (messageIndex >= 0) {
                newHistory[messageIndex] = {
                  ...newHistory[messageIndex],
                  content: data.aiResponse.content,
                  isStreaming: false,
                  isThinking: false,
                  isTyping: false
                };
                delete newHistory[messageIndex].id; // Remove temp ID
              }
              return newHistory;
            });
            
            setIsProcessing(false);
            
            if (onAiResponse) {
              onAiResponse({
                ...data.aiResponse,
                chatId: data.chatId || currentChatId
              });
            }
          },
          onError: (error) => {
            console.error('Socket error:', error);
            setError(error.error || error.message || 'An error occurred');
            setIsProcessing(false);
            
            // Remove the empty assistant message on error
            setChatHistory(prev => prev.filter(msg => msg.id !== streamingMessageId));
          }
        });
      } else {
        // Fallback to HTTP
        const response = await apiClient.sendMessage(
          userMessage,
          currentChatId,
          aiProvider || 'deepseek',
          model || 'deepseek-chat',
          needsSystemContext ? getEnhancedSystemContext() : undefined,
          feature,
          subFeature
        );

        setCurrentChatId(response.data.chat._id);
        
        // Update chat history with AI response
        setChatHistory(prev => {
          const newHistory = [...prev];
          const messageIndex = newHistory.findIndex(msg => msg.id === streamingMessageId);
          
          if (messageIndex >= 0) {
            newHistory[messageIndex] = {
              ...newHistory[messageIndex],
              content: response.data.aiResponse.content,
              isStreaming: false,
              isThinking: false,
              isTyping: false
            };
            delete newHistory[messageIndex].id; // Remove temp ID
          }
          return newHistory;
        });

        if (onAiResponse) {
          onAiResponse({
            ...response.data.aiResponse,
            chatId: response.data.chat._id
          });
        }
      }
      
    } catch (error) {
      console.error('Send message error:', error);
      setError(error.message);
      setIsProcessing(false);
      
      // Remove the empty assistant message on error
      setChatHistory(prev => prev.filter(msg => msg.id !== streamingMessageId));
    }
  };

  // Enhanced Markdown components with better styling
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative">
          <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {match[1]}
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg my-3 !bg-gray-900"
            customStyle={{
              padding: '1rem',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 text-gray-800">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-base font-bold mb-2 text-gray-800">{children}</h4>
    ),
    p: ({ children }) => (
      <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-400 pl-4 py-2 my-3 bg-indigo-50 italic text-gray-700 rounded-r">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-gray-300 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm text-gray-700">{children}</td>
    ),
    hr: () => (
      <hr className="my-4 border-gray-300" />
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-indigo-600 hover:text-indigo-800 underline"
      >
        {children}
      </a>
    )
  };

  // Simplified connection status indicator
  const renderConnectionStatus = () => {
    const statusConfig = {
      connecting: {
        color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
        icon: '⏳',
        message: 'Connecting to real-time chat...'
      },
      connected: {
        color: 'bg-green-100 border-green-300 text-green-700',
        icon: '✅',
        message: 'Connected - Real-time streaming enabled'
      },
      disconnected: {
        color: 'bg-red-100 border-red-300 text-red-700',
        icon: '⚠️',
        message: 'Connection lost - Using fallback mode'
      }
    };

    const config = statusConfig[connectionStatus];
    
    return (
      <div className={`${config.color} px-3 py-2 rounded-lg text-sm border flex items-center gap-2`}>
        <span>{config.icon}</span>
        <span>{config.message}</span>
      </div>
    );
  };

  if (!showChat) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages container - scrollable */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {/* Enhanced Connection status indicator */}
        {connectionStatus !== 'connected' && renderConnectionStatus()}

        {chatHistory
          .filter(msg => {
            if (msg.role === 'system') return false;
            if (hideAiResponse && msg.role === 'assistant' && !msg.isStreaming) return false;
            return true;
          })
          .map((msg, index) => (
          <div key={msg.id || index} className={`flex message-enter ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-4xl px-4 py-3 rounded-lg shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              <div className="whitespace-pre-wrap break-words">
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none streaming-content">
                    <ReactMarkdown components={MarkdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                    {/* Real-time streaming indicators */}
                    {msg.isStreaming && msg.isTyping && msg.content && (
                      <span className="inline-block w-2 h-5 bg-gray-600 typing-cursor ml-1 align-text-bottom"></span>
                    )}
                    {msg.isStreaming && msg.isThinking && !msg.content && (
                      <div className="flex items-center space-x-2 gentle-pulse">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full thinking-dot"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full thinking-dot"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full thinking-dot"></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is thinking...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="leading-relaxed">{msg.content}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Simple loading indicator for HTTP fallback */}
        {isProcessing && !socketConnected && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">Processing...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 my-4 rounded-lg" role="alert">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Fixed input section at bottom - only show if showInput is true */}
      {showInput && (
        <div className="flex-shrink-0 border-t bg-white shadow-lg">
          <form onSubmit={handleSendMessage} className="p-4">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                {isProcessing && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isProcessing || !message.trim()}
                className="flex-shrink-0 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            
            {/* Simplified status indicator */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span>{socketConnected ? 'Real-time streaming' : 'Standard mode'}</span>
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}