# Review & Follow Platform App

A modern, mobile-first web application built with React and Next.js for collecting user reviews and growing social media following across multiple platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation Steps

1. **Clone or create the project:**
```bash
npx create-next-app@latest review-follow-app
cd review-follow-app
```

2. **Install dependencies:**
```bash
npm install lucide-react
```

3. **Copy all project files** into your project directory following the structure below.

4. **Create environment file:**
```bash
cp .env.local.example .env.local
# Edit .env.local and add your API keys
```

5. **Run development server:**
```bash
npm run dev
```

6. **Open browser:**
Navigate to `http://localhost:3000`

## 📁 Complete File Structure

```
review-follow-app/
├── app/
│   ├── api/
│   │   └── generate-review/
│   │       └── route.js          # API endpoint for review generation
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.js                 # Root layout with metadata
│   └── page.js                   # Main application component
├── public/
│   └── favicon.ico               # App icon
├── .env.local.example            # Environment variables template
├── .gitignore                    # Git ignore file
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # This file
```

## 🎨 Features

### 1. Write Reviews Section
- ✅ Multi-platform support (Xiaohongshu, Yelp, Google Maps, Instagram)
- ✅ AI-powered review generation
- ✅ Modal occupies 2/3 of screen height
- ✅ "Regenerate" button for new suggestions
- ✅ One-click copy to clipboard
- ✅ Smart app deep linking with web fallback
- ✅ Auto-copy text when opening apps

### 2. Follow Us Section
- ✅ Direct app jump functionality
- ✅ 5 platforms (Xiaohongshu, TikTok, Instagram, Facebook, WeChat)
- ✅ Automatic fallback to web if app not installed
- ✅ Clean, modern button design

## 🔧 Configuration

### Customizing Platform URLs

Edit the platform configurations in `app/page.js`:

```javascript
// For review platforms
const reviewPlatforms = [
  {
    id: 'xiaohongshu',
    name: 'Xiaohongshu',
    icon: '📕',
    color: 'bg-red-500',
    appScheme: 'xhsdiscover://',
    fallbackUrl: 'https://www.xiaohongshu.com/YOUR_PROFILE'
  },
  // ... add more platforms
];

// For follow platforms
const followPlatforms = [
  {
    id: 'xiaohongshu',
    name: 'Xiaohongshu',
    icon: '📕',
    color: 'bg-red-500',
    appScheme: 'xhsdiscover://user/YOUR_USER_ID',
    fallbackUrl: 'https://www.xiaohongshu.com/user/profile/YOUR_USER_ID'
  },
  // ... add more platforms
];
```

### Common App Schemes

| Platform | App Scheme | Example |
|----------|------------|---------|
| Xiaohongshu | `xhsdiscover://` | `xhsdiscover://user/USER_ID` |
| TikTok | `snssdk1233://` | `snssdk1233://user/profile/USER_ID` |
| Instagram | `instagram://` | `instagram://user?username=HANDLE` |
| Facebook | `fb://` | `fb://profile/PAGE_ID` |
| WeChat | `weixin://` | `weixin://dl/profile/WECHAT_ID` |
| Yelp | `yelp://` | `yelp://biz/BUSINESS_ID` |
| Google Maps | `comgooglemaps://` | `comgooglemaps://?q=PLACE` |

## 🤖 AI Integration

### Using OpenAI

1. Install OpenAI SDK:
```bash
npm install openai
```

2. Update `app/api/generate-review/route.js`:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { platform } = await request.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Generate positive, authentic reviews in English with emojis."
      },
      {
        role: "user",
        content: `Generate a review for ${platform}`
      }
    ],
  });
  
  return NextResponse.json({ 
    review: completion.choices[0].message.content 
  });
}
```

### Using Anthropic Claude

1. Install Anthropic SDK:
```bash
npm install @anthropic-ai/sdk
```

2. Update the API route similarly with Claude integration.

## 🌐 Deploy to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel dashboard
6. Deploy!

### Environment Variables in Vercel

Add these in **Settings → Environment Variables**:
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 📱 Testing

### Local Mobile Testing

```bash
# Start dev server on network
npm run dev -- --host

# Find your local IP
# Mac/Linux: ifconfig | grep inet
# Windows: ipconfig

# Access on mobile: http://YOUR_IP:3000
```

### Testing App Deep Links

- **iOS**: Test on actual devices (simulator doesn't support all schemes)
- **Android**: Use `adb` to test deep links
- **Web fallback**: Always works as backup

## 🎨 CSS Files Explained

### globals.css
- Includes Tailwind directives
- Custom scrollbar styles
- Modal animations (fadeIn, slideUp)
- Base typography and spacing
- Smooth transitions

### Tailwind Configuration
- Custom animations
- Extended theme
- Content paths for purging
- Plugin configurations

## 🐛 Troubleshooting

### Modal not showing
- Check React state management
- Verify z-index values
- Check browser console for errors

### App deep links not working
- Ensure testing on real devices
- Verify app is installed
- Check app scheme syntax
- Fallback should always work

### CSS not loading
- Run `npm run dev` to restart
- Check Tailwind config paths
- Verify PostCSS is configured

### API calls failing
- Check API route path (`/api/generate-review`)
- Verify request format
- Check environment variables
- Look at browser network tab

## 📊 Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Caching**: Configure in `next.config.js`
4. **Analytics**: Add Vercel Analytics

## 🔒 Security Best Practices

1. Never expose API keys in client code
2. Use environment variables
3. Implement rate limiting
4. Validate all inputs
5. Set up CORS properly
6. Use HTTPS in production

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

**Built with ❤️ using React, Next.js, Tailwind CSS**