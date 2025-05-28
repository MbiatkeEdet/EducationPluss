// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, Code, Award, BookOpen, ListChecks, Brain, GraduationCap, Wallet } from 'lucide-react';
import WalletModal from '@/components/ui/WalletModal';
import LazyEPlusWidget from '@/components/ui/LazyEPlusWidget';
import RewardNotificationContainer from '@/components/ui/RewardNotificationContainer';
import ePlusService from '@/lib/ePlusService';

export default function DashboardHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    studyHours: 0,
    examsPracticed: 0,
    writingProjects: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  
  // New EPlus state
  const [ePlusData, setEPlusData] = useState({
    balance: 0,
    rewardHistory: [],
    dailyStreak: { current: 0, longest: 0 },
    stats: {}
  });
  const [lastLoginProcessed, setLastLoginProcessed] = useState(false);

  // Check for authentication and wallet connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if wallet is connected from user data
      if (parsedUser.solanaWallet && parsedUser.walletVerified) {
        setWalletConnected(true);
      }
      
      // Set total rewards from user's EPlus claim or activity metrics
      if (parsedUser.ePlusClaim && parsedUser.ePlusClaim.claimedAmount) {
        setTotalRewards(parsedUser.ePlusClaim.claimedAmount);
      }
    }
    
    // Load stats and activities
    loadUserData();
    
    // Load EPlus data
    loadEPlusData();
    
    // Process daily login
    processDailyLogin();
  }, [router]);

  // Load user data for stats and activities
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
    
    // Generate total rewards based on activity if not set from user data
    if (!user?.ePlusClaim?.claimedAmount) {
      const calculatedRewards = completedTasks * 5 + examSessions.length * 8;
      setTotalRewards(calculatedRewards);
    }
    
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
  
  // Load EPlus data
  const loadEPlusData = async () => {
    try {
      const data = await ePlusService.getBalance();
      setEPlusData(data);
      setTotalRewards(data.balance);
    } catch (error) {
      console.error('Failed to load EPlus data:', error);
    }
  };

  // Process daily login
  const processDailyLogin = async () => {
    const today = new Date().toDateString();
    const lastProcessed = localStorage.getItem('lastDailyLoginProcessed');
    
    if (lastProcessed !== today) {
      try {
        const result = await ePlusService.processDailyLogin();
        if (result) {
          localStorage.setItem('lastDailyLoginProcessed', today);
          setLastLoginProcessed(true);
          // Reload EPlus data to reflect new balance
          setTimeout(loadEPlusData, 1000);
        }
      } catch (error) {
        console.error('Failed to process daily login:', error);
      }
    }
  };

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletConnected = (address) => {
    // Update user data with new wallet
    const updatedUser = { 
      ...user, 
      solanaWallet: address, 
      walletVerified: true 
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setWalletConnected(true);
    setShowWalletModal(false);
  };

  const handleRewardsClick = () => {
    if (walletConnected) {
      router.push('/dashboard/rewards');
    } else {
      setShowWalletModal(true);
    }
  };

  const handleEPlusClick = () => {
    router.push('/dashboard/rewards');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
      description: 'Flashcards, notes, summaries, and mind maps',
      icon: <Brain size={24} />,
      color: 'bg-purple-100 text-purple-600',
      submenu: [
        { name: 'Flashcard Generator', link: '/dashboard/study-tools?tool=flashcards', icon: '📇' },
        { name: 'Note Organizer', link: '/dashboard/study-tools?tool=notes', icon: '📝' },
        { name: 'Content Summarizer', link: '/dashboard/study-tools?tool=summarizer', icon: '📄' },
        { name: 'Mind Map Creator', link: '/dashboard/study-tools?tool=mindmap', icon: '🗺️' },
        { name: 'Concept Explainer', link: '/dashboard/study-tools?tool=explain', icon: '💡' }
      ],
      stat: `${stats.studyHours} study hours`
    },
    {
      title: 'Code Generator',
      description: 'Generate code with implementation steps',
      icon: <Code size={24} />,
      color: 'bg-slate-100 text-slate-600',
      link: '/dashboard/code-generator',
      stat: 'AI-powered coding'
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
      {/* Reward Notifications */}
      <RewardNotificationContainer />
      
      {/* Welcome section - Modified layout */}
      <div className="mb-6">
        {/* Welcome message */}
        <div className="mb-4">
          <motion.h1 
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome back, {user?.name || 'Student'}!
          </motion.h1>
          <p className="text-gray-600 mt-1">
            Track your progress and access your learning tools
          </p>
        </div>
        
        {/* EPlus Widget - Full width on desktop with lazy loading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <LazyEPlusWidget
            balance={ePlusData.balance}
            dailyStreak={ePlusData.dailyStreak}
            recentRewards={ePlusData.rewardHistory}
            onClick={handleEPlusClick}
          />
        </motion.div>
      </div>

      {/* Quick action buttons */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {quickActions.map((action, index) => (
          <Link 
            key={index} 
            href={action.link}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
            onClick={() => {
              // Simulate reward for quick actions
              ePlusService.simulateReward('ai_usage', { 
                newBalance: ePlusData.balance + 0.02 
              });
            }}
          >
            <div className={`${action.color} p-2 rounded-lg text-white`}>
              {action.icon}
            </div>
            <span className="font-medium text-sm">{action.name}</span>
          </Link>
        ))}
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Tools (takes 2/3 of the space on large screens) */}
        <div className="lg:col-span-2">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {toolCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {card.submenu ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className={`${card.color} p-3 rounded-lg`}>
                        {card.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {card.submenu.map((item, subIndex) => (
                        <Link 
                          key={subIndex} 
                          href={item.link}
                          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                          onClick={() => {
                            ePlusService.simulateReward('ai_usage');
                          }}
                        >
                          <span className="text-lg mr-3">{item.icon}</span>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{card.stat}</span>
                    </div>
                  </div>
                ) : (
                  <Link href={card.link} className="block">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group">
                      <div className="flex items-center mb-4">
                        <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                          {card.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-800">{card.title}</h3>
                          <p className="text-sm text-gray-600">{card.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{card.stat}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Right sidebar - takes 1/3 of the space on large screens */}
        <div className="space-y-6">
          {/* Upcoming tasks */}
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>
          
          {/* Recent activity */}
          <motion.div 
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
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
          </motion.div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}