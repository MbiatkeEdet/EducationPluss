"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { 
  Coins, 
  Gift, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  BookOpen,
  MessageSquare,
  CheckSquare,
  Flame,
  Star,
  Crown,
  Award,
  ArrowRight,
  Wallet
} from 'lucide-react';

export default function RewardsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const rewards = [
    {
      id: 1,
      title: "Daily Login Streak",
      description: "Login daily to maintain your streak",
      reward: "0.1 FIN/day",
      icon: Calendar,
      color: "bg-blue-500",
      progress: 85,
      maxProgress: 100,
      category: "daily"
    },
    {
      id: 2,
      title: "Complete Study Session",
      description: "Finish a 30-minute focused study session",
      reward: "0.5 FIN",
      icon: BookOpen,
      color: "bg-green-500",
      progress: 60,
      maxProgress: 100,
      category: "study"
    },
    {
      id: 3,
      title: "Help Community Member",
      description: "Answer questions in community discussions",
      reward: "1.0 FIN",
      icon: MessageSquare,
      color: "bg-purple-500",
      progress: 40,
      maxProgress: 100,
      category: "community"
    },
    {
      id: 4,
      title: "Complete Assignment",
      description: "Submit and complete course assignments",
      reward: "2.0 FIN",
      icon: CheckSquare,
      color: "bg-orange-500",
      progress: 90,
      maxProgress: 100,
      category: "achievements"
    },
    {
      id: 5,
      title: "AI Tool Usage",
      description: "Use AI writing or code generation tools",
      reward: "0.2 FIN",
      icon: Zap,
      color: "bg-yellow-500",
      progress: 75,
      maxProgress: 100,
      category: "daily"
    },
    {
      id: 6,
      title: "Weekly Challenge",
      description: "Complete weekly learning challenges",
      reward: "5.0 FIN",
      icon: Target,
      color: "bg-red-500",
      progress: 25,
      maxProgress: 100,
      category: "achievements"
    }
  ];

  const milestones = [
    {
      id: 1,
      title: "First Steps",
      description: "Earn your first 10 FIN tokens",
      reward: "Bonus: 2 FIN + Bronze Badge",
      requirement: "10 FIN",
      completed: true,
      icon: Star,
      color: "text-yellow-500"
    },
    {
      id: 2,
      title: "Learning Enthusiast",
      description: "Maintain a 7-day study streak",
      reward: "Bonus: 5 FIN + Silver Badge",
      requirement: "7-day streak",
      completed: true,
      icon: Flame,
      color: "text-orange-500"
    },
    {
      id: 3,
      title: "Community Helper",
      description: "Help 50 community members",
      reward: "Bonus: 10 FIN + Helper Badge",
      requirement: "50 helps",
      completed: false,
      progress: 32,
      icon: Award,
      color: "text-blue-500"
    },
    {
      id: 4,
      title: "Scholar",
      description: "Accumulate 100 FIN tokens",
      reward: "Bonus: 20 FIN + Gold Badge",
      requirement: "100 FIN",
      completed: false,
      progress: 67,
      icon: Trophy,
      color: "text-purple-500"
    },
    {
      id: 5,
      title: "Master Learner",
      description: "Complete 30-day streak and earn 500 FIN",
      reward: "Bonus: 50 FIN + Platinum Badge",
      requirement: "500 FIN + 30-day streak",
      completed: false,
      progress: 15,
      icon: Crown,
      color: "text-indigo-500"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Rewards', count: rewards.length },
    { id: 'daily', label: 'Daily', count: rewards.filter(r => r.category === 'daily').length },
    { id: 'study', label: 'Study', count: rewards.filter(r => r.category === 'study').length },
    { id: 'community', label: 'Community', count: rewards.filter(r => r.category === 'community').length },
    { id: 'achievements', label: 'Achievements', count: rewards.filter(r => r.category === 'achievements').length }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleConnectWallet = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎁 Rewards Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn FIN tokens for your learning activities and unlock exclusive rewards
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Balance</p>
                <p className="text-3xl font-bold">67.85</p>
                <p className="text-blue-100">FIN Tokens</p>
              </div>
              <Coins size={40} className="text-blue-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Today&apos;s Earnings</p>
                <p className="text-2xl font-bold text-gray-900">+2.3</p>
                <p className="text-green-600 text-sm">+15% from yesterday</p>
              </div>
              <TrendingUp size={32} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">12 days</p>
                <p className="text-orange-600 text-sm">Keep it up!</p>
              </div>
              <Flame size={32} className="text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-purple-600 text-sm">This month</p>
              </div>
              <CheckSquare size={32} className="text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rewards List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
                <div className="flex items-center space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category.label} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`${reward.color} p-2 rounded-lg text-white`}>
                          <reward.icon size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{reward.title}</h3>
                          <p className="text-sm text-gray-600">{reward.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{reward.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${reward.color}`}
                          style={{ width: `${reward.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-600">{reward.reward}</span>
                      <button 
                        onClick={handleConnectWallet}
                        className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-200 transition-colors text-sm"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Milestones */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
              <div className="space-y-4">
                {milestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${milestone.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <milestone.icon size={16} className={milestone.completed ? 'text-green-600' : milestone.color} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      {milestone.completed ? (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1">
                          Completed ✓
                        </span>
                      ) : (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full bg-indigo-500"
                              style={{ width: `${milestone.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{milestone.progress || 0}% complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors">
                View All Milestones →
              </button>
            </div>

            {/* Wallet Connection */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet size={24} />
                <h3 className="text-lg font-semibold">Connect Wallet</h3>
              </div>
              <p className="text-purple-100 text-sm mb-4">
                Connect your Solana wallet to receive FIN token rewards automatically.
              </p>
              <button 
                onClick={handleConnectWallet}
                className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                Connect Wallet
              </button>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Start Study Session</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Join Community</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-700">Complete Assignment</span>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Start Earning Today!</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Begin your learning journey and start earning FIN tokens for every milestone you achieve.
            </p>
            <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}