import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validatePassword } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';

// 强制动态渲染
export const dynamic = 'force-dynamic'

/**
 * 重置密码
 * POST /api/auth/reset-password
 */
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token 和新密码不能为空' },
        { status: 422 }
      );
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: '密码不符合要求',
          details: passwordValidation.errors 
        },
        { status: 422 }
      );
    }

    // 查找有效的重置记录
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: '无效的重置链接' },
        { status: 404 }
      );
    }

    // 检查是否已使用
    if (resetRecord.used) {
      return NextResponse.json(
        { error: '该重置链接已被使用，请重新申请' },
        { status: 422 }
      );
    }

    // 检查是否过期
    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json(
        { error: '重置链接已过期，请重新申请' },
        { status: 422 }
      );
    }

    // 更新密码
    const hashedPassword = await hashPassword(password);
    
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // 标记重置记录为已使用
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // 删除该用户所有其他未使用的重置请求
    await prisma.passwordReset.deleteMany({
      where: {
        userId: resetRecord.userId,
        used: false,
        id: { not: resetRecord.id },
      },
    });

    return NextResponse.json({
      message: '密码重置成功，请使用新密码登录',
    });

  } catch (error) {
    console.error('重置密码失败:', error);
    return NextResponse.json(
      { error: '重置密码失败，请稍后重试' },
      { status: 500 }
    );
  }
}

/**
 * 验证重置 token 是否有效
 * GET /api/auth/reset-password?token=xxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token 不能为空' },
        { status: 422 }
      );
    }

    // 查找重置记录
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { valid: false, error: '无效的重置链接' },
        { status: 200 }
      );
    }

    if (resetRecord.used) {
      return NextResponse.json(
        { valid: false, error: '该重置链接已被使用' },
        { status: 200 }
      );
    }

    if (new Date() > resetRecord.expiresAt) {
      return NextResponse.json(
        { valid: false, error: '重置链接已过期' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      expiresAt: resetRecord.expiresAt,
    });

  } catch (error) {
    console.error('验证 token 失败:', error);
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    );
  }
}



