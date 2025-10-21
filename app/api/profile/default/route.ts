import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

// 获取默认用户的 Profile（公开访问，用于主页）
export async function GET() {
  try {
    // 获取第一个用户作为默认用户
    const user = await prisma.user.findFirst({
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'asc'  // 按创建时间排序，取第一个
      }
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: '暂无配置' },
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

    // 返回公开信息
    return NextResponse.json({
      profile: {
        companyName: user.profile.companyName,
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
    console.error('获取默认配置失败:', error)
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    )
  }
}

