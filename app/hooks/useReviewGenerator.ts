import { useState } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

// Hook for generating reviews
export const useReviewGenerator = () => {
  const [reviewText, setReviewText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { triggerHaptic } = useHapticFeedback();

  const generateReview = async (platformId: string): Promise<void> => {
    setIsLoading(true);
    triggerHaptic('light');
    
    try {
      const response = await fetch("/api/generate_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform: platformId }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      setReviewText(data.review);
      triggerHaptic('success');
    } catch {
      const mockReviews = [
        "Amazing experience! The service was outstanding and the atmosphere was perfect. Highly recommend to everyone! ⭐⭐⭐⭐⭐",
        "Absolutely loved it! Great quality, friendly staff, and excellent value. Will definitely come back again! 💯",
        "Fantastic! Everything exceeded my expectations. The attention to detail was impressive. A must-visit place! ✨",
        "Outstanding service and wonderful experience! The team went above and beyond. Couldn't be happier! 🌟",
      ];
      setReviewText(
        mockReviews[Math.floor(Math.random() * mockReviews.length)]
      );
      triggerHaptic('success');
    } finally {
      setIsLoading(false);
    }
  };

  return { reviewText, isLoading, generateReview, setReviewText };
};

