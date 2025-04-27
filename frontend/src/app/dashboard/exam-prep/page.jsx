// app/dashboard/exam-prep/page.jsx
"use client";

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';

const examTypes = [
  {
    id: 'multiple-choice',
    name: 'Multiple Choice',
    description: 'Practice with multiple choice questions',
    icon: '🔘'
  },
  {
    id: 'short-answer',
    name: 'Short Answer',
    description: 'Practice answering concise questions',
    icon: '✏️'
  },
  {
    id: 'essay',
    name: 'Essay Questions',
    description: 'Practice structured long-form answers',
    icon: '📝'
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    description: 'Practice solving complex problems step by step',
    icon: '🔍'
  }
];

const subjectAreas = [
  'Mathematics', 'Science', 'History', 'Literature', 
  'Computer Science', 'Economics', 'Business', 'Arts',
  'Psychology', 'Philosophy', 'Law', 'Medicine',
  'Engineering', 'Foreign Languages', 'Social Studies'
];

export default function ExamPrepPage() {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicInfo, setTopicInfo] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [initialMessage, setInitialMessage] = useState('');
  const [prepSessions, setPrepSessions] = useState([]);
  const [activePrepSession, setActivePrepSession] = useState(null);
  
  // Load saved prep sessions
  useEffect(() => {
    const savedSessions = localStorage.getItem('eduExamPrepSessions');
    if (savedSessions) {
      setPrepSessions(JSON.parse(savedSessions));
    }
  }, []);
  
  // Save prep sessions
  useEffect(() => {
    if (prepSessions.length > 0) {
      localStorage.setItem('eduExamPrepSessions', JSON.stringify(prepSessions));
    }
  }, [prepSessions]);
  
  const handleCreatePractice = (e) => {
    e.preventDefault();
    
    if (!selectedExamType || !selectedSubject || !topicInfo.trim()) {
      return;
    }
    
    // Format the prompt based on exam type
    let prompt = `Create a practice ${selectedExamType.id} exam for ${selectedSubject} on the topic of ${topicInfo}. `;
    prompt += `Please provide ${numQuestions} questions at a ${difficultyLevel} difficulty level. `;
    
    switch (selectedExamType.id) {
      case 'multiple-choice':
        prompt += 'For each multiple choice question, include 4 options (A, B, C, D) and indicate the correct answer.';
        break;
      case 'short-answer':
        prompt += 'For each short answer question, provide a model answer after all questions.';
        break;
      case 'essay':
        prompt += 'For each essay question, provide a detailed rubric on what would constitute an excellent answer.';
        break;
      case 'problem-solving':
        prompt += 'For each problem, provide a step-by-step solution after all problems.';
        break;
    }
    
    setInitialMessage(prompt);
    
    // Create a new prep session
    const newSession = {
      id: Date.now().toString(),
      type: selectedExamType.id,
      subject: selectedSubject,
      topic: topicInfo,
      difficulty: difficultyLevel,
      questions: numQuestions,
      date: new Date().toISOString(),
      chatId: null // Will be set when chat response comes back
    };
    
    setPrepSessions([newSession, ...prepSessions]);
    setActivePrepSession(newSession);
    
    // Reset form
    setTopicInfo('');
  };
  
  const handleSessionSelect = (session) => {
    setActivePrepSession(session);
    setInitialMessage('');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Exam Prep</h1>
        <p className="text-gray-600">Generate practice exams and quizzes to test your knowledge</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with past sessions and form */}
        <div className="w-80 bg-gray-50 border-r overflow-y-auto flex flex-col">
          {!activePrepSession ? (
            <div className="p-4 border-b">
              <h2 className="font-medium text-gray-700 mb-3">Create Practice Exam</h2>
              <form onSubmit={handleCreatePractice}>
                {/* Exam Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {examTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedExamType(type)}
                        className={`text-center p-2 border rounded-lg ${
                          selectedExamType?.id === type.id 
                            ? 'bg-indigo-100 border-indigo-300' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Area
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjectAreas.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Topic */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specific Topic
                  </label>
                  <input
                    type="text"
                    value={topicInfo}
                    onChange={(e) => setTopicInfo(e.target.value)}
                    placeholder="E.g., Quadratic equations, World War II..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                
                {/* Difficulty */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                {/* Number of questions */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  disabled={!selectedExamType || !selectedSubject || !topicInfo.trim()}
                >
                  Generate Practice Exam
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium text-gray-700">Current Session</h2>
                <button
                  onClick={() => setActivePrepSession(null)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  New Exam
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">
                    {examTypes.find(t => t.id === activePrepSession.type)?.icon || '📚'}
                  </span>
                  <span className="font-medium">{activePrepSession.subject}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Topic: {activePrepSession.topic}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {activePrepSession.questions} questions • {activePrepSession.difficulty} difficulty
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(activePrepSession.date)}
                </div>
              </div>
            </div>
          )}
          
          {/* Past Sessions */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-medium text-gray-700 mb-2">Recent Sessions</h3>
            
            {prepSessions.length > 0 ? (
              <div className="space-y-2">
                {prepSessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => handleSessionSelect(session)}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      activePrepSession?.id === session.id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg mr-2">
                        {examTypes.find(t => t.id === session.type)?.icon || '📚'}
                      </span>
                      <span className="font-medium flex-1">{session.subject}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(session.date).split(',')[0]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {session.topic}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No exam sessions yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Main exam prep area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activePrepSession ? (
            <ChatInterface 
              initialMessage={initialMessage}
              aiProvider="openai" 
              model="gpt-4o"
              placeholder="Ask questions about the exam content..."
              systemContext={`You are an exam preparation assistant specialized in creating practice questions for ${activePrepSession.subject}, particularly ${activePrepSession.topic}. Provide detailed explanations with your answers and help the student understand concepts thoroughly.`}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Create a Practice Exam</h3>
                <p className="text-gray-600">
                  Use the form on the left to generate a customized practice exam.
                  You can select the exam type, subject, topic, and difficulty level.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}