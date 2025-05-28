"use client";

import { useState } from 'react';
import ChatHistoryManager from '@/components/ui/ChatHistoryManager';

export default function ChatHistoryPage() {
  const [selectedFeature, setSelectedFeature] = useState('study-tools');

  const features = [
    { id: 'study-tools', name: 'Study Tools' },
    { id: 'writing-help', name: 'Writing Help' },
    { id: 'exam-prep', name: 'Exam Prep' },
    { id: 'task-manager', name: 'Task Manager' },
    { id: 'code-generator', name: 'Code Generator' }
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chat History</h1>
          <p className="text-gray-600">View and manage your AI conversation history by feature</p>
        </div>

        {/* Feature Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex overflow-x-auto">
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  selectedFeature === feature.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {feature.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Manager */}
        <ChatHistoryManager feature={selectedFeature} />
      </div>
    </div>
  );
}