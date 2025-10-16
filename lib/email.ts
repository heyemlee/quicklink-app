import { Resend } from 'resend';

// 初始化 Resend 客户端
const resend = new Resend(process.env.RESEND_API_KEY);

// 发件人邮箱（需要在 Resend 中验证的域名）
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

/**
 * 生成6位数字验证码
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 生成随机 token
 */
export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * 发送邮箱验证码
 */
export async function sendVerificationEmail(
  to: string,
  code: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '验证您的邮箱地址 - QuickLink',
      html: getVerificationEmailTemplate(code, userName),
    });

    if (error) {
      console.error('发送验证邮件失败:', error);
      return { success: false, error: error.message };
    }

    console.log('验证邮件已发送:', data);
    return { success: true };
  } catch (error) {
    console.error('发送验证邮件异常:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '发送失败' 
    };
  }
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  userName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '重置您的密码 - QuickLink',
      html: getPasswordResetEmailTemplate(resetUrl, userName),
    });

    if (error) {
      console.error('发送密码重置邮件失败:', error);
      return { success: false, error: error.message };
    }

    console.log('密码重置邮件已发送:', data);
    return { success: true };
  } catch (error) {
    console.error('发送密码重置邮件异常:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '发送失败' 
    };
  }
}

/**
 * 邮箱验证码邮件模板
 */
function getVerificationEmailTemplate(code: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .code-box {
      background: linear-gradient(135deg, #f3e7ff 0%, #fce7f3 100%);
      border: 2px dashed #7c3aed;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #7c3aed;
      font-family: 'Courier New', monospace;
    }
    .code-label {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
    .message {
      font-size: 15px;
      color: #666;
      line-height: 1.8;
      margin: 20px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #856404;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ QuickLink</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        ${userName ? `您好，${userName}！` : '您好！'}
      </div>
      
      <p class="message">
        感谢您注册 QuickLink！请使用以下验证码完成邮箱验证：
      </p>
      
      <div class="code-box">
        <div class="code">${code}</div>
        <div class="code-label">验证码有效期：10分钟</div>
      </div>
      
      <p class="message">
        请在注册页面输入此验证码以完成邮箱验证。
      </p>
      
      <div class="warning">
        ⚠️ <strong>安全提示：</strong>请勿将此验证码分享给任何人。QuickLink 的工作人员永远不会要求您提供验证码。
      </div>
      
      <p class="message">
        如果您没有请求此验证码，请忽略此邮件。
      </p>
    </div>
    
    <div class="footer">
      <p>此邮件由 QuickLink 系统自动发送，请勿回复。</p>
      <p>
        访问我们的 <a href="${process.env.NEXTAUTH_URL}">网站</a> 了解更多信息
      </p>
      <p style="margin-top: 20px; color: #adb5bd; font-size: 12px;">
        © ${new Date().getFullYear()} QuickLink. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 密码重置邮件模板
 */
function getPasswordResetEmailTemplate(resetUrl: string, userName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .message {
      font-size: 15px;
      color: #666;
      line-height: 1.8;
      margin: 20px 0;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
      transition: transform 0.2s;
    }
    .reset-button:hover {
      transform: translateY(-2px);
    }
    .alternative-link {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 13px;
      color: #666;
      word-break: break-all;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #856404;
    }
    .info-box {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      color: #0c5460;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 13px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 重置密码</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        ${userName ? `您好，${userName}！` : '您好！'}
      </div>
      
      <p class="message">
        我们收到了您重置 QuickLink 账户密码的请求。点击下方按钮即可设置新密码：
      </p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="reset-button">
          重置密码
        </a>
      </div>
      
      <div class="info-box">
        ℹ️ <strong>提示：</strong>此链接有效期为 1 小时，且仅可使用一次。
      </div>
      
      <div class="alternative-link">
        <strong>如果按钮无法点击，请复制以下链接到浏览器：</strong><br>
        <a href="${resetUrl}" style="color: #7c3aed;">${resetUrl}</a>
      </div>
      
      <div class="warning">
        ⚠️ <strong>安全提示：</strong>如果您没有请求重置密码，请立即忽略此邮件并确保您的账户安全。建议您定期更改密码并启用两步验证。
      </div>
      
      <p class="message">
        如有任何问题，请联系我们的客服团队。
      </p>
    </div>
    
    <div class="footer">
      <p>此邮件由 QuickLink 系统自动发送，请勿回复。</p>
      <p>
        访问我们的 <a href="${process.env.NEXTAUTH_URL}">网站</a> 了解更多信息
      </p>
      <p style="margin-top: 20px; color: #adb5bd; font-size: 12px;">
        © ${new Date().getFullYear()} QuickLink. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}



