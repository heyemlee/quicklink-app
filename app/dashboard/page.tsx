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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')
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
        setModalType('success')
        setShowModal(true)
      } else {
        setMessage('保存失败：' + data.error)
        setModalType('error')
        setShowModal(true)
      }
    } catch (error) {
      setMessage('保存失败，请稍后重试')
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
                setModalType('success')
                setShowModal(true)
              }}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              复制链接
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
                        {modalType === 'success' ? '操作成功' : '操作失败'}
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
                    确定
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
                { id: 'basic', label: '网页信息' },
                { id: 'display', label: '显示设置' },
                { id: 'style', label: '主题风格' },
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">网页信息</h3>
                <p className="text-sm text-gray-600 mb-4">
                  这些信息将显示在主页上
                </p>
                
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
              </div>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">主题风格</h3>
                  <p className="text-sm text-gray-600 mb-4">选择一种主题风格应用到您的名片</p>
                </div>

                {/* 主题风格选择 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 经典风格 */}
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
                        <div className="font-bold text-lg text-gray-900 mb-1">经典风格</div>
                        <div className="text-sm text-gray-500 mb-3">紫粉渐变 · 活泼时尚</div>
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
                          当前主题
                        </div>
                      )}
                    </div>
                  </button>

                  {/* 简约蓝调 */}
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
                        <div className="font-bold text-lg text-gray-900 mb-1">简约蓝调</div>
                        <div className="text-sm text-gray-500 mb-3">清新专业 · 商务风格</div>
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
                          当前主题
                        </div>
                      )}
                    </div>
                  </button>

                  {/* 优雅深色 */}
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
                        <div className="font-bold text-lg text-gray-900 mb-1">优雅深色</div>
                        <div className="text-sm text-gray-500 mb-3">沉稳大气 · 高端奢华</div>
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
                          当前主题
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">模块显示设置</h3>
                  <p className="text-sm text-gray-600 mb-4">选择要在名片页面上显示的模块，并配置相应的信息</p>
                </div>

                {/* 联系信息模块 */}
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
                      <div className="text-base font-semibold text-gray-900">显示联系信息</div>
                      <div className="text-sm text-gray-600">显示保存联系人按钮和名片配置</div>
                    </label>
                  </div>

                  {formData.showContact && (
                    <div className="mt-6 pl-8 border-l-2 border-green-200">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          名片信息配置
                        </h4>
                        <p className="text-xs text-gray-600 mb-4">
                          这些信息将用于生成联系人名片(vCard)文件
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              名称
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
                              电话
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
                              邮箱
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
                              地址
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
                              网站
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
                              公司
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

                {/* 关注模块 */}
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
                      <div className="text-base font-semibold text-gray-900">显示关注模块</div>
                      <div className="text-sm text-gray-600">显示社交媒体关注按钮</div>
                    </label>
                  </div>

                  {formData.showFollow && (
                    <div className="mt-6 space-y-6 pl-8 border-l-2 border-purple-200">
                      {/* 平台选择 */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">选择要显示的平台</h4>
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

                      {/* Website平台配置 - 仅在选中时显示 */}
                      {formData.followPlatforms?.includes('website') && (
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            Website平台配置
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website名称
                              </label>
                              <input
                                type="text"
                                name="websiteName"
                                value={formData.websiteName || ''}
                                onChange={handleChange}
                                placeholder="例如：KABI、我的网站等"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website链接
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

                      {/* 社交媒体链接配置 - 仅显示选中的平台 */}
                      {(() => {
                        const socialMediaFields = [
                          { id: 'wechat', name: 'wechatId' as keyof FormData, label: '微信 ID', placeholder: 'your-wechat-id' },
                          { id: 'instagram', name: 'instagram' as keyof FormData, label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
                          { id: 'facebook', name: 'facebook' as keyof FormData, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                          { id: 'tiktok', name: 'tiktok' as keyof FormData, label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
                          { id: 'xiaohongshu', name: 'xiaohongshu' as keyof FormData, label: '小红书', placeholder: 'https://xiaohongshu.com/user/...' },
                          { id: 'yelp', name: 'yelp' as keyof FormData, label: 'Yelp', placeholder: 'https://yelp.com/biz/...' },
                          { id: 'google', name: 'google' as keyof FormData, label: 'Google', placeholder: 'https://g.page/...' },
                        ].filter(field => formData.followPlatforms?.includes(field.id));
                        
                        if (socialMediaFields.length === 0) return null;
                        
                        return (
                          <div className="bg-white rounded-lg p-4 border border-purple-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                              社交媒体链接配置
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

                {/* 评价模块 */}
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
                      <div className="text-base font-semibold text-gray-900">显示评价模块</div>
                      <div className="text-sm text-gray-600">显示撰写评价按钮</div>
                    </label>
                  </div>

                  {formData.showReview && (
                    <div className="mt-6 space-y-6 pl-8 border-l-2 border-pink-200">
                      {/* 平台选择 */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">选择要显示的平台</h4>
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

                      {/* 评价平台链接配置 - 仅显示选中的平台 */}
                      {(() => {
                        const reviewLinkFields = [
                          { id: 'googlemap', name: 'googleReviewUrl' as keyof FormData, label: 'Google 评价链接', placeholder: 'https://g.page/...' },
                          { id: 'yelp', name: 'yelpReviewUrl' as keyof FormData, label: 'Yelp 评价链接', placeholder: 'https://yelp.com/writeareview/biz/...' },
                          { id: 'facebook', name: 'facebookReviewUrl' as keyof FormData, label: 'Facebook 评价链接', placeholder: 'https://facebook.com/...' },
                          { id: 'xiaohongshu', name: 'xiaohongshuReviewUrl' as keyof FormData, label: '小红书评价链接', placeholder: 'https://xiaohongshu.com/...' },
                          { id: 'instagram', name: 'instagramReviewUrl' as keyof FormData, label: 'Instagram 评价链接', placeholder: 'https://instagram.com/...' },
                        ].filter(field => formData.reviewPlatforms?.includes(field.id));
                        
                        if (reviewLinkFields.length === 0) return null;
                        
                        return (
                          <div className="bg-white rounded-lg p-4 border border-pink-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                              评价平台链接配置
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
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

