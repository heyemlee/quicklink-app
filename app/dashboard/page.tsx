"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { followPlatforms, reviewPlatforms, PlatformConfig } from '@/app/config/platformsConfig'

interface FormData {
  // 基本信息
  companyName: string;
  logoUrl: string;
  websiteName: string;
  websiteUrl: string;
  phone: string;
  address: string;
  email: string;
  
  // 社交媒体
  wechatId: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  xiaohongshu: string;
  yelp: string;
  google: string;
  
  // 评价平台链接
  googleReviewUrl: string;
  yelpReviewUrl: string;
  facebookReviewUrl: string;
  
  // 配色方案
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // 展示模块
  showContact: boolean;
  showFollow: boolean;
  showReview: boolean;
  
  // 平台显示控制
  followPlatforms: string[];
  reviewPlatforms: string[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('basic')
  
  const [formData, setFormData] = useState<FormData>({
    // 基本信息
    companyName: '',
    logoUrl: '',
    websiteName: '',
    websiteUrl: '',
    phone: '',
    address: '',
    email: '',
    
    // 社交媒体
    wechatId: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    xiaohongshu: '',
    yelp: '',
    google: '',
    
    // 评价平台链接
    googleReviewUrl: '',
    yelpReviewUrl: '',
    facebookReviewUrl: '',
    
    // 配色方案
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    accentColor: '#3b82f6',
    
    // 展示模块
    showContact: true,
    showFollow: true,
    showReview: true,
    
    // 平台显示控制
    followPlatforms: ["website","tiktok","instagram","facebook","wechat","xiaohongshu"],
    reviewPlatforms: ["xiaohongshu","yelp","googlemap","instagram"],
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (response.ok) {
        const profile = data.profile
        // 解析JSON字段
        if (typeof profile.followPlatforms === 'string') {
          profile.followPlatforms = JSON.parse(profile.followPlatforms)
        }
        if (typeof profile.reviewPlatforms === 'string') {
          profile.reviewPlatforms = JSON.parse(profile.reviewPlatforms)
        }
        setFormData(profile)
      }
    } catch (error) {
      console.error('获取配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const togglePlatform = (platformId: string, platformType: 'follow' | 'review') => {
    const key = platformType === 'follow' ? 'followPlatforms' : 'reviewPlatforms'
    const currentPlatforms = formData[key] || []
    
    if (currentPlatforms.includes(platformId)) {
      setFormData({
        ...formData,
        [key]: currentPlatforms.filter(id => id !== platformId)
      })
    } else {
      setFormData({
        ...formData,
        [key]: [...currentPlatforms, platformId]
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('保存成功！')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('保存失败：' + data.error)
      }
    } catch (error) {
      setMessage('保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const cardUrl = typeof window !== 'undefined' ? `${window.location.origin}/card/${session.user.slug}` : ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">后台管理</h1>
              <p className="text-sm text-gray-600 mt-1">
                欢迎，{session.user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                预览名片
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card URL Display */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-2">您的名片链接</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={cardUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-white/20 rounded-lg text-white placeholder-white/60 border border-white/30"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(cardUrl)
                setMessage('链接已复制！')
                setTimeout(() => setMessage(''), 2000)
              }}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              复制链接
            </button>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {[
                { id: 'basic', label: '基本信息' },
                { id: 'website', label: 'Website平台' },
                { id: 'social', label: '社交媒体' },
                { id: 'review', label: '评价链接' },
                { id: 'style', label: '样式配置' },
                { id: 'display', label: '显示设置' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司名称
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    电话
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    地址
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State 12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Website Tab */}
            {activeTab === 'website' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Website平台设置</h3>
                <p className="text-sm text-gray-600 mb-4">
                  配置在关注模块中显示的Website平台信息
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website名称
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    这个名称将显示在关注模块的Website按钮上
                  </p>
                  <input
                    type="text"
                    name="websiteName"
                    value={formData.websiteName || ''}
                    onChange={handleChange}
                    placeholder="例如：KABI、我的网站等"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website链接
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    用户点击Website按钮时将跳转到这个链接
                  </p>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl || ''}
                    onChange={handleChange}
                    placeholder="https://www.example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">提示</p>
                      <p>如果留空，系统将使用默认的Website配置。确保Website链接以 http:// 或 https:// 开头。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">社交媒体链接</h3>
                
                {[
                  { name: 'wechatId' as keyof FormData, label: '微信 ID', placeholder: 'your-wechat-id' },
                  { name: 'instagram' as keyof FormData, label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
                  { name: 'facebook' as keyof FormData, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                  { name: 'tiktok' as keyof FormData, label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
                  { name: 'xiaohongshu' as keyof FormData, label: '小红书', placeholder: 'https://xiaohongshu.com/user/...' },
                  { name: 'yelp' as keyof FormData, label: 'Yelp', placeholder: 'https://yelp.com/biz/...' },
                  { name: 'google' as keyof FormData, label: 'Google', placeholder: 'https://g.page/...' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={(formData[field.name] as string) || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Review Links Tab */}
            {activeTab === 'review' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">评价平台链接</h3>
                
                {[
                  { name: 'googleReviewUrl' as keyof FormData, label: 'Google 评价链接', placeholder: 'https://g.page/...' },
                  { name: 'yelpReviewUrl' as keyof FormData, label: 'Yelp 评价链接', placeholder: 'https://yelp.com/writeareview/biz/...' },
                  { name: 'facebookReviewUrl' as keyof FormData, label: 'Facebook 评价链接', placeholder: 'https://facebook.com/...' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="url"
                      name={field.name}
                      value={(formData[field.name] as string) || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">配色方案</h3>
                
                {[
                  { name: 'primaryColor' as keyof FormData, label: '主色调', description: '主要按钮和标题颜色' },
                  { name: 'secondaryColor' as keyof FormData, label: '次要色调', description: '次要元素颜色' },
                  { name: 'accentColor' as keyof FormData, label: '强调色', description: '强调和高亮颜色' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name={field.name}
                        value={formData[field.name] as string}
                        onChange={handleChange}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData[field.name] as string}
                        onChange={(e) => handleChange({ target: { name: field.name, value: e.target.value, type: 'text', checked: false } } as any)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display Settings Tab */}
            {activeTab === 'display' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本模块显示</h3>
                  <p className="text-sm text-gray-600 mb-4">选择在名片页面上显示哪些基本模块</p>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'showContact' as keyof FormData, label: '显示联系信息', description: '显示保存联系人按钮和联系信息' },
                      { name: 'showFollow' as keyof FormData, label: '显示关注模块', description: '显示社交媒体关注按钮' },
                      { name: 'showReview' as keyof FormData, label: '显示评价模块', description: '显示撰写评价按钮' },
                    ].map(field => (
                      <div key={String(field.name)} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id={String(field.name)}
                          name={String(field.name)}
                          checked={formData[field.name] as boolean}
                          onChange={handleChange}
                          className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
                        />
                        <label htmlFor={String(field.name)} className="ml-3">
                          <div className="text-sm font-medium text-gray-700">{field.label}</div>
                          <div className="text-xs text-gray-500">{field.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 关注平台选择 */}
                {formData.showFollow && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">关注模块 - 平台选择</h3>
                    <p className="text-sm text-gray-600 mb-4">选择要在关注模块中显示的平台</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {followPlatforms.map((platform: PlatformConfig) => {
                        const isSelected = formData.followPlatforms?.includes(platform.id)
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => togglePlatform(platform.id, 'follow')}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <div className="flex flex-col items-center gap-2">
                              {platform.isImage ? (
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.color}`}>
                                  <div className="bg-white rounded-full p-1.5">
                                    <Image 
                                      src={platform.icon} 
                                      alt={platform.name}
                                      width={32}
                                      height={32}
                                      className="w-6 h-6 object-contain"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-2xl">{platform.icon}</span>
                              )}
                              <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 评价平台选择 */}
                {formData.showReview && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">评价模块 - 平台选择</h3>
                    <p className="text-sm text-gray-600 mb-4">选择要在评价模块中显示的平台</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {reviewPlatforms.map((platform: PlatformConfig) => {
                        const isSelected = formData.reviewPlatforms?.includes(platform.id)
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            onClick={() => togglePlatform(platform.id, 'review')}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? 'border-pink-600 bg-pink-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <div className="flex flex-col items-center gap-2">
                              {platform.isImage ? (
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.color}`}>
                                  <div className="bg-white rounded-full p-1.5">
                                    <Image 
                                      src={platform.icon} 
                                      alt={platform.name}
                                      width={32}
                                      height={32}
                                      className="w-6 h-6 object-contain"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-2xl">{platform.icon}</span>
                              )}
                              <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

