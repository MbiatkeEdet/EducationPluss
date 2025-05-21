// app/dashboard/layout.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white flex flex-col">
        <div className="p-5">
          <h1 className="text-2xl font-bold">Education +</h1>
        </div>
        
        {/* User info */}
        <div className="p-5 border-b border-indigo-700">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-lg font-bold">{user.name ? user.name[0] : 'U'}</span>
              </div>
              <div>
                <p className="font-medium">{user.name || 'User'}</p>
                <p className="text-sm text-indigo-300">{user.email || ''}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-5">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block p-3 rounded hover:bg-indigo-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard/writing-help" className="block p-3 rounded hover:bg-indigo-700">
                Writing Help
              </Link>
            </li>
            <li>
              <Link href="/dashboard/task-manager" className="block p-3 rounded hover:bg-indigo-700">
                Task Manager
              </Link>
            </li>
            <li>
              <Link href="/dashboard/study-tools" className="block p-3 rounded hover:bg-indigo-700">
                Study Tools
              </Link>
            </li>
            <li>
              <Link href="/dashboard/exam-prep" className="block p-3 rounded hover:bg-indigo-700">
                Exam Prep
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Bottom section */}
        <div className="p-5 border-t border-indigo-700 space-y-2">
          <Link href="/dashboard/settings" className="block p-3 rounded hover:bg-indigo-700">
            Settings
          </Link>
          <Link href="/dashboard/profile" className="block p-3 rounded hover:bg-indigo-700">
            Profile  
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 rounded hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}