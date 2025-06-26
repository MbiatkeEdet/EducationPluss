// app/dashboard/layout.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { 
  Home, 
  PenTool, 
  CheckSquare, 
  Brain, 
  Code, 
  GraduationCap, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  Bookmark,
  FileSearch,
  Map,
  Lightbulb
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudyToolsOpen, setIsStudyToolsOpen] = useState(false);
  
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

  const studyToolsSubmenu = [
    { name: 'Flashcard Generator', href: '/dashboard/study-tools?tool=flashcards', icon: Bookmark },
    { name: 'Note Organizer', href: '/dashboard/study-tools?tool=notes', icon: FileText },
    { name: 'Content Summarizer', href: '/dashboard/study-tools?tool=summarizer', icon: FileSearch },
    { name: 'Mind Map Creator', href: '/dashboard/study-tools?tool=mindmap', icon: Map },
    { name: 'Concept Explainer', href: '/dashboard/study-tools?tool=explain', icon: Lightbulb },
  ];

  const navigationItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Writing Help', href: '/dashboard/writing-help', icon: PenTool },
    { name: 'Task Manager', href: '/dashboard/task-manager', icon: CheckSquare },
    { 
      name: 'Study Tools', 
      href: '/dashboard/study-tools', 
      icon: Brain,
      hasSubmenu: true,
      submenu: studyToolsSubmenu
    },
    { name: 'Code Generator', href: '/dashboard/code-generator', icon: Code },
    { name: 'Exam Prep', href: '/dashboard/exam-prep', icon: GraduationCap },
  ];

  const Sidebar = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'w-full' : 'w-64'} bg-gradient-to-b from-indigo-800 to-indigo-900 text-white flex flex-col shadow-xl h-screen`}>
      {/* Header */}
      <div className="p-5 border-b border-indigo-600/30">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            <Image
                              src="/logo-main.png"
                              alt="Finear"
                              width={100}
                              height={100}
                              className="object-contain"
                              priority
                            />
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* User info */}
      <div className="p-5 border-b border-indigo-600/30">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user.name || 'User'}</p>
              <p className="text-sm text-indigo-200 truncate">{user.email || ''}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-5 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item, index) => (
            <li key={index}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => setIsStudyToolsOpen(!isStudyToolsOpen)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon 
                        size={20} 
                        className="text-indigo-200 group-hover:text-white transition-colors" 
                      />
                      <span className="font-medium group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </div>
                    {isStudyToolsOpen ? (
                      <ChevronDown size={16} className="text-indigo-200 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronRight size={16} className="text-indigo-200 group-hover:text-white transition-colors" />
                    )}
                  </button>
                  
                  {/* Submenu */}
                  <div className={`mt-2 ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
                    isStudyToolsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-700/30 transition-all duration-200 group text-indigo-200 hover:text-white"
                      onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-white transition-colors"></div>
                      <span className="text-sm">All Tools</span>
                    </Link>
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-700/30 transition-all duration-200 group text-indigo-200 hover:text-white"
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}
                      >
                        <subItem.icon size={16} className="text-indigo-300 group-hover:text-white transition-colors" />
                        <span className="text-sm">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 group"
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <item.icon 
                    size={20} 
                    className="text-indigo-200 group-hover:text-white transition-colors" 
                  />
                  <span className="font-medium text-indigo-100 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom section */}
      <div className="p-5 border-t border-indigo-600/30 space-y-2">
        <Link 
          href="/dashboard/settings" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 group"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Settings 
            size={20} 
            className="text-indigo-200 group-hover:text-white transition-colors" 
          />
          <span className="font-medium text-indigo-100 group-hover:text-white transition-colors">
            Settings
          </span>
        </Link>
        <Link 
          href="/dashboard/profile" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-700/50 transition-all duration-200 group"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <User 
            size={20} 
            className="text-indigo-200 group-hover:text-white transition-colors" 
          />
          <span className="font-medium text-indigo-100 group-hover:text-white transition-colors">
            Profile
          </span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600/50 transition-all duration-200 group text-left"
        >
          <LogOut 
            size={20} 
            className="text-indigo-200 group-hover:text-red-200 transition-colors" 
          />
          <span className="font-medium text-indigo-100 group-hover:text-red-200 transition-colors">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-indigo-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            <Image
                              src="/logo-main.png"
                              alt="Finear"
                              width={100}
                              height={100}
                              className="object-contain"
                              priority
                            />
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
            <Sidebar isMobile={true} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-auto lg:ml-0">
        {/* Add top padding on mobile to account for fixed header */}
        <div className="lg:hidden h-16"></div>
        {children}
      </div>
    </div>
  );
}