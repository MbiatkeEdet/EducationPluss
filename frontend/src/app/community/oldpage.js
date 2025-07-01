"use client";

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  Heart, 
  Share2, 
  BookOpen, 
  Target, 
  Star,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Crown,
  Flame
} from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions');

  const discussions = [
    {
      id: 1,
      title: "Best AI study techniques for calculus?",
      author: "Sarah Chen",
      avatar: "SC",
      replies: 24,
      likes: 18,
      timestamp: "2 hours ago",
      category: "Mathematics",
      tags: ["calculus", "ai-help", "study-tips"]
    },
    {
      id: 2,
      title: "Sharing my 30-day streak milestone! 🔥",
      author: "Alex Rodriguez",
      avatar: "AR",
      replies: 42,
      likes: 156,
      timestamp: "4 hours ago",
      category: "Achievements",
      tags: ["milestone", "motivation", "streak"]
    },
    {
      id: 3,
      title: "Code review: My first Python project",
      author: "Emily Johnson",
      avatar: "EJ",
      replies: 15,
      likes: 23,
      timestamp: "6 hours ago",
      category: "Programming",
      tags: ["python", "code-review", "beginner"]
    },
    {
      id: 4,
      title: "Study group for AP Chemistry - anyone interested?",
      author: "Marcus Kim",
      avatar: "MK",
      replies: 8,
      likes: 12,
      timestamp: "1 day ago",
      category: "Study Groups",
      tags: ["chemistry", "study-group", "ap-exam"]
    }
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Jessica Park",
      avatar: "JP",
      points: 2847,
      streak: 45,
      badge: "Scholar",
      level: "Expert"
    },
    {
      rank: 2,
      name: "David Liu",
      avatar: "DL",
      points: 2634,
      streak: 32,
      badge: "Mentor",
      level: "Expert"
    },
    {
      rank: 3,
      name: "Anna Costa",
      avatar: "AC",
      points: 2341,
      streak: 28,
      badge: "Helper",
      level: "Advanced"
    },
    {
      rank: 4,
      name: "Ryan Taylor",
      avatar: "RT",
      points: 2156,
      streak: 21,
      badge: "Achiever",
      level: "Advanced"
    },
    {
      rank: 5,
      name: "Sofia Rahman",
      avatar: "SR",
      points: 1987,
      streak: 19,
      badge: "Learner",
      level: "Intermediate"
    }
  ];

  const studyGroups = [
    {
      id: 1,
      name: "AP Computer Science Study Circle",
      members: 24,
      subject: "Computer Science",
      description: "Weekly coding challenges and exam prep",
      nextSession: "Tomorrow at 3 PM",
      level: "Advanced"
    },
    {
      id: 2,
      name: "Calculus Collaborative",
      members: 18,
      subject: "Mathematics",
      description: "Collaborative problem solving and concept review",
      nextSession: "Friday at 7 PM",
      level: "Intermediate"
    },
    {
      id: 3,
      name: "Spanish Conversation Club",
      members: 31,
      subject: "Languages",
      description: "Practice Spanish conversation in a friendly environment",
      nextSession: "Monday at 6 PM",
      level: "Beginner"
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-gray-300" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      case 'Beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🌟 Community Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow learners, share knowledge, and grow together in our vibrant learning community
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            <div className="flex space-x-2">
              {[
                { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { id: 'study-groups', label: 'Study Groups', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Discussions</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Start Discussion
                  </button>
                </div>
                
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium">
                          {discussion.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>by {discussion.author}</span>
                            <span>{discussion.timestamp}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{discussion.category}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1">
                              <MessageSquare size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">{discussion.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">{discussion.likes}</span>
                            </div>
                            <div className="flex space-x-1">
                              {discussion.tags.map((tag) => (
                                <span key={tag} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Members</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Discussions</span>
                    <span className="font-medium">3,842</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Popular Topics</h3>
                <div className="space-y-2">
                  {['study-tips', 'mathematics', 'programming', 'motivation', 'exam-prep'].map((topic) => (
                    <span key={topic} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Community Leaderboard</h2>
              <p className="text-gray-600">Top performers this month</p>
            </div>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user.rank} className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(user.rank)}
                      <span className="text-2xl font-bold text-gray-700">#{user.rank}</span>
                    </div>
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                          {user.level}
                        </span>
                        <span className="text-sm text-gray-500">{user.badge}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{user.points.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">points</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Flame size={16} className="text-orange-500" />
                      <span className="text-sm font-medium">{user.streak} day streak</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Groups Tab */}
        {activeTab === 'study-groups' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Active Study Groups</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Create Group
                  </button>
                </div>
                
                <div className="space-y-4">
                  {studyGroups.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{group.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(group.level)}`}>
                          {group.level}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users size={16} />
                            <span>{group.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{group.nextSession}</span>
                          </div>
                        </div>
                        <button className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-200 transition-colors text-sm">
                          Join Group
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Study Group Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Target size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">Collaborative learning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookOpen size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700">Shared resources</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Zap size={16} className="text-purple-600" />
                    </div>
                    <span className="text-gray-700">Motivation & accountability</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Join the Community!</h3>
                <p className="text-indigo-100 mb-4">
                  Connect with thousands of learners worldwide and accelerate your learning journey.
                </p>
                <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}