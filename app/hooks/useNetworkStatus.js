import { useState, useEffect } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

// Hook for monitoring network status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineWarning(true);
      triggerHaptic('error');
      setTimeout(() => setShowOfflineWarning(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerHaptic]);

  return { isOnline, showOfflineWarning };
};

