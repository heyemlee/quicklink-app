"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useHapticFeedback } from "@/app/hooks/useHapticFeedback";
import { useNetworkStatus } from "@/app/hooks/useNetworkStatus";
import { useReviewGenerator } from "@/app/hooks/useReviewGenerator";
import { useAppOpener } from "@/app/hooks/useAppOpener";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { copyToClipboard } from "@/app/utils/clipboard";
import Header from "@/app/components/Header";
import SaveContactButton from "@/app/components/SaveContactButton";
import FollowSection from "@/app/components/FollowSection";
import ReviewSection from "@/app/components/ReviewSection";
import ReviewModal from "@/app/components/ReviewModal";
import { WeChatToast, OfflineToast, OfflineIndicator } from "@/app/components/Toast";
import { followPlatforms as allFollowPlatforms, reviewPlatforms as allReviewPlatforms, PlatformConfig } from "@/app/config/platformsConfig";

interface Profile {
  companyName: string;
  companySubtitle?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  websiteName?: string | null;
  websiteUrl?: string | null;
  wechatId?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showContact: boolean;
  showFollow: boolean;
  showReview: boolean;
  followPlatforms: string[];
  reviewPlatforms: string[];
  contactInfoName?: string | null;
  contactInfoPhone?: string | null;
  contactInfoEmail?: string | null;
  contactInfoAddress?: string | null;
  contactInfoWebsite?: string | null;
  contactInfoOrganization?: string | null;
}

interface ContactInfo {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export default function CardPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // State management
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
  const { reviewText, isLoading: reviewLoading, generateReview } = useReviewGenerator();
  const { openApp } = useAppOpener();
  const { trackSaveContact, trackPlatformClick } = useAnalytics(slug);

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
        setError(err instanceof Error ? err.message : '加载失败');
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

  // Build contact info from profile - use contactInfo fields if available, fallback to basic profile fields
  const contactInfo: ContactInfo | null = profile ? {
    name: profile.contactInfoName || '',
    phone: profile.contactInfoPhone || profile.phone,
    email: profile.contactInfoEmail || profile.email,
    address: profile.contactInfoAddress || profile.address,
  } : null;

  // Build follow platforms based on profile settings
  const followPlatforms: PlatformConfig[] = profile && profile.followPlatforms ? 
    allFollowPlatforms
      .filter(platform => profile.followPlatforms.includes(platform.id))
      .map(platform => {
        // 如果是微信，添加badge
        if (platform.id === 'wechat' && profile.wechatId) {
          return { ...platform, badge: profile.wechatId } as PlatformConfig & { badge: string }
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
  const reviewPlatforms: PlatformConfig[] = profile && profile.reviewPlatforms ? 
    allReviewPlatforms.filter(platform => profile.reviewPlatforms.includes(platform.id))
    : [];

  // Handle review platform click
  const handlePlatformClick = async (platform: PlatformConfig) => {
    if (buttonClickTimeout.current) return;
    
    triggerHaptic('medium');
    setSelectedPlatform(platform);
    setIsModalOpen(true);
    setCopySuccess(false);
    
    // 追踪评价平台点击
    trackPlatformClick(platform.id, 'review');
    
    buttonClickTimeout.current = setTimeout(() => {
      buttonClickTimeout.current = null;
    }, 500);
    
    await generateReview(platform.id);
  };

  // Handle refresh review
  const handleRefresh = () => {
    if (reviewLoading || !selectedPlatform) return;
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
    if (isPublishing || !selectedPlatform) return;
    
    setIsPublishing(true);
    triggerHaptic('heavy');
    
    await handleCopy();
    await new Promise(resolve => setTimeout(resolve, 300));
    await openApp(selectedPlatform.appScheme, selectedPlatform.fallbackUrl);
    
    setIsPublishing(false);
  };

  // Handle follow platform click
  const handleFollowClick = async (platform: PlatformConfig) => {
    triggerHaptic('medium');
    
    // 追踪关注平台点击
    trackPlatformClick(platform.id, 'follow');
    
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

    await openApp(platform.appScheme, platform.fallbackUrl);
  };

  // Handle save contact
  const handleSaveContact = () => {
    if (!contactInfo || !profile) return;
    triggerHaptic('medium');
    
    // 追踪保存联系人
    trackSaveContact();
    
    // Generate vCard
    const saveContact = (contact: ContactInfo) => {
      // Parse name into first and last name
      const fullName = contact.name || '';
      let lastName = '';
      let firstName = '';
      
      if (fullName.trim()) {
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length === 1) {
          // Single name, treat as last name
          lastName = nameParts[0];
        } else {
          // Multiple parts: last part is last name, rest is first name
          lastName = nameParts[nameParts.length - 1];
          firstName = nameParts.slice(0, -1).join(' ');
        }
      }
      
      const vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fullName}
${profile.contactInfoOrganization ? `ORG:${profile.contactInfoOrganization}` : ''}
TEL:${contact.phone || ''}
EMAIL:${contact.email || ''}
ADR:;;${contact.address || ''};;;;
${profile.contactInfoWebsite ? `URL:${profile.contactInfoWebsite}` : ''}
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
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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
            <div 
              className="h-1 animate-pulse" 
              style={{ 
                background: `linear-gradient(to right, var(--accent-color), var(--primary-color), var(--secondary-color))` 
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

