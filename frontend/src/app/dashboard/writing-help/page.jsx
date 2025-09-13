// app/dashboard/writing-help/page.jsx
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';

const writingTools = [
  { 
    id: 'essay-help', 
    name: 'Essay Writing', 
    description: 'Get help with structuring and writing essays',
    icon: '📝',
    prompt: 'I need help writing an essay about ',
    systemContext: 'You are a writing assistant specialized in academic essays. Help the user structure, plan, and improve their essays. Provide constructive feedback and suggestions for improvement.' 
  },
  { 
    id: 'grammar-check', 
    name: 'Grammar Check', 
    description: 'Check your text for grammar and spelling errors',
    icon: '✅',
    prompt: 'Please check this text for grammar and spelling errors: ',
    systemContext: 'You are a grammar and spelling assistant. Review the user\'s text for errors and suggest corrections. Be thorough but constructive in your feedback.' 
  },
  { 
    id: 'paraphrasing', 
    name: 'Paraphrasing Tool', 
    description: 'Rephrase text while maintaining meaning',
    icon: '🔄',
    prompt: 'Please help me paraphrase the following text: ',
    systemContext: 'You are a paraphrasing assistant. Help the user rephrase content while preserving the original meaning. Offer multiple paraphrasing options when appropriate.' 
  },
  { 
    id: 'research-help', 
    name: 'Research Assistant', 
    description: 'Get help with research questions and methodology',
    icon: '🔍',
    prompt: 'I need help with my research on ',
    systemContext: 'You are a research assistant. Help the user formulate research questions, develop methodologies, and organize their research process effectively.' 
  }
];

export default function WritingHelpPage() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [systemContext, setSystemContext] = useState('');

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage('');
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    // Set the initial message to start streaming
    setInitialMessage(selectedTool.prompt + customInput);
    setCustomInput('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Writing Help</h1>
        <p className="text-gray-600 text-sm md:text-base">Select a writing tool and get real-time AI assistance</p>
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Tools sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r overflow-y-auto p-4 flex-shrink-0">
          <h2 className="font-medium text-gray-700 mb-3 text-base md:text-lg">Writing Tools</h2>
          <div className="space-y-2">
            {writingTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`w-full text-left p-3 rounded-lg transition text-sm md:text-base ${
                  selectedTool?.id === tool.id 
                    ? 'bg-indigo-100 border border-indigo-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{tool.icon}</span>
                  <div className="font-medium">{tool.name}</div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">{tool.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedTool ? (
            <>
              {/* Input section */}
              <div className="bg-indigo-50 p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedTool.icon}</span>
                  <h2 className="font-medium text-base md:text-lg">{selectedTool.name}</h2>
                </div>
                <form onSubmit={handlePromptSubmit} className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex bg-white rounded-lg border overflow-hidden">
                    <span className="bg-gray-50 px-3 py-2 text-gray-600 border-r text-xs md:text-sm whitespace-nowrap">
                      {selectedTool.prompt}
                    </span>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 px-3 py-2 focus:outline-none text-sm md:text-base"
                      placeholder="Enter your specific request..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!customInput.trim()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start
                  </button>
                </form>
              </div>

              {/* Chat area */}
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  initialMessage={initialMessage}
                  aiProvider="deepseek"
                  model="deepseek-chat"
                  placeholder="Ask follow-up questions or request modifications..."
                  systemContext={systemContext}
                  feature="writing-help"
                  subFeature={selectedTool?.id}
                  showChat={true}
                  showInput={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4 md:p-8 max-w-md">
                <div className="text-6xl mb-4">✍️</div>
                <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">Select a Writing Tool</h3>
                <p className="text-gray-600 text-sm md:text-base">
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