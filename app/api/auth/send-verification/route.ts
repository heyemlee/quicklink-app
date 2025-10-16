import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail } from '@/lib/validation';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email';

// 强制动态渲染
export const dynamic = 'force-dynamic'

/**
 * 发送邮箱验证码
 * POST /api/auth/send-verification
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 422 }
      );
    }

    // 检查邮箱是否已被注册（但未验证）
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: '该邮箱已被注册并验证' },
        { status: 422 }
      );
    }

    // 生成6位数字验证码
    const code = generateVerificationCode();
    
    // 设置过期时间（10分钟）
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let userId: string;

    if (existingUser) {
      // 用户存在但未验证，允许重新发送验证码
      userId = existingUser.id;
      
      // 删除该用户之前的验证码
      await prisma.verificationToken.deleteMany({
        where: {
          userId: existingUser.id,
          type: 'email_verification',
        },
      });
    } else {
      // 新用户 - 创建一个临时用户记录（没有密码）
      const newUser = await prisma.user.create({
        data: {
          email,
          password: '', // 临时密码，注册时会更新
          slug: `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`, // 临时slug
          emailVerified: false,
        },
      });
      userId = newUser.id;
    }

    // 创建验证码
    await prisma.verificationToken.create({
      data: {
        userId,
        token: code,
        type: 'email_verification',
        expiresAt,
      },
    });

    // 发送验证邮件
    const result = await sendVerificationEmail(email, code);

    if (!result.success) {
      return NextResponse.json(
        { error: '发送验证邮件失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '验证码已发送到您的邮箱',
      expiresIn: 600, // 10分钟（秒）
    });

  } catch (error) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { error: '发送验证码失败，请稍后重试' },
      { status: 500 }
    );
  }
}

