import apiClient from './api';

class EPlusService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Get EPlus balance and stats
  async getBalance() {
    try {
      const response = await apiClient.getEPlusBalance();
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to fetch balance');
    } catch (error) {
      console.error('EPlus balance error:', error);
      return {
        balance: 0,
        rewardHistory: [],
        dailyStreak: { current: 0, longest: 0 },
        stats: {}
      };
    }
  }

  // Get detailed reward stats
  async getStats() {
    try {
      const response = await apiClient.getRewardStats();
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to fetch stats');
    } catch (error) {
      console.error('EPlus stats error:', error);
      return null;
    }
  }

  // Process daily login and check for rewards
  async processDailyLogin() {
    try {
      const response = await apiClient.processDailyLogin();
      if (response.success && !response.data.alreadyProcessed) {
        // Show notification for new login reward
        this.showNotification({
          type: 'daily_login',
          amount: response.data.rewardAmount || 0.1,
          streak: response.data.streak,
          newBalance: response.data.newBalance,
          streakBroken: response.data.streakBroken
        });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Daily login error:', error);
      return null;
    }
  }

  // Show reward notification
  showNotification(notificationData) {
    const notification = {
      id: Date.now(),
      ...notificationData,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.notifyListeners(notification);

    // Auto-remove after delay
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 6000);

    return notification;
  }

  // Remove notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners(null, 'remove', id);
  }

  // Add notification listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(notification, action = 'add', id = null) {
    this.listeners.forEach(callback => {
      callback({ notification, action, id });
    });
  }

  // Simulate rewards for actions (this would normally be handled by backend)
  async simulateReward(type, metadata = {}) {
    const rewardAmounts = {
      chat_message: 0.01,
      task_completed: 0.1,
      task_created: 0.05,
      ai_usage: 0.02,
      streak_bonus: 0.05
    };

    const amount = rewardAmounts[type] || 0.01;
    
    // In a real app, this would be an API call
    setTimeout(() => {
      this.showNotification({
        type,
        amount,
        ...metadata
      });
    }, 500);
  }

  // Get current balance from local state (for immediate UI updates)
  getLocalBalance() {
    const balance = localStorage.getItem('ePlusBalance');
    return balance ? parseFloat(balance) : 0;
  }

  // Update local balance
  updateLocalBalance(newBalance) {
    localStorage.setItem('ePlusBalance', newBalance.toString());
  }
}

export const ePlusService = new EPlusService();
export default ePlusService;