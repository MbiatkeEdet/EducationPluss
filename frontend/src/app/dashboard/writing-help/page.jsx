// app/dashboard/writing-help/page.jsx
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Menu, X } from 'lucide-react';

const writingTools = [
  { 
    id: 'essay-help', 
    name: 'Essay Writing', 
    description: 'Get help with structuring and writing essays',
    prompt: 'I need help writing an essay about ',
    systemContext: 'You are a writing assistant specialized in academic essays. Help the user structure, plan, and improve their essays. Provide constructive feedback and suggestions for improvement.' 
  },
  { 
    id: 'grammar-check', 
    name: 'Grammar Check', 
    description: 'Check your text for grammar and spelling errors',
    prompt: 'Please check this text for grammar and spelling errors: ',
    systemContext: 'You are a grammar and spelling assistant. Review the user\'s text for errors and suggest corrections. Be thorough but constructive in your feedback.' 
  },
  { 
    id: 'paraphrasing', 
    name: 'Paraphrasing Tool', 
    description: 'Rephrase text while maintaining meaning',
    prompt: 'Please help me paraphrase the following text: ',
    systemContext: 'You are a paraphrasing assistant. Help the user rephrase content while preserving the original meaning. Offer multiple paraphrasing options when appropriate.' 
  },
  { 
    id: 'research-help', 
    name: 'Research Assistant', 
    description: 'Get help with research questions and methodology',
    prompt: 'I need help with my research on ',
    systemContext: 'You are a research assistant. Help the user formulate research questions, develop methodologies, and organize their research process effectively.' 
  }
];

export default function WritingHelpPage() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [systemContext, setSystemContext] = useState('');
  const [hasInitialResponse, setHasInitialResponse] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatKey, setChatKey] = useState(0); // Add this to force re-render
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage('');
    setHasInitialResponse(false);
    setCurrentChatId(null);
    setChatKey(prev => prev + 1); // Force new ChatInterface instance
    setIsDrawerOpen(false); // Close drawer on mobile after selection
  };
  
  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    const newMessage = selectedTool.prompt + customInput;
    console.log('Submitting message:', newMessage);
    
    // Clear and set the initial message to trigger ChatInterface processing
    setInitialMessage('');
    setTimeout(() => {
      setInitialMessage(newMessage);
    }, 50);
    
    setCustomInput('');
    setHasInitialResponse(false);
    setChatKey(prev => prev + 1); // Force ChatInterface to re-render
  };

  const handleInitialAiResponse = (response) => {
    console.log('Received AI response:', response);
    setHasInitialResponse(true);
    if (response.chatId) {
      setCurrentChatId(response.chatId);
    }
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

  // Custom components for markdown rendering
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative">
          <button
            onClick={() => copyToClipboard(String(children), `code-${node.position?.start.line}`)}
            className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-xs"
            title="Copy code"
          >
            {copiedStates[`code-${node.position?.start.line}`] ? (
              <Check size={12} />
            ) : (
              <Copy size={12} />
            )}
          </button>
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 border-b pb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl md:text-2xl font-semibold mb-3 mt-6 text-gray-800">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg md:text-xl font-semibold mb-2 mt-4 text-gray-700">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base md:text-lg font-medium mb-2 mt-3 text-gray-700">{children}</h4>,
    p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed text-sm md:text-base">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700 text-sm md:text-base">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 mb-4 bg-indigo-50 italic">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
    hr: () => <hr className="my-6 border-gray-300" />,
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-gray-700">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 text-gray-700">{children}</td>,
  };

  // Writing Tools Drawer Component
  const WritingToolsDrawer = ({ isOpen, onClose }) => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:w-64 md:bg-gray-50 md:border-r md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className="font-semibold text-gray-800">Writing Tools</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          <h2 className="font-medium text-gray-700 mb-3 hidden md:block">Writing Tools</h2>
          <div className="space-y-2">
            {writingTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedTool?.id === tool.id 
                    ? 'bg-indigo-100 border border-indigo-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm md:text-base">{tool.name}</div>
                <div className="text-xs md:text-sm text-gray-600">{tool.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Writing Help</h1>
            <p className="text-sm md:text-base text-gray-600">Select a writing tool or ask any writing-related question</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar / Mobile Drawer */}
        <WritingToolsDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTool ? (
            <>
              {/* Top prompt form - hide after initial message is sent */}
              {!hasInitialResponse && (
                <div className="bg-indigo-50 p-3 md:p-4 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="md:hidden p-1 hover:bg-indigo-100 rounded"
                    >
                      <Menu size={16} />
                    </button>
                    <h2 className="font-medium text-sm md:text-base">{selectedTool.name}</h2>
                  </div>
                  <form onSubmit={handlePromptSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex bg-white rounded-lg border overflow-hidden text-sm md:text-base">
                      <span className="bg-gray-50 px-2 md:px-3 py-2 text-gray-600 border-r text-xs md:text-sm whitespace-nowrap">
                        {selectedTool.prompt}
                      </span>
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="flex-1 px-2 md:px-3 py-2 focus:outline-none min-w-0"
                        placeholder="Enter your specific request..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm md:text-base whitespace-nowrap"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )}
              
              {/* Chat Interface - streaming with full chat history */}
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  key={`${selectedTool.id}-${chatKey}-${currentChatId || 'new'}`}
                  initialMessage={initialMessage}
                  chatId={currentChatId}
                  aiProvider="deepseek"
                  model="deepseek-chat"
                  placeholder="Ask follow-up questions here..."
                  systemContext={systemContext}
                  feature="writing-help"
                  subFeature={selectedTool?.id}
                  showChat={true}
                  showInput={hasInitialResponse}
                  onAiResponse={handleInitialAiResponse}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
              <div className="text-center max-w-md">
                <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">Select a Writing Tool</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Choose one of the writing tools to get started with your writing task.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="md:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
                >
                  <Menu size={16} />
                  View Writing Tools
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}