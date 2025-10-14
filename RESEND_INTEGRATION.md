# 📧 Resend 邮件服务集成指南

## 🎉 已完成的功能

本项目已完成集成 Resend 邮件服务，实现了以下功能：

### ✅ 1. **邮箱验证码功能**

- 注册时发送 6 位数字验证码
- 验证码有效期：10 分钟
- 精美的 HTML 邮件模板
- 防止重复注册

### ✅ 2. **忘记密码功能**

- 发送密码重置链接
- 重置链接有效期：1 小时
- 一次性使用（安全）
- 精美的 HTML 邮件模板

---

## 🚀 快速开始

### 步骤 1: 注册 Resend 账号

1. 访问 [https://resend.com](https://resend.com)
2. 点击 "Sign Up" 注册账号
3. 验证邮箱

### 步骤 2: 获取 API Key

1. 登录 Resend 控制台
2. 进入 "API Keys" 页面
3. 点击 "Create API Key"
4. 命名（如：`quicklink-production`）
5. 选择权限：**Full Access**（生产环境）或 **Sending Access**（推荐）
6. 复制生成的 API Key（以 `re_` 开头）

### 步骤 3: 配置环境变量

在 `.env` 文件中添加：

```bash
# Resend API Key（必需）
RESEND_API_KEY="re_your_actual_api_key_here"

# 发件人邮箱（必需）
# 开发环境：使用 Resend 提供的测试邮箱
EMAIL_FROM="onboarding@resend.dev"

# 生产环境：使用您自己验证的域名
# EMAIL_FROM="noreply@yourdomain.com"

# 应用 URL（必需 - 用于生成密码重置链接）
NEXTAUTH_URL="http://localhost:3000"
```

### 步骤 4: 更新数据库

运行数据库迁移以创建新的验证表：

```bash
# 推送数据库变更
npm run db:push

# 或使用迁移
npx prisma migrate dev --name add_verification_tables
```

### 步骤 5: 测试功能

```bash
# 启动开发服务器
npm run dev

# 访问测试页面
# - 忘记密码: http://localhost:3000/forgot-password
# - 重置密码: http://localhost:3000/reset-password
```

---

## 📋 数据库变更

新增了以下数据库模型：

### 1. `VerificationToken` 表

用于存储邮箱验证码

```prisma
model VerificationToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  type      String   // 'email_verification'
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### 2. `PasswordReset` 表

用于存储密码重置请求

```prisma
model PasswordReset {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### 3. `User` 表更新

添加了邮箱验证状态字段

```prisma
model User {
  // ... 其他字段
  emailVerified Boolean @default(false)  // 新增
}
```

---

## 🔧 API 端点

### 1. 发送邮箱验证码

**POST** `/api/auth/send-verification`

```typescript
// 请求
{
  "email": "user@example.com"
}

// 响应
{
  "message": "验证码已发送到您的邮箱",
  "expiresIn": 600
}
```

### 2. 验证邮箱

**POST** `/api/auth/verify-email`

```typescript
// 请求
{
  "email": "user@example.com",
  "code": "123456"
}

// 响应
{
  "message": "邮箱验证成功",
  "userId": "..."
}
```

### 3. 请求密码重置

**POST** `/api/auth/forgot-password`

```typescript
// 请求
{
  "email": "user@example.com"
}

// 响应
{
  "message": "如果该邮箱已注册，您将收到密码重置邮件"
}
```

### 4. 重置密码

**POST** `/api/auth/reset-password`

```typescript
// 请求
{
  "token": "reset_token_from_email",
  "password": "NewPassword123"
}

// 响应
{
  "message": "密码重置成功，请使用新密码登录"
}
```

### 5. 验证重置 Token

**GET** `/api/auth/reset-password?token=xxx`

```typescript
// 响应
{
  "valid": true,
  "expiresAt": "2024-10-14T12:00:00.000Z"
}
```

---

## 🎨 邮件模板

### 邮箱验证邮件预览

```
┌─────────────────────────────────────┐
│     ✉️ QuickLink                    │
├─────────────────────────────────────┤
│                                      │
│  您好！                              │
│                                      │
│  感谢您注册 QuickLink！              │
│  请使用以下验证码完成邮箱验证：       │
│                                      │
│  ┌────────────────────────┐         │
│  │      123456            │         │
│  │  验证码有效期：10分钟    │         │
│  └────────────────────────┘         │
│                                      │
│  ⚠️ 请勿将此验证码分享给任何人        │
│                                      │
└─────────────────────────────────────┘
```

### 密码重置邮件预览

```
┌─────────────────────────────────────┐
│     🔒 重置密码                      │
├─────────────────────────────────────┤
│                                      │
│  您好！                              │
│                                      │
│  我们收到了您重置密码的请求           │
│                                      │
│  ┌────────────────────────┐         │
│  │   [重置密码]           │ ← 按钮   │
│  └────────────────────────┘         │
│                                      │
│  ℹ️ 此链接有效期为 1 小时             │
│                                      │
│  如果按钮无法点击，复制以下链接：     │
│  https://yourdomain.com/reset...    │
│                                      │
└─────────────────────────────────────┘
```

---

## 🔐 生产环境配置

### 1. 配置自定义域名（推荐）

#### 为什么需要自定义域名？

- ✅ 更专业的发件人地址
- ✅ 提高邮件送达率
- ✅ 避免被标记为垃圾邮件
- ✅ 建立品牌信任度

#### 配置步骤：

**A. 在 Resend 中添加域名**

1. 登录 Resend 控制台
2. 进入 "Domains" 页面
3. 点击 "Add Domain"
4. 输入您的域名（如：`yourdomain.com`）

**B. 配置 DNS 记录**

Resend 会提供需要添加的 DNS 记录：

```
类型: MX
主机: @
值: feedback-smtp.us-east-1.amazonses.com
优先级: 10

类型: TXT
主机: _amazonses
值: [Resend 提供的验证字符串]

类型: TXT
主机: @
值: v=spf1 include:amazonses.com ~all

类型: CNAME
主机: resend._domainkey
值: [Resend 提供的 DKIM 值]
```

**C. 验证域名**

1. 添加 DNS 记录后等待 10-30 分钟
2. 在 Resend 控制台点击 "Verify"
3. 验证成功后即可使用

**D. 更新环境变量**

```bash
# 生产环境 .env
EMAIL_FROM="noreply@yourdomain.com"
# 或
EMAIL_FROM="hello@yourdomain.com"
# 或
EMAIL_FROM="support@yourdomain.com"
```

### 2. 测试邮件送达

```bash
# 在生产环境测试
curl -X POST https://yourdomain.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@gmail.com"}'
```

### 3. 监控邮件发送

在 Resend 控制台：

- **Logs** - 查看所有发送记录
- **Analytics** - 查看发送统计
- **Webhooks** - 配置送达/退信通知

---

## 📊 使用限制和定价

### 免费计划

- ✅ 每月 3,000 封邮件
- ✅ 适合小型项目和开发测试
- ✅ 可以使用 `onboarding@resend.dev`

### 付费计划

| 计划           | 价格    | 邮件量        | 适用场景   |
| -------------- | ------- | ------------- | ---------- |
| **Starter**    | $20/月  | 50,000 封/月  | 中小型应用 |
| **Pro**        | $150/月 | 500,000 封/月 | 成长型企业 |
| **Enterprise** | 定制    | 不限          | 大型企业   |

💡 **建议**：开发和测试使用免费计划，生产环境至少使用 Starter 计划

---

## 🛡️ 安全最佳实践

### 1. API Key 安全

```bash
# ❌ 错误 - 不要这样做
RESEND_API_KEY="re_abc123"  # 提交到 Git

# ✅ 正确 - 使用环境变量
# .env 文件（在 .gitignore 中）
RESEND_API_KEY="re_your_actual_key"

# .env.example 文件（可以提交）
RESEND_API_KEY="re_..."
```

### 2. 防止邮件滥用

已实现的保护措施：

- ✅ 验证码 10 分钟过期
- ✅ 重置链接 1 小时过期
- ✅ 一次性使用 token
- ✅ 防止邮箱枚举攻击

建议添加（未来）：

- ⏰ 速率限制（如：每小时最多 3 次重置请求）
- 🔒 reCAPTCHA 验证
- 📝 审计日志

### 3. 邮件内容安全

已实现：

- ✅ 使用 HTTPS 链接
- ✅ 清晰的安全提示
- ✅ 不包含敏感信息
- ✅ 专业的邮件格式

---

## 🧪 测试指南

### 本地测试

```bash
# 1. 启动开发服务器
npm run dev

# 2. 测试忘记密码
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 3. 检查邮箱收到的邮件
```

### 测试邮箱建议

开发环境测试邮箱：

- Gmail（推荐）
- Outlook
- 临时邮箱服务（如 [temp-mail.org](https://temp-mail.org)）

---

## 🐛 故障排除

### 问题 1: 邮件没有收到

**检查清单：**

- [ ] `RESEND_API_KEY` 是否正确配置
- [ ] `EMAIL_FROM` 格式是否正确
- [ ] 检查垃圾邮件文件夹
- [ ] 查看 Resend 控制台的 Logs
- [ ] 确认域名已验证（生产环境）

**解决方案：**

```bash
# 测试 API Key
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your@email.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### 问题 2: 域名验证失败

**常见原因：**

- DNS 记录未生效（需要等待 10-30 分钟）
- DNS 记录配置错误
- 域名注册商不支持某些记录类型

**检查 DNS：**

```bash
# 检查 MX 记录
dig MX yourdomain.com

# 检查 TXT 记录
dig TXT yourdomain.com

# 检查 DKIM
dig TXT resend._domainkey.yourdomain.com
```

### 问题 3: 验证码过期

**原因：**

- 验证码有效期只有 10 分钟
- 系统时间不同步

**解决方案：**

```typescript
// 调整过期时间（在 lib/email.ts 中）
const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 改为 30 分钟
```

---

## 📚 相关文档

- [Resend 官方文档](https://resend.com/docs)
- [Resend API 参考](https://resend.com/docs/api-reference/introduction)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Prisma 文档](https://www.prisma.io/docs)

---

## ✅ 集成清单

部署前检查：

- [ ] Resend API Key 已配置
- [ ] 发件人邮箱已配置
- [ ] 数据库已更新（运行 `npm run db:push`）
- [ ] 环境变量已添加到生产环境
- [ ] （生产环境）域名已验证
- [ ] 测试邮件发送成功
- [ ] 测试忘记密码流程
- [ ] 测试邮箱验证流程

---

## 🎯 下一步

建议的后续优化：

1. **添加速率限制**

   - 使用 `@upstash/ratelimit`
   - 限制每个 IP 的请求频率

2. **添加邮件队列**

   - 使用 Bull Queue 或 BullMQ
   - 异步处理邮件发送

3. **添加邮件模板管理**

   - 支持多语言
   - 可视化编辑器

4. **添加邮件送达追踪**
   - Webhook 集成
   - 送达率统计

---

**🎉 恭喜！Resend 邮件服务已成功集成！**

如有问题，请参考：

- [项目 README](./README.md)
- [部署清单](./DEPLOYMENT_CHECKLIST.md)
- [Resend 支持](https://resend.com/support)
