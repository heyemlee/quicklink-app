// 全局类型定义

import { User, Profile } from "@prisma/client";

export type UserWithProfile = User & {
  profile: Profile | null;
};

export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  hasCustomUrl?: boolean;
  urlPrefix?: string;
  placeholder?: string;
}

export interface ReviewPlatform extends Platform {
  reviewUrl?: string;
}

export interface ProfileFormData {
  companyName: string;
  logoUrl?: string | null;
  websiteName?: string | null;
  websiteUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  email?: string | null;
  wechatId?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  xiaohongshu?: string | null;
  yelp?: string | null;
  google?: string | null;
  googleReviewUrl?: string | null;
  yelpReviewUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showContact: boolean;
  showFollow: boolean;
  showReview: boolean;
  followPlatforms: string[];
  reviewPlatforms: string[];
}

export interface ContactInfo {
  phone?: string | null;
  address?: string | null;
  email?: string | null;
}

export interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export interface GenerateReviewResponse {
  review: string;
}

