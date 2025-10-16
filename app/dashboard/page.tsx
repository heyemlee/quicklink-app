"use client";
import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { followPlatforms, reviewPlatforms, PlatformConfig } from '@/app/config/platformsConfig'

interface FormData {
  // 基本信息
  companyName: string;
  companySubtitle: string;
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
  xiaohongshuReviewUrl: string;
  instagramReviewUrl: string;
  
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
  
  // ContactInfo配置
  contactInfoName: string;
  contactInfoPhone: string;
  contactInfoEmail: string;
  contactInfoAddress: string;
  contactInfoWebsite: string;
  contactInfoOrganization: string;
}

interface PlatformStat {
  platform: string;
  platformType: string | null;
  count: number;
}

interface TrendItem {
  date: string;
  count: number;
}

interface HourlyItem {
  hour: number;
  count: number;
}

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalSaveContacts: number;
    totalPlatformClicks: number;
    uniqueVisitors: number;
    period: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
  platformStats: {
    follow: PlatformStat[];
    review: PlatformStat[];
  };
  trends: {
    daily: TrendItem[];
    hourly: HourlyItem[];
  };
  recentActivities: Array<{
    eventType: string;
    platform: string | null;
    platformType: string | null;
    createdAt: Date;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
  const [activeTab, setActiveTab] = useState<string>('analytics')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [viewMode, setViewMode] = useState<'month' | 'all'>('month')
  
  const [formData, setFormData] = useState<FormData>({
    // 基本信息
    companyName: '',
    companySubtitle: '',
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
    xiaohongshuReviewUrl: '',
    instagramReviewUrl: '',
    
    // 配色方案
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    accentColor: '#3b82f6',
    
    // 展示模块
    showContact: true,
    showFollow: false,
    showReview: false,
    
    // 平台显示控制
    followPlatforms: [],
    reviewPlatforms: [],
    
    // ContactInfo配置
    contactInfoName: '',
    contactInfoPhone: '',
    contactInfoEmail: '',
    contactInfoAddress: '',
    contactInfoWebsite: '',
    contactInfoOrganization: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (response.ok) {
        const profile = data.profile
        // Parse JSON fields
        if (typeof profile.followPlatforms === 'string') {
          profile.followPlatforms = JSON.parse(profile.followPlatforms)
        }
        if (typeof profile.reviewPlatforms === 'string') {
          profile.reviewPlatforms = JSON.parse(profile.reviewPlatforms)
        }
        setFormData(profile)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    try {
      let url = '/api/analytics?'
      
      if (viewMode === 'month') {
        url += `year=${selectedYear}&month=${selectedMonth}`
      } else {
        url += 'all=true'
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [viewMode, selectedYear, selectedMonth])

  // Initial load
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, fetchProfile])

  // Load analytics when authenticated and tab is active, or when time range changes
  useEffect(() => {
    if (status === 'authenticated' && activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [status, activeTab, fetchAnalytics])

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
        setMessage('Saved successfully!')
        setModalType('success')
        setShowModal(true)
      } else {
        setMessage('Save failed: ' + data.error)
        setModalType('error')
        setShowModal(true)
      }
    } catch {
      setMessage('Save failed, please try again later')
      setModalType('error')
      setShowModal(true)
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {session.user.email}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Preview Card
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card URL Display */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-2">Your Card Link</h2>
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
                setMessage('Link copied!')
                setModalType('success')
                setShowModal(true)
              }}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Success/Error Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

              {/* Center modal */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal panel */}
              <div 
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                      modalType === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {modalType === 'success' ? (
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Message */}
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        modalType === 'success' ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {modalType === 'success' ? 'Success' : 'Failed'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-2.5 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors ${
                      modalType === 'success' 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { id: 'analytics', label: 'Analytics' },
                { id: 'basic', label: 'Basic Info' },
                { id: 'display', label: 'Display Settings' },
                { id: 'style', label: 'Theme Style' },
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
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {viewMode === 'month' 
                          ? `Viewing data for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
                          : 'Viewing all-time data'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchAnalytics}
                      disabled={analyticsLoading}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {analyticsLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  {/* Time Range Selector */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* View Mode Selector */}
                      <div className="flex-shrink-0">
                        <label className="block text-xs font-medium text-gray-700 mb-1">View Mode</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                              viewMode === 'month'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Month
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewMode('all')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                              viewMode === 'all'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            All Time
                          </button>
                        </div>
                      </div>

                      {/* Year Selector */}
                      {viewMode === 'month' && (
                        <div className="flex-shrink-0">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                          >
                            {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2025 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Month Selector */}
                      {viewMode === 'month' && (
                        <div className="flex-shrink-0">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month}>
                                {new Date(2025, month - 1).toLocaleString('en-US', { month: 'long' })}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex-1 flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode('month')
                            setSelectedYear(new Date().getFullYear())
                            setSelectedMonth(new Date().getMonth() + 1)
                          }}
                          className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
                        >
                          This Month
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {analyticsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : analyticsData ? (
                  <>
                    {/* Core Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-600 text-2xl">👁️</span>
                          <span className="text-xs text-blue-600 font-medium bg-blue-200 px-2 py-1 rounded-full">
                            Views
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">{analyticsData.summary.totalViews}</div>
                        <div className="text-sm text-blue-700 mt-1">Total Page Views</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-600 text-2xl">💾</span>
                          <span className="text-xs text-green-600 font-medium bg-green-200 px-2 py-1 rounded-full">
                            Saved
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-green-900">{analyticsData.summary.totalSaveContacts}</div>
                        <div className="text-sm text-green-700 mt-1">Contact Saves</div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-600 text-2xl">🔗</span>
                          <span className="text-xs text-purple-600 font-medium bg-purple-200 px-2 py-1 rounded-full">
                            Clicks
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-purple-900">{analyticsData.summary.totalPlatformClicks}</div>
                        <div className="text-sm text-purple-700 mt-1">Platform Clicks</div>
                      </div>

                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-pink-600 text-2xl">👥</span>
                          <span className="text-xs text-pink-600 font-medium bg-pink-200 px-2 py-1 rounded-full">
                            Visitors
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-pink-900">{analyticsData.summary.uniqueVisitors || '~' + Math.floor(analyticsData.summary.totalViews * 0.6)}</div>
                        <div className="text-sm text-pink-700 mt-1">Unique Visitors (est.)</div>
                      </div>
                    </div>

                    {/* Platform Click Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Follow Platforms */}
                      <div className="bg-white border rounded-xl p-5">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          Follow Platform Rankings
                        </h4>
                        {analyticsData.platformStats.follow.length > 0 ? (
                          <div className="space-y-3">
                            {analyticsData.platformStats.follow.map((stat: PlatformStat, index: number) => (
                              <div key={stat.platform} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900 capitalize">{stat.platform}</span>
                                    <span className="text-sm font-semibold text-purple-600">{stat.count} clicks</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                                      style={{ width: `${(stat.count / analyticsData.platformStats.follow[0].count) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No data yet</p>
                        )}
                      </div>

                      {/* Review Platforms */}
                      <div className="bg-white border rounded-xl p-5">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                          Review Platform Rankings
                        </h4>
                        {analyticsData.platformStats.review.length > 0 ? (
                          <div className="space-y-3">
                            {analyticsData.platformStats.review.map((stat: PlatformStat, index: number) => (
                              <div key={stat.platform} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm font-bold text-pink-600">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900 capitalize">{stat.platform}</span>
                                    <span className="text-sm font-semibold text-pink-600">{stat.count} clicks</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all"
                                      style={{ width: `${(stat.count / analyticsData.platformStats.review[0].count) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No data yet</p>
                        )}
                      </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-white border rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {viewMode === 'all' ? 'Monthly Trend (Last 12 Months)' : 'Daily Trend (Last 7 Days)'}
                      </h4>
                      <div className="flex items-end justify-between gap-2 h-48">
                        {analyticsData.trends.daily.map((item: TrendItem) => {
                          const maxCount = Math.max(...analyticsData.trends.daily.map((d: TrendItem) => d.count), 1)
                          const height = (item.count / maxCount) * 100
                          
                          // Format label based on view mode
                          let label = ''
                          if (viewMode === 'all') {
                            // Show month name for all-time view
                            const [year, month] = item.date.split('-')
                            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'short' })
                            label = `${monthName} ${year.slice(2)}`
                          } else {
                            // Show day for monthly view
                            const date = new Date(item.date)
                            label = `${date.getMonth() + 1}/${date.getDate()}`
                          }
                          
                          return (
                            <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                              <div className="relative w-full">
                                <div 
                                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                                  style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}
                                  title={`${item.count} views`}
                                >
                                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                                    {item.count}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 text-center">
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Hourly Distribution */}
                    <div className="bg-white border rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                        24-Hour Activity Heatmap
                      </h4>
                      <div className="grid grid-cols-12 gap-1">
                        {analyticsData.trends.hourly.map((hourData: HourlyItem) => {
                          const maxCount = Math.max(...analyticsData.trends.hourly.map((h: HourlyItem) => h.count), 1)
                          const intensity = hourData.count / maxCount
                          return (
                            <div 
                              key={hourData.hour}
                              className="flex flex-col items-center gap-1"
                              title={`${hourData.hour}:00 - ${hourData.count} views`}
                            >
                              <div 
                                className={`w-full h-12 rounded transition-colors cursor-pointer ${
                                  intensity > 0.7 ? 'bg-indigo-600' :
                                  intensity > 0.4 ? 'bg-indigo-400' :
                                  intensity > 0.1 ? 'bg-indigo-200' :
                                  'bg-gray-100'
                                }`}
                              ></div>
                              <span className="text-xs text-gray-600">{hourData.hour}</span>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">Darker colors indicate higher activity during that hour</p>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white border rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                        Recent Activity Feed
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {analyticsData.recentActivities.map((activity, index: number) => (
                          <div key={index} className="flex items-center gap-3 text-sm py-2 border-b last:border-b-0">
                            <span className="text-xl">
                              {activity.eventType === 'page_view' ? '👁️' :
                               activity.eventType === 'save_contact' ? '💾' : '🔗'}
                            </span>
                            <div className="flex-1">
                              <span className="text-gray-900">
                                {activity.eventType === 'page_view' ? 'Visited page' :
                                 activity.eventType === 'save_contact' ? 'Saved contact' :
                                 `Clicked ${activity.platform} (${activity.platformType === 'follow' ? 'follow' : 'review'})`}
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {new Date(activity.createdAt).toLocaleString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>No analytics data yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This information will be displayed on your homepage
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
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
                    Description
                  </label>
                  <input
                    type="text"
                    name="companySubtitle"
                    value={formData.companySubtitle || ''}
                    onChange={handleChange}
                    placeholder="e.g., Kitchen and Bath Institute"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will appear below your company name on the card</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
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
                    Address
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
              </div>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Theme Style</h3>
                  <p className="text-sm text-gray-600 mb-4">Select a theme style to apply to your card</p>
                </div>

                {/* Theme style selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Classic style */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        primaryColor: '#7c3aed',
                        secondaryColor: '#ec4899',
                        accentColor: '#3b82f6'
                      })
                    }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.primaryColor === '#7c3aed' && formData.secondaryColor === '#ec4899' && formData.accentColor === '#3b82f6'
                        ? 'border-purple-600 bg-purple-50 shadow-lg ring-2 ring-purple-200'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 shadow-lg"></div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 mb-1">Classic Style</div>
                        <div className="text-sm text-gray-500 mb-3">Purple-Pink Gradient · Vibrant & Stylish</div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#7c3aed' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#ec4899' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      {formData.primaryColor === '#7c3aed' && formData.secondaryColor === '#ec4899' && formData.accentColor === '#3b82f6' && (
                        <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Current Theme
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Simple Blue */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        primaryColor: '#0ea5e9',
                        secondaryColor: '#06b6d4',
                        accentColor: '#3b82f6'
                      })
                    }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.primaryColor === '#0ea5e9' && formData.secondaryColor === '#06b6d4' && formData.accentColor === '#3b82f6'
                        ? 'border-sky-600 bg-sky-50 shadow-lg ring-2 ring-sky-200'
                        : 'border-gray-200 bg-white hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-500 shadow-lg"></div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 mb-1">Simple Blue</div>
                        <div className="text-sm text-gray-500 mb-3">Fresh & Professional · Business Style</div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#06b6d4' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      {formData.primaryColor === '#0ea5e9' && formData.secondaryColor === '#06b6d4' && formData.accentColor === '#3b82f6' && (
                        <div className="flex items-center gap-2 text-sky-600 font-medium text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Current Theme
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Elegant Dark */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        primaryColor: '#1e293b',
                        secondaryColor: '#475569',
                        accentColor: '#64748b'
                      })
                    }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.primaryColor === '#1e293b' && formData.secondaryColor === '#475569' && formData.accentColor === '#64748b'
                        ? 'border-slate-600 bg-slate-50 shadow-lg ring-2 ring-slate-200'
                        : 'border-gray-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 via-slate-600 to-slate-500 shadow-lg"></div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 mb-1">Elegant Dark</div>
                        <div className="text-sm text-gray-500 mb-3">Sophisticated · Premium Luxury</div>
                      </div>
                      <div className="flex gap-2 w-full">
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#1e293b' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#475569' }}></div>
                        <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#64748b' }}></div>
                      </div>
                      {formData.primaryColor === '#1e293b' && formData.secondaryColor === '#475569' && formData.accentColor === '#64748b' && (
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Current Theme
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Display Settings Tab */}
            {activeTab === 'display' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Display Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Select which modules to display on your card page and configure the information</p>
                </div>

                {/* Contact Info Module */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="showContact"
                      name="showContact"
                      checked={formData.showContact}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="showContact" className="ml-3">
                      <div className="text-base font-semibold text-gray-900">Show Contact Information</div>
                      <div className="text-sm text-gray-600">Display save contact button and card configuration</div>
                    </label>
                  </div>

                  {formData.showContact && (
                    <div className="mt-6 pl-8 border-l-2 border-green-200">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          Contact Card Configuration
                        </h4>
                        <p className="text-xs text-gray-600 mb-4">
                          This information will be used to generate vCard file
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              name="contactInfoName"
                              value={formData.contactInfoName || ''}
                              onChange={handleChange}
                              placeholder="My Name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="contactInfoPhone"
                              value={formData.contactInfoPhone || ''}
                              onChange={handleChange}
                              placeholder="(001) 123-4567"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="contactInfoEmail"
                              value={formData.contactInfoEmail || ''}
                              onChange={handleChange}
                              placeholder="office@abc.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <input
                              type="text"
                              name="contactInfoAddress"
                              value={formData.contactInfoAddress || ''}
                              onChange={handleChange}
                              placeholder="123 abc Ave, City, CA"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Website
                            </label>
                            <input
                              type="url"
                              name="contactInfoWebsite"
                              value={formData.contactInfoWebsite || ''}
                              onChange={handleChange}
                              placeholder="https://www.abc.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              name="contactInfoOrganization"
                              value={formData.contactInfoOrganization || ''}
                              onChange={handleChange}
                              placeholder="Company"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow Module */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="showFollow"
                      name="showFollow"
                      checked={formData.showFollow}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="showFollow" className="ml-3">
                      <div className="text-base font-semibold text-gray-900">Show Follow Module</div>
                      <div className="text-sm text-gray-600">Display social media follow buttons</div>
                    </label>
                  </div>

                  {formData.showFollow && (
                    <div className="mt-6 space-y-6 pl-8 border-l-2 border-purple-200">
                      {/* Platform selection */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Platforms to Display</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {followPlatforms.map((platform: PlatformConfig) => {
                            const isSelected = formData.followPlatforms?.includes(platform.id)
                            return (
                              <button
                                key={platform.id}
                                type="button"
                                onClick={() => togglePlatform(platform.id, 'follow')}
                                className={`relative p-3 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-purple-600 bg-purple-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </div>
                                )}
                                <div className="flex flex-col items-center gap-2">
                                  {platform.isImage ? (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platform.color}`}>
                                      <div className="bg-white rounded-full p-1">
                                        <Image 
                                          src={platform.icon} 
                                          alt={platform.name}
                                          width={24}
                                          height={24}
                                          className="w-5 h-5 object-contain"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xl">{platform.icon}</span>
                                  )}
                                  <span className="text-xs font-medium text-gray-700">{platform.name}</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Website platform configuration - shown only when selected */}
                      {formData.followPlatforms?.includes('website') && (
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            Website Platform Configuration
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website Name
                              </label>
                              <input
                                type="text"
                                name="websiteName"
                                value={formData.websiteName || ''}
                                onChange={handleChange}
                                placeholder="e.g.: KABI, My Website, etc."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website URL
                              </label>
                              <input
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl || ''}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Social media links configuration - only show selected platforms */}
                      {(() => {
                        const socialMediaFields = [
                          { id: 'wechat', name: 'wechatId' as keyof FormData, label: 'WeChat ID', placeholder: 'your-wechat-id' },
                          { id: 'instagram', name: 'instagram' as keyof FormData, label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
                          { id: 'facebook', name: 'facebook' as keyof FormData, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                          { id: 'tiktok', name: 'tiktok' as keyof FormData, label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
                          { id: 'xiaohongshu', name: 'xiaohongshu' as keyof FormData, label: 'Xiaohongshu', placeholder: 'https://xiaohongshu.com/user/...' },
                          { id: 'yelp', name: 'yelp' as keyof FormData, label: 'Yelp', placeholder: 'https://yelp.com/biz/...' },
                          { id: 'google', name: 'google' as keyof FormData, label: 'Google', placeholder: 'https://g.page/...' },
                        ].filter(field => formData.followPlatforms?.includes(field.id));
                        
                        if (socialMediaFields.length === 0) return null;
                        
                        return (
                          <div className="bg-white rounded-lg p-4 border border-purple-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                              Social Media Links Configuration
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {socialMediaFields.map(field => (
                                <div key={field.name}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    name={field.name}
                                    value={(formData[field.name] as string) || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Review Module */}
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="showReview"
                      name="showReview"
                      checked={formData.showReview}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor="showReview" className="ml-3">
                      <div className="text-base font-semibold text-gray-900">Show Review Module</div>
                      <div className="text-sm text-gray-600">Display write review buttons</div>
                    </label>
                  </div>

                  {formData.showReview && (
                    <div className="mt-6 space-y-6 pl-8 border-l-2 border-pink-200">
                      {/* Platform selection */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Platforms to Display</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {reviewPlatforms.map((platform: PlatformConfig) => {
                            const isSelected = formData.reviewPlatforms?.includes(platform.id)
                            return (
                              <button
                                key={platform.id}
                                type="button"
                                onClick={() => togglePlatform(platform.id, 'review')}
                                className={`relative p-3 rounded-xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-pink-600 bg-pink-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </div>
                                )}
                                <div className="flex flex-col items-center gap-2">
                                  {platform.isImage ? (
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${platform.color}`}>
                                      <div className="bg-white rounded-full p-1">
                                        <Image 
                                          src={platform.icon} 
                                          alt={platform.name}
                                          width={24}
                                          height={24}
                                          className="w-5 h-5 object-contain"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xl">{platform.icon}</span>
                                  )}
                                  <span className="text-xs font-medium text-gray-700">{platform.name}</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Review platform links configuration - only show selected platforms */}
                      {(() => {
                        const reviewLinkFields = [
                          { id: 'googlemap', name: 'googleReviewUrl' as keyof FormData, label: 'Google Review Link', placeholder: 'https://g.page/...' },
                          { id: 'yelp', name: 'yelpReviewUrl' as keyof FormData, label: 'Yelp Review Link', placeholder: 'https://yelp.com/writeareview/biz/...' },
                          { id: 'facebook', name: 'facebookReviewUrl' as keyof FormData, label: 'Facebook Review Link', placeholder: 'https://facebook.com/...' },
                          { id: 'xiaohongshu', name: 'xiaohongshuReviewUrl' as keyof FormData, label: 'Xiaohongshu Review Link', placeholder: 'https://xiaohongshu.com/...' },
                          { id: 'instagram', name: 'instagramReviewUrl' as keyof FormData, label: 'Instagram Review Link', placeholder: 'https://instagram.com/...' },
                        ].filter(field => formData.reviewPlatforms?.includes(field.id));
                        
                        if (reviewLinkFields.length === 0) return null;
                        
                        return (
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                              Review Platform Links Configuration
                            </h4>
                            <div className="space-y-3">
                              {reviewLinkFields.map(field => (
                                <div key={field.name}>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                  </label>
                                  <input
                                    type="url"
                                    name={field.name}
                                    value={(formData[field.name] as string) || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

