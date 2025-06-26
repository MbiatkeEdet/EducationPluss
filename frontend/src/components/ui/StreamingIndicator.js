// components/ui/StreamingIndicator.js
"use client";

export default function StreamingIndicator({ isStreaming, message = 'AI is responding...' }) {
  if (!isStreaming) return null;
  
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <span>{message}</span>
    </div>
  );
}