"use client";

import React, { useState } from "react";
import { Copy, RefreshCw, ExternalLink, X } from "lucide-react";

export default function Home() {
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

      if (!response.ok) throw new Error("API call failed");

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
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Share Your Experience
          </h1>
          <p className="text-gray-600 mt-1">
            Help us grow by sharing your thoughts
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Write a Good Review
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reviewPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                className={`${platform.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-3`}
              >
                <span className="text-4xl">{platform.icon}</span>
                <span className="font-medium text-sm">{platform.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Follow Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {followPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleFollowClick(platform)}
                className={`${platform.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-3`}
              >
                <span className="text-4xl">{platform.icon}</span>
                <span className="font-medium text-sm">{platform.name}</span>
                <span className="text-xs opacity-80">Tap to Follow</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-content bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${selectedPlatform?.color} text-white p-6 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPlatform?.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">Write a Review</h3>
                  <p className="text-sm opacity-90">{selectedPlatform?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Generated Review
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 min-h-[120px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-24">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <p className="text-gray-800 leading-relaxed">
                      {reviewText}
                    </p>
                  )}
                </div>
                {copySuccess && (
                  <div className="absolute -top-2 right-0 bg-green-500 text-white text-xs py-1 px-3 rounded-full">
                    Copied!
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RefreshCw
                    size={18}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  Regenerate
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isLoading}
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy Text
                </button>
              </div>

              <button
                onClick={handlePublish}
                disabled={isLoading}
                className={`w-full ${selectedPlatform?.color} text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
              >
                <ExternalLink size={20} />
                Go to Publish
              </button>

              <p className="text-xs text-gray-500 text-center">
                Text will be copied automatically. Paste it in the app to
                publish your review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
