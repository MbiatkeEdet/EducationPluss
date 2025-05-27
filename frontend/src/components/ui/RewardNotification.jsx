"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Flame, Trophy, Star, Calendar, MessageSquare, CheckSquare, Zap } from 'lucide-react';

const rewardIcons = {
  daily_login: Calendar,
  chat_message: MessageSquare,
  task_completed: CheckSquare,
  task_created: CheckSquare,
  ai_usage: Zap,
  streak_bonus: Flame
};

const rewardColors = {
  daily_login: 'from-blue-500 to-blue-600',
  chat_message: 'from-green-500 to-green-600', 
  task_completed: 'from-purple-500 to-purple-600',
  task_created: 'from-indigo-500 to-indigo-600',
  ai_usage: 'from-yellow-500 to-yellow-600',
  streak_bonus: 'from-orange-500 to-red-500'
};

export default function RewardNotification({ 
  notification, 
  onClose, 
  autoClose = 5000 
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!notification) return null;

  const Icon = rewardIcons[notification.type] || Coins;
  const colorClass = rewardColors[notification.type] || 'from-blue-500 to-blue-600';

  const getRewardMessage = () => {
    switch (notification.type) {
      case 'daily_login':
        if (notification.streakBroken) {
          return `Daily login streak reset! Starting fresh with ${notification.streak} day${notification.streak > 1 ? 's' : ''}`;
        }
        return `${notification.streak} day login streak! Keep it going! 🔥`;
      case 'chat_message':
        return 'Great question! Keep the conversation going! 💬';
      case 'task_completed':
        return 'Task completed! Amazing progress! ✅';
      case 'task_created':
        return 'New task created! Stay organized! 📝';
      case 'ai_usage':
        return 'AI assistance used! Learning efficiently! ⚡';
      case 'streak_bonus':
        return `Streak bonus earned! ${notification.streak} days strong! 🔥`;
      default:
        return 'Reward earned! Keep up the great work! 🎉';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${colorClass} p-6 rounded-2xl shadow-2xl text-white border border-white/20`}>
            {/* Close button */}
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Reward icon and amount */}
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Icon size={24} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Coins size={20} className="text-yellow-300" />
                  <span className="text-2xl font-bold">+{notification.amount || 0.01}</span>
                  <span className="text-sm font-medium opacity-90">EPlus</span>
                </div>
                
                {notification.newBalance && (
                  <div className="text-sm opacity-90">
                    Balance: {notification.newBalance} EPlus
                  </div>
                )}
              </div>
            </div>

            {/* Reward message */}
            <p className="text-sm font-medium mb-4 leading-relaxed">
              {getRewardMessage()}
            </p>

            {/* Streak indicator */}
            {notification.streak && notification.type === 'daily_login' && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <Flame size={16} className="text-orange-300" />
                <span className="text-sm font-medium">
                  {notification.streak} day streak
                </span>
                {notification.streak >= 7 && (
                  <Trophy size={16} className="text-yellow-300 ml-auto" />
                )}
              </div>
            )}

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoClose / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}