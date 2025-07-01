"use client";

import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Clock, Filter, ChevronRight } from 'lucide-react';
import apiClient from '@/lib/api';
import { extractUserContent } from '@/lib/messageUtils';

export default function ChatHistoryManager({ 
  feature, 
  subFeature = null, 
  onChatSelect = null,
  selectedChatId = null 
}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSubFeature, setSelectedSubFeature] = useState(subFeature);
  const [deleteLoading, setDeleteLoading] = useState(null);

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
    },
    'general': {
      name: 'General Chat',
      subFeatures: []
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
        20
      );
      
      setChats(response.data || response.chats || []);
      setTotalPages(response.totalPages || Math.ceil((response.totalCount || response.total || 0) / 20));
    } catch (err) {
      setError(err.message);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(chatId);
      await apiClient.deleteChat(chatId);
      setChats(chats.filter(chat => chat._id !== chatId));
      
      // If this was the selected chat, clear selection
      if (selectedChatId === chatId && onChatSelect) {
        onChatSelect(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleChatClick = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getLastMessage = (messages) => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) return 'No messages';
    
    const lastMessage = userMessages[userMessages.length - 1];
    const cleanContent = extractUserContent(lastMessage.content);
    return cleanContent.length > 60 
      ? `${cleanContent.substring(0, 60)}...`
      : cleanContent;
  };

  const getChatTitle = (chat) => {
    if (chat.title && chat.title !== 'New Chat') {
      return chat.title;
    }
    return getLastMessage(chat.messages);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {featureConfig[feature]?.name || feature} History
          </h2>
          
          {featureConfig[feature]?.subFeatures?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedSubFeature || ''}
                onChange={(e) => setSelectedSubFeature(e.target.value || null)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
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
      </div>

      <div className="flex-1 overflow-y-auto p-4">
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
            <p>No chat history found.</p>
            <p className="text-sm mt-2">Start a conversation to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map(chat => (
              <div 
                key={chat._id} 
                className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md group ${
                  selectedChatId === chat._id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleChatClick(chat)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                        {chat.subFeature || 'General'}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={10} className="mr-1" />
                        {formatDate(chat.updatedAt)}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {getChatTitle(chat)}
                    </h3>
                    
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                      {getLastMessage(chat.messages)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {chat.messages.filter(msg => msg.role !== 'system').length} messages
                      </span>
                      <span className="text-xs text-gray-400">
                        {chat.aiProvider} • {chat.model}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 group-hover:text-indigo-500 transition-colors ${
                        selectedChatId === chat._id ? 'text-indigo-500' : ''
                      }`} 
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat._id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete chat"
                      disabled={deleteLoading === chat._id}
                    >
                      {deleteLoading === chat._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t p-4">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}