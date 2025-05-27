"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Coins, Loader2 } from 'lucide-react';

// Lazy load the actual EPlusWidget
const EPlusWidget = lazy(() => import('./EPlusWidget'));

// Lightweight skeleton component
const EPlusWidgetSkeleton = () => (
  <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-6 rounded-2xl shadow-lg text-white animate-pulse">
    {/* Desktop Layout Skeleton */}
    <div className="hidden md:block">
      <div className="flex items-center justify-between">
        {/* Left section skeleton */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Coins size={28} className="text-yellow-300" />
            </div>
            <div>
              <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
              <div className="h-8 bg-white/20 rounded w-24 mb-1"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
          </div>
        </div>

        {/* Center section skeleton */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm min-w-[200px]">
          <div className="h-5 bg-white/20 rounded w-24 mb-3"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <div className="h-8 bg-white/20 rounded w-8 mx-auto mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-12 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-8 bg-white/20 rounded w-8 mx-auto mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded w-full"></div>
        </div>

        {/* Right section skeleton */}
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm min-w-[80px]">
              <div className="h-5 bg-white/20 rounded w-6 mx-auto mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-10 mx-auto"></div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm min-w-[80px]">
              <div className="h-5 bg-white/20 rounded w-8 mx-auto mb-1"></div>
              <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Layout Skeleton */}
    <div className="md:hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Coins size={20} className="text-yellow-300" />
          </div>
          <div>
            <div className="h-5 bg-white/20 rounded w-16 mb-1"></div>
            <div className="h-3 bg-white/10 rounded w-20"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <div className="h-8 bg-white/20 rounded w-24 mx-auto mb-1"></div>
        <div className="h-3 bg-white/10 rounded w-16 mx-auto"></div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm mb-3">
        <div className="h-4 bg-white/20 rounded w-20 mb-2"></div>
        <div className="space-y-2">
          <div className="h-6 bg-white/20 rounded w-8 mx-auto"></div>
          <div className="h-3 bg-white/10 rounded w-16 mx-auto"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
          <div className="h-4 bg-white/20 rounded w-6 mx-auto mb-1"></div>
          <div className="h-3 bg-white/10 rounded w-10 mx-auto"></div>
        </div>
        <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
          <div className="h-4 bg-white/20 rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
        </div>
      </div>
    </div>
  </div>
);

// Error fallback component
const EPlusWidgetError = ({ onRetry }) => (
  <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-4 md:p-6 rounded-2xl shadow-lg text-white">
    <div className="text-center">
      <Coins size={32} className="mx-auto mb-2 text-gray-200" />
      <h3 className="font-semibold mb-2">EPlus Widget</h3>
      <p className="text-sm text-gray-200 mb-3">Failed to load rewards data</p>
      <button 
        onClick={onRetry}
        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Error boundary hook
function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  const captureError = (error) => {
    console.error('EPlusWidget error:', error);
    setHasError(true);
    setError(error);
  };

  return { hasError, error, resetError, captureError };
}

export default function LazyEPlusWidget({ 
  balance = 0, 
  dailyStreak = { current: 0, longest: 0 }, 
  recentRewards = [],
  onClick,
  className = ""
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { hasError, resetError, captureError } = useErrorBoundary();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const element = document.getElementById('eplus-widget-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const handleRetry = () => {
    resetError();
    setRetryCount(prev => prev + 1);
    setIsVisible(false);
    // Trigger re-observation
    setTimeout(() => setIsVisible(true), 100);
  };

  const WidgetWithErrorHandling = () => {
    try {
      return (
        <EPlusWidget
          balance={balance}
          dailyStreak={dailyStreak}
          recentRewards={recentRewards}
          onClick={onClick}
        />
      );
    } catch (error) {
      captureError(error);
      return <EPlusWidgetSkeleton />;
    }
  };

  return (
    <div id="eplus-widget-container" className={className}>
      {hasError ? (
        <EPlusWidgetError onRetry={handleRetry} />
      ) : !isVisible ? (
        <EPlusWidgetSkeleton />
      ) : (
        <Suspense fallback={<EPlusWidgetSkeleton />}>
          <div key={retryCount}>
            <WidgetWithErrorHandling />
          </div>
        </Suspense>
      )}
    </div>
  );
}