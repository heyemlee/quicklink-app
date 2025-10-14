/**
 * 环境变量验证
 * 在应用启动时验证所有必需的环境变量
 */

interface EnvConfig {
  DATABASE_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  REGISTRATION_INVITE_CODE: string;
  OPENAI_API_KEY?: string;
  NODE_ENV: string;
}

/**
 * 验证环境变量
 * @throws Error 如果缺少必需的环境变量
 */
export function validateEnv(): EnvConfig {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'REGISTRATION_INVITE_CODE',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `缺少必需的环境变量: ${missing.join(', ')}\n` +
      '请检查 .env 文件是否正确配置，参考 .env.example 文件'
    );
  }

  // 验证环境变量格式
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.warn('⚠️  DATABASE_URL 应该是 PostgreSQL 连接字符串');
  }

  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn('⚠️  NEXTAUTH_SECRET 长度应该至少 32 个字符，建议使用: openssl rand -base64 32');
  }

  if (process.env.REGISTRATION_INVITE_CODE && process.env.REGISTRATION_INVITE_CODE.length < 8) {
    console.warn('⚠️  REGISTRATION_INVITE_CODE 长度应该至少 8 个字符');
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    REGISTRATION_INVITE_CODE: process.env.REGISTRATION_INVITE_CODE!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

/**
 * 安全地获取环境变量
 */
export const env = validateEnv();

