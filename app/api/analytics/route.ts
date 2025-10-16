import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

// 类型定义
interface PlatformClick {
  platform: string
  platformType: string | null
  count: number
}

interface PlatformClicksMap {
  [key: string]: PlatformClick
}

interface TrendData {
  date: string
  count: number
}

// POST /api/analytics - 记录用户行为事件（公开，不需要认证）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, eventType, platform, platformType, visitorId } = body

    // 验证必需字段
    if (!slug || !eventType) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      )
    }

    // 验证eventType
    const validEventTypes = ['page_view', 'save_contact', 'platform_click']
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: '无效的事件类型' },
        { status: 400 }
      )
    }

    // 如果是平台点击事件，验证必需参数
    if (eventType === 'platform_click' && (!platform || !platformType)) {
      return NextResponse.json(
        { error: '平台点击事件需要提供platform和platformType' },
        { status: 400 }
      )
    }

    // 根据slug查找用户
    const user = await prisma.user.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 创建统计记录
    const analytics = await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType,
        platform: eventType === 'platform_click' ? platform : null,
        platformType: eventType === 'platform_click' ? platformType : null,
        visitorId: visitorId || null,
      }
    })

    return NextResponse.json({ success: true, id: analytics.id })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: '记录失败' },
      { status: 500 }
    )
  }
}

// GET /api/analytics - 获取统计数据（需要认证，只能看自己的数据）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const all = searchParams.get('all')

    let startDate: Date
    let endDate: Date
    let periodLabel: string

    if (all === 'true') {
      // All time data
      startDate = new Date('2025-01-01')
      endDate = new Date()
      periodLabel = 'All Time'
    } else if (year && month) {
      // Specific month - show data up to today
      const y = parseInt(year)
      const m = parseInt(month)
      const today = new Date()
      const monthStart = new Date(y, m - 1, 1)
      const monthEnd = new Date(y, m, 0, 23, 59, 59, 999)
      
      startDate = monthStart
      // If current month, use today; otherwise use month end
      if (y === today.getFullYear() && m === today.getMonth() + 1) {
        endDate = today
        // Format: "October 1-16, 2025"
        periodLabel = `${monthStart.toLocaleString('en-US', { month: 'long' })} ${monthStart.getDate()}-${today.getDate()}, ${y}`
      } else {
        endDate = monthEnd
        periodLabel = new Date(y, m - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
      }
    } else if (year) {
      // Specific year
      const y = parseInt(year)
      startDate = new Date(y, 0, 1)
      endDate = new Date(y, 11, 31, 23, 59, 59, 999)
      periodLabel = `${y}`
    } else {
      // Default: last 30 days
      startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      endDate = new Date()
      periodLabel = 'Last 30 Days'
    }

    // 查询该用户的所有统计数据
    const analytics = await prisma.analytics.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 总览统计
    const totalViews = analytics.filter(a => a.eventType === 'page_view').length
    const totalSaveContacts = analytics.filter(a => a.eventType === 'save_contact').length
    const totalPlatformClicks = analytics.filter(a => a.eventType === 'platform_click').length

    // 平台点击统计
    const platformClicks = analytics
      .filter(a => a.eventType === 'platform_click')
      .reduce((acc: PlatformClicksMap, curr) => {
        if (!curr.platform) return acc
        
        if (!acc[curr.platform]) {
          acc[curr.platform] = {
            platform: curr.platform,
            platformType: curr.platformType,
            count: 0
          }
        }
        acc[curr.platform].count++
        return acc
      }, {})

    // 按平台类型分组（follow vs review）
    const followClicks = Object.values(platformClicks).filter((p: PlatformClick) => p.platformType === 'follow')
    const reviewClicks = Object.values(platformClicks).filter((p: PlatformClick) => p.platformType === 'review')

    // 趋势数据：根据时间范围调整
    let dailyViews: TrendData[]
    
    if (all === 'true') {
      // All time: show monthly trend
      const monthsMap = new Map<string, number>()
      analytics.forEach(a => {
        if (a.eventType === 'page_view') {
          const monthKey = `${a.createdAt.getFullYear()}-${String(a.createdAt.getMonth() + 1).padStart(2, '0')}`
          monthsMap.set(monthKey, (monthsMap.get(monthKey) || 0) + 1)
        }
      })
      
      dailyViews = Array.from(monthsMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months
        .map(([date, count]) => ({ date, count }))
    } else {
      // Month view: show daily trend for last 7 days (including today)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      
      dailyViews = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - (6 - i)) // 6 days ago to today
        date.setHours(0, 0, 0, 0) // Start of day
        
        const dateStr = date.toISOString().split('T')[0]
        const count = analytics.filter(a => {
          const aDate = new Date(a.createdAt)
          aDate.setHours(0, 0, 0, 0)
          return aDate.toISOString().split('T')[0] === dateStr && a.eventType === 'page_view'
        }).length
        
        return { date: dateStr, count }
      })
    }

    // 时段分布（按小时统计）
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
      const count = analytics.filter(a => {
        return a.createdAt.getHours() === hour
      }).length
      return { hour, count }
    })

    // 独立访客数（基于visitorId，如果有的话）
    const uniqueVisitors = new Set(
      analytics
        .filter(a => a.visitorId)
        .map(a => a.visitorId)
    ).size

    // 最近活动记录（最新20条）
    const recentActivities = analytics.slice(0, 20).map(a => ({
      eventType: a.eventType,
      platform: a.platform,
      platformType: a.platformType,
      createdAt: a.createdAt
    }))

    return NextResponse.json({
      summary: {
        totalViews,
        totalSaveContacts,
        totalPlatformClicks,
        uniqueVisitors,
        period: periodLabel,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      },
      platformStats: {
        follow: followClicks.sort((a: PlatformClick, b: PlatformClick) => b.count - a.count),
        review: reviewClicks.sort((a: PlatformClick, b: PlatformClick) => b.count - a.count)
      },
      trends: {
        daily: dailyViews,
        hourly: hourlyDistribution
      },
      recentActivities
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}

