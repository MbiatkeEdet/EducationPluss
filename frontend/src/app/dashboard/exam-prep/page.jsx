// app/dashboard/exam-prep/page.jsx
"use client";

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle, XCircle, Clock, FileText, Award, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

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

// Exam Display Component
function ExamDisplay({ examData, examType, onSubmitAnswers, isSubmitted, results }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    onSubmitAnswers(userAnswers, timeElapsed);
  };

  const toggleQuestionExpansion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const parseExamContent = (content) => {
    // Parse the AI response to extract questions
    const lines = content.split('\n').filter(line => line.trim());
    const questions = [];
    let currentQuestion = null;
    let questionIndex = -1;

    for (const line of lines) {
      // Check for question start - handle both numbered and markdown heading formats
      const questionMatch = line.match(/^\*?\*?(\d+)[\.\)]\s*(.+)/) || 
                           line.match(/^###\s*\*?\*?(\d+)[\.\)]\s*(.+)/) ||
                           line.match(/^###\s*(.+\?\s*)$/);
      
      if (questionMatch) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        questionIndex++;
        
        // Extract question text - handle different formats
        let questionText = '';
        if (questionMatch[2]) {
          questionText = questionMatch[2]; // For numbered questions
        } else if (questionMatch[1]) {
          questionText = questionMatch[1]; // For markdown headings
        }
        
        // Remove markdown formatting
        questionText = questionText.replace(/\*\*/g, '').trim();
        
        currentQuestion = {
          index: questionIndex,
          question: questionText,
          options: [],
          correctAnswer: null,
          explanation: ''
        };
      }
      // Check for options (A, B, C, D) - handle various formats
      else if (currentQuestion && (
        line.match(/^\s*[A-D][\.\)]\s*(.+)/) || 
        line.match(/^[A-D][\.\)]\s*(.+)/)
      )) {
        const optionMatch = line.match(/^\s*([A-D])[\.\)]\s*(.+)/) || 
                           line.match(/^([A-D])[\.\)]\s*(.+)/);
        if (optionMatch) {
          currentQuestion.options.push({
            letter: optionMatch[1],
            text: optionMatch[2].trim()
          });
        }
      }
      // Check for correct answer indication in various formats
      else if (line.toLowerCase().includes('correct answer') || 
               line.toLowerCase().includes('answer:') ||
               line.toLowerCase().includes('correct:')) {
        const answerMatch = line.match(/([A-D])/);
        if (answerMatch && currentQuestion) {
          currentQuestion.correctAnswer = answerMatch[1];
        }
      }
      // Check for explanation text
      else if (currentQuestion && line.toLowerCase().includes('explanation')) {
        currentQuestion.explanation = line.replace(/explanation:?/i, '').trim();
      }
    }

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // If no questions were parsed, try alternative parsing for markdown format
    if (questions.length === 0) {
      return parseMarkdownQuestions(content);
    }

    return questions;
  };

  // Alternative parser for markdown-formatted questions
  const parseMarkdownQuestions = (content) => {
    const questions = [];
    
    // Split by question separators (--- or ###)
    const sections = content.split(/---+|\n###/).filter(section => section.trim());
    
    sections.forEach((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length < 5) return; // Skip if not enough content for a question
      
      let questionText = '';
      const options = [];
      
      // Find the question text (usually the first substantial line)
      for (const line of lines) {
        if (line.includes('?') && !questionText) {
          questionText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
          break;
        }
      }
      
      // Find options A, B, C, D
      for (const line of lines) {
        const optionMatch = line.match(/^[A-D][\.\)]\s*(.+)/);
        if (optionMatch) {
          options.push({
            letter: optionMatch[0].charAt(0),
            text: optionMatch[1].trim()
          });
        }
      }
      
      if (questionText && options.length >= 4) {
        questions.push({
          index: index,
          question: questionText,
          options: options,
          correctAnswer: null, // Will be determined during grading
          explanation: ''
        });
      }
    });
    
    return questions;
  };

  const questions = parseExamContent(examData);

  const renderMultipleChoice = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile-optimized header */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <span className="text-gray-600">Time: {formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-500" />
              <span className="text-gray-600">
                Progress: {Object.keys(userAnswers).length}/{questions.length}
              </span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted || Object.keys(userAnswers).length !== questions.length}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm font-medium self-start sm:self-auto"
          >
            {isSubmitted ? 'Submitted' : 'Submit Exam'}
          </button>
        </div>
      </div>

      {questions.map((q, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
              Question {index + 1}
            </h3>
            {isSubmitted && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {userAnswers[index] === q.correctAnswer ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {userAnswers[index] === q.correctAnswer ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            )}
          </div>
          
          <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">{q.question}</p>
          
          <div className="space-y-2">
            {q.options.map((option) => (
              <label
                key={option.letter}
                className={`flex items-start p-3 rounded-lg border cursor-pointer transition text-sm md:text-base ${
                  userAnswers[index] === option.letter
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'hover:bg-gray-50'
                } ${
                  isSubmitted && option.letter === q.correctAnswer
                    ? 'bg-green-50 border-green-300'
                    : ''
                } ${
                  isSubmitted && userAnswers[index] === option.letter && option.letter !== q.correctAnswer
                    ? 'bg-red-50 border-red-300'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.letter}
                  checked={userAnswers[index] === option.letter}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={isSubmitted}
                  className="mt-0.5 mr-3 flex-shrink-0"
                />
                <span className="font-medium mr-2 flex-shrink-0">{option.letter}.</span>
                <span className="leading-relaxed">{option.text}</span>
              </label>
            ))}
          </div>

          {isSubmitted && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Correct Answer:</strong> {q.correctAnswer}
              </p>
              {q.explanation && (
                <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {isSubmitted && results && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="text-center">
            <Award className="mx-auto text-indigo-600 mb-4" size={48} />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Exam Results</h3>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
              {results.score}%
            </div>
            <p className="text-gray-600 mb-4 text-sm md:text-base">
              {results.correct} out of {results.total} questions correct
            </p>
            <div className="text-sm text-gray-500">
              Completed in {formatTime(results.timeElapsed)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderShortAnswer = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">Time: {formatTime(timeElapsed)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm font-medium self-start sm:self-auto"
          >
            {isSubmitted ? 'Submitted' : 'Submit Answers'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="prose prose-sm md:prose max-w-none">
          <ReactMarkdown>{examData}</ReactMarkdown>
        </div>
        
        {!isSubmitted && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Your Answers:</h3>
            <textarea
              value={userAnswers.essay || ''}
              onChange={(e) => handleAnswerChange('essay', e.target.value)}
              placeholder="Type your answers here..."
              className="w-full h-48 md:h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            />
          </div>
        )}

        {isSubmitted && results && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Your Answers:</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm md:text-base">{userAnswers.essay}</pre>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">AI Feedback:</h4>
              <div className="prose prose-blue prose-sm md:prose max-w-none">
                <ReactMarkdown>{results.feedback}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEssay = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600">Time: {formatTime(timeElapsed)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitted || !userAnswers.essay?.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 text-sm font-medium self-start sm:self-auto"
          >
            {isSubmitted ? 'Submitted' : 'Submit Essay'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Essay Prompt:</h3>
        <div className="prose prose-sm md:prose max-w-none mb-6">
          <ReactMarkdown>{examData}</ReactMarkdown>
        </div>
        
        {!isSubmitted && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Essay:</h3>
            <textarea
              value={userAnswers.essay || ''}
              onChange={(e) => handleAnswerChange('essay', e.target.value)}
              placeholder="Write your essay here..."
              className="w-full h-64 md:h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            />
            <div className="text-sm text-gray-500">
              Word count: {(userAnswers.essay || '').split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>
        )}

        {isSubmitted && results && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Essay:</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm md:text-base">{userAnswers.essay}</pre>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Award size={20} />
                  Grade: {results.grade}
                </h4>
                <p className="text-green-700 text-sm">{results.gradeDescription}</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Overall Score:</h4>
                <div className="text-2xl font-bold text-blue-600">{results.score}/100</div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Detailed Feedback:</h4>
              <div className="prose prose-yellow prose-sm md:prose max-w-none">
                <ReactMarkdown>{results.feedback}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render based on exam type
  if (examType === 'multiple-choice') {
    return renderMultipleChoice();
  } else if (examType === 'short-answer') {
    return renderShortAnswer();
  } else if (examType === 'essay') {
    return renderEssay();
  } else {
    return renderShortAnswer(); // Default to short answer for problem-solving
  }
}

export default function ExamPrepPage() {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topicInfo, setTopicInfo] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState(5);
  const [initialMessage, setInitialMessage] = useState('');
  const [prepSessions, setPrepSessions] = useState([]);
  const [activePrepSession, setActivePrepSession] = useState(null);
  const [examGenerated, setExamGenerated] = useState(false);
  const [examData, setExamData] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
        prompt += `For each multiple choice question:
1. Number the questions (1, 2, 3, etc.)
2. Include exactly 4 options labeled A, B, C, D
3. Do NOT reveal the correct answers in the initial response
4. Format each question clearly
5. Make the questions challenging but fair for the ${difficultyLevel} level`;
        break;
      case 'short-answer':
        prompt += 'Create clear, concise questions that require short paragraph responses. Number each question clearly.';
        break;
      case 'essay':
        prompt += 'Create essay prompts that require detailed, analytical responses. Include specific requirements for each essay.';
        break;
      case 'problem-solving':
        prompt += 'Create step-by-step problems that require logical reasoning and problem-solving skills.';
        break;
    }
    
    setInitialMessage(prompt);
    setExamGenerated(false);
    setExamSubmitted(false);
    setExamResults(null);
    
    // Create a new prep session
    const newSession = {
      id: Date.now().toString(),
      type: selectedExamType.id,
      subject: selectedSubject,
      topic: topicInfo,
      difficulty: difficultyLevel,
      questions: numQuestions,
      date: new Date().toISOString(),
      chatId: null
    };
    
    setPrepSessions([newSession, ...prepSessions]);
    setActivePrepSession(newSession);
    
    // Reset form and close sidebar on mobile
    setTopicInfo('');
    setIsSidebarOpen(false);
  };
  
  const handleSessionSelect = (session) => {
    setActivePrepSession(session);
    setInitialMessage('');
    setExamGenerated(false);
    setExamSubmitted(false);
    setExamResults(null);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleAiResponse = (response) => {
    if (response && response.content) {
      setExamData(response.content);
      setExamGenerated(true);
    }
  };

  const handleSubmitAnswers = async (userAnswers, timeElapsed) => {
    setExamSubmitted(true);
    
    // Generate grading prompt based on exam type
    let gradingPrompt = '';
    
    if (activePrepSession.type === 'multiple-choice') {
      gradingPrompt = `Please grade this multiple choice exam and provide the correct answers. 

Original exam:
${examData}

Student's answers: ${JSON.stringify(userAnswers)}

IMPORTANT: Please respond in this exact format:

CORRECT ANSWERS:
1. A
2. B
3. C
4. D

EXPLANATIONS:
1. [Brief explanation for question 1]
2. [Brief explanation for question 2]
3. [Brief explanation for question 3]
4. [Brief explanation for question 4]

SCORE: X out of Y questions correct (Z%)`;
    } else if (activePrepSession.type === 'essay') {
      gradingPrompt = `Please grade this essay response and provide detailed feedback.

Essay prompt:
${examData}

Student's essay:
${userAnswers.essay}

Please provide:
1. A letter grade (A, B, C, D, F)
2. A numerical score out of 100
3. Detailed feedback covering:
   - Content and argument quality
   - Organization and structure
   - Writing clarity and style
   - Areas for improvement
   - Specific strengths`;
    } else {
      gradingPrompt = `Please grade these short answers and provide feedback.

Questions:
${examData}

Student's answers:
${userAnswers.essay}

Please provide detailed feedback and suggestions for improvement.`;
    }

    // Send grading request to AI
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: gradingPrompt,
          aiProvider: 'deepseek',
          model: 'deepseek-chat',
          systemContext: 'You are an experienced teacher grading student work. Provide constructive, detailed feedback.',
          feature: 'exam-prep-grading',
          subFeature: activePrepSession.type
        })
      });

      const gradingResult = await response.json();
      
      // Parse the grading result based on exam type
      if (activePrepSession.type === 'multiple-choice') {
        // Parse correct answers from AI response
        const correctAnswersMatch = gradingResult.response.match(/CORRECT ANSWERS:([\s\S]*?)(?:EXPLANATIONS:|$)/);
        const scoreMatch = gradingResult.response.match(/(\d+)\s+out of\s+(\d+).*?(\d+)%/);
        
        let correctAnswers = {};
        if (correctAnswersMatch) {
          const answerLines = correctAnswersMatch[1].trim().split('\n');
          answerLines.forEach(line => {
            const match = line.match(/(\d+)\.\s*([A-D])/);
            if (match) {
              correctAnswers[parseInt(match[1]) - 1] = match[2]; // Convert to 0-based index
            }
          });
        }
        
        // Update questions with correct answers
        const updatedQuestions = parseExamContent(examData);
        updatedQuestions.forEach((question, index) => {
          if (correctAnswers[index]) {
            question.correctAnswer = correctAnswers[index];
          }
        });
        
        // Calculate score
        let correct = 0;
        Object.keys(userAnswers).forEach(key => {
          if (userAnswers[key] === correctAnswers[key]) {
            correct++;
          }
        });
        
        const total = Object.keys(userAnswers).length;
        const percentage = Math.round((correct / total) * 100);
        
        setExamResults({
          score: percentage,
          correct: correct,
          total: total,
          timeElapsed: timeElapsed,
          feedback: gradingResult.response,
          correctAnswers: correctAnswers
        });
        
        // Update exam data with correct answers for display
        setExamData(examData); // This will trigger re-render with correct answers
        
      } else if (activePrepSession.type === 'essay') {
        // Parse grade and score from AI response
        const gradeMatch = gradingResult.response.match(/grade:\s*([A-F][+-]?)/i);
        const scoreMatch = gradingResult.response.match(/score:\s*(\d+)/i);
        
        setExamResults({
          grade: gradeMatch ? gradeMatch[1] : 'B',
          score: scoreMatch ? parseInt(scoreMatch[1]) : 85,
          gradeDescription: 'Good work with room for improvement',
          feedback: gradingResult.response,
          timeElapsed: timeElapsed
        });
      } else {
        setExamResults({
          feedback: gradingResult.response,
          timeElapsed: timeElapsed
        });
      }
    } catch (error) {
      console.error('Error grading exam:', error);
      setExamResults({
        error: 'Failed to grade exam. Please try again.',
        timeElapsed: timeElapsed
      });
    }
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Exam Prep</h1>
            <p className="text-sm md:text-base text-gray-600">Generate practice exams and quizzes to test your knowledge</p>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white">
              <SidebarContent
                activePrepSession={activePrepSession}
                setActivePrepSession={setActivePrepSession}
                selectedExamType={selectedExamType}
                setSelectedExamType={setSelectedExamType}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                topicInfo={topicInfo}
                setTopicInfo={setTopicInfo}
                difficultyLevel={difficultyLevel}
                setDifficultyLevel={setDifficultyLevel}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                handleCreatePractice={handleCreatePractice}
                prepSessions={prepSessions}
                handleSessionSelect={handleSessionSelect}
                formatDate={formatDate}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-gray-50 border-r overflow-y-auto">
          <SidebarContent
            activePrepSession={activePrepSession}
            setActivePrepSession={setActivePrepSession}
            selectedExamType={selectedExamType}
            setSelectedExamType={setSelectedExamType}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            topicInfo={topicInfo}
            setTopicInfo={setTopicInfo}
            difficultyLevel={difficultyLevel}
            setDifficultyLevel={setDifficultyLevel}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            handleCreatePractice={handleCreatePractice}
            prepSessions={prepSessions}
            handleSessionSelect={handleSessionSelect}
            formatDate={formatDate}
            isMobile={false}
          />
        </div>
        
        {/* Main exam prep area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activePrepSession ? (
            examGenerated && examData ? (
              <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
                <ExamDisplay
                  examData={examData}
                  examType={activePrepSession.type}
                  onSubmitAnswers={handleSubmitAnswers}
                  isSubmitted={examSubmitted}
                  results={examResults}
                />
              </div>
            ) : (
              <ChatInterface 
                initialMessage={initialMessage}
                aiProvider="deepseek" 
                model="deepseek-chat"
                placeholder="Generating your exam..."
                systemContext={`You are an exam preparation assistant specialized in creating practice questions for ${activePrepSession.subject}, particularly ${activePrepSession.topic}. Create clear, well-formatted questions appropriate for the specified difficulty level.`}
                feature="exam-prep"
                subFeature={activePrepSession?.type}
                onAiResponse={handleAiResponse}
                showChat={false}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
              <div className="text-center max-w-md">
                <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-2">Create a Practice Exam</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Use the form to generate a customized practice exam.
                  You can select the exam type, subject, topic, and difficulty level.
                </p>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({
  activePrepSession,
  setActivePrepSession,
  selectedExamType,
  setSelectedExamType,
  selectedSubject,
  setSelectedSubject,
  topicInfo,
  setTopicInfo,
  difficultyLevel,
  setDifficultyLevel,
  numQuestions,
  setNumQuestions,
  handleCreatePractice,
  prepSessions,
  handleSessionSelect,
  formatDate,
  onClose,
  isMobile
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile header with close button */}
      {isMobile && (
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Exam Prep</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
      )}

      {!activePrepSession ? (
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="font-medium text-gray-700 mb-3 text-sm md:text-base">Create Practice Exam</h2>
          <form onSubmit={handleCreatePractice} className="space-y-4">
            {/* Exam Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {examTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedExamType(type)}
                    className={`text-center p-2 border rounded-lg text-xs transition ${
                      selectedExamType?.id === type.id 
                        ? 'bg-indigo-100 border-indigo-300' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="font-medium">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Area
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Topic
              </label>
              <input
                type="text"
                value={topicInfo}
                onChange={(e) => setTopicInfo(e.target.value)}
                placeholder="E.g., Quadratic equations, World War II..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            {/* Number of questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
              disabled={!selectedExamType || !selectedSubject || !topicInfo.trim()}
            >
              Generate Practice Exam
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium text-gray-700 text-sm md:text-base">Current Session</h2>
            <button
              onClick={() => setActivePrepSession(null)}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              New Exam
            </button>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">
                {examTypes.find(t => t.id === activePrepSession.type)?.icon || '📚'}
              </span>
              <span className="font-medium text-sm">{activePrepSession.subject}</span>
            </div>
            <div className="text-xs text-gray-600 mb-1">
              Topic: {activePrepSession.topic}
            </div>
            <div className="text-xs text-gray-600 mb-1">
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
        <h3 className="font-medium text-gray-700 mb-3 text-sm md:text-base">Recent Sessions</h3>
        
        {prepSessions.length > 0 ? (
          <div className="space-y-2">
            {prepSessions.map(session => (
              <button
                key={session.id}
                onClick={() => handleSessionSelect(session)}
                className={`w-full text-left p-3 rounded-lg border transition text-xs md:text-sm ${
                  activePrepSession?.id === session.id
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base mr-2">
                    {examTypes.find(t => t.id === session.type)?.icon || '📚'}
                  </span>
                  <span className="font-medium flex-1">{session.subject}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(session.date).split(',')[0]}
                  </span>
                </div>
                <div className="text-gray-600 truncate mt-1">
                  {session.topic}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No exam sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}