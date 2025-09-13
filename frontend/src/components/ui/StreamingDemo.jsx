// components/ui/StreamingDemo.jsx
"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

const StreamingDemo = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showFormattedResponse, setShowFormattedResponse] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTypingCursor, setShowTypingCursor] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});

  // Sample AI response content for demonstration
  const demoResponse = `# Essay Writing Guide: Climate Change

## Introduction

Climate change represents one of the most significant challenges facing humanity in the 21st century. This comprehensive essay will explore the causes, effects, and potential solutions to global climate change.

## Main Body

### Causes of Climate Change

**Greenhouse Gas Emissions**: The primary driver of modern climate change is the increased concentration of greenhouse gases in our atmosphere, particularly:

- Carbon dioxide (CO₂) from fossil fuel combustion
- Methane (CH₄) from agriculture and waste
- Nitrous oxide (N₂O) from industrial processes

### Effects on Global Systems

Climate change impacts multiple interconnected systems:

1. **Rising sea levels** threatening coastal communities
2. **Extreme weather events** becoming more frequent and severe
3. **Ecosystem disruption** affecting biodiversity worldwide

## Solutions and Mitigation

### Renewable Energy Transition
Investing in clean energy sources such as:
- Solar power
- Wind energy  
- Hydroelectric systems

### Policy and Individual Action
Both governmental policies and individual choices play crucial roles in addressing climate change.

## Conclusion

Addressing climate change requires immediate, coordinated global action. Through technological innovation, policy reform, and individual responsibility, we can work toward a sustainable future for generations to come.

---

*This essay demonstrates proper structure, clear arguments, and evidence-based reasoning essential for academic writing.*`;

  const startStreamingDemo = () => {
    setIsStreaming(true);
    setShowFormattedResponse(false);
    setStreamedContent('');
    setCurrentIndex(0);
    setShowTypingCursor(false);

    // Simulate the streaming phases
    setTimeout(() => {
      // Phase 1: "AI is thinking..." (2 seconds)
      simulateStreaming();
    }, 1000);
  };

  const simulateStreaming = () => {
    setShowTypingCursor(true);
    const streamingInterval = setInterval(() => {
      setCurrentIndex(prev => {
        const newIndex = prev + Math.floor(Math.random() * 3) + 1; // 1-3 characters at a time
        const newContent = demoResponse.substring(0, newIndex);
        setStreamedContent(newContent);

        if (newIndex >= demoResponse.length) {
          clearInterval(streamingInterval);
          setShowTypingCursor(false);
          setIsStreaming(false);
          
          // Show completed streaming for 1 second before transitioning
          setTimeout(() => {
            setShowFormattedResponse(true);
          }, 1000);
          
          return demoResponse.length;
        }
        
        return newIndex;
      });
    }, 50); // Adjust speed (lower = faster)
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

  const resetDemo = () => {
    setIsStreaming(false);
    setShowFormattedResponse(false);
    setStreamedContent('');
    setCurrentIndex(0);
    setShowTypingCursor(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Writing Help - Streaming Demo</h1>
        <p className="text-gray-600">Demonstration of the fixed ChatGPT-like streaming experience</p>
      </div>

      {/* Demo Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col p-4">
          {/* Tool Selection Area */}
          <div className="bg-indigo-50 p-4 rounded-lg border mb-4">
            <h2 className="font-medium text-lg mb-2">Essay Writing Tool</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white rounded-lg border p-3">
                <span className="text-gray-600">I need help writing an essay about </span>
                <span className="font-medium">climate change and its global impact</span>
              </div>
              <button
                onClick={startStreamingDemo}
                disabled={isStreaming}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStreaming ? 'Generating...' : 'Submit'}
              </button>
              <button
                onClick={resetDemo}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Streaming Display Area */}
          <div className="flex-1 overflow-hidden">
            {showFormattedResponse ? (
              // Formatted Response View
              <div className="h-full overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">AI Response</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetDemo}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={() => copyToClipboard(demoResponse)}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
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
                  </div>
                  <div className="p-6">
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown>{demoResponse}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Streaming Chat Interface
              <div className="h-full flex flex-col bg-gray-50 rounded-lg border">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-lg px-4 py-3 rounded-lg bg-indigo-600 text-white">
                      I need help writing an essay about climate change and its global impact
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-4xl px-4 py-3 rounded-lg bg-white border border-gray-200">
                      <div className="whitespace-pre-wrap break-words">
                        {isStreaming && !streamedContent ? (
                          // Phase 1: "AI is thinking..."
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-gray-500 text-sm">AI is thinking...</span>
                          </div>
                        ) : (
                          // Phase 2: Streaming content
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{streamedContent}</ReactMarkdown>
                            {showTypingCursor && (
                              <span className="inline-block w-2 h-5 bg-gray-600 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="border-t bg-white p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Ask follow-up questions here..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={true}
                    />
                    <button
                      disabled={true}
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Demo mode - Real-time streaming simulation</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingDemo;