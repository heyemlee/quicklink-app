"use client";
import React, { useState } from "react";
import { Copy, RefreshCw, ExternalLink, X } from "lucide-react";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Platform configurations for reviews
  const reviewPlatforms = [
    {
      id: "xiaohongshu",
      name: "Xiaohongshu",
      icon: "📕",
      color: "bg-red-500",
      appScheme: "xhsdiscover://",
      fallbackUrl: "https://www.xiaohongshu.com",
    },
    {
      id: "yelp",
      name: "Yelp",
      icon: "🔴",
      color: "bg-red-600",
      appScheme: "yelp://",
      fallbackUrl: "https://www.yelp.com",
    },
    {
      id: "googlemap",
      name: "Google Maps",
      icon: "🗺️",
      color: "bg-blue-500",
      appScheme: "comgooglemaps://",
      fallbackUrl: "https://maps.google.com",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      appScheme: "instagram://",
      fallbackUrl: "https://www.instagram.com",
    },
  ];

  // Platform configurations for following
  const followPlatforms = [
    {
      id: "xiaohongshu",
      name: "Xiaohongshu",
      icon: "📕",
      color: "bg-red-500",
      appScheme: "xhsdiscover://user/YOUR_USER_ID",
      fallbackUrl: "https://www.xiaohongshu.com/user/profile/YOUR_USER_ID",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "bg-black",
      appScheme: "snssdk1233://user/profile/YOUR_USER_ID",
      fallbackUrl: "https://www.tiktok.com/@YOUR_HANDLE",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
      appScheme: "instagram://user?username=YOUR_HANDLE",
      fallbackUrl: "https://www.instagram.com/YOUR_HANDLE",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "bg-blue-600",
      appScheme: "fb://profile/YOUR_PAGE_ID",
      fallbackUrl: "https://www.facebook.com/YOUR_PAGE",
    },
    {
      id: "wechat",
      name: "WeChat",
      icon: "💬",
      color: "bg-green-500",
      appScheme: "weixin://dl/profile/YOUR_WECHAT_ID",
      fallbackUrl: "https://weixin.qq.com",
    },
  ];

  const generateReview = async (platformId) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformClick = async (platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
    setCopySuccess(false);
    await generateReview(platform.id);
  };

  const handleRefresh = () => {
    setCopySuccess(false);
    generateReview(selectedPlatform.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handlePublish = () => {
    const link = document.createElement("a");
    link.href = selectedPlatform.appScheme;
    link.click();

    handleCopy();

    setTimeout(() => {
      if (document.hidden) return;
      window.open(selectedPlatform.fallbackUrl, "_blank");
    }, 1500);
  };

  const handleFollowClick = (platform) => {
    const link = document.createElement("a");
    link.href = platform.appScheme;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      if (document.hidden) return;
      window.open(platform.fallbackUrl, "_blank");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Fixed for mobile */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Share Your Experience
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Help us grow by sharing your thoughts
          </p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        {/* Section 1: Write Reviews */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Write a Good Review
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {reviewPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px]`}
              >
                <span className="text-3xl sm:text-4xl">{platform.icon}</span>
                <span className="font-medium text-xs sm:text-sm text-center leading-tight">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Follow Us */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Follow Us
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {followPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleFollowClick(platform)}
                className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px]`}
              >
                <span className="text-3xl sm:text-4xl">{platform.icon}</span>
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
      </main>
      {/* Review Modal - Mobile Optimized */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-full sm:max-w-lg h-[75vh] sm:h-auto sm:max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`${selectedPlatform?.color} text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">
                  {selectedPlatform?.icon}
                </span>
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
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  AI Generated Review
                </label>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border-2 border-gray-200 min-h-[100px] sm:min-h-[120px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-20 sm:h-24">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                      {reviewText}
                    </p>
                  )}
                </div>
                {copySuccess && (
                  <div className="absolute -top-2 right-0 bg-green-500 text-white text-xs py-1 px-3 rounded-full animate-bounce">
                    Copied!
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-300 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="flex-1 bg-blue-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-blue-600 active:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Copy
                </button>
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className={`w-full ${selectedPlatform?.color} text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 active:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
              >
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                Go to Publish
              </button>

              <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed px-2">
                Text will be copied automatically. Paste it in the app to
                publish your review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
