"use client";
import React, { useState, useEffect, useRef } from "react";
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
  companySubtitle?: string | null;
  phone?: string | null;
  address?: string | null;
  email?: string | null;
  wechatId?: string | null;
  // Social media links
  websiteName?: string | null;
  websiteUrl?: string | null;
  tiktok?: string | null;
  instagram?: string | null;
  xiaohongshu?: string | null;
  facebook?: string | null;
  // Review platform links
  googleReviewUrl?: string | null;
  yelpReviewUrl?: string | null;
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  // Display settings
  showContact: boolean;
  showFollow: boolean;
  showReview: boolean;
  // Platform control
  followPlatforms: string[];
  reviewPlatforms: string[];
  // ContactInfo fields
  contactInfoName?: string | null;
  contactInfoPhone?: string | null;
  contactInfoEmail?: string | null;
  contactInfoAddress?: string | null;
  contactInfoWebsite?: string | null;
  contactInfoOrganization?: string | null;
}

const App = () => {
  // State management
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Page loaded effect
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

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
    if (platform.id === "wechat" && profile?.wechatId) {
      const success = await copyToClipboard(profile.wechatId);
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
    if (!profile) return;
    
    triggerHaptic('medium');
    
    // Build contact info from profile
    const contact = {
      name: profile.contactInfoName || profile.companyName || '',
      phone: profile.contactInfoPhone || profile.phone || '',
      email: profile.contactInfoEmail || profile.email || '',
      address: profile.contactInfoAddress || profile.address || '',
      website: profile.contactInfoWebsite || '',
      organization: profile.contactInfoOrganization || profile.companyName || '',
    };
    
    saveContact(contact);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // Build dynamic platform lists from profile
  const dynamicFollowPlatforms: PlatformConfig[] = profile && profile.followPlatforms ? 
    followPlatforms
      .filter(platform => profile.followPlatforms.includes(platform.id))
      .map(platform => {
        if (platform.id === 'wechat' && profile.wechatId) {
          return { ...platform, badge: profile.wechatId } as PlatformConfig & { badge: string }
        }
        if (platform.id === 'website') {
          const customPlatform = { ...platform }
          if (profile.websiteName) customPlatform.name = profile.websiteName
          if (profile.websiteUrl) {
            customPlatform.appScheme = profile.websiteUrl
            customPlatform.fallbackUrl = profile.websiteUrl
          }
          return customPlatform
        }
        if (platform.id === 'tiktok' && profile.tiktok) {
          return profile.tiktok.startsWith('http') 
            ? { ...platform, appScheme: profile.tiktok, fallbackUrl: profile.tiktok }
            : { ...platform, fallbackUrl: profile.tiktok }
        }
        if (platform.id === 'instagram' && profile.instagram) {
          return profile.instagram.startsWith('http')
            ? { ...platform, appScheme: profile.instagram, fallbackUrl: profile.instagram }
            : { ...platform, fallbackUrl: profile.instagram }
        }
        if (platform.id === 'xiaohongshu' && profile.xiaohongshu) {
          return profile.xiaohongshu.startsWith('http')
            ? { ...platform, appScheme: profile.xiaohongshu, fallbackUrl: profile.xiaohongshu }
            : { ...platform, fallbackUrl: profile.xiaohongshu }
        }
        if (platform.id === 'facebook' && profile.facebook) {
          return profile.facebook.startsWith('http')
            ? { ...platform, appScheme: profile.facebook, fallbackUrl: profile.facebook }
            : { ...platform, fallbackUrl: profile.facebook }
        }
        return platform
      })
    : [];

  const dynamicReviewPlatforms: PlatformConfig[] = profile && profile.reviewPlatforms ? 
    reviewPlatforms
      .filter(platform => profile.reviewPlatforms.includes(platform.id))
      .map(platform => {
        if (platform.id === 'googlemap' && profile.googleReviewUrl) {
          return profile.googleReviewUrl.startsWith('http')
            ? { ...platform, appScheme: profile.googleReviewUrl, fallbackUrl: profile.googleReviewUrl }
            : { ...platform, fallbackUrl: profile.googleReviewUrl }
        }
        if (platform.id === 'yelp' && profile.yelpReviewUrl) {
          return profile.yelpReviewUrl.startsWith('http')
            ? { ...platform, appScheme: profile.yelpReviewUrl, fallbackUrl: profile.yelpReviewUrl }
            : { ...platform, fallbackUrl: profile.yelpReviewUrl }
        }
        return platform
      })
    : [];

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
        companySubtitle={profile?.companySubtitle}
        phone={profile?.phone}
        address={profile?.address}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
        {/* Save Contact Section */}
        {profile?.showContact && (
          <SaveContactButton onClick={handleSaveContact} />
        )}

        {/* Follow Us Section */}
        {profile?.showFollow && dynamicFollowPlatforms.length > 0 && (
          <FollowSection 
            platforms={dynamicFollowPlatforms} 
            onPlatformClick={handleFollowClick} 
          />
        )}

        {/* Write Reviews Section */}
        {profile?.showReview && dynamicReviewPlatforms.length > 0 && (
          <ReviewSection 
            platforms={dynamicReviewPlatforms} 
            onPlatformClick={handlePlatformClick} 
          />
        )}
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

