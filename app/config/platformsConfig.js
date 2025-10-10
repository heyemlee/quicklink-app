// Platform configurations for reviews
export const reviewPlatforms = [
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
export const followPlatforms = [
  {
    id: "website",
    name: "KABI",
    icon: "/icons/kabi.png",
    isImage: true,
    color: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
    appScheme: "https://www.la-kabi.com/",
    fallbackUrl: "https://www.la-kabi.com/",
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
    id: "xiaohongshu",
    name: "小红书",
    icon: "/icons/xiaohongshu.png",
    isImage: true,
    color: "bg-red-500",
    appScheme: "xhsdiscover://user/64b8123700000000140399ef",
    fallbackUrl: "https://xhslink.com/m/22MB8xOCPQb",
  },
];

