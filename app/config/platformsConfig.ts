// Platform configurations for reviews
export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  isImage: boolean;
  color: string;
  appScheme: string;
  fallbackUrl: string;
}

export const reviewPlatforms: PlatformConfig[] = [
  {
    id: "yelp",
    name: "Yelp",
    icon: "/icons/yelp.png",
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
    id: "xiaohongshu",
    name: "小红书",
    icon: "/icons/xiaohongshu.png",
    isImage: true,
    color: "bg-red-500",
    appScheme: "xhsdiscover://",
    fallbackUrl: "https://www.xiaohongshu.com/explore",
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
export const followPlatforms: PlatformConfig[] = [
  {
    id: "website",
    name: "KABI",
    icon: "/icons/company-logo.png",
    isImage: true,
    color: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
    appScheme: "https://www.google.com/",
    fallbackUrl: "https://www.google.com/",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/icons/tiktok.png",
    isImage: true,
    color: "bg-black",
    appScheme: "snssdk1233://user/profile/YOUR_USER_ID",
    fallbackUrl: "https://www.tiktok.com/@YOUR_USERNAME",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/icons/instagram.png",
    isImage: true,
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    appScheme: "instagram://user?username=YOUR_HANDLE",
    fallbackUrl: "https://www.instagram.com/",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "/icons/facebook.png",
    isImage: true,
    color: "bg-blue-600",
    appScheme: "fb://profile/YOUR_PAGE_ID",
    fallbackUrl: "https://www.facebook.com/",
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
    id: "xiaohongshu",
    name: "小红书",
    icon: "/icons/xiaohongshu.png",
    isImage: true,
    color: "bg-red-500",
    appScheme: "xhsdiscover://user/YOUR_USER_ID",
    fallbackUrl: "https://www.xiaohongshu.com/user/profile/YOUR_USER_ID",
  },
];

