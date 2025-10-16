import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateSlug } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/validation'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password, inviteCode } = await request.json()

    // 验证邀请码
    const validInviteCode = process.env.REGISTRATION_INVITE_CODE
    if (!inviteCode || inviteCode !== validInviteCode) {
      return NextResponse.json(
        { error: '邀请码无效或已过期' },
        { status: 403 }
      )
    }

    // 验证邮箱
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 422 }
      )
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: '密码不符合要求',
          details: passwordValidation.errors 
        },
        { status: 422 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 422 }
      )
    }

    // ===== 邮箱验证功能已禁用 =====
    // 不再需要验证码，直接创建用户
    
    // 创建新用户
    const hashedPassword = await hashPassword(password)
    const slug = generateSlug(email)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        slug,
        emailVerified: true, // 直接设置为已验证
        profile: {
          create: {
            companyName: 'Company Name',
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
          emailVerified: user.emailVerified,
        },
        needsVerification: false,
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

