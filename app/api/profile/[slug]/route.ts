import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    slug: string
  }
}

// 根据 slug 获取用户的 Profile（公开访问）
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = params

    const user = await prisma.user.findUnique({
      where: {
        slug: slug
      },
      include: {
        profile: true
      }
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 解析平台控制JSON字段
    let followPlatforms: string[] = []
    let reviewPlatforms: string[] = []
    
    try {
      followPlatforms = JSON.parse(user.profile.followPlatforms || '[]')
    } catch {
      followPlatforms = []
    }
    
    try {
      reviewPlatforms = JSON.parse(user.profile.reviewPlatforms || '[]')
    } catch {
      reviewPlatforms = []
    }

    // 只返回需要公开的信息
    return NextResponse.json({
      profile: {
        companyName: user.profile.companyName,
        companySubtitle: user.profile.companySubtitle,
        phone: user.profile.phone,
        address: user.profile.address,
        email: user.profile.email,
        websiteName: user.profile.websiteName,
        websiteUrl: user.profile.websiteUrl,
        
        // 社交媒体
        wechatId: user.profile.wechatId,
        instagram: user.profile.instagram,
        facebook: user.profile.facebook,
        tiktok: user.profile.tiktok,
        xiaohongshu: user.profile.xiaohongshu,
        yelp: user.profile.yelp,
        google: user.profile.google,
        
        // 评价平台链接
        googleReviewUrl: user.profile.googleReviewUrl,
        yelpReviewUrl: user.profile.yelpReviewUrl,
        
        // 配色方案
        primaryColor: user.profile.primaryColor,
        secondaryColor: user.profile.secondaryColor,
        accentColor: user.profile.accentColor,
        
        // 展示模块
        showContact: user.profile.showContact,
        showFollow: user.profile.showFollow,
        showReview: user.profile.showReview,
        
        // 平台显示控制
        followPlatforms: followPlatforms,
        reviewPlatforms: reviewPlatforms,
        
        // ContactInfo配置
        contactInfoName: user.profile.contactInfoName,
        contactInfoPhone: user.profile.contactInfoPhone,
        contactInfoEmail: user.profile.contactInfoEmail,
        contactInfoAddress: user.profile.contactInfoAddress,
        contactInfoWebsite: user.profile.contactInfoWebsite,
        contactInfoOrganization: user.profile.contactInfoOrganization,
      }
    })
  } catch (error) {
    console.error('获取配置失败:', error)
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    )
  }
}

