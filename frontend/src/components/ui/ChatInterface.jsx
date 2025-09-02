"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import apiClient from '@/lib/api';
import { cleanMessageForDisplay, extractUserContent } from '@/lib/messageUtils';

/**
 * Modern ChatInterface - Real-time streaming with minimal state management
 * Eliminates loaders and shows direct WebSocket chunk display
 */
export default function ChatInterface({ 
  initialMessage = '', 
  chatId = null,
  aiProvider = 'deepseek', 
  model = 'deepseek-chat',
  placeholder = 'Type your message...',
  systemContext = '',
  showChat = true,
  showInput = true,
  onAiResponse = null,
  formatInstructions = '',
  feature = null,
  subFeature = null        
}) {
  // Minimal state management - only essentials
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  
  const messagesEndRef = useRef(null);
  const processedInitialRef = useRef(false);
  const socketRef = useRef(null);

  // Enhanced system context with proper formatting
  const getSystemContext = useCallback(() => {
    let context = systemContext || '';
    
    if (!formatInstructions) {
      context += `

RESPONSE FORMATTING:
- Use clear Markdown formatting in all responses
- For code: use \`\`\`language blocks
- Use **bold** for emphasis and proper headings
- Structure responses with bullet points and numbered lists
- Use tables for structured data
- Keep responses well-organized and readable`;
    } else {
      context += "\n\n" + formatInstructions;
    }
    
    return context;
  }, [systemContext, formatInstructions]);

  // Initialize WebSocket connection
  useEffect(() => {
    const initSocket = async () => {
      try {
        setConnectionStatus('connecting');
        await apiClient.initializeSocket();
        setIsConnected(true);
        setConnectionStatus('connected');
        console.log('✅ WebSocket connected for real-time streaming');
      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        setIsConnected(false);
        setConnectionStatus('error');
        
        // Retry connection after 3 seconds
        setTimeout(() => {
          if (!isConnected) {
            initSocket();
          }
        }, 3000);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        apiClient.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle initial message processing
  useEffect(() => {
    if (initialMessage && !processedInitialRef.current) {
      console.log('🚀 Processing initial message:', initialMessage);
      processedInitialRef.current = true;
      
      // Add system context if needed
      if (systemContext && messages.length === 0) {
        setMessages([{ 
          role: 'system', 
          content: getSystemContext(), 
          timestamp: Date.now() 
        }]);
      }
      
      // Process initial message
      handleSendMessage(null, initialMessage);
    }
  }, [initialMessage, systemContext, getSystemContext]);

  // Reset when initialMessage changes
  useEffect(() => {
    if (!initialMessage) {
      processedInitialRef.current = false;
    }
  }, [initialMessage]);

  const handleSendMessage = async (e, explicitMessage = null) => {
    if (e) e.preventDefault();
    
    const userMessage = explicitMessage || message.trim();
    if (!userMessage) return;

    const displayMessage = extractUserContent(userMessage);
    
    // Add user message immediately
    const userMsg = {
      role: 'user',
      content: displayMessage,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setError(null);
    
    // Create streaming assistant message
    const streamingId = `streaming_${Date.now()}`;
    const assistantMsg = {
      id: streamingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      status: 'thinking' // thinking -> streaming -> complete
    };
    
    setMessages(prev => [...prev, assistantMsg]);

    // Determine if system context is needed
    const needsSystemContext = !currentChatId || messages.filter(m => m.role !== 'system').length === 0;

    try {
      if (isConnected) {
        // WebSocket streaming - Direct chunk display
        await apiClient.sendMessageSocket({
          content: userMessage,
          chatId: currentChatId,
          aiProvider: aiProvider,
          model: model,
          systemContext: needsSystemContext ? getSystemContext() : undefined,
          feature,
          subFeature
        }, {
          onStarted: (data) => {
            console.log('🎯 Streaming started:', data);
            setError(null);
          },
          
          onInfo: (data) => {
            console.log('ℹ️ Chat info:', data);
            if (data.chatId) {
              setCurrentChatId(data.chatId);
            }
          },
          
          onChunk: (data) => {
            // DIRECT REAL-TIME CHUNK DISPLAY - No simulation, no delays
            const chunkContent = data.content || data.fullContent || '';
            const fullContent = data.fullContent || chunkContent;
            
            console.log('📦 Real-time chunk:', fullContent.slice(-50));
            
            // Update message immediately with chunk data
            setMessages(prev => {
              const newMessages = [...prev];
              const msgIndex = newMessages.findIndex(m => m.id === streamingId);
              
              if (msgIndex >= 0) {
                newMessages[msgIndex] = {
                  ...newMessages[msgIndex],
                  content: fullContent,
                  status: fullContent ? 'streaming' : 'thinking'
                };
              }
              
              return newMessages;
            });
          },
          
          onComplete: (data) => {
            console.log('✅ Streaming complete:', data);
            
            // Finalize the message
            setMessages(prev => {
              const newMessages = [...prev];
              const msgIndex = newMessages.findIndex(m => m.id === streamingId);
              
              if (msgIndex >= 0) {
                newMessages[msgIndex] = {
                  ...newMessages[msgIndex],
                  content: data.aiResponse.content,
                  isStreaming: false,
                  status: 'complete'
                };
                delete newMessages[msgIndex].id; // Remove temporary ID
              }
              
              return newMessages;
            });
            
            // Callback for parent components
            if (onAiResponse) {
              onAiResponse({
                ...data.aiResponse,
                chatId: data.chatId || currentChatId
              });
            }
          },
          
          onError: (error) => {
            console.error('❌ Streaming error:', error);
            setError(error.error || error.message || 'Streaming failed');
            
            // Remove failed message
            setMessages(prev => prev.filter(m => m.id !== streamingId));
          }
        });
        
      } else {
        // HTTP fallback
        console.log('📡 Using HTTP fallback mode');
        
        const response = await apiClient.sendMessage(
          userMessage,
          currentChatId,
          aiProvider,
          model,
          needsSystemContext ? getSystemContext() : undefined,
          feature,
          subFeature
        );

        setCurrentChatId(response.data.chat._id);
        
        // Update with complete response
        setMessages(prev => {
          const newMessages = [...prev];
          const msgIndex = newMessages.findIndex(m => m.id === streamingId);
          
          if (msgIndex >= 0) {
            newMessages[msgIndex] = {
              ...newMessages[msgIndex],
              content: response.data.aiResponse.content,
              isStreaming: false,
              status: 'complete'
            };
            delete newMessages[msgIndex].id;
          }
          
          return newMessages;
        });

        if (onAiResponse) {
          onAiResponse({
            ...response.data.aiResponse,
            chatId: response.data.chat._id
          });
        }
      }
      
    } catch (error) {
      console.error('💥 Send message error:', error);
      setError(error.message || 'Failed to send message');
      
      // Remove failed message
      setMessages(prev => prev.filter(m => m.id !== streamingId));
    }
  };

  // Optimized Markdown components for better performance
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative my-4">
          <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {match[1]}
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg !bg-gray-900"
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
        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-800 border-b border-gray-200 pb-1">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-gray-800">{children}</h3>,
    p: ({ children }) => <p className="mb-3 leading-relaxed text-gray-700">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-400 pl-4 py-2 my-3 bg-indigo-50 italic text-gray-700 rounded-r">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="min-w-full border border-gray-300 rounded-lg">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-gray-50">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-300">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 text-sm text-gray-700">{children}</td>,
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
        {children}
      </a>
    )
  };

  // Connection status indicator
  const ConnectionStatus = () => {
    const statusConfig = {
      connecting: { color: 'bg-yellow-100 text-yellow-700', icon: '🔄', text: 'Connecting...' },
      connected: { color: 'bg-green-100 text-green-700', icon: '✅', text: 'Real-time streaming active' },
      error: { color: 'bg-red-100 text-red-700', icon: '⚠️', text: 'Connection failed - using fallback' }
    };

    const config = statusConfig[connectionStatus];
    
    return connectionStatus !== 'connected' ? (
      <div className={`${config.color} px-3 py-2 rounded-lg text-sm flex items-center gap-2 mb-4`}>
        <span>{config.icon}</span>
        <span>{config.text}</span>
      </div>
    ) : null;
  };

  // Streaming visual indicators
  const StreamingIndicator = ({ status, content }) => {
    if (status === 'thinking') {
      return (
        <div className="flex items-center space-x-2 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm text-gray-500">AI is thinking...</span>
        </div>
      );
    }
    
    if (status === 'streaming' && content) {
      return (
        <span className="inline-block w-0.5 h-5 bg-indigo-600 animate-pulse ml-1 align-text-bottom"></span>
      );
    }
    
    return null;
  };

  if (!showChat) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ConnectionStatus />
        
        {messages
          .filter(msg => msg.role !== 'system')
          .map((msg, index) => (
          <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl px-4 py-3 rounded-lg shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-800 border'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown components={MarkdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                  <StreamingIndicator status={msg.status} content={msg.content} />
                </div>
              ) : (
                <div className="leading-relaxed">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg" role="alert">
            <div className="flex">
              <span className="mr-2">❌</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input section */}
      {showInput && (
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={messages.some(m => m.isStreaming)}
            />
            <button
              type="submit"
              disabled={!message.trim() || messages.some(m => m.isStreaming)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          
          {/* Status indicator */}
          <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span>{isConnected ? 'Real-time streaming enabled' : 'Standard mode'}</span>
          </div>
        </div>
      )}
    </div>
  );
}