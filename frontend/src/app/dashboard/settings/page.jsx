// app/dashboard/settings/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    aiProvider: 'deepseek',
    defaultModel: '',
    language: 'en',
    fontSize: 'medium',
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const userData1 = await response.json();
          const userData = userData1.data
          setUser(userData);
          
          // Load user-specific settings
          const userSettings = localStorage.getItem(`eduSettings_${userData.id}`);
          if (userSettings) {
            setSettings(JSON.parse(userSettings));
          }
        } else {
          setError('Failed to load user data');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setSaveStatus('saving');
    
    try {
      // Save to localStorage with user-specific key
      localStorage.setItem(`eduSettings_${user.id}`, JSON.stringify(settings));
      
      // Simulate API call to save settings to backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaveStatus('saved');
      setHasChanges(false);
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Error saving settings:', err);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">
          Customize your dashboard experience, {user?.name || 'User'}
        </p>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Account Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Account Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-gray-900 capitalize">{user?.role || 'User'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Appearance</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex space-x-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleSettingChange('theme', theme)}
                      className={`px-4 py-2 border rounded-lg capitalize transition-colors ${
                        settings.theme === theme 
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <div className="flex space-x-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('fontSize', size)}
                      className={`px-4 py-2 border rounded-lg capitalize transition-colors ${
                        settings.fontSize === size 
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Notifications</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm font-medium text-gray-700">
                    Enable notifications
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-6">
                  Master control for all notification types
                </p>
              </div>
              
              <div className="pl-6 space-y-3">
                {[
                  { id: 'emailNotifications', label: 'Email notifications' },
                  { id: 'pushNotifications', label: 'Push notifications' },
                  { id: 'weeklyDigest', label: 'Weekly digest emails' }
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={id}
                      checked={settings[id] && settings.notifications}
                      onChange={(e) => handleSettingChange(id, e.target.checked)}
                      disabled={!settings.notifications}
                      className={`h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded ${
                        !settings.notifications ? 'opacity-50 cursor-not-allowed' : 'text-indigo-600'
                      }`}
                    />
                    <label 
                      htmlFor={id} 
                      className={`ml-2 block text-sm ${
                        !settings.notifications ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Data & Privacy */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Data & Privacy</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-yellow-800">Privacy Settings</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Your data privacy is important to us. We only collect data necessary to provide our services.
              </p>
            </div>
            
            <button
              className="text-red-600 hover:text-red-800 text-sm font-medium inline-flex items-center transition-colors"
              onClick={() => {
                if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Clear all local data
            </button>
          </div>
          
          {/* Save Button */}
          <div className="sticky bottom-6 bg-white py-4 border-t mt-8">
            <div className="flex justify-end">
              <button
                onClick={saveSettings}
                disabled={!hasChanges || saveStatus === 'saving'}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  !hasChanges || saveStatus === 'saving'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {saveStatus === 'saving' && '⏳ Saving...'}
                {saveStatus === 'saved' && '✓ Saved!'}
                {saveStatus === 'error' && '✗ Error'}
                {!saveStatus && 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}