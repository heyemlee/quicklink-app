import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * 健康检查端点
 * 用于监控系统和负载均衡器检查
 */
export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;

    // 返回健康状态
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'quicklink-app',
        database: 'connected',
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    // 数据库连接失败
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'quicklink-app',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}



