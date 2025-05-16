// app/dashboard/task-manager/page.jsx
"use client";

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ui/ChatInterface';

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('eduTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  
  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('eduTasks', JSON.stringify(tasks));
    }
  }, [tasks]);
  
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      createdAt: new Date().toISOString(),
      status: 'pending',
      chatId: null
    };
    
    setTasks([...tasks, newTask]);
    setTaskTitle('');
  };
  
  const handleTaskSelect = (task) => {
    setActiveTask(task);
    setChatId(task.chatId);
    setTaskPrompt('');
  };
  
  const handleSendTaskPrompt = (e) => {
    e.preventDefault();
    if (!taskPrompt.trim() || !activeTask) return;
    
    // Set the message to be sent by the ChatInterface
    const fullPrompt = `Task: ${activeTask.title}\n\nDetails: ${taskPrompt}`;
    setTaskPrompt('');
    
    // The actual sending will be handled by ChatInterface
    // We just need to update our task
    const updatedTasks = tasks.map(task => 
      task.id === activeTask.id 
        ? { ...task, status: 'in-progress' } 
        : task
    );
    
    setTasks(updatedTasks);
  };
  
  const handleTaskStatusChange = (taskId, status) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    
    setTasks(updatedTasks);
  };
  
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
      setChatId(null);
    }
  };
  
  // Group tasks by status for display
  const groupedTasks = {
    pending: tasks.filter(task => task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  };
  
  const taskStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <p className="text-gray-600">Manage your tasks and get AI assistance with them</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Tasks sidebar */}
        <div className="w-72 bg-gray-50 border-r overflow-y-auto flex flex-col">
          <div className="p-4 border-b">
            <form onSubmit={handleAddTask} className="flex">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="New task title..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </form>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
              <div key={status} className="p-4 border-b">
                <h3 className="font-medium text-gray-700 mb-2 capitalize flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'in-progress' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></span>
                  {status} ({statusTasks.length})
                </h3>
                
                <div className="space-y-2">
                  {statusTasks.map(task => (
                    <div 
                      key={task.id}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        activeTask?.id === task.id 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'hover:bg-gray-100 border-gray-200'
                      }`}
                      onClick={() => handleTaskSelect(task)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex space-x-1">
                          <select
                            value={task.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleTaskStatusChange(task.id, e.target.value);
                            }}
                            className={`text-xs px-2 py-1 rounded ${taskStatusColors[task.status]}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  
                  {statusTasks.length === 0 && (
                    <div className="text-sm text-gray-500 italic p-2">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main task area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTask ? (
            <>
              <div className="bg-white p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">{activeTask.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded ${taskStatusColors[activeTask.status]}`}>
                    {activeTask.status}
                  </span>
                </div>
                
                {!activeTask.chatId && (
                  <form onSubmit={handleSendTaskPrompt} className="mt-4">
                    <div className="mb-2">
                      <label htmlFor="taskPrompt" className="block text-sm font-medium text-gray-700">
                        Provide details about this task for AI assistance
                      </label>
                      <textarea
                        id="taskPrompt"
                        value={taskPrompt}
                        onChange={(e) => setTaskPrompt(e.target.value)}
                        placeholder="Describe the task in detail. E.g., 'I need to write a research paper about renewable energy by next week...'"
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Get AI Assistance
                    </button>
                  </form>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  chatId={activeTask.chatId}
                  aiProvider="deepseek" 
                  model="" 
                  placeholder="Ask for help with your task..."
                  systemContext={`You are a helpful task assistant. The user has the following task: "${activeTask.title}". Help them break down, plan, and complete this task effectively. Provide actionable advice, resources, and step-by-step guidance.`}
                  showChat={true}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8 max-w-md">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Select or Create a Task</h3>
                <p className="text-gray-600">
                  Select an existing task from the sidebar or create a new one to get started.
                  You'll receive AI assistance to help you complete your tasks efficiently.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}