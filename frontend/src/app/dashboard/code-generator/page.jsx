"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/ui/ChatInterface';
import { Download, Copy, FileText, Code, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('codeGeneratorHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
    
    setSystemContext('You are a code generation assistant. Help the user generate high-quality, well-documented code based on their requirements. Provide clear implementation steps, explanations, and best practices.');
  }, []);

  useEffect(() => {
    localStorage.setItem('codeGeneratorHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!codeContent.trim()) return;

    const message = `Please generate ${codeLanguage} code for the following requirement. Include detailed implementation steps, explanations, and best practices. Make sure to use proper markdown code blocks with language identifiers:\n\n${codeContent}`;
    
    const newMessage = {
      role: 'user',
      content: codeContent,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setInitialMessage(message + `\n\n${getFormatInstructions()}`);
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

  const getFormatInstructions = () => {
    return `CODE GENERATION FORMAT:
1. Begin with a brief overview of the implementation approach
2. Format your response in the following sections:

## Implementation Steps
- Provide a numbered list of clear implementation steps

## Complete Solution
\`\`\`${codeLanguage}
// Provide the complete, working code solution here
\`\`\`

## Explanation
- Explain key parts of the code
- Highlight best practices and important considerations

## Usage Example
\`\`\`${codeLanguage}
// Provide a practical example of how to use the code
\`\`\`

3. Ensure the code is properly formatted, commented, and follows best practices
4. If helpful, include alternative approaches or optimizations`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
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
        
        let codeContent = content;
        const codeBlockRegex = new RegExp(`\`\`\`(?:${codeLanguage})?([\\s\\S]*?)\`\`\``, 'g');
        const matches = [...content.matchAll(codeBlockRegex)];
        
        if (matches.length > 0) {
          for (const match of matches) {
            const extractedCode = match[1].trim();
            if (extractedCode.length > 10) {
              codeContent = extractedCode;
              break;
            }
          }
        }
        
        file = new Blob([codeContent], {type: 'text/plain'});
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

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Code Generator</h1>
        <p className="text-gray-600">Generate code with implementation steps and explanations</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        <div className="hidden md:block w-64 bg-gray-50 border-r overflow-y-auto p-4">
          <h2 className="font-medium text-gray-700 mb-3">Chat History</h2>
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
                    <div className="truncate">
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
              Clear All History
            </button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white p-4 border-b">
            <h2 className="font-medium flex items-center">
              <span className="text-2xl mr-2">💻</span>
              Code Generator
            </h2>
            <p className="text-gray-600 mt-1">Generate code with implementation steps and explanations</p>
            
            {!initialMessage && (
              <form onSubmit={handleCodeSubmit} className="mt-4">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe what you want to build
                  </label>
                  
                  <div className="mb-3">
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
                  
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    placeholder={`Describe what you want to build in ${codeLanguage}...`}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`${isProcessing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg flex items-center`}
                >
                  {isProcessing && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isProcessing ? 'Processing...' : 'Generate Code'}
                </button>
              </form>
            )}
          </div>
          
          <div className="flex-1 overflow-auto">
            {aiResponse ? (
              <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg shadow overflow-auto h-full">
                <div className="prose prose-slate max-w-none bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <ReactMarkdown components={MarkdownComponents}>
                    {aiResponse.content}
                  </ReactMarkdown>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => copyToClipboard(aiResponse.content)} className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <Copy size={16} className="mr-2" /> Copy All
                  </button>
                  <button onClick={() => downloadContent(aiResponse.content, 'code-solution', 'code')} className="flex items-center px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
                    <Code size={16} className="mr-2" /> Download Code
                  </button>
                  <button onClick={() => downloadContent(aiResponse.content, 'full-solution', 'text/plain')} className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <Terminal size={16} className="mr-2" /> Download Full Solution
                  </button>
                </div>
                
                {/* Mobile Chat History */}
                <div className="md:hidden">
                  {renderChatHistory()}
                </div>
              </div>
            ) : (
              <ChatInterface 
                initialMessage={initialMessage}
                aiProvider="deepseek" 
                model="deepseek-chat"
                placeholder="Ask follow-up questions about your code..."
                systemContext={systemContext}
                formatInstructions={getFormatInstructions()}
                onAiResponse={handleAiResponse}
                chatHistory={chatHistory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}