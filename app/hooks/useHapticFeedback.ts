// Hook for haptic feedback
type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error';

interface HapticPatterns {
  light: number[];
  medium: number[];
  heavy: number[];
  success: number[];
  error: number[];
}

export const useHapticFeedback = () => {
  const triggerHaptic = (type: HapticType = 'light'): void => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const patterns: HapticPatterns = {
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

