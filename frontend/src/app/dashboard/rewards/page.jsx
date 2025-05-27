'use client';

import { useState, useEffect } from 'react';
import { Coins, Wallet, Gift, TrendingUp, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import WalletModal from '@/components/ui/WalletModal';

export default function RewardsPage() {
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchWalletInfo();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EDU Token Rewards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Earn EDU tokens for your learning activities and achievements
        </p>
      </div>

      {/* Wallet Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
            <span>Connect your Solana wallet to receive EDU tokens</span>
          </div>
        )}
      </div>

      {/* EDU Claim Status */}
      {user?.eduClaim && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              EDU Token Claim
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.eduClaim.status)}`}>
                {user.eduClaim.status.charAt(0).toUpperCase() + user.eduClaim.status.slice(1)}
              </span>
            </div>

            {user.eduClaim.hasApplied && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(user.eduClaim.appliedAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {user.eduClaim.claimedAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Claimed Amount:</span>
                <span className="text-green-600 font-semibold">
                  {user.eduClaim.claimedAmount} EDU
                </span>
              </div>
            )}

            {user.eduClaim.rejectionReason && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Rejection Reason:</strong> {user.eduClaim.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Metrics */}
      {user?.activityMetrics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Activity
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.activityMetrics.totalChats}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.activityMetrics.totalTasks}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user.activityMetrics.daysActive}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{user.apiUsage?.count || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">API Calls</div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletConnected={handleWalletConnected}
      />
    </div>
  );
}