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
    appScheme: "https://www.yelp.com/writeareview/biz/-YfNM7V52zpRuA9_DqBeUA",
    fallbackUrl:"https://www.yelp.com/writeareview/biz/-YfNM7V52zpRuA9_DqBeUA",
  },
  {
    id: "googlemap",
    name: "Google",
    icon: "/icons/google.png",
    isImage: true,
    color: "bg-blue-500",
    appScheme: "https://g.page/r/CffWB10nyKpfEAE/review",
    fallbackUrl: "https://g.page/r/CffWB10nyKpfEAE/review",
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
    appScheme: "https://la-kabi.com/",
    fallbackUrl: "https://la-kabi.com/",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/icons/tiktok.png",
    isImage: true,
    color: "bg-black",
    appScheme: "https://www.tiktok.com/@kabi.cabinet?_t=ZP-90ibyFgb1fK&_r=1",
    fallbackUrl: "https://www.tiktok.com/@kabi.cabinet?_t=ZP-90ibyFgb1fK&_r=1",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/icons/instagram.png",
    isImage: true,
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    appScheme: "https://www.instagram.com/kabidesign?igsh=NTc4MTIwNjQ2YQ==",
    fallbackUrl: "https://www.instagram.com/kabidesign?igsh=NTc4MTIwNjQ2YQ==",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "/icons/facebook.png",
    isImage: true,
    color: "bg-blue-600",
    appScheme: "https://www.facebook.com/profile.php?id=61576815081257",
    fallbackUrl: "https://www.facebook.com/profile.php?id=61576815081257",
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
    appScheme: "https://xhslink.com/m/6br4JuyIvNP",
    fallbackUrl: "https://xhslink.com/m/6br4JuyIvNP",
  },
];

