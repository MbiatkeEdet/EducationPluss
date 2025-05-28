"use client";

import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Clock, Filter } from 'lucide-react';
import apiClient from '@/lib/api';

export default function ChatHistoryManager({ feature, subFeature = null }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubFeature, setSelectedSubFeature] = useState(subFeature);

  const featureConfig = {
    'study-tools': {
      name: 'Study Tools',
      subFeatures: ['flashcards', 'notes', 'summarizer', 'mindmap', 'explain']
    },
    'writing-help': {
      name: 'Writing Help',
      subFeatures: ['essay-help', 'grammar-check', 'paraphrasing', 'research-help']
    },
    'exam-prep': {
      name: 'Exam Prep',
      subFeatures: ['multiple-choice', 'short-answer', 'essay', 'problem-solving']
    },
    'task-manager': {
      name: 'Task Manager',
      subFeatures: ['help']
    },
    'code-generator': {
      name: 'Code Generator',
      subFeatures: ['generate', 'debug', 'explain']
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [feature, selectedSubFeature, page]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getChatsByFeature(
        feature, 
        selectedSubFeature, 
        page, 
        10
      );
      setChats(response.data.chats);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await apiClient.deleteChat(chatId);
      setChats(chats.filter(chat => chat._id !== chatId));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLastMessage = (messages) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) return 'No messages';
    
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage.content.length > 50 
      ? `${lastMessage.content.substring(0, 50)}...`
      : lastMessage.content;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {featureConfig[feature]?.name || feature} Chat History
        </h2>
        
        {featureConfig[feature]?.subFeatures && (
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedSubFeature || ''}
              onChange={(e) => setSelectedSubFeature(e.target.value || null)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">All Tools</option>
              {featureConfig[feature].subFeatures.map(sf => (
                <option key={sf} value={sf}>
                  {sf.charAt(0).toUpperCase() + sf.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No chat history found for this feature.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {chats.map(chat => (
              <div key={chat._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-indigo-600">
                        {chat.subFeature || 'General'}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatDate(chat.updatedAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {getLastMessage(chat.messages)}
                    </p>
                    <div className="text-xs text-gray-500">
                      {chat.messages.filter(msg => msg.role !== 'system').length} messages
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteChat(chat._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}