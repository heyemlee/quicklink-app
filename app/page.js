"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Copy, RefreshCw, ExternalLink, X } from "lucide-react";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);

  // Platform configurations for reviews
  const reviewPlatforms = [
    {
      id: "xiaohongshu",
      name: "Xiaohongshu",
      icon: "/icons/xiaohongshu.png",
      isImage: true,
      color: "bg-red-500",
      appScheme: "xhsdiscover://item/new",
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
      name: "Google Maps",
      icon: "/icons/google.png",
      isImage: true,
      color: "bg-blue-500",
      appScheme: "comgooglemaps://?q=YourBusinessName&center=40.7484,-73.9857",
      fallbackUrl: "https://www.google.com/maps/search/?api=1&query=YourBusinessName",
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
      name: "Xiaohongshu",
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
      color: "bg-black",
      appScheme: "https://www.la-kabi.com/",
      fallbackUrl: "https://www.la-kabi.com/",
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
    // First copy the text
    handleCopy();

    // Create an invisible iframe to try opening the app
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = selectedPlatform.appScheme;
    document.body.appendChild(iframe);

    // Track if app opened
    let appOpened = false;
    const startTime = Date.now();

    // Listen for visibility change (app opening will hide the page)
    const visibilityHandler = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    // Fallback to web URL if app doesn't open
    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      document.body.removeChild(iframe);
      
      // If app didn't open and we're still here, open fallback
      if (!appOpened && Date.now() - startTime < 2500) {
        window.open(selectedPlatform.fallbackUrl, "_blank");
      }
    }, 2000);
  };

  const handleFollowClick = async (platform) => {
    // Special handling for WeChat - copy ID first
    if (platform.id === "wechat") {
      try {
        await navigator.clipboard.writeText("KABI-Design");
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy WeChat ID:", err);
      }
    }

    // If it's a direct web URL (like the website), open it directly
    if (platform.appScheme.startsWith("http://") || platform.appScheme.startsWith("https://")) {
      window.open(platform.appScheme, "_blank");
      return;
    }

    // Create an invisible iframe to try opening the app
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = platform.appScheme;
    document.body.appendChild(iframe);

    // Track if app opened
    let appOpened = false;

    // Listen for visibility change
    const visibilityHandler = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    // Fallback to web URL if app doesn't open
    setTimeout(() => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      document.body.removeChild(iframe);
      
      if (!appOpened) {
        window.open(platform.fallbackUrl, "_blank");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Fixed for mobile */}
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Share Your Experience
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-700">
              <a href="tel:6692256456" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <span className="text-lg">📞</span>
                <span className="text-sm sm:text-base font-medium">(669) 225-6456</span>
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

        {/* Section 2: Follow Us */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Follow us
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
            {followPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleFollowClick(platform)}
                className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px]`}
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

      {/* WeChat ID Copied Toast */}
      {wechatCopied && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Copy size={20} />
            <div className="text-sm font-medium">
              <div>WeChat ID Copied!</div>
              <div className="text-xs opacity-90">KABI-Design</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
