"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Copy, RefreshCw, ExternalLink, X, Sparkles } from "lucide-react";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  // Initialize showWelcome based on whether user has visited before
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('hasVisited');
    }
    return false;
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const modalRef = useRef(null);
  const buttonClickTimeout = useRef(null);

  // Welcome animation on first load (NFC tap)
  useEffect(() => {
    if (showWelcome) {
      sessionStorage.setItem('hasVisited', 'true');
      setTimeout(() => setShowWelcome(false), 1000); // 1 second animation
    }
  }, [showWelcome]);

  // Page loaded effect
  useEffect(() => {
    // Simulate page load complete
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Network status monitoring
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
  }, []);

  // Haptic feedback helper
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

  // Platform configurations for reviews
  const reviewPlatforms = [
    {
      id: "xiaohongshu",
      name: "小红书",
      icon: "/icons/xiaohongshu.png",
      isImage: true,
      color: "bg-red-500",
      appScheme: "xhsdiscover://",
      fallbackUrl: "https://www.xiaohongshu.com/explore",
    },
    {
      id: "yelp",
      name: "Yelp",
      icon: "/yelp.png",
      isImage: true,
      color: "bg-red-600",
      appScheme: "yelp:///write_review",
      fallbackUrl:
        "https://www.yelp.com/writeareview/biz/-YfNM7V52zpRuA9_DqBeUA?return_url=%2Fbiz%2F-YfNM7V52zpRuA9_DqBeUA&review_origin=biz-details-war-button",
    },
    {
      id: "googlemap",
      name: "Google",
      icon: "/icons/google.png",
      isImage: true,
      color: "bg-blue-500",
      appScheme: "comgooglemaps://?q=YourBusinessName&center=40.7484,-73.9857",
      fallbackUrl: "https://g.page/r/CffWB10nyKpfEAE/review",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "/icons/instagram.png",
      isImage: true,
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      appScheme: "instagram://camera",
      fallbackUrl: "https://www.instagram.com/create/story",
    },
  ];

  // Platform configurations for following
  const followPlatforms = [
    {
      id: "xiaohongshu",
      name: "小红书",
      icon: "/icons/xiaohongshu.png",
      isImage: true,
      color: "bg-red-500",
      appScheme: "xhsdiscover://user/YOUR_USER_ID",
      fallbackUrl: "https://xhslink.com/m/22MB8xOCPQb",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "/icons/tiktok.png",
      isImage: true,
      color: "bg-black",
      appScheme: "snssdk1233://user/profile/YOUR_USER_ID",
      fallbackUrl: "https://www.tiktok.com/@kabi.cabinet?_t=ZT-90MOSFyVCrV&_r=1",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "/icons/instagram.png",
      isImage: true,
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      appScheme: "instagram://user?username=YOUR_HANDLE",
      fallbackUrl: "https://www.instagram.com/kabidesign?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "/icons/facebook.png",
      isImage: true,
      color: "bg-blue-600",
      appScheme: "fb://profile/YOUR_PAGE_ID",
      fallbackUrl: "https://www.facebook.com/profile.php?id=61576815081257&mibextid=wwXIfr",
    },
    {
      id: "wechat",
      name: "WeChat",
      icon: "/icons/wechat.png",
      isImage: true,
      color: "bg-green-500",
      appScheme: "weixin://",
      fallbackUrl: "https://weixin.qq.com",
    },
    {
      id: "website",
      name: "KABI",
      icon: "/icons/kabi.png",
      isImage: true,
      color: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
      appScheme: "https://www.la-kabi.com/",
      fallbackUrl: "https://www.la-kabi.com/",
    },
  ];

  const generateReview = async (platformId) => {
    setIsLoading(true);
    triggerHaptic('light');
    
    try {
      const response = await fetch("/api/generate-review", {
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
    } catch (error) {
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

  const handlePlatformClick = async (platform) => {
    // Prevent double-click
    if (buttonClickTimeout.current) return;
    
    triggerHaptic('medium');
    setSelectedPlatform(platform);
    setIsModalOpen(true);
    setCopySuccess(false);
    
    // Debounce button clicks
    buttonClickTimeout.current = setTimeout(() => {
      buttonClickTimeout.current = null;
    }, 500);
    
    await generateReview(platform.id);
  };

  const handleRefresh = () => {
    if (isLoading) return;
    setCopySuccess(false);
    triggerHaptic('light');
    generateReview(selectedPlatform.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopySuccess(true);
      triggerHaptic('success');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      triggerHaptic('error');
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    triggerHaptic('heavy');
    
    // First copy the text
    await handleCopy();

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Safari-compatible app opening method
    let hasBlurred = false;
    let timeoutId;

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
      window.location.href = selectedPlatform.appScheme;
    } catch (e) {
      console.log('Failed to open app scheme:', e);
    }

    // Fallback to web URL if app doesn't open within 2 seconds
    timeoutId = setTimeout(() => {
      window.removeEventListener('blur', blurHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      
      // If app didn't open (page didn't blur) and we're still here, open fallback
      if (!hasBlurred) {
        window.open(selectedPlatform.fallbackUrl, '_blank');
      }
      
      setIsPublishing(false);
    }, 2000);

    // Clean up if user comes back quickly (app opened successfully)
    setTimeout(() => {
      if (hasBlurred) {
        clearTimeout(timeoutId);
        window.removeEventListener('blur', blurHandler);
        document.removeEventListener('visibilitychange', visibilityHandler);
        setIsPublishing(false);
      }
    }, 500);
  };

  const handleFollowClick = async (platform) => {
    triggerHaptic('medium');
    
    // Special handling for WeChat - copy ID first
    if (platform.id === "wechat") {
      try {
        await navigator.clipboard.writeText("KABI-Design");
        setWechatCopied(true);
        triggerHaptic('success');
        setTimeout(() => setWechatCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy WeChat ID:", err);
        triggerHaptic('error');
      }
    }

    // If it's a direct web URL (like the website), open it directly
    if (platform.appScheme.startsWith("http://") || platform.appScheme.startsWith("https://")) {
      window.open(platform.appScheme, "_blank");
      return;
    }

    // Safari-compatible app opening method
    let hasBlurred = false;
    let timeoutId;

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
      window.location.href = platform.appScheme;
    } catch (e) {
      console.log('Failed to open app scheme:', e);
    }

    // Fallback to web URL if app doesn't open within 2 seconds
    timeoutId = setTimeout(() => {
      window.removeEventListener('blur', blurHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      
      // If app didn't open (page didn't blur), open fallback
      if (!hasBlurred) {
        window.open(platform.fallbackUrl, '_blank');
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

  // Handle swipe down to close modal
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd < -100) {
      // Swiped down
      triggerHaptic('light');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Loading Progress Bar */}
      {pageLoading && (
        <div className="fixed top-0 left-0 right-0 z-[101]">
          <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse"></div>
        </div>
      )}

      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center animate-fadeIn">
          <div className="text-center animate-bounceIn">
            <div className="bg-white rounded-full p-6 mb-4 inline-block shadow-2xl">
              <Sparkles size={48} className="text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-white text-lg opacity-90">Thank you for visiting KABI</p>
          </div>
        </div>
      )}

      {/* Header - Fixed for mobile */}
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            KABI - Kitchen and Bath Cabinet
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-700">
              <a href="tel:6692981888" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <span className="text-lg">📞</span>
                <span className="text-sm sm:text-base font-medium">(669) 298-1888</span>
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a 
                href="https://maps.google.com/?q=1754+Junction+Ave,+San+Jose" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <span className="text-lg">📍</span>
                <span className="text-sm sm:text-base font-medium">1754 Junction Ave, San Jose</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        {/* Section 1: Follow Us */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Follow us
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {followPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleFollowClick(platform)}
                className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] touch-manipulation`}
              >
                {platform.isImage ? (
                  <div className="bg-white rounded-full p-2 sm:p-3 flex items-center justify-center">
                    <Image 
                      src={platform.icon} 
                      alt={platform.name}
                      width={64}
                      height={64}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-3xl sm:text-4xl">{platform.icon}</span>
                )}
                <span className="font-medium text-xs sm:text-sm text-center leading-tight">
                  {platform.name}
                </span>
                <span className="text-[10px] sm:text-xs opacity-80">
                  Tap to Follow
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Write Reviews */}
        <section>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Write a Good Review
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {reviewPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] touch-manipulation`}
              >
                {platform.isImage ? (
                  <div className="bg-white rounded-full p-2 sm:p-3 flex items-center justify-center">
                    <Image 
                      src={platform.icon} 
                      alt={platform.name}
                      width={64}
                      height={64}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-3xl sm:text-4xl">{platform.icon}</span>
                )}
                <span className="font-medium text-xs sm:text-sm text-center leading-tight">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
      {/* Review Modal - Mobile Optimized */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn"
          onClick={() => {
            triggerHaptic('light');
            setIsModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-full sm:max-w-lg h-[75vh] sm:h-auto sm:max-h-[70vh] overflow-hidden flex flex-col animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Swipe indicator */}
            <div className="flex justify-center pt-2 pb-1 sm:hidden">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div
              className={`${selectedPlatform?.color} text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0`}
            >
              <div className="flex items-center gap-3">
                {selectedPlatform?.isImage ? (
                  <div className="bg-white rounded-full p-2 flex items-center justify-center">
                    <Image 
                      src={selectedPlatform?.icon} 
                      alt={selectedPlatform?.name}
                      width={48}
                      height={48}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl">
                    {selectedPlatform?.icon}
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Write a Review
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {selectedPlatform?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Generated Review Text */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  AI Generated Review
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 border-2 border-gray-200 min-h-[100px] sm:min-h-[120px] relative overflow-hidden">
                  {isLoading ? (
                    <div className="space-y-3">
                      {/* Skeleton loader */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                        <span className="text-sm text-gray-600 animate-pulse">Generating your review...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-11/12"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-4/5"></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                      {reviewText}
                    </p>
                  )}
                </div>
                {copySuccess && (
                  <div className="absolute -top-2 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-1.5 px-4 rounded-full animate-bounce shadow-lg flex items-center gap-1">
                    <Copy size={12} />
                    Copied!
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <RefreshCw
                    size={16}
                    className={`sm:w-[18px] sm:h-[18px] ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Regenerate</span>
                  <span className="sm:hidden">Refresh</span>
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublish}
                disabled={isLoading || isPublishing}
                className={`w-full ${selectedPlatform?.color} text-white py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Opening...
                  </>
                ) : (
                  <>
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                    Go to Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WeChat ID Copied Toast */}
      {wechatCopied && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
            <div className="bg-white rounded-full p-2">
              <Copy size={18} className="text-green-600" />
            </div>
            <div className="text-sm font-medium">
              <div className="font-bold">WeChat ID Copied!</div>
              <div className="text-xs opacity-90">KABI-Design</div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Warning Toast */}
      {showOfflineWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
            <div className="bg-white rounded-full p-2">
              <span className="text-lg">📡</span>
            </div>
            <div className="text-sm font-medium">
              <div className="font-bold">No Internet Connection</div>
              <div className="text-xs opacity-90">Some features may not work</div>
            </div>
          </div>
        </div>
      )}

      {/* Online Status Indicator - subtle */}
      {!isOnline && !showOfflineWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg opacity-75">
          Offline Mode
        </div>
      )}
    </div>
  );
};

export default App;
