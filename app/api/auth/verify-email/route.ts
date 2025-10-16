import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * 验证邮箱验证码
 * POST /api/auth/verify-email
 */
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: '邮箱和验证码不能为空' },
        { status: 422 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationTokens: {
          where: {
            type: 'email_verification',
            expiresAt: {
              gt: new Date(), // 未过期
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: '该邮箱已验证' },
        { status: 422 }
      );
    }

    // 检查验证码
    const verificationToken = user.verificationTokens[0];

    if (!verificationToken) {
      return NextResponse.json(
        { error: '验证码已过期或不存在，请重新获取' },
        { status: 422 }
      );
    }

    if (verificationToken.token !== code) {
      return NextResponse.json(
        { error: '验证码错误' },
        { status: 422 }
      );
    }

    // 验证成功 - 更新用户状态
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // 删除已使用的验证码
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({
      message: '邮箱验证成功',
      userId: user.id,
    });

  } catch (error) {
    console.error('验证邮箱失败:', error);
    return NextResponse.json(
      { error: '验证失败，请稍后重试' },
      { status: 500 }
    );
  }
}



