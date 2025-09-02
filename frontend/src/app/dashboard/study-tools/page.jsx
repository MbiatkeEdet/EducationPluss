"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatInterface from '@/components/ui/ChatInterface';

const studyTools = [
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Generate flashcards from your study material',
    icon: '🗂️',
    prompt: 'Create flashcards from the following content: ',
    systemContext: 'You are a flashcard generator. Create comprehensive flashcards from the provided content. Each flashcard should have a clear question on one side and a detailed answer on the other. Format your response as a numbered list with "Q:" for questions and "A:" for answers.',
    outputFormat: 'Format: Create at least 10 flashcards. Use this format:\n\n**Flashcard 1:**\n**Q:** Question here\n**A:** Answer here\n\n**Flashcard 2:**\n**Q:** Question here\n**A:** Answer here'
  },
  {
    id: 'notes',
    name: 'Note Organizer',
    description: 'Organize and structure your study notes',
    icon: '📝',
    prompt: 'Please organize these notes: ',
    systemContext: 'You are a note organization assistant. Help the user structure and organize their study notes effectively. Use clear headings, bullet points, and hierarchical organization to make the information accessible and organized for study purposes.',
    outputFormat: 'Return well-organized notes in markdown format with proper headings, bullet points, and clear structure'
  },
  {
    id: 'summarizer',
    name: 'Content Summarizer',
    description: 'Summarize content for quick review',
    icon: '📄',
    prompt: 'Please summarize this content: ',
    systemContext: 'You are a content summarization assistant. Help the user create concise, comprehensive summaries of their study material that highlight key concepts and important information.',
    outputFormat: 'Return summaries in markdown format with clear sections and bullet points for key takeaways'
  },
  {
    id: 'mindmap',
    name: 'Mind Map Creator',
    description: 'Create visual mind maps from your content',
    icon: '🗺️',
    prompt: 'Create a mind map from this content: ',
    systemContext: 'You are a mind mapping assistant. Help the user create visual mind maps that organize information hierarchically and show relationships between concepts.',
    outputFormat: 'Return the mind map in markdown format using headings, subheadings, indentation, and emojis to create a visual hierarchy'
  },
  {
    id: 'explain',
    name: 'Concept Explainer',
    description: 'Get clear explanations of difficult concepts',
    icon: '💡',
    prompt: 'Please explain this concept: ',
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

  // Initialize tool from URL
  useEffect(() => {
    const toolId = searchParams.get('tool');
    if (toolId) {
      const tool = studyTools.find(t => t.id === toolId);
      if (tool) {
        setSelectedTool(tool);
        setSystemContext(tool.systemContext + "\n\n" + tool.outputFormat);
      }
    }
  }, [searchParams]);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setSystemContext(tool.systemContext + "\n\n" + tool.outputFormat);
    setInitialMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studyContent.trim()) return;
    
    // Set the initial message to start streaming
    setInitialMessage(selectedTool.prompt + studyContent);
    setStudyContent('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Study Tools</h1>
        <p className="text-gray-600 text-sm md:text-base">Transform your study materials with AI-powered tools</p>
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Tools sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r overflow-y-auto p-4 flex-shrink-0">
          <h2 className="font-medium text-gray-700 mb-3 text-base md:text-lg">Study Tools</h2>
          <div className="space-y-2">
            {studyTools.map((tool) => (
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
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your study content:
                    </label>
                    <textarea
                      value={studyContent}
                      onChange={(e) => setStudyContent(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                      placeholder="Paste your notes, text, or content here..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!studyContent.trim()}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate {selectedTool.name}
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
                  feature="study-tools"
                  subFeature={selectedTool?.id}
                  showChat={true}
                  showInput={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-4 md:p-8 max-w-md">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">Select a Study Tool</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Choose one of the study tools from the sidebar to transform your study materials.
                </p>
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
    <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
      <StudyToolsContent />
    </Suspense>
  );
}