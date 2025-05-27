'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Wallet, 
  Gift, 
  TrendingUp, 
  AlertCircle, 
  Copy, 
  CheckCircle,
  Flame,
  Trophy,
  Calendar,
  MessageSquare,
  CheckSquare,
  Zap,
  Star,
  Target
} from 'lucide-react';
import WalletModal from '@/components/ui/WalletModal';
import ePlusService from '@/lib/ePlusService';

const rewardIcons = {
  daily_login: Calendar,
  chat_message: MessageSquare,
  task_completed: CheckSquare,
  task_created: CheckSquare,
  ai_usage: Zap,
  streak_bonus: Flame
};

const rewardColors = {
  daily_login: 'bg-blue-500',
  chat_message: 'bg-green-500',
  task_completed: 'bg-purple-500',
  task_created: 'bg-indigo-500',
  ai_usage: 'bg-yellow-500',
  streak_bonus: 'bg-gradient-to-r from-orange-500 to-red-500'
};

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // New EPlus state
  const [ePlusData, setEPlusData] = useState({
    balance: 0,
    rewardHistory: [],
    dailyStreak: { current: 0, longest: 0 },
    stats: {}
  });
  const [rewardStats, setRewardStats] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchWalletInfo();
    loadEPlusData();
  }, []);

  const loadEPlusData = async () => {
    try {
      const [balanceData, statsData] = await Promise.all([
        ePlusService.getBalance(),
        ePlusService.getStats()
      ]);
      
      setEPlusData(balanceData);
      setRewardStats(statsData);
    } catch (error) {
      console.error('Failed to load EPlus data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get user data from localStorage or make API call
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchWalletInfo = async () => {
    try {
      const response = await fetch('/api/wallet/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWalletInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = (address) => {
    // Update user data with new wallet
    const updatedUser = { ...user, solanaWallet: address, walletVerified: true };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Refresh wallet info
    fetchWalletInfo();
  };

  const handleRemoveWallet = async () => {
    if (!confirm('Are you sure you want to remove your wallet address?')) return;

    try {
      const response = await fetch('/api/wallet/address', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedUser = { ...user, solanaWallet: null, walletVerified: false };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setWalletInfo(null);
      }
    } catch (error) {
      console.error('Error removing wallet:', error);
    }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStreakLevel = (streak) => {
    if (streak >= 30) return { level: 'Legendary', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (streak >= 14) return { level: 'Expert', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (streak >= 7) return { level: 'Committed', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (streak >= 3) return { level: 'Getting Started', color: 'text-green-600', bg: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const formatRewardType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const streakLevel = getStreakLevel(ePlusData.dailyStreak?.current || 0);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EPlus Token Rewards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Earn EPlus tokens for your learning activities and achievements
        </p>
      </motion.div>

      {/* Balance Overview */}
      <motion.div 
        className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your EPlus Balance</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{ePlusData.balance?.toFixed(2) || '0.00'}</span>
              <span className="text-lg opacity-90">EPlus</span>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
            <Coins size={40} className="text-yellow-300" />
          </div>
        </div>

        {rewardStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{rewardStats.totalEarned?.toFixed(2) || '0.00'}</div>
              <div className="text-sm opacity-80">Total Earned</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{ePlusData.rewardHistory?.length || 0}</div>
              <div className="text-sm opacity-80">Total Rewards</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{ePlusData.dailyStreak?.current || 0}</div>
              <div className="text-sm opacity-80">Current Streak</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{ePlusData.dailyStreak?.longest || 0}</div>
              <div className="text-sm opacity-80">Best Streak</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Streak Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-3 rounded-xl">
            <Flame size={24} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Streak</h2>
            <p className="text-gray-600 dark:text-gray-400">Keep learning every day to maintain your streak</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {ePlusData.dailyStreak?.current || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${streakLevel.bg} ${streakLevel.color}`}>
              {streakLevel.level}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {ePlusData.dailyStreak?.longest || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Trophy size={16} className="text-yellow-500" />
              <span className="text-sm text-yellow-600">Personal Record</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {Math.max(0, 7 - ((ePlusData.dailyStreak?.current || 0) % 7))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days to Next Milestone</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((ePlusData.dailyStreak?.current || 0) % 7) * (100/7)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reward Breakdown */}
      {rewardStats && (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Earning Breakdown</h2>
              <p className="text-gray-600 dark:text-gray-400">See how you've earned your EPlus tokens</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(rewardStats.rewardsByType || {}).map(([type, amount]) => {
              const Icon = rewardIcons[type] || Star;
              const colorClass = rewardColors[type] || 'bg-gray-500';
              
              return (
                <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${colorClass} p-2 rounded-lg text-white`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatRewardType(type)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {amount?.toFixed(2) || '0.00'} EPlus
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Rewards */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Gift size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Rewards</h2>
            <p className="text-gray-600 dark:text-gray-400">Your latest earning activities</p>
          </div>
        </div>

        <div className="space-y-3">
          {ePlusData.rewardHistory?.slice(0, 10).map((reward, index) => {
            const Icon = rewardIcons[reward.type] || Star;
            const colorClass = rewardColors[reward.type] || 'bg-gray-500';
            
            return (
              <motion.div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`${colorClass} p-2 rounded-lg text-white`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {reward.description || formatRewardType(reward.type)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(reward.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    +{reward.amount?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">EPlus</div>
                </div>
              </motion.div>
            );
          })}
          
          {(!ePlusData.rewardHistory || ePlusData.rewardHistory.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Gift size={32} className="mx-auto mb-2 opacity-50" />
              <p>No rewards yet. Start learning to earn EPlus tokens!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Wallet Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Solana Wallet
            </h2>
          </div>
          
          {user?.solanaWallet ? (
            <div className="flex items-center gap-2">
              {user.walletVerified && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              )}
              <button
                onClick={handleRemoveWallet}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {user?.solanaWallet ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <span className="font-mono text-sm text-gray-900 dark:text-white">
                {user.solanaWallet}
              </span>
              <button
                onClick={() => copyAddress(user.solanaWallet)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {copiedAddress ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            {walletInfo && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Balance: {walletInfo.balance || 0} SOL
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span>Connect your Solana wallet to receive EPlus tokens</span>
          </div>
        )}
      </motion.div>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}