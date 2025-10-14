import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail } from '@/lib/validation';
import { sendPasswordResetEmail, generateToken } from '@/lib/email';

/**
 * 请求密码重置
 * POST /api/auth/forgot-password
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

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 安全考虑：即使用户不存在也返回成功消息（防止邮箱枚举攻击）
    if (!user) {
      return NextResponse.json({
        message: '如果该邮箱已注册，您将收到密码重置邮件',
      });
    }

    // 生成重置 token
    const resetToken = generateToken();
    
    // 设置过期时间（1小时）
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // 删除该用户之前未使用的重置请求
    await prisma.passwordReset.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // 创建新的密码重置记录
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // 发送密码重置邮件
    const result = await sendPasswordResetEmail(email, resetToken);

    if (!result.success) {
      console.error('发送密码重置邮件失败:', result.error);
      return NextResponse.json(
        { error: '发送邮件失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '如果该邮箱已注册，您将收到密码重置邮件',
    });

  } catch (error) {
    console.error('密码重置请求失败:', error);
    return NextResponse.json(
      { error: '请求失败，请稍后重试' },
      { status: 500 }
    );
  }
}

