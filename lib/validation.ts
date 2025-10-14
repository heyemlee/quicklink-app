/**
 * 验证工具函数
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 验证密码强度
 * 要求：至少6个字符
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('密码不能为空');
    return { isValid: false, errors };
  }

  if (password.trim().length < 6) {
    errors.push('密码至少需要6个字符');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL格式
 */
export function validateUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证电话号码（支持多种格式）
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // 移除所有空格、括号、连字符
  const cleaned = phone.replace(/[\s()\-]/g, '');
  
  // 检查是否只包含数字和可选的国际区号前缀
  const phoneRegex = /^\+?\d{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * 清理和标准化输入
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

