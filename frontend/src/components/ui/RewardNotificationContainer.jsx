"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import RewardNotification from './RewardNotification';
import ePlusService from '@/lib/ePlusService';

export default function RewardNotificationContainer() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = ePlusService.addListener(({ notification, action, id }) => {
      if (action === 'add' && notification) {
        setNotifications(prev => [...prev, notification]);
      } else if (action === 'remove' && id) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    });

    return unsubscribe;
  }, []);

  const handleCloseNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <RewardNotification
            key={notification.id}
            notification={notification}
            onClose={() => handleCloseNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}