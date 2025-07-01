"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, History, X, Code, FileText } from 'lucide-react';
import ChatInterface from '@/components/ui/ChatInterface';
import ChatHistoryManager from '@/components/ui/ChatHistoryManager';
import FlashcardDisplay from '@/components/ui/FlashcardDisplay';
import { extractUserContent } from '@/lib/messageUtils';
import dynamic from 'next/dynamic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';


// Dynamic import for jsPDF to avoid SSR issues
const JsPDF = dynamic(
  () => import('jspdf').then(mod => mod.default),
  { ssr: false }
);

const studyTools = [
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Generate flashcards from your study material',
    icon: '🗂️',
    systemContext: 'You are a flashcard generator. Create comprehensive flashcards from the provided content. Each flashcard should have a clear question on one side and a detailed answer on the other. Format your response as a numbered list with "Q:" for questions and "A:" for answers.',
    outputFormat: 'Format: Create at least 10 flashcards. Use this format:\n\n**Flashcard 1:**\n**Q:** Question here\n**A:** Answer here\n\n**Flashcard 2:**\n**Q:** Question here\n**A:** Answer here'
  },
  {
    id: 'notes',
    name: 'Note Organizer',
    description: 'Organize and structure your study notes',
    icon: '📝',
    systemContext: 'You are a note organization assistant. Help the user structure and organize their study notes effectively. Use clear headings, bullet points, and hierarchical organization to make the information accessible and organized for study purposes.',
    outputFormat: 'Return well-organized notes in markdown format with proper headings, bullet points, and clear structure'
  },
  {
    id: 'summarizer',
    name: 'Content Summarizer',
    description: 'Summarize content for quick review',
    icon: '📄',
    systemContext: 'You are a content summarization assistant. Help the user create concise, comprehensive summaries of their study material that highlight key concepts and important information.',
    outputFormat: 'Return summaries in markdown format with clear sections and bullet points for key takeaways'
  },
  {
    id: 'mindmap',
    name: 'Mind Map Creator',
    description: 'Create visual mind maps from your content',
    icon: '🗺️',
    systemContext: 'You are a mind mapping assistant. Help the user create visual mind maps that organize information hierarchically and show relationships between concepts.',
    outputFormat: 'Return the mind map in markdown format using headings, subheadings, indentation, and emojis to create a visual hierarchy'
  },
  {
    id: 'explain',
    name: 'Concept Explainer',
    description: 'Get clear explanations of difficult concepts',
    icon: '💡',
    systemContext: 'You are a concept explanation assistant. Help the user understand difficult concepts by providing clear, intuitive explanations at their level of understanding. Use analogies, examples, and break down complex ideas into simpler components.',
    outputFormat: 'Return the explanation in well-formatted markdown with proper headings, lists, analogies, and examples'
  }
];

// Create a separate component that uses useSearchParams
function StudyToolsContent() {
  const searchParams = useSearchParams();
  const [selectedTool, setSelectedTool] = useState(null);
  const [studyContent, setStudyContent] = useState('');
  const [systemContext, setSystemContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Initialize tool from URL
  useEffect(() => {
    const toolId = searchParams.get('tool');
    if (toolId) {
      const tool = studyTools.find(t => t.id === toolId);
      if (tool) {
        setSelectedTool(tool);
        setSystemContext(tool.systemContext);
      }
    }
  }, [searchParams]);

  // Load chat history from localStorage for the selected tool
  useEffect(() => {
    if (selectedTool && !selectedChat) {
      const savedHistory = localStorage.getItem(`${selectedTool.id}History`);
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      } else {
        setChatHistory([]);
      }
    }
  }, [selectedTool, selectedChat]);

  // Save chat history when it changes (only for local history, not database chats)
  useEffect(() => {
    if (selectedTool && chatHistory.length > 0 && !selectedChat) {
      localStorage.setItem(`${selectedTool.id}History`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, selectedTool, selectedChat]);
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage('');
    setAiResponse(null);
    setStudyContent('');
    setSelectedChat(null);
    setCurrentChatId(null);
    
    // Update URL without page reload
    const newUrl = `/dashboard/study-tools?tool=${tool.id}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleChatSelect = (chat) => {
    if (!chat) {
      setSelectedChat(null);
      setCurrentChatId(null);
      setChatHistory([]);
      setAiResponse(null);
      return;
    }

    setSelectedChat(chat);
    setCurrentChatId(chat._id);
    
    // Load chat messages and clean user content for display
    const cleanedMessages = chat.messages.map(msg => {
      if (msg.role === 'user') {
        return {
          ...msg,
          content: extractUserContent(msg.content)
        };
      }
      return msg;
    }).filter(msg => msg.role !== 'system');
    
    setChatHistory(cleanedMessages);
    
    // Set the last AI response for display
    const lastAiMessage = cleanedMessages.filter(msg => msg.role === 'assistant').pop();
    if (lastAiMessage) {
      setAiResponse({
        content: lastAiMessage.content
      });
    }
    
    setShowHistory(false); // Hide history sidebar on mobile
  };
  
  const handleContentSubmit = (e) => {
    e.preventDefault();
    if (!studyContent.trim() || !selectedTool) return;

    setIsProcessing(true);
    setAiResponse(null);
    
    // Create message based on tool type
    let message;
    switch (selectedTool.id) {
      case 'flashcards':
        message = `Create comprehensive flashcards from this content. Make them clear and educational:\n\n${studyContent}`;
        break;
      case 'summarizer':
        message = `Summarize this content in a clear, concise way. Include key points and main ideas:\n\n${studyContent}`;
        break;
      case 'notes':
        message = `Convert this content into well-organized study notes. Use headings, bullet points, and highlight important concepts:\n\n${studyContent}`;
        break;
      case 'mindmap':
        message = `Create a text-based mind map from this content. Show relationships between concepts and organize hierarchically:\n\n${studyContent}`;
        break;
      case 'explain':
        message = `Please explain these concepts in a simple, clear way. Use analogies and examples. Return your response in markdown format:\n\n${studyContent}`;
        break;
      default:
        message = studyContent;
    }
    
    if (selectedTool.outputFormat) {
      message += `\n\n${selectedTool.outputFormat}`;
    }
    
    // For new conversations (not continuing existing chat)
    if (!selectedChat) {
      // Use extractUserContent for the chat history display
      const newMessage = {
        role: 'user',
        content: extractUserContent(studyContent), // Show only user's actual content
        timestamp: new Date().toISOString(),
        originalContent: studyContent // Keep original for reference
      };
      
      setChatHistory(prev => [...prev, newMessage]);
    }
    
    setInitialMessage(message); // Full context goes to AI
    setStudyContent(''); // Clear input
  };
  
  const handleAiResponse = (response) => {
    setAiResponse(response);
    setIsProcessing(false);
    
    // Only add to local chat history if not using database chat
    if (!selectedChat) {
      const aiMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    }
  };

  const clearHistory = () => {
    if (selectedTool && !selectedChat) {
      setChatHistory([]);
      localStorage.removeItem(`${selectedTool.id}History`);
      setAiResponse(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadContent = (content, filename, fileType) => {
    const element = document.createElement('a');
    let file;

    switch (fileType) {
      case 'text/plain':
        file = new Blob([content], {type: fileType});
        filename = `${filename}.txt`;
        break;
      case 'text/html':
        file = new Blob([content], {type: fileType});
        filename = `${filename}.html`;
        break;
      default:
        file = new Blob([content], {type: 'text/plain'});
        filename = `${filename}.txt`;
    }

    const fileURL = URL.createObjectURL(file);
    element.href = fileURL;
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(fileURL);
  };

  // Enhanced markdown components with better styling
  const markdownComponents = {
    h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{children}</h1>,
    h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-gray-800 mt-6">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-medium mb-2 text-gray-700 mt-4">{children}</h3>,
    p: ({children}) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
    strong: ({children}) => <strong className="font-semibold text-gray-800 bg-yellow-100 px-1 rounded">{children}</strong>,
    ul: ({children}) => <ul className="list-disc ml-6 my-3 space-y-1">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal ml-6 my-3 space-y-1">{children}</ol>,
    li: ({children}) => <li className="text-gray-700">{children}</li>,
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 bg-indigo-50 py-2 italic text-gray-700">
        {children}
      </blockquote>
    ),
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && match ? (
        <div className="my-4">
          <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
            <span className="text-sm font-medium">{language.toUpperCase()}</span>
            <button
              onClick={() => copyToClipboard(String(children))}
              className="text-gray-300 hover:text-white p-1 rounded"
              title="Copy code"
            >
              <Copy size={14} />
            </button>
          </div>
          <SyntaxHighlighter
            style={atomDark}
            language={language}
            PreTag="div"
            className="rounded-t-none"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props}>
          {children}
        </code>
      );
    }
  };

  // Enhanced function to render AI response based on tool type
  const renderFormattedAiResponse = (content, toolId) => {
    switch (toolId) {
      case 'flashcards':
        return (
          <div className="space-y-4">
            <FlashcardDisplay flashcards={content} />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">💡 Study Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Review these flashcards regularly for better retention</li>
                <li>• Practice active recall by reading the question first</li>
                <li>• Use spaced repetition for optimal learning</li>
              </ul>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📝</span>
              <h3 className="text-lg font-semibold text-gray-800">Organized Study Notes</h3>
            </div>
            <div className="prose max-w-none bg-white rounded-lg p-4 shadow-sm">
              <ReactMarkdown components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        );
      
      case 'summarizer':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📄</span>
              <h3 className="text-lg font-semibold text-gray-800">Content Summary</h3>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="prose max-w-none">
                <ReactMarkdown components={markdownComponents}>
                  {content}
                </ReactMarkdown>
              </div>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>💡 Tip:</strong> Use this summary as a quick review before exams or as a starting point for deeper study.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'mindmap':
        return (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🗺️</span>
              <h3 className="text-lg font-semibold text-gray-800">Mind Map</h3>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="prose max-w-none">
                <ReactMarkdown components={{
                  ...markdownComponents,
                  h1: ({children}) => <div className="text-xl font-bold text-center p-3 bg-orange-100 rounded-lg mb-4 text-orange-800">{children}</div>,
                  h2: ({children}) => <div className="text-lg font-semibold ml-4 p-2 bg-yellow-100 rounded mb-2 text-yellow-800">{children}</div>,
                  h3: ({children}) => <div className="text-md font-medium ml-8 p-2 bg-green-100 rounded mb-2 text-green-800">{children}</div>,
                  ul: ({children}) => <ul className="ml-6 space-y-2">{children}</ul>,
                  li: ({children}) => <li className="flex items-center"><span className="mr-2">🔗</span>{children}</li>
                }}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );
      
      case 'explain':
        return (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">💡</span>
              <h3 className="text-lg font-semibold text-gray-800">Concept Explanation</h3>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="prose max-w-none">
                <ReactMarkdown components={{
                  ...markdownComponents,
                  blockquote: ({children}) => (
                    <div className="border-l-4 border-blue-500 pl-4 my-4 bg-blue-50 py-3 rounded-r-lg">
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2 text-lg">💭</span>
                        <div className="italic text-blue-700">{children}</div>
                      </div>
                    </div>
                  ),
                  strong: ({children}) => <strong className="font-semibold text-blue-800 bg-blue-100 px-1 rounded">{children}</strong>
                }}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="prose max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        );
    }
  };

  // Enhanced chat history rendering with better formatting
  const renderChatHistory = () => (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">Recent Conversations</h3>
        {chatHistory.length > 0 && !selectedChat && (
          <button 
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {chatHistory.slice(-6).map((message, index) => (
          <div key={index} className={`p-3 rounded-lg text-sm border transition-all hover:shadow-sm ${
            message.role === 'user' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="flex items-center">
                {message.role === 'user' ? (
                  <>
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    You
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    AI Assistant
                  </>
                )}
              </span>
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-gray-700">
              {message.role === 'user' 
                ? (
                    <div className="font-medium">
                      {message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')}
                    </div>
                  )
                : (
                    <div className="max-h-32 overflow-hidden">
                      {selectedTool ? renderPreviewContent(message.content, selectedTool.id) : (
                        <ReactMarkdown components={markdownComponents}>
                          {message.content.substring(0, 200) + (message.content.length > 200 ? '...' : '')}
                        </ReactMarkdown>
                      )}
                    </div>
                  )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Function to render preview content in chat history
  const renderPreviewContent = (content, toolId) => {
    const preview = content.substring(0, 150) + (content.length > 150 ? '...' : '');
    
    switch (toolId) {
      case 'flashcards':
        const flashcardCount = (content.match(/\*\*Q:\*\*/g) || []).length;
        return (
          <div className="flex items-center text-xs">
            <span className="text-blue-600 mr-2">🗂️</span>
            <span className="font-medium">{flashcardCount} flashcards generated</span>
          </div>
        );
      
      case 'notes':
        return (
          <div className="flex items-center text-xs">
            <span className="text-green-600 mr-2">📝</span>
            <span>{preview}</span>
          </div>
        );
      
      case 'summarizer':
        return (
          <div className="flex items-center text-xs">
            <span className="text-purple-600 mr-2">📄</span>
            <span>{preview}</span>
          </div>
        );
      
      case 'mindmap':
        return (
          <div className="flex items-center text-xs">
            <span className="text-orange-600 mr-2">🗺️</span>
            <span>{preview}</span>
          </div>
        );
      
      case 'explain':
        return (
          <div className="flex items-center text-xs">
            <span className="text-indigo-600 mr-2">💡</span>
            <span>{preview}</span>
          </div>
        );
      
      default:
        return <span className="text-xs">{preview}</span>;
    }
  };


  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col md:flex-row">
        
        {/* Mobile History Toggle */}
        {selectedTool && (
          <div className="md:hidden bg-white border-b p-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
            >
              <History size={20} />
              <span>Chat History</span>
            </button>
          </div>
        )}

        {/* History Sidebar */}
        {selectedTool && (showHistory || window.innerWidth >= 768) && (
          <div className={`${showHistory ? 'block' : 'hidden md:block'} w-full md:w-80 bg-white border-r relative`}>
            {/* Mobile close button */}
            <button
              onClick={() => setShowHistory(false)}
              className="md:hidden absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <ChatHistoryManager 
              feature="study-tools"
              subFeature={selectedTool.id}
              onChatSelect={handleChatSelect}
              selectedChatId={currentChatId}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-white border-b p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Study Tools</h1>
            <p className="text-sm md:text-base text-gray-600">Tools to enhance your learning and study efficiency</p>
          </div>

          {!selectedTool ? (
            /* Tool Selection Grid */
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {studyTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="bg-white p-4 md:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="text-3xl md:text-4xl mb-3 md:mb-4">{tool.icon}</div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{tool.name}</h3>
                      <p className="text-sm md:text-base text-gray-600">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Selected Tool Interface */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Tool Header */}
              <div className="bg-indigo-50 border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedTool.icon}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{selectedTool.name}</h2>
                      <p className="text-sm text-gray-600">{selectedTool.description}</p>
                      {selectedChat && (
                        <p className="text-xs text-indigo-600 mt-1">
                          Continuing conversation from {new Date(selectedChat.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToolSelect(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* Input Section */}
                {!selectedChat && (
                  <div className="w-full lg:w-1/3 bg-white border-b lg:border-b-0 lg:border-r p-4 overflow-y-auto">
                    <form onSubmit={handleContentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter your study content:
                        </label>
                        <textarea
                          value={studyContent}
                          onChange={(e) => setStudyContent(e.target.value)}
                          placeholder={`Paste your ${selectedTool.name.toLowerCase()} content here...`}
                          className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!studyContent.trim() || isProcessing}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : `Generate ${selectedTool.name}`}
                      </button>
                    </form>

                    {/* Local Chat History for new conversations */}
                    {!selectedChat && renderChatHistory()}
                  </div>
                )}

                {/* Results/Chat Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {selectedChat || aiResponse ? (
                    <div className="flex-1 bg-gray-50 overflow-hidden">
                      {selectedChat ? (
                        /* Continue Existing Chat */
                        <ChatInterface 
                          chatId={currentChatId}
                          aiProvider={selectedChat.aiProvider}
                          model={selectedChat.model}
                          systemContext=""
                          feature="study-tools"
                          subFeature={selectedTool.id}
                          showChat={true}
                          onAiResponse={handleAiResponse}
                        />
                      ) : (
                        /* New Chat Interface */
                        <div className="h-full flex flex-col">
                          {/* AI Response Display */}
                          <div className="flex-1 overflow-y-auto p-4">
                            <div className="max-w-4xl mx-auto">
                              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <span className="text-2xl mr-3">{selectedTool.icon}</span>
                                      <div>
                                        <h3 className="text-lg font-semibold text-white">
                                          {selectedTool.name} Result
                                        </h3>
                                        <p className="text-indigo-100 text-sm">
                                          Generated with AI assistance
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => copyToClipboard(aiResponse.content)}
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                        title="Copy to clipboard"
                                      >
                                        <Copy size={14} />
                                        Copy
                                      </button>
                                      <button
                                        onClick={() => downloadContent(aiResponse.content, selectedTool.name.toLowerCase(), 'text/plain')}
                                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                        title="Download"
                                      >
                                        <Download size={14} />
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-6">
                                  {/* Use the enhanced formatted response renderer */}
                                  {renderFormattedAiResponse(aiResponse.content, selectedTool.id)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Continue Chat Interface */}
                          <div className="border-t bg-white">
                            <ChatInterface 
                              initialMessage={initialMessage}
                              aiProvider="deepseek"
                              model="deepseek-chat"
                              systemContext={systemContext}
                              feature="study-tools"
                              subFeature={selectedTool.id}
                              showChat={false}
                              onAiResponse={handleAiResponse}
                              placeholder="Ask follow-up questions or request modifications..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-4">{selectedTool.icon}</div>
                        <p className="text-lg mb-2">Ready to generate {selectedTool.name.toLowerCase()}</p>
                        <p className="text-sm">Enter your content and click generate to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudyToolsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudyToolsContent />
    </Suspense>
  );
}