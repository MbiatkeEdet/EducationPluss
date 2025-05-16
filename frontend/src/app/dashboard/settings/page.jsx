// app/dashboard/settings/page.jsx
"use client";

import { useState, useEffect } from 'react';

export default function SettingsPage() {
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
  
  const aiProviders = [
    { id: 'anthropic', name: 'Anthropic Claude', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
    { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'] },
    { id: 'deepseek', name: 'deepseek', models: ''}
  ];
  
  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('eduSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('eduSettings', JSON.stringify(settings));
  }, [settings]);
  
  const handleSettingChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
    setHasChanges(true);
  };
  
  const saveSettings = () => {
    // Simulate API call
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('eduSettings', JSON.stringify(settings));
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }, 800);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Customize your dashboard experience</p>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Appearance */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Appearance</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleSettingChange('theme', theme)}
                    className={`px-4 py-2 border rounded-lg capitalize ${
                      settings.theme === theme 
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <div className="flex space-x-4">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSettingChange('fontSize', size)}
                    className={`px-4 py-2 border rounded-lg capitalize ${
                      settings.fontSize === size 
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs"
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
          
          {/* AI Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">AI Assistant</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default AI Provider
              </label>
              <select
                value={settings.aiProvider}
                onChange={(e) => {
                  const provider = e.target.value;
                  const defaultModel = aiProviders.find(p => p.id === provider)?.models[0] || '';
                  handleSettingChange('aiProvider', provider);
                  handleSettingChange('defaultModel', defaultModel);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs"
              >
                {aiProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select your preferred AI provider for all tools
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Model
              </label>
              <select
                value={settings.defaultModel}
                onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs"
              >
                {aiProviders
                  .find(p => p.id === settings.aiProvider)
                  ?.models.map(model => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select the default AI model to use
              </p>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Notifications</h2>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                  Enable notifications
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-6">
                Master control for all notification types
              </p>
            </div>
            
            <div className="pl-6 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications && settings.notifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  disabled={!settings.notifications}
                  className={`h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded ${
                    !settings.notifications ? 'opacity-50 cursor-not-allowed' : 'text-indigo-600'
                  }`}
                />
                <label 
                  htmlFor="emailNotifications" 
                  className={`ml-2 block text-sm ${
                    !settings.notifications ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Email notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  checked={settings.pushNotifications && settings.notifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  disabled={!settings.notifications}
                  className={`h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded ${
                    !settings.notifications ? 'opacity-50 cursor-not-allowed' : 'text-indigo-600'
                  }`}
                />
                <label 
                  htmlFor="pushNotifications" 
                  className={`ml-2 block text-sm ${
                    !settings.notifications ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Push notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="weeklyDigest"
                  checked={settings.weeklyDigest && settings.notifications}
                  onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                  disabled={!settings.notifications}
                  className={`h-4 w-4 focus:ring-indigo-500 border-gray-300 rounded ${
                    !settings.notifications ? 'opacity-50 cursor-not-allowed' : 'text-indigo-600'
                  }`}
                />
                <label 
                  htmlFor="weeklyDigest" 
                  className={`ml-2 block text-sm ${
                    !settings.notifications ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Weekly digest emails
                </label>
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
              className="text-red-600 hover:text-red-800 text-sm font-medium inline-flex items-center"
              onClick={() => {
                if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                className={`px-4 py-2 rounded-lg font-medium ${
                  !hasChanges || saveStatus === 'saving'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}