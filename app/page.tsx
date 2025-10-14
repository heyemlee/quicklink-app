"use client";
import React, { useState, useEffect, useRef } from "react";
import { contactInfo } from "./contactConfig";
import { reviewPlatforms, followPlatforms, PlatformConfig } from "./config/platformsConfig";
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

interface Profile {
  companyName: string;
  phone?: string | null;
  address?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const App = () => {
  // State management
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [wechatCopied, setWechatCopied] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const buttonClickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Custom hooks
  const { triggerHaptic } = useHapticFeedback();
  const { isOnline, showOfflineWarning } = useNetworkStatus();
  const { reviewText, isLoading, generateReview } = useReviewGenerator();
  const { openApp } = useAppOpener();

  // Fetch profile data from default user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile/default');
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('获取配置失败:', error);
      }
    };

    fetchProfile();
  }, []);

  // Page loaded effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle review platform click
  const handlePlatformClick = async (platform: PlatformConfig) => {
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
    if (isLoading || !selectedPlatform) return;
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
    if (isPublishing || !selectedPlatform) return;
    
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
  const handleFollowClick = async (platform: PlatformConfig) => {
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
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd < -100) {
      // Swiped down
      triggerHaptic('light');
      setIsModalOpen(false);
    }
  };

  // Apply custom colors from profile
  const customStyles = profile ? `
    :root {
      --primary-color: ${profile.primaryColor};
      --secondary-color: ${profile.secondaryColor};
      --accent-color: ${profile.accentColor};
    }
  ` : `
    :root {
      --primary-color: #7c3aed;
      --secondary-color: #ec4899;
      --accent-color: #3b82f6;
    }
  `;

  return (
    <>
      {/* Apply color scheme */}
      <style jsx global>{customStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Loading Progress Bar */}
        {pageLoading && (
          <div className="fixed top-0 left-0 right-0 z-[101]">
            <div 
              className="h-1 animate-pulse"
              style={{ 
                background: 'linear-gradient(to right, var(--accent-color), var(--primary-color), var(--secondary-color))' 
              }}
            ></div>
          </div>
        )}

      {/* Header */}
      <Header 
        companyName={profile?.companyName}
        phone={profile?.phone}
        address={profile?.address}
      />

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

        {/* Footer with Admin Link */}
        <footer className="py-8 text-center border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <a
              href="/login"
              className="inline-block text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;

