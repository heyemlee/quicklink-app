// Hook for opening apps with Safari compatibility
export const useAppOpener = () => {
  const openApp = async (
    appScheme: string, 
    fallbackUrl: string, 
    beforeOpen: (() => Promise<void>) | null = null
  ): Promise<void> => {
    // Execute callback before opening (e.g., copy text)
    if (beforeOpen) {
      await beforeOpen();
    }

    // If it's a direct web URL, open it directly
    if (appScheme.startsWith("http://") || appScheme.startsWith("https://")) {
      window.open(appScheme, "_blank");
      return;
    }

    // Safari-compatible app opening method
    let hasBlurred = false;

    // Track if page loses focus (app opened)
    const blurHandler = () => {
      hasBlurred = true;
    };

    const visibilityHandler = () => {
      if (document.hidden) {
        hasBlurred = true;
      }
    };

    window.addEventListener('blur', blurHandler);
    document.addEventListener('visibilitychange', visibilityHandler);

    // Try to open the app using direct location change (better for Safari)
    try {
      window.location.href = appScheme;
    } catch (e) {
      console.log('Failed to open app scheme:', e);
    }

    // Fallback to web URL if app doesn't open within 2 seconds
    const timeoutId = setTimeout(() => {
      window.removeEventListener('blur', blurHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      
      // If app didn't open (page didn't blur), open fallback
      if (!hasBlurred) {
        window.open(fallbackUrl, '_blank');
      }
    }, 2000);

    // Clean up if user comes back quickly (app opened successfully)
    setTimeout(() => {
      if (hasBlurred) {
        clearTimeout(timeoutId);
        window.removeEventListener('blur', blurHandler);
        document.removeEventListener('visibilitychange', visibilityHandler);
      }
    }, 500);
  };

  return { openApp };
};

