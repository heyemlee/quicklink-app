import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateSlug } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // 验证输入
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 422 }
      )
    }

    if (!password || password.trim().length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 422 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 422 }
      )
    }

    // 创建新用户
    const hashedPassword = await hashPassword(password)
    const slug = generateSlug(email)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        slug,
        profile: {
          create: {
            companyName: '我的公司',
            showContact: true,
            showFollow: true,
            showReview: true,
          }
        }
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json(
      { 
        message: '注册成功',
        user: {
          id: user.id,
          email: user.email,
          slug: user.slug,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}

