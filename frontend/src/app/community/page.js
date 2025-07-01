"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { 
  Trophy, 
  Star,
  Award,
  Crown,
  Flame
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/leaderboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const getUserLevel = (points) => {
    if (points >= 2500) return 'Expert';
    if (points >= 1500) return 'Advanced';
    if (points >= 500) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchLeaderboard}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🏆 Community Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how you rank among our top learners and get inspired by the community&apos;s achievements
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Performers This Month</h2>
            <p className="text-gray-600">Based on FIN tokens earned and learning activity</p>
          </div>

          <div className="space-y-4">
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              const level = getUserLevel(user.totalPoints);
              return (
                <div key={user._id} className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all ${
                  rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(rank)}
                      <span className="text-2xl font-bold text-gray-700">#{rank}</span>
                    </div>
                    <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg">
                      {user.username ? user.username.substring(0, 2).toUpperCase() : 'U?'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.username || 'Anonymous'}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
                          {level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.totalChats || 0} chats • {user.totalTasks || 0} tasks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{(user.totalPoints || 0).toFixed(2)}</div>
                    <div className="text-sm text-gray-500">FIN tokens</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Flame size={16} className="text-orange-500" />
                      <span className="text-sm font-medium">{user.currentStreak || 0} day streak</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No leaderboard data available yet.</p>
              <p className="text-sm text-gray-400 mt-2">Start learning to see rankings!</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Join the Competition!</h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Start learning, complete tasks, and climb the leaderboard. Every study session counts!
            </p>
            <Link href="/signup">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Learning
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}