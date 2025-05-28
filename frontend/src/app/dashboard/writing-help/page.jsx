// app/dashboard/writing-help/page.jsx
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

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
  const [aiResponse, setAiResponse] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage(''); // Reset initial message when tool changes
    setAiResponse(null); // Clear previous response
  };
  
  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    setInitialMessage(selectedTool.prompt + customInput);
    setCustomInput('');
  };

  const handleAiResponse = (response) => {
    setAiResponse(response);
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
    h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 mt-6 text-gray-800">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-700">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-medium mb-2 mt-3 text-gray-700">{children}</h4>,
    p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-gray-700">{children}</li>,
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

  const renderFormattedResponse = () => {
    if (!aiResponse) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">AI Response</h3>
            <button
              onClick={() => copyToClipboard(aiResponse.content)}
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
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown components={MarkdownComponents}>
              {aiResponse.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Writing Help</h1>
        <p className="text-gray-600">Select a writing tool or ask any writing-related question</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Tools sidebar */}
        <div className="w-64 bg-gray-50 border-r overflow-y-auto p-4">
          <h2 className="font-medium text-gray-700 mb-3">Writing Tools</h2>
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
                <div className="font-medium">{tool.name}</div>
                <div className="text-sm text-gray-600">{tool.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTool ? (
            <>
              <div className="bg-indigo-50 p-4 border-b">
                <h2 className="font-medium">{selectedTool.name}</h2>
                <form onSubmit={handlePromptSubmit} className="mt-2 flex">
                  <div className="flex-1 flex bg-white rounded-lg border overflow-hidden">
                    <span className="bg-gray-50 px-3 py-2 text-gray-600 border-r">
                      {selectedTool.prompt}
                    </span>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 px-3 py-2 focus:outline-none"
                      placeholder="Enter your specific request..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </form>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {aiResponse ? (
                  <div className="h-full overflow-y-auto p-6 bg-gray-50">
                    {renderFormattedResponse()}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Continue the conversation:</h4>
                      <div className="bg-white rounded-lg border">
                        <ChatInterface 
                          initialMessage=""
                          aiProvider="deepseek"
                          model="deepseek-chat"
                          placeholder="Ask follow-up questions here..."
                          systemContext={systemContext}
                          feature="writing-help"
                          subFeature={selectedTool?.id}
                          showChat={true}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ChatInterface 
                    initialMessage={initialMessage}
                    aiProvider="deepseek"
                    model="deepseek-chat"
                    placeholder="Ask follow-up questions here..."
                    systemContext={systemContext}
                    feature="writing-help"
                    subFeature={selectedTool?.id}
                    onAiResponse={handleAiResponse}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Select a Writing Tool</h3>
                <p className="text-gray-600">
                  Choose one of the writing tools from the sidebar to get started with your writing task.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}