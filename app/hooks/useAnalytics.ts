import { useCallback, useEffect, useRef } from 'react'

interface TrackEventParams {
  slug: string
  eventType: 'page_view' | 'save_contact' | 'platform_click'
  platform?: string
  platformType?: 'follow' | 'review'
}

// 生成或获取访客ID（存储在localStorage）
const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') return ''
  
  const storageKey = 'quicklink_visitor_id'
  let visitorId = localStorage.getItem(storageKey)
  
  if (!visitorId) {
    // 生成简单的唯一ID
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(storageKey, visitorId)
  }
  
  return visitorId
}

export function useAnalytics(slug: string) {
  const trackedPageView = useRef(false)

  // 追踪事件的通用函数
  const trackEvent = useCallback(async (params: Omit<TrackEventParams, 'slug'>) => {
    try {
      const visitorId = getOrCreateVisitorId()
      
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          visitorId,
          ...params
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Analytics tracking failed:', errorData)
      } else {
        console.log(`✅ Analytics tracked: ${params.eventType}`, params)
      }
    } catch (error) {
      // 静默失败，不影响用户体验
      console.error('Analytics tracking failed:', error)
    }
  }, [slug])

  // 追踪页面访问（自动，仅一次）
  useEffect(() => {
    if (!slug || trackedPageView.current) return
    
    trackedPageView.current = true
    trackEvent({ eventType: 'page_view' })
  }, [slug, trackEvent])

  // 追踪保存联系人
  const trackSaveContact = useCallback(() => {
    trackEvent({ eventType: 'save_contact' })
  }, [trackEvent])

  // 追踪平台点击
  const trackPlatformClick = useCallback((platform: string, platformType: 'follow' | 'review') => {
    trackEvent({
      eventType: 'platform_click',
      platform,
      platformType
    })
  }, [trackEvent])

  return {
    trackSaveContact,
    trackPlatformClick
  }
}

