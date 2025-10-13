import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 根据 slug 获取用户的 Profile（公开访问）
export async function GET(request, { params }) {
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

    // 只返回需要公开的信息
    return NextResponse.json({
      profile: {
        companyName: user.profile.companyName,
        logoUrl: user.profile.logoUrl,
        phone: user.profile.phone,
        address: user.profile.address,
        email: user.profile.email,
        
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
        facebookReviewUrl: user.profile.facebookReviewUrl,
        
        // 配色方案
        primaryColor: user.profile.primaryColor,
        secondaryColor: user.profile.secondaryColor,
        accentColor: user.profile.accentColor,
        
        // 展示模块
        showContact: user.profile.showContact,
        showFollow: user.profile.showFollow,
        showReview: user.profile.showReview,
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

