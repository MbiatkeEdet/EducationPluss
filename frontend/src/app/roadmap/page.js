"use client";

import { useState } from 'react';
import Footer from '@/components/Footer'; // Adjust the import based on your project structure
import Navbar from '@/components/Navbar'; // Add this import for Navbar
import Link from 'next/link';
import { CheckCircle, Users, PenTool, Brain, Calendar, Zap, Settings, FileText, BookOpen, Globe, Award, Smartphone, MessageSquare, GraduationCap, ArrowRight, Target, ChevronRight } from 'lucide-react';

const navItems = [
  { text: "AI Features", href: "/signup" },
  { text: "Roadmap", href: "/roadmap" },
  { text: "Community", href: "/community" },
  { text: "Rewards", href: "/rewards" }
];
  
export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState(1);

  const phases = [
    {
      id: 1,
      title: "MVP (Minimum Viable Product)",
      subtitle: "Phase 1",
      description: "Launch a lean, functional version to validate core demand and gather early feedback.",
      color: "from-green-500 to-emerald-600",
      icon: <CheckCircle size={24} />,
      emoji: "✅",
      features: [
        { 
          name: "User Authentication & Profiles", 
          description: "Students sign up and set preferences (subjects, level)",
          icon: <Users size={20} />
        },
        { 
          name: "AI Writing Assistant", 
          description: "Proofreading, grammar correction, basic structure suggestions",
          icon: <PenTool size={20} />
        },
        { 
          name: "AI-Powered Study Help", 
          description: "Chatbot that answers academic questions from selected subjects",
          icon: <Brain size={20} />
        },
        { 
          name: "Task & Time Management Tool", 
          description: "To-do list with deadlines, reminders, and calendar view",
          icon: <Calendar size={20} />
        }
      ],
      objectives: [
        "Launch to early users (high school & college students)",
        "Collect analytics, feedback, and bug reports"
      ]
    },
    {
      id: 2,
      title: "Full Launch",
      subtitle: "Phase 2",
      description: "Build full platform value, drive engagement, and prepare for partnerships or B2B pitch.",
      color: "from-blue-500 to-indigo-600",
      icon: <Zap size={24} />,
      emoji: "💡",
      features: [
        { 
          name: "AI Agent Creator (No-Code Builder)", 
          description: "Templates, drag-and-drop logic builder",
          icon: <Settings size={20} />
        },
        { 
          name: "AI-Summarizer & Flashcard Generator", 
          description: "Upload files to convert into study sets",
          icon: <FileText size={20} />
        },
        { 
          name: "Smart Study Planner", 
          description: "Auto-suggest study blocks based on tasks and availability",
          icon: <BookOpen size={20} />
        },
        { 
          name: "Multilingual Support (Beta)", 
          description: "Support English + 1–2 other languages (e.g., Spanish, Hindi)",
          icon: <Globe size={20} />
        },
        { 
          name: "Leaderboards & Badges", 
          description: "Based on quiz scores, tasks, and study streaks",
          icon: <Award size={20} />
        }
      ],
      objectives: [
        "Onboard 5–10 institutions or student groups",
        "Launch press/marketing campaign",
        "Collect case studies and testimonials"
      ]
    },
    {
      id: 3,
      title: "V2 Expansion",
      subtitle: "Phase 3",
      description: "Scale the platform, expand into partnerships, and offer institutional-level tools.",
      color: "from-purple-500 to-violet-600",
      icon: <Globe size={24} />,
      emoji: "🌍",
      features: [
        { 
          name: "Offline Support / Lightweight Mobile App", 
          description: "AI tools work offline or on low bandwidth",
          icon: <Smartphone size={20} />
        },
        { 
          name: "Peer Tutoring Marketplace", 
          description: "Users offer help for tokens, rated by peers",
          icon: <Users size={20} />
        },
        { 
          name: "Voice-to-Agent Tool", 
          description: "Convert spoken lessons into AI tutors",
          icon: <MessageSquare size={20} />
        },
        { 
          name: "Group Study Rooms", 
          description: "Real-time collaboration with whiteboard and shared notes",
          icon: <Users size={20} />
        },
        { 
          name: "AI Grader & Feedback System", 
          description: "Auto-grade essays with structure and clarity feedback",
          icon: <GraduationCap size={20} />
        },
        { 
          name: "LMS & API Integrations", 
          description: "Integrate with Moodle, Canvas, Google Classroom, etc.",
          icon: <Settings size={20} />
        }
      ],
      objectives: []
    }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🚀 ROAD-MAP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our journey to revolutionize education through AI-powered learning tools
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            <div className="flex space-x-2">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activePhase === phase.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {phase.subtitle}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="mb-16">
          <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phase.color} text-white flex items-center justify-center mb-2`}>
                    {phase.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{phase.subtitle}</p>
                    <p className="text-sm text-gray-500">{phase.title}</p>
                  </div>
                </div>
                {index < phases.length - 1 && (
                  <ArrowRight size={20} className="text-gray-400 mx-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Phase Details */}
        {phases.map((phase) => (
          activePhase === phase.id && (
            <div
              key={phase.id}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Phase Overview */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${phase.color} text-white flex items-center justify-center mb-4`}>
                    {phase.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h2>
                  <p className="text-gray-600 mb-6">{phase.description}</p>
                  
                  {phase.objectives.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <Target size={16} className="mr-2 text-indigo-600" />
                        🎯 Key Objectives
                      </h3>
                      <ul className="space-y-2">
                        {phase.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight size={16} className="mr-2 text-gray-400 mt-0.5" />
                            <span className="text-sm text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Features Grid */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  {phase.emoji} {phase.id === 2 ? 'Feature Additions' : phase.id === 3 ? 'Expansion Features' : 'Core Features'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phase.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start mb-4">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3 group-hover:bg-indigo-100 transition-colors">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ))}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Be part of the future of education. Get early access to new features and help shape the platform.
            </p>
           <Link href="/signup">
             <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
               Get Early Access
             </button>
           </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}




