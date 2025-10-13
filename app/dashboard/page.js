"use client";
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  
  const [formData, setFormData] = useState({
    // 基本信息
    companyName: '',
    logoUrl: '',
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
        setFormData(data.profile)
      }
    } catch (error) {
      console.error('获取配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
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

  const cardUrl = `${window.location.origin}/card/${session.user.slug}`

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
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
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

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">社交媒体链接</h3>
                
                {[
                  { name: 'wechatId', label: '微信 ID', placeholder: 'your-wechat-id' },
                  { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
                  { name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
                  { name: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourprofile' },
                  { name: 'xiaohongshu', label: '小红书', placeholder: 'https://xiaohongshu.com/user/...' },
                  { name: 'yelp', label: 'Yelp', placeholder: 'https://yelp.com/biz/...' },
                  { name: 'google', label: 'Google', placeholder: 'https://g.page/...' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ''}
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
                  { name: 'googleReviewUrl', label: 'Google 评价链接', placeholder: 'https://g.page/...' },
                  { name: 'yelpReviewUrl', label: 'Yelp 评价链接', placeholder: 'https://yelp.com/writeareview/biz/...' },
                  { name: 'facebookReviewUrl', label: 'Facebook 评价链接', placeholder: 'https://facebook.com/...' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="url"
                      name={field.name}
                      value={formData[field.name] || ''}
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
                  { name: 'primaryColor', label: '主色调', description: '主要按钮和标题颜色' },
                  { name: 'secondaryColor', label: '次要色调', description: '次要元素颜色' },
                  { name: 'accentColor', label: '强调色', description: '强调和高亮颜色' },
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
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData[field.name]}
                        onChange={(e) => handleChange({ target: { name: field.name, value: e.target.value } })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display Settings Tab */}
            {activeTab === 'display' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">显示设置</h3>
                <p className="text-sm text-gray-600 mb-4">选择在名片页面上显示哪些模块</p>
                
                {[
                  { name: 'showContact', label: '显示联系信息', description: '显示保存联系人按钮和联系信息' },
                  { name: 'showFollow', label: '显示关注模块', description: '显示社交媒体关注按钮' },
                  { name: 'showReview', label: '显示评价模块', description: '显示撰写评价按钮' },
                ].map(field => (
                  <div key={field.name} className="flex items-start">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-600 border-gray-300 rounded"
                    />
                    <label htmlFor={field.name} className="ml-3">
                      <div className="text-sm font-medium text-gray-700">{field.label}</div>
                      <div className="text-xs text-gray-500">{field.description}</div>
                    </label>
                  </div>
                ))}
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

