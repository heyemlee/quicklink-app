"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useHapticFeedback } from "@/app/hooks/useHapticFeedback";
import { useNetworkStatus } from "@/app/hooks/useNetworkStatus";
import { useReviewGenerator } from "@/app/hooks/useReviewGenerator";
import { useAppOpener } from "@/app/hooks/useAppOpener";
import { copyToClipboard } from "@/app/utils/clipboard";
import Header from "@/app/components/Header";
import SaveContactButton from "@/app/components/SaveContactButton";
import FollowSection from "@/app/components/FollowSection";
import ReviewSection from "@/app/components/ReviewSection";
import ReviewModal from "@/app/components/ReviewModal";
import { WeChatToast, OfflineToast, OfflineIndicator } from "@/app/components/Toast";
import { followPlatforms as allFollowPlatforms, reviewPlatforms as allReviewPlatforms } from "@/app/config/platformsConfig";

export default function CardPage() {
  const params = useParams();
  const slug = params.slug;
  
  // State management
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const { reviewText, isLoading: reviewLoading, generateReview } = useReviewGenerator();
  const { openApp } = useAppOpener();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '加载失败');
        }

        setProfile(data.profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  // Page loaded effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Build contact info from profile
  const contactInfo = profile ? {
    name: profile.companyName,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  } : null;

  // Build follow platforms based on profile settings
  const followPlatforms = profile && profile.followPlatforms ? 
    allFollowPlatforms
      .filter(platform => profile.followPlatforms.includes(platform.id))
      .map(platform => {
        // 如果是微信，添加badge
        if (platform.id === 'wechat' && profile.wechatId) {
          return { ...platform, badge: profile.wechatId }
        }
        // 如果是website，使用用户自定义的名称和链接
        if (platform.id === 'website') {
          const customPlatform = { ...platform }
          if (profile.websiteName) {
            customPlatform.name = profile.websiteName
          }
          if (profile.websiteUrl) {
            customPlatform.appScheme = profile.websiteUrl
            customPlatform.fallbackUrl = profile.websiteUrl
          }
          return customPlatform
        }
        return platform
      })
    : [];

  // Build review platforms based on profile settings
  const reviewPlatforms = profile && profile.reviewPlatforms ? 
    allReviewPlatforms.filter(platform => profile.reviewPlatforms.includes(platform.id))
    : [];

  // Handle review platform click
  const handlePlatformClick = async (platform) => {
    if (buttonClickTimeout.current) return;
    
    triggerHaptic('medium');
    setSelectedPlatform(platform);
    setIsModalOpen(true);
    setCopySuccess(false);
    
    buttonClickTimeout.current = setTimeout(() => {
      buttonClickTimeout.current = null;
    }, 500);
    
    await generateReview(platform.id);
  };

  // Handle refresh review
  const handleRefresh = () => {
    if (reviewLoading) return;
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

  // Handle publish
  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    triggerHaptic('heavy');
    
    await handleCopy();
    await new Promise(resolve => setTimeout(resolve, 300));
    await openApp(selectedPlatform.appScheme, selectedPlatform.fallbackUrl);
    
    setIsPublishing(false);
  };

  // Handle follow platform click
  const handleFollowClick = async (platform) => {
    triggerHaptic('medium');
    
    if (platform.id === "wechat" && profile.wechatId) {
      const success = await copyToClipboard(profile.wechatId);
      if (success) {
        setWechatCopied(true);
        triggerHaptic('success');
        setTimeout(() => setWechatCopied(false), 3000);
      } else {
        triggerHaptic('error');
      }
    }

    await openApp(platform.appScheme, platform.fallbackUrl);
  };

  // Handle save contact
  const handleSaveContact = () => {
    if (!contactInfo) return;
    triggerHaptic('medium');
    
    // Generate vCard
    const saveContact = (contact) => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name || ''}
TEL:${contact.phone || ''}
EMAIL:${contact.email || ''}
ADR:;;${contact.address || ''};;;;
END:VCARD`;

      const blob = new Blob([vcard], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${contact.name || 'contact'}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };
    
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">找不到页面</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  // Apply custom colors
  const customStyles = profile ? `
    :root {
      --primary-color: ${profile.primaryColor};
      --secondary-color: ${profile.secondaryColor};
      --accent-color: ${profile.accentColor};
    }
  ` : '';

  return (
    <>
      <style jsx global>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Loading Progress Bar */}
        {pageLoading && (
          <div className="fixed top-0 left-0 right-0 z-[101]">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse"></div>
          </div>
        )}

        {/* Header */}
        <Header companyName={profile?.companyName} />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20">
          {/* Save Contact Section */}
          {profile?.showContact && contactInfo && (
            <SaveContactButton onClick={handleSaveContact} />
          )}

          {/* Follow Us Section */}
          {profile?.showFollow && followPlatforms.length > 0 && (
            <FollowSection 
              platforms={followPlatforms} 
              onPlatformClick={handleFollowClick} 
            />
          )}

          {/* Write Reviews Section */}
          {profile?.showReview && reviewPlatforms.length > 0 && (
            <ReviewSection 
              platforms={reviewPlatforms} 
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
          isLoading={reviewLoading}
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
    </>
  );
}

