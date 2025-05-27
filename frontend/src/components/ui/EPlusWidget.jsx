"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Gift, 
  Star,
  ChevronRight,
  Trophy,
  Target
} from 'lucide-react';

export default function EPlusWidget({ 
  balance = 0, 
  dailyStreak = { current: 0, longest: 0 }, 
  recentRewards = [],
  onClick,
  className = ""
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (balance > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [balance]);

  // Memoize expensive calculations
  const { streakLevel, todaysRewards, totalEarned } = useMemo(() => {
    const getStreakLevel = (streak) => {
      if (streak >= 30) return { level: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-500/20' };
      if (streak >= 14) return { level: 'Expert', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      if (streak >= 7) return { level: 'Committed', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      if (streak >= 3) return { level: 'Getting Started', color: 'text-green-400', bg: 'bg-green-500/20' };
      return { level: 'Beginner', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    };

    const today = new Date().toDateString();
    const todaysRewards = recentRewards.filter(reward => {
      const rewardDate = new Date(reward.createdAt).toDateString();
      return today === rewardDate;
    });

    const totalEarned = recentRewards.reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
      streakLevel: getStreakLevel(dailyStreak.current),
      todaysRewards,
      totalEarned
    };
  }, [dailyStreak.current, recentRewards]);

  return (
    <motion.div
      onClick={onClick}
      className={`bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg text-white cursor-pointer hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:block p-6">
        <div className="flex items-center justify-between">
          {/* Left section - Balance */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"
                animate={isAnimating ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Coins size={28} className="text-yellow-300" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-xl mb-1">EPlus Rewards</h3>
                <div className="flex items-baseline gap-2">
                  <motion.span 
                    className="text-3xl font-bold"
                    key={balance}
                    initial={{ scale: 1.1, color: '#fbbf24' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.5 }}
                  >
                    {balance.toFixed(2)}
                  </motion.span>
                  <span className="text-lg font-medium text-white/90">EPlus</span>
                </div>
                {todaysRewards.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-green-300 mt-1">
                    <TrendingUp size={14} />
                    <span>+{todaysRewards.reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2)} today</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center section - Streak */}
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm min-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-400" />
                <span className="font-medium">Daily Streak</span>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${streakLevel.bg} ${streakLevel.color}`}>
                {streakLevel.level}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold">{dailyStreak.current}</div>
                <div className="text-xs text-white/70">Current</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-xl font-bold">{dailyStreak.longest}</span>
                </div>
                <div className="text-xs text-white/70">Best</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Next milestone</span>
                <span>{Math.min(dailyStreak.current + (7 - (dailyStreak.current % 7)), dailyStreak.current + 7)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full"
                  style={{ width: `${(dailyStreak.current % 7) * (100/7)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(dailyStreak.current % 7) * (100/7)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Right section - Stats */}
          <div className="flex items-center gap-4">
            {recentRewards.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm min-w-[80px]">
                  <div className="text-lg font-bold">{recentRewards.length}</div>
                  <div className="text-xs text-white/70">Rewards</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm min-w-[80px]">
                  <div className="text-lg font-bold">{totalEarned.toFixed(2)}</div>
                  <div className="text-xs text-white/70">Total</div>
                </div>
              </div>
            )}
            
            <ChevronRight size={20} className="text-white/60" />
          </div>
        </div>
      </div>

      {/* Mobile Layout - Vertical (existing layout) */}
      <div className="md:hidden p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"
              animate={isAnimating ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              <Coins size={20} className="text-yellow-300" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-lg">EPlus</h3>
              <p className="text-xs text-white/80">Your rewards</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/60" />
        </div>

        {/* Balance Display */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <motion.span 
              className="text-2xl font-bold"
              key={balance}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
            >
              {balance.toFixed(2)}
            </motion.span>
            <span className="text-sm font-medium text-white/90">EPlus</span>
          </div>
          
          {todaysRewards.length > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs text-green-300">
              <TrendingUp size={12} />
              <span>+{todaysRewards.reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2)} today</span>
            </div>
          )}
        </div>

        {/* Streak Section */}
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-sm font-medium">Daily Streak</span>
            </div>
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${streakLevel.bg} ${streakLevel.color}`}>
              {streakLevel.level}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-xl font-bold">{dailyStreak.current}</div>
              <div className="text-xs text-white/70">Current streak</div>
            </div>
            
            <div className="text-center border-t border-white/10 pt-2">
              <div className="flex items-center justify-center gap-1 text-sm">
                <Trophy size={12} className="text-yellow-400" />
                <span className="font-semibold">{dailyStreak.longest}</span>
              </div>
              <div className="text-xs text-white/70">Best streak</div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Next milestone</span>
              <span>{Math.min(dailyStreak.current + (7 - (dailyStreak.current % 7)), dailyStreak.current + 7)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <motion.div 
                className="bg-gradient-to-r from-orange-400 to-red-400 h-1.5 rounded-full"
                style={{ width: `${(dailyStreak.current % 7) * (100/7)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${(dailyStreak.current % 7) * (100/7)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {recentRewards.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="text-sm font-bold">{recentRewards.length}</div>
              <div className="text-xs text-white/70">Rewards</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
              <div className="text-sm font-bold">{totalEarned.toFixed(2)}</div>
              <div className="text-xs text-white/70">Earned</div>
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="text-center">
          <div className="text-xs text-white/60">
            Tap to view details
          </div>
        </div>
      </div>
    </motion.div>
  );
}