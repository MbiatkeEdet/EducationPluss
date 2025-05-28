"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/ui/ChatInterface';
import FlashcardDisplay from '@/components/ui/FlashcardDisplay';
import { Download, Copy, FileText, Code, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cleanMessageForDisplay } from '@/lib/messageUtils';

// Dynamic import for jsPDF to avoid SSR issues
const JsPDF = dynamic(
  () => import('jspdf').then(mod => mod.default),
  { ssr: false }
);

const studyTools = [
  {
    id: 'flashcards',
    name: 'Flashcard Generator',
    description: 'Create study flashcards from your content',
    icon: '📇',
    systemContext: `You are a flashcard creation assistant. Help the user create effective study flashcards from their content.
    
IMPORTANT FORMAT INSTRUCTIONS:
1. Format each flashcard using this exact structure:
   **Front:** [Question text here]
   **Back:** [Answer text here]

2. Separate each flashcard with a line: ---

3. Create 5-10 comprehensive but concise flashcards that focus on key concepts.

4. Include images, bullet points, and formatting in the answers where helpful.

5. Keep questions clear and straightforward.`,
    outputFormat: 'Return flashcards in a clear format with Front/Back structure. Do not include Flashcard X headers, just the Front/Back pattern'
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

export default function StudyToolsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTool, setSelectedTool] = useState(null);
  const [studyContent, setStudyContent] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [systemContext, setSystemContext] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Initialize tool from URL parameter
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    if (toolParam) {
      const tool = studyTools.find(t => t.id === toolParam);
      if (tool) {
        handleToolSelect(tool);
      }
    }
  }, [searchParams]);

  // Load chat history for selected tool
  useEffect(() => {
    if (selectedTool) {
      const savedHistory = localStorage.getItem(`${selectedTool.id}History`);
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      } else {
        setChatHistory([]);
      }
    }
  }, [selectedTool]);

  // Save chat history when it changes
  useEffect(() => {
    if (selectedTool && chatHistory.length > 0) {
      localStorage.setItem(`${selectedTool.id}History`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, selectedTool]);
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage('');
    setAiResponse(null);
    setStudyContent('');
    
    // Update URL without page reload
    const newUrl = `/dashboard/study-tools?tool=${tool.id}`;
    window.history.pushState({}, '', newUrl);
  };
  
  const handleStudyContentSubmit = (e) => {
    e.preventDefault();
    if (!studyContent.trim()) return;

    setIsProcessing(true);
    let message = '';
    
    switch (selectedTool.id) {
      case 'flashcards':
        message = `Please create study flashcards from this content. Format them exactly with **Front:** and **Back:** patterns separated by ---\n\n${studyContent}`;
        break;
      case 'notes':
        message = `Please help me organize these notes into a well-structured study guide. Return your response in markdown format:\n\n${studyContent}`;
        break;
      case 'summarizer':
        message = `Please summarize this content for study purposes. Return your response in markdown format:\n\n${studyContent}`;
        break;
      case 'mindmap':
        message = `Please create a mind map based on this content. Use emoji icons where appropriate to enhance visualization. Return your response in markdown format:\n\n${studyContent}`;
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
    
    // Use cleanMessageForDisplay for the chat history
    const newMessage = {
      role: 'user',
      content: cleanMessageForDisplay(studyContent), // Clean the display message
      timestamp: new Date().toISOString(),
      originalContent: studyContent // Keep original for reference
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setInitialMessage(message); // Full context goes to AI
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

  const clearHistory = () => {
    if (selectedTool) {
      setChatHistory([]);
      localStorage.removeItem(`${selectedTool.id}History`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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

    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    ul: ({children}) => <ul className="list-disc ml-5 my-3">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal ml-5 my-3">{children}</ol>,
    li: ({children}) => <li className="mb-1">{children}</li>,
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

  const renderToolOutput = () => {
    if (!aiResponse) return null;

    const content = aiResponse.content;
    
    switch (selectedTool.id) {
      case 'flashcards':
        return (
          <>
            <FlashcardDisplay flashcards={content} />
            <div className="md:hidden">
              {renderChatHistory()}
            </div>
          </>
        );
        
      default:
        return (
          <div className="p-4 md:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow overflow-auto h-full">
            <div className="prose prose-stone max-w-none bg-white p-4 md:p-6 rounded-lg shadow-sm border border-yellow-200">
              <ReactMarkdown components={MarkdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
            <div className="mt-4 md:mt-6 flex flex-wrap gap-2 md:gap-3">
              <button 
                onClick={() => copyToClipboard(content)} 
                className="flex items-center px-2 md:px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
              >
                <Copy size={14} className="mr-1 md:mr-2" /> Copy All
              </button>
              <button 
                onClick={() => downloadContent(content, `${selectedTool.name.toLowerCase().replace(' ', '-')}`, 'text/plain')} 
                className="flex items-center px-2 md:px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
              >
                <Download size={14} className="mr-1 md:mr-2" /> Download
              </button>
            </div>
            
            {/* Mobile Chat History */}
            <div className="md:hidden">
              {renderChatHistory()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Study Tools</h1>
        <p className="text-sm md:text-base text-gray-600">Tools to enhance your learning and study efficiency</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar - Hidden on mobile, shown when tool is selected */}
        {selectedTool && (
          <div className="hidden md:block w-64 bg-gray-50 border-r overflow-y-auto p-4">
            <h2 className="font-medium text-gray-700 mb-3">
              {selectedTool.name} History
            </h2>
            {chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500">No previous conversations</p>
            ) : (
              <div className="space-y-2">
                {chatHistory.slice(-10).reverse().map((message, index) => (
                  message.role === 'user' && (
                    <div key={index} className="p-2 bg-white rounded border text-sm">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                      <div className="line-clamp-3">
                        {message.content.length > 60 
                          ? `${message.content.substring(0, 60)}...` 
                          : message.content}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
            {chatHistory.length > 0 && (
              <button 
                onClick={clearHistory}
                className="mt-4 text-sm text-red-600 hover:text-red-800 w-full text-center"
              >
                Clear History
              </button>
            )}
          </div>
        )}

        {/* Tool Selection Dropdown for Mobile */}
        {!selectedTool && (
          <div className="md:hidden w-full p-4">
            <h2 className="font-medium text-gray-700 mb-3">Select a Study Tool</h2>
            <div className="space-y-2">
              {studyTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{tool.icon}</span>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-gray-600">{tool.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTool ? (
            <>
              <div className="bg-white p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-medium flex items-center">
                    <span className="text-2xl mr-2">{selectedTool.icon}</span>
                    {selectedTool.name}
                  </h2>
                  {/* Back button for mobile */}
                  <button 
                    onClick={() => setSelectedTool(null)}
                    className="md:hidden text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    ← Back
                  </button>
                </div>
                <p className="text-gray-600 text-sm md:text-base">{selectedTool.description}</p>
                
                {!initialMessage && (
                  <form onSubmit={handleStudyContentSubmit} className="mt-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paste your study content below
                      </label>
                      
                      <textarea
                        value={studyContent}
                        onChange={(e) => setStudyContent(e.target.value)}
                        placeholder={`Enter content for ${selectedTool.name.toLowerCase()}...`}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`${isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg flex items-center text-sm md:text-base`}
                    >
                      {isProcessing && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isProcessing ? 'Processing...' : 'Process Content'}
                    </button>
                  </form>
                )}
              </div>
              
              <div className="flex-1 overflow-auto">
                {aiResponse ? renderToolOutput() : (
                  <ChatInterface
                    initialMessage={initialMessage}
                    chatId={null}
                    aiProvider="deepseek"
                    model="deepseek-chat"
                    systemContext={systemContext}
                    placeholder="Ask a follow-up question or request modifications..."
                    showChat={true}
                    onAiResponse={handleAiResponse}
                    formatInstructions={selectedTool?.outputFormat}
                    feature="study-tools"              // Add feature
                    subFeature={selectedTool?.id}      // Add subFeature (flashcards, notes, etc.)
                  />
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Select a Study Tool</h3>
                <p className="text-gray-600">
                  Choose one of the study tools from the navigation menu to enhance your learning experience.
                  Each tool is designed to help you study more effectively.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}