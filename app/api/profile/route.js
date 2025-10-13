import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

// 获取当前用户的 Profile
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      include: {
        profile: true
      }
    })

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: '用户配置不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        slug: user.slug,
      },
      profile: user.profile
    })
  } catch (error) {
    console.error('获取配置失败:', error)
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    )
  }
}

// 更新当前用户的 Profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // 更新 Profile
    const profile = await prisma.profile.update({
      where: {
        userId: session.user.id
      },
      data: {
        // 基本信息
        companyName: data.companyName,
        logoUrl: data.logoUrl,
        phone: data.phone,
        address: data.address,
        email: data.email,
        
        // 社交媒体
        wechatId: data.wechatId,
        instagram: data.instagram,
        facebook: data.facebook,
        tiktok: data.tiktok,
        xiaohongshu: data.xiaohongshu,
        yelp: data.yelp,
        google: data.google,
        
        // 评价平台链接
        googleReviewUrl: data.googleReviewUrl,
        yelpReviewUrl: data.yelpReviewUrl,
        facebookReviewUrl: data.facebookReviewUrl,
        
        // 配色方案
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        
        // 展示模块
        showContact: data.showContact,
        showFollow: data.showFollow,
        showReview: data.showReview,
      }
    })

    return NextResponse.json({
      message: '更新成功',
      profile
    })
  } catch (error) {
    console.error('更新配置失败:', error)
    return NextResponse.json(
      { error: '更新配置失败' },
      { status: 500 }
    )
  }
}

