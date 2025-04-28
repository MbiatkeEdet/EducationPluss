// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Clock, Award, BookOpen, ListChecks, Brain, GraduationCap, Wallet } from 'lucide-react';

export default function DashboardHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    studyHours: 0,
    examsPracticed: 0,
    writingProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  
  // Check for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load stats and activities
    loadUserData();
  }, [router]);
  
  const loadUserData = () => {
    // Get tasks from localStorage
    const savedTasks = localStorage.getItem('eduTasks');
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Get exam prep sessions
    const savedExamSessions = localStorage.getItem('eduExamPrepSessions');
    const examSessions = savedExamSessions ? JSON.parse(savedExamSessions) : [];
    
    // Calculate stats
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    
    setStats({
      tasksCompleted: completedTasks,
      studyHours: Math.floor(Math.random() * 10) + 5, // Placeholder for actual study hour tracking
      examsPracticed: examSessions.length,
      writingProjects: Math.floor(Math.random() * 5) + 1 // Placeholder for writing projects
    });
    
    // Generate total rewards based on activity (placeholder for actual reward calculation)
    const calculatedRewards = completedTasks * 5 + examSessions.length * 8;
    setTotalRewards(calculatedRewards);
    
    // Set upcoming tasks (tasks not completed)
    const pendingTasks = tasks
      .filter(task => task.status !== 'completed')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 5);
    
    setUpcomingTasks(pendingTasks);
    
    // Generate recent activity from tasks and exams
    const taskActivities = tasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      type: 'task',
      title: task.title,
      status: task.status,
      date: task.createdAt,
      link: '/dashboard/task-manager'
    }));
    
    const examActivities = examSessions.slice(0, 2).map(session => ({
      id: `exam-${session.id}`,
      type: 'exam',
      title: `${session.subject} - ${session.topic}`,
      details: `${session.questions} questions • ${session.difficulty} difficulty`,
      date: session.date,
      link: '/dashboard/exam-prep'
    }));
    
    const allActivities = [...taskActivities, ...examActivities]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    setRecentActivity(allActivities);
  };
  
  const handleConnectWallet = () => {
    // Placeholder for wallet connection functionality
    setWalletConnected(true);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  // Quick actions for dashboard
  const quickActions = [
    { 
      name: 'New Task', 
      icon: <PlusCircle size={20} />, 
      color: 'bg-blue-500', 
      link: '/dashboard/task-manager' 
    },
    { 
      name: 'Study Session', 
      icon: <BookOpen size={20} />, 
      color: 'bg-purple-500', 
      link: '/dashboard/study-tools' 
    },
    { 
      name: 'Practice Exam', 
      icon: <GraduationCap size={20} />, 
      color: 'bg-amber-500', 
      link: '/dashboard/exam-prep' 
    },
    { 
      name: 'Writing Help', 
      icon: <PlusCircle size={20} />, 
      color: 'bg-green-500', 
      link: '/dashboard/writing-help' 
    }
  ];
  
  // Tool cards for main menu
  const toolCards = [
    {
      title: 'Task Manager',
      description: 'Organize your assignments and get AI help',
      icon: <ListChecks size={24} />,
      color: 'bg-blue-100 text-blue-600',
      link: '/dashboard/task-manager',
      stat: `${stats.tasksCompleted} tasks completed`
    },
    {
      title: 'Writing Help',
      description: 'Get assistance with essays and written work',
      icon: <PlusCircle size={24} />,
      color: 'bg-green-100 text-green-600',
      link: '/dashboard/writing-help',
      stat: `${stats.writingProjects} writing projects`
    },
    {
      title: 'Study Tools',
      description: 'Create flashcards, notes, and summaries',
      icon: <Brain size={24} />,
      color: 'bg-purple-100 text-purple-600',
      link: '/dashboard/study-tools',
      stat: `${stats.studyHours} study hours`
    },
    {
      title: 'Exam Prep',
      description: 'Practice with custom quizzes and tests',
      icon: <GraduationCap size={24} />,
      color: 'bg-amber-100 text-amber-600',
      link: '/dashboard/exam-prep',
      stat: `${stats.examsPracticed} exams practiced`
    }
  ];
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Welcome section with quick stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Track your progress and access your learning tools
          </p>
        </div>
        
        {/* Rewards section */}
        <div className="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Rewards</p>
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">{totalRewards}</span>
              <span className="ml-1 text-sm font-medium text-indigo-600">EDU</span>
            </div>
          </div>
          {!walletConnected ? (
            <button 
              onClick={handleConnectWallet}
              className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Wallet size={14} className="mr-1" />
              Connect
            </button>
          ) : (
            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg flex items-center">
              <Wallet size={14} className="mr-1" />
              Connected
            </span>
          )}
        </div>
      </div>
      
      {/* Quick action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((action, index) => (
          <Link 
            key={index} 
            href={action.link}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center space-x-2 hover:bg-gray-50 transition"
          >
            <div className={`${action.color} p-2 rounded-lg text-white`}>
              {action.icon}
            </div>
            <span className="font-medium">{action.name}</span>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main tools grid - takes 2/3 of the space on large screens */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {toolCards.map((card, index) => (
            <Link
              key={index}
              href={card.link}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  {card.icon}
                </div>
                <h3 className="ml-3 text-lg font-medium">{card.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">{card.stat}</span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Right sidebar - takes 1/3 of the space on large screens */}
        <div className="space-y-6">
          {/* Upcoming tasks */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Upcoming Tasks</h3>
              <Link href="/dashboard/task-manager" className="text-indigo-600 text-sm hover:text-indigo-800">
                View All
              </Link>
            </div>
            
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start">
                    <div className={`mt-1 w-3 h-3 rounded-full ${
                      task.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No upcoming tasks</p>
              </div>
            )}
          </div>
          
          {/* Recent activity */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <Link key={activity.id} href={activity.link} className="block">
                    <div className="flex items-start">
                      <div className={`mt-1 p-2 rounded-lg ${
                        activity.type === 'task' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {activity.type === 'task' ? <ListChecks size={16} /> : <GraduationCap size={16} />}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{activity.title}</p>
                        {activity.details && (
                          <p className="text-xs text-gray-600">{activity.details}</p>
                        )}
                        {activity.status && (
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>
          
          {/* Rewards section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-xl shadow-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Learning Rewards</h3>
              <Award className="h-5 w-5" />
            </div>
            <p className="text-sm text-indigo-100 mb-3">
              Earn EDU tokens by completing learning tasks and reaching your goals
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress to next reward</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            {!walletConnected ? (
              <button 
                onClick={handleConnectWallet}
                className="w-full py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition flex items-center justify-center"
              >
                <Wallet size={16} className="mr-2" />
                Connect Wallet to Claim
              </button>
            ) : (
              <div className="flex justify-between items-center bg-indigo-600 p-3 rounded-lg">
                <div>
                  <p className="text-sm text-indigo-200">Available to claim</p>
                  <p className="text-xl font-bold">{totalRewards} EDU</p>
                </div>
                <button className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-sm font-medium">
                  Claim
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}