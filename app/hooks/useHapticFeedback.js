// Hook for haptic feedback
export const useHapticFeedback = () => {
  const triggerHaptic = (type = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [50, 100, 50]
      };
      window.navigator.vibrate(patterns[type] || patterns.light);
    }
  };

  return { triggerHaptic };
};

