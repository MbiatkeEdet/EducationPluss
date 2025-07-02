"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/ui/ChatInterface';
import ChatHistoryManager from '@/components/ui/ChatHistoryManager';
import { Download, Copy, FileText, Code, Terminal, History, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { extractUserContent } from '@/lib/messageUtils';

const JsPDF = dynamic(
  () => import('jspdf').then(mod => mod.default),
  { ssr: false }
);

export default function CodeGeneratorPage() {
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [systemContext, setSystemContext] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [followUpResponse, setFollowUpResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('codeGeneratorHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
    
    setSystemContext('You are a code generation assistant. Help the user generate high-quality, well-documented code based on their requirements. Provide clear implementation steps, explanations, and best practices.');
    
    // Check screen size on client-side
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('codeGeneratorHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!codeContent.trim()) return;

    setIsProcessing(true);
    
    // Create the full message for the AI (with context and formatting)
    const fullMessage = `Please generate ${codeLanguage} code for the following requirement. Include detailed implementation steps, explanations, and best practices. Make sure to use proper markdown code blocks with language identifiers:\n\n${codeContent}`;
    
    // Store only the user's clean input in chat history
    const newMessage = {
      role: 'user',
      content: codeContent, // Only the actual user input
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    
    // Send the full message with formatting instructions to AI
    setInitialMessage(fullMessage + `\n\n${getFormatInstructions()}`);
    setCodeContent('');
  };

  const handleAiResponse = (response) => {
    setAiResponse(response);
    setIsProcessing(false);
    
    const aiMessage = {
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, aiMessage]);
  };

  const handleFollowUpResponse = (response) => {
    setFollowUpResponse(response);
    
    const aiMessage = {
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, aiMessage]);
  };

  const getFormatInstructions = () => {
    return `CODE GENERATION FORMAT:
1. Begin with a brief overview of the implementation approach
2. Format your response in the following sections:

## Implementation Steps
- Provide a numbered list of clear implementation steps

## Complete Solution
\`\`\`${codeLanguage}
// Provide the complete, working code solution here
// Include ALL necessary imports, functions, classes, and logic
// Make sure the code is production-ready and fully functional
\`\`\`

## Explanation
- Explain key parts of the code
- Highlight best practices and important considerations

## Usage Example
\`\`\`${codeLanguage}
// Provide a practical example of how to use the code
\`\`\`

3. Ensure the code is COMPLETE and FUNCTIONAL - include all necessary imports, dependencies, and implementation details
4. The code should be ready to run without modifications
5. If helpful, include alternative approaches or optimizations`;
  };

  // Enhanced function to extract only code blocks
  const extractCodeOnly = (content) => {
    const codeBlockRegex = new RegExp(`\`\`\`(?:${codeLanguage})?([\\s\\S]*?)\`\`\``, 'g');
    const matches = [...content.matchAll(codeBlockRegex)];
    
    if (matches.length === 0) return content;
    
    // Find the largest code block (likely the main solution)
    let largestCode = '';
    for (const match of matches) {
      const extractedCode = match[1].trim();
      if (extractedCode.length > largestCode.length) {
        largestCode = extractedCode;
      }
    }
    
    return largestCode || content;
  };

  const copyCodeOnly = (content = aiResponse?.content) => {
    if (!content) return;
    const codeOnly = extractCodeOnly(content);
    copyToClipboard(codeOnly, 'code');
  };

  const copyToClipboard = async (text, id = 'main') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadContent = (content, filename, fileType) => {
    const element = document.createElement('a');
    let file;

    switch (fileType) {
      case 'code':
        const extensionMap = {
          javascript: 'js', python: 'py', java: 'java', cpp: 'cpp',
          'c#': 'cs', html: 'html', css: 'css', ruby: 'rb',
          go: 'go', php: 'php', swift: 'swift', typescript: 'ts',
          rust: 'rs', kotlin: 'kt'
        };
        const ext = extensionMap[codeLanguage] || 'txt';
        
        // Extract only the code blocks
        const codeOnly = extractCodeOnly(content);
        
        file = new Blob([codeOnly], {type: 'text/plain'});
        filename = `${filename}.${ext}`;
        break;
      case 'text/plain':
        file = new Blob([content], {type: fileType});
        filename = `${filename}.txt`;
        break;
      default:
        file = new Blob([content], {type: 'text/plain'});
        filename = `${filename}.txt`;
    }

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearHistory = () => {
    setChatHistory([]);
    setAiResponse(null);
    setFollowUpResponse(null);
    setInitialMessage('');
    localStorage.removeItem('codeGeneratorHistory');
  };

  const MarkdownComponents = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`bg-gray-100 px-1 py-0.5 rounded text-sm ${className}`} {...props}>
          {children}
        </code>
      );
    },
    h1: ({children}) => <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-3">{children}</h1>,
    h2: ({children}) => <h2 className="text-xl font-bold text-gray-700 mt-5 mb-2">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-bold text-gray-600 mt-4 mb-1">{children}</h3>,
  };

  const renderChatHistory = () => (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">Recent Conversations</h3>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear History
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {chatHistory.slice(-6).map((message, index) => (
          <div key={index} className={`p-3 rounded-lg text-sm ${
            message.role === 'user' 
              ? 'bg-blue-50 border border-blue-100' 
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className="text-xs text-gray-500 mb-1">
              {message.role === 'user' ? 'You' : 'AI Assistant'}:
            </div>
            <div>
              {message.content.length > 150 
                ? `${message.content.substring(0, 150)}...` 
                : message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFormattedResponse = (response, title = "Generated Code") => {
    if (!response) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="text-white mr-3" size={24} />
              <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-indigo-100 text-sm">
                  {codeLanguage.charAt(0).toUpperCase() + codeLanguage.slice(1)} Solution
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(response.content, 'main')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                title="Copy entire response"
              >
                {copiedStates.main ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={() => copyCodeOnly(response.content)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                title="Copy code only"
              >
                <Terminal size={16} />
                Code Only
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={MarkdownComponents}>
              {response.content}
            </ReactMarkdown>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => copyToClipboard(response.content, 'main')} 
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              <Copy size={16} className="mr-2" /> Copy All
            </button>
            <button 
              onClick={() => copyCodeOnly(response.content)} 
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <Code size={16} className="mr-2" /> Copy Code Only
            </button>
            <button 
              onClick={() => downloadContent(response.content, 'code-solution', 'code')} 
              className="flex items-center px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
            >
              <Download size={16} className="mr-2" /> Download Code
            </button>
            <button 
              onClick={() => downloadContent(response.content, 'full-solution', 'text/plain')} 
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <FileText size={16} className="mr-2" /> Download Full Solution
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFormattedFollowUpResponse = () => {
    if (!followUpResponse) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Follow-up Response</h3>
            <button
              onClick={() => copyToClipboard(followUpResponse.content, 'followup')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
              title="Copy entire response"
            >
              {copiedStates.followup ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy All
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={MarkdownComponents}>
              {followUpResponse.content}
            </ReactMarkdown>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => copyToClipboard(followUpResponse.content, 'followup')} className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              <Copy size={16} className="mr-2" /> Copy All
            </button>
            <button onClick={() => copyCodeOnly(followUpResponse.content)} className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              <Code size={16} className="mr-2" /> Copy Code Only
            </button>
            <button onClick={() => downloadContent(followUpResponse.content, 'followup-code', 'code')} className="flex items-center px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
              <Download size={16} className="mr-2" /> Download Code
            </button>
            <button onClick={() => downloadContent(followUpResponse.content, 'followup-solution', 'text/plain')} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              <FileText size={16} className="mr-2" /> Download Full Solution
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced function to handle chat selection from history
  const handleChatSelect = (chat) => {
    if (!chat) {
      setSelectedChat(null);
      setCurrentChatId(null);
      setChatHistory([]);
      setAiResponse(null);
      setFollowUpResponse(null);
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
    
    // Set the last AI response for display with proper formatting
    const lastAiMessage = cleanedMessages.filter(msg => msg.role === 'assistant').pop();
    if (lastAiMessage) {
      setAiResponse({
        content: lastAiMessage.content
      });
    }
    
    setShowHistory(false); // Hide history sidebar on mobile
  };

  // Enhanced function to render formatted code response
  const renderFormattedCodeResponse = (response, title = "Generated Code") => {
    if (!response) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="text-white mr-3" size={24} />
              <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-indigo-100 text-sm">
                  {codeLanguage.charAt(0).toUpperCase() + codeLanguage.slice(1)} Solution
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(response.content, 'main')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                title="Copy entire response"
              >
                {copiedStates.main ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy All
                  </>
                )}
              </button>
              <button
                onClick={() => copyCodeOnly(response.content)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                title="Copy code only"
              >
                <Terminal size={16} />
                Code Only
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={MarkdownComponents}>
              {response.content}
            </ReactMarkdown>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => copyToClipboard(response.content, 'main')} 
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              <Copy size={16} className="mr-2" /> Copy All
            </button>
            <button 
              onClick={() => copyCodeOnly(response.content)} 
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <Code size={16} className="mr-2" /> Copy Code Only
            </button>
            <button 
              onClick={() => downloadContent(response.content, 'code-solution', 'code')} 
              className="flex items-center px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
            >
              <Download size={16} className="mr-2" /> Download Code
            </button>
            <button 
              onClick={() => downloadContent(response.content, 'full-solution', 'text/plain')} 
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <FileText size={16} className="mr-2" /> Download Full Solution
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced chat history rendering for code generator
  const renderCodeChatHistory = () => (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">Recent Code Sessions</h3>
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
                    <Terminal size={12} className="mr-2 text-blue-500" />
                    You
                  </>
                ) : (
                  <>
                    <Code size={12} className="mr-2 text-green-500" />
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
                      <div className="flex items-center mb-1">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded mr-2">{codeLanguage}</span>
                      </div>
                      {message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')}
                    </div>
                  )
                : (
                    <div className="max-h-32 overflow-hidden">
                      <div className="flex items-center mb-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Code Generated
                        </span>
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        {message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')}
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Mobile History Toggle */}
      <div className="md:hidden bg-white border-b p-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
        >
          <History size={20} />
          <span>Code History</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {(showHistory || isDesktop) && (
          <div className={`${showHistory ? 'block' : 'hidden md:block'} w-full md:w-80 bg-white border-r relative`}>
            {/* Mobile close button */}
            <button
              onClick={() => setShowHistory(false)}
              className="md:hidden absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <ChatHistoryManager 
              feature="code-generator"
              subFeature={codeLanguage}
              onChatSelect={handleChatSelect}
              selectedChatId={currentChatId}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Code className="mr-3 text-indigo-600" size={28} />
                  Code Generator
                </h1>
                <p className="text-gray-600">Generate code with implementation steps and explanations</p>
                {selectedChat && (
                  <p className="text-xs text-indigo-600 mt-1">
                    Continuing session from {new Date(selectedChat.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Input/Chat History Section */}
            {/* {!selectedChat && (
              <div className="hidden md:block w-64 bg-gray-50 border-r overflow-y-auto p-4">
                <h2 className="font-medium text-gray-700 mb-3">Local History</h2>
                {renderCodeChatHistory()}
              </div>
            )} */}

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedChat ? (
                /* Continue Existing Chat */
                <div className="flex-1 bg-gray-50 overflow-hidden">
                  <ChatInterface 
                    chatId={currentChatId}
                    aiProvider={selectedChat.aiProvider}
                    model={selectedChat.model}
                    systemContext=""
                    feature="code-generator"
                    subFeature={codeLanguage}
                    showChat={true}
                    onAiResponse={handleAiResponse}
                  />
                </div>
              ) : (
                /* New Code Generation Interface */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Input Section */}
                  {!aiResponse && (
                    <div className="bg-white p-4 border-b">
                      <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Programming Language
                          </label>
                          <select
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            className="w-full md:w-64 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="c#">C#</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="ruby">Ruby</option>
                            <option value="go">Go</option>
                            <option value="php">PHP</option>
                            <option value="swift">Swift</option>
                            <option value="typescript">TypeScript</option>
                            <option value="rust">Rust</option>
                            <option value="kotlin">Kotlin</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Describe what you want to build
                          </label>
                          <textarea
                            value={codeContent}
                            onChange={(e) => setCodeContent(e.target.value)}
                            placeholder={`Describe what you want to build in ${codeLanguage}...`}
                            rows={6}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isProcessing || !codeContent.trim()}
                          className={`${isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isProcessing && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {isProcessing ? 'Generating...' : 'Generate Code'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Results Section */}
                  <div className="flex-1 overflow-y-auto">
                    {aiResponse ? (
                      <div className="p-6 bg-gray-50">
                        {renderFormattedCodeResponse(aiResponse)}
                        {renderFormattedFollowUpResponse()}
                        
                        {/* Continue Chat Interface */}
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Continue the conversation:</h4>
                          <div className="bg-white rounded-lg border">
                            <ChatInterface 
                              initialMessage=""
                              aiProvider="deepseek"
                              model="deepseek-chat"
                              placeholder="Ask follow-up questions about your code..."
                              systemContext={systemContext}
                              feature="code-generator"
                              subFeature={codeLanguage}
                              showChat={true}
                              hideAiResponse={true}
                              onAiResponse={handleFollowUpResponse}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Code size={64} className="mx-auto mb-4 text-gray-300" />
                          <p className="text-lg mb-2">Ready to generate code</p>
                          <p className="text-sm">Describe what you want to build and select your preferred language</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}