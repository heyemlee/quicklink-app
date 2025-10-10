"use client";
import React, { useState, useEffect, useRef } from "react";
import { contactInfo } from "./contactConfig";
import { reviewPlatforms, followPlatforms } from "./config/platformsConfig";
import { useHapticFeedback } from "./hooks/useHapticFeedback";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { useReviewGenerator } from "./hooks/useReviewGenerator";
import { useAppOpener } from "./hooks/useAppOpener";
import { saveContact } from "./utils/vcard";
import { copyToClipboard } from "./utils/clipboard";
import Header from "./components/Header";
import SaveContactButton from "./components/SaveContactButton";
import FollowSection from "./components/FollowSection";
import ReviewSection from "./components/ReviewSection";
import ReviewModal from "./components/ReviewModal";
import { WeChatToast, OfflineToast, OfflineIndicator } from "./components/Toast";

const App = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const buttonClickTimeout = useRef(null);

  // Custom hooks
  const { triggerHaptic } = useHapticFeedback();
  const { isOnline, showOfflineWarning } = useNetworkStatus();
  const { reviewText, isLoading, generateReview } = useReviewGenerator();
  const { openApp } = useAppOpener();

  // Page loaded effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle review platform click
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

  // Handle refresh review
  const handleRefresh = () => {
    if (isLoading) return;
    setCopySuccess(false);
    triggerHaptic('light');
    generateReview(selectedPlatform.id);
  };

  // Handle copy review text
  const handleCopy = async () => {
    const success = await copyToClipboard(reviewText);
    if (success) {
      setCopySuccess(true);
      triggerHaptic('success');
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      triggerHaptic('error');
    }
  };

  // Handle publish (copy and open app)
  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    triggerHaptic('heavy');
    
    // Copy text first
    await handleCopy();
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Open the app
    await openApp(selectedPlatform.appScheme, selectedPlatform.fallbackUrl);
    
    setIsPublishing(false);
  };

  // Handle follow platform click
  const handleFollowClick = async (platform) => {
    triggerHaptic('medium');
    
    // Special handling for WeChat - copy ID first
    if (platform.id === "wechat") {
      const success = await copyToClipboard("KABI-Design");
      if (success) {
        setWechatCopied(true);
        triggerHaptic('success');
        setTimeout(() => setWechatCopied(false), 3000);
      } else {
        triggerHaptic('error');
      }
    }

    // Open the app
    await openApp(platform.appScheme, platform.fallbackUrl);
  };

  // Handle save contact
  const handleSaveContact = () => {
    triggerHaptic('medium');
    saveContact(contactInfo);
    triggerHaptic('success');
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

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        {/* Save Contact Section */}
        <SaveContactButton onClick={handleSaveContact} />

        {/* Follow Us Section */}
        <FollowSection 
          platforms={followPlatforms} 
          onPlatformClick={handleFollowClick} 
        />

        {/* Write Reviews Section */}
        <ReviewSection 
          platforms={reviewPlatforms} 
          onPlatformClick={handlePlatformClick} 
        />
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => {
          triggerHaptic('light');
          setIsModalOpen(false);
        }}
        selectedPlatform={selectedPlatform}
        reviewText={reviewText}
        isLoading={isLoading}
        copySuccess={copySuccess}
        isPublishing={isPublishing}
        onRefresh={handleRefresh}
        onCopy={handleCopy}
        onPublish={handlePublish}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Toasts */}
      <WeChatToast show={wechatCopied} />
      <OfflineToast show={showOfflineWarning} />
      <OfflineIndicator show={!isOnline && !showOfflineWarning} />
    </div>
  );
};

export default App;
