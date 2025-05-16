// app/dashboard/writing-help/page.jsx
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';

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
  
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext);
    setInitialMessage(''); // Reset initial message when tool changes
  };
  
  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    
    setInitialMessage(selectedTool.prompt + customInput);
    setCustomInput('');
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
        
        {/* Main chat area */}
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
                <ChatInterface 
                  initialMessage={initialMessage}
                  aiProvider="deepseek" // Recommended for writing tasks
                  model="" // Best for high-quality writing assistance
                  placeholder="Ask follow-up questions here..."
                  systemContext={systemContext}
                />
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