# 🚀 生产环境部署指南

> 从零到一，将数字名片系统部署到生产环境

## 目录

- [部署准备](#部署准备)
- [数据库部署](#数据库部署)
- [应用部署](#应用部署)
- [域名配置](#域名配置)
- [SSL证书](#ssl证书)
- [环境变量](#环境变量)
- [性能优化](#性能优化)
- [监控运维](#监控运维)

---

## 部署准备

### 检查清单

在部署前确保：

- [ ] 代码已提交到 Git 仓库
- [ ] 本地测试全部通过
- [ ] 环境变量已准备
- [ ] 数据库已选定
- [ ] 部署平台已注册

### 推荐架构

```
┌─────────────────┐
│   Vercel        │  ← 应用托管（免费）
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │  ← PostgreSQL（免费）
│   (Database)    │
└─────────────────┘
         +
┌─────────────────┐
│   Cloudflare    │  ← CDN + 域名（可选）
└─────────────────┘
```

---

## 数据库部署

### 选项 1: Supabase（推荐）

#### 优势

- ✅ 免费 500MB 存储
- ✅ 自动备份
- ✅ 内置管理界面
- ✅ 全球 CDN

#### 部署步骤

**1. 注册账号**

- 访问 [supabase.com](https://supabase.com)
- 使用 GitHub 账号登录

**2. 创建项目**

```
Project Name: review-app
Database Password: [生成强密码]
Region: Northeast Asia (Tokyo) - 最靠近中国
```

**3. 获取连接字符串**

- 进入项目 → Settings → Database
- 复制 Connection String
- 格式: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

**4. 配置连接**

```bash
# 添加到环境变量
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
```

### 选项 2: Railway

#### 优势

- ✅ $5/月起
- ✅ 简单易用
- ✅ 自动备份

#### 部署步骤

**1. 访问 [railway.app](https://railway.app)**

**2. 创建新项目**

- New Project → Provision PostgreSQL

**3. 获取连接字符串**

- 点击 PostgreSQL → Connect
- 复制 Database URL

### 选项 3: Neon

#### 优势

- ✅ 免费无限存储
- ✅ 无服务器架构
- ✅ 自动扩展

#### 部署步骤

**1. 访问 [neon.tech](https://neon.tech)**

**2. 创建项目**

- 选择 Region
- 创建数据库

**3. 获取连接字符串**

- Dashboard → Connection Details
- 复制 Connection string

---

## 应用部署

### 方案 1: Vercel（推荐）

#### 优势

- ✅ 免费额度充足
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 一键部署

#### 部署步骤

**1. 推送代码到 GitHub**

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "准备部署"

# 创建 GitHub 仓库，然后推送
git remote add origin https://github.com/your-username/review-app.git
git branch -M main
git push -u origin main
```

**2. 连接 Vercel**

- 访问 [vercel.com](https://vercel.com)
- 用 GitHub 账号登录
- New Project → Import Git Repository
- 选择你的 review-app 仓库

**3. 配置项目**

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**4. 配置环境变量**

在 Vercel Dashboard → Settings → Environment Variables 添加：

```bash
# 数据库
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret

# OpenAI（可选）
OPENAI_API_KEY=sk-...
```

⚠️ **重要**: 每个环境变量都要选择应用到所有环境（Production, Preview, Development）

**5. 部署**

- 点击 "Deploy"
- 等待 2-3 分钟
- 部署完成！

**6. 运行数据库迁移**

```bash
# 方法 1: 本地连接生产数据库
DATABASE_URL="your-production-url" npx prisma migrate deploy

# 方法 2: 使用 Vercel CLI
vercel env pull .env.production
npm run db:migrate
```

**7. 测试应用**

- 访问 `https://your-project.vercel.app`
- 注册账号测试
- 检查所有功能

#### 自动部署

配置完成后，每次推送到 main 分支会自动部署：

```bash
git add .
git commit -m "更新功能"
git push

# Vercel 自动检测并部署
```

### 方案 2: Netlify

#### 部署步骤

**1. 添加构建配置**

创建 `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**2. 连接 Netlify**

- 访问 [netlify.com](https://netlify.com)
- New site from Git
- 选择仓库
- 配置环境变量
- Deploy

### 方案 3: Docker 部署

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=review_app
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### 部署命令

```bash
# 构建
docker-compose build

# 启动
docker-compose up -d

# 运行迁移
docker-compose exec app npx prisma migrate deploy

# 查看日志
docker-compose logs -f app
```

---

## 域名配置

### 购买域名

推荐域名注册商：

- **Namecheap** - 价格实惠
- **Cloudflare** - 集成方便
- **GoDaddy** - 知名品牌

### 配置 DNS

#### 在 Vercel 使用自定义域名

**1. 添加域名**

- Vercel Dashboard → Settings → Domains
- 输入你的域名：`example.com`

**2. 配置 DNS 记录**

在你的域名注册商添加：

```
类型: A
名称: @
值: 76.76.21.21

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

**3. 等待生效**

- DNS 传播需要 24-48 小时
- 通常 10 分钟就可以访问

**4. 更新环境变量**

```bash
NEXTAUTH_URL=https://yourdomain.com
```

重新部署应用。

---

## SSL证书

### Vercel（自动）

Vercel 自动提供免费 SSL 证书：

- ✅ 自动续期
- ✅ 支持通配符
- ✅ 无需配置

### 手动配置（如果使用其他平台）

#### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 环境变量

### 生产环境变量清单

```bash
# 应用
NODE_ENV=production

# 数据库（必需）
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# NextAuth（必需）
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=[强密码 - 使用 openssl rand -base64 32 生成]

# OpenAI（可选）
OPENAI_API_KEY=sk-...

# 其他
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 安全最佳实践

✅ **必须做：**

- 使用强密码（32+ 字符）
- 每个环境不同的密钥
- 不要在代码中硬编码
- 定期轮换密钥

❌ **不要做：**

- 不要提交 .env 文件
- 不要在前端暴露 API 密钥
- 不要在日志中打印密钥

---

## 性能优化

### 1. 数据库优化

#### 连接池配置

```javascript
// lib/prisma.js
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

#### 查询优化

```javascript
// 只选择需要的字段
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    slug: true,
  },
});
```

### 2. 缓存策略

#### Next.js 缓存

```javascript
// 启用 ISR
export const revalidate = 3600; // 1 小时

// 动态路由
export async function generateStaticParams() {
  const users = await prisma.user.findMany();
  return users.map((user) => ({ slug: user.slug }));
}
```

### 3. CDN 配置

#### Vercel CDN（自动）

Vercel 自动使用全球 CDN，无需额外配置。

#### Cloudflare CDN（可选）

```
1. 添加网站到 Cloudflare
2. 更新 DNS 到 Cloudflare
3. 启用 CDN 缓存
4. 配置缓存规则
```

### 4. 图片优化

```javascript
// 使用 Next.js Image 组件
import Image from "next/image";

<Image src={logoUrl} alt="Logo" width={200} height={200} priority />;
```

---

## 监控运维

### 1. 错误监控

#### Sentry（推荐）

```bash
# 安装
npm install @sentry/nextjs

# 初始化
npx @sentry/wizard@latest -i nextjs

# 配置环境变量
SENTRY_DSN=your-sentry-dsn
```

### 2. 性能监控

#### Vercel Analytics

```bash
# 安装
npm install @vercel/analytics

# 使用
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. 日志管理

#### 查看日志

```bash
# Vercel
vercel logs <deployment-url>

# Docker
docker-compose logs -f app

# 生产环境
pm2 logs
```

### 4. 数据库备份

#### 自动备份（Supabase）

- 每日自动备份
- 保留 7 天
- 可手动恢复

#### 手动备份

```bash
# 导出数据库
pg_dump $DATABASE_URL > backup.sql

# 恢复数据库
psql $DATABASE_URL < backup.sql
```

### 5. 健康检查

创建健康检查端点：

```javascript
// app/api/health/route.js
export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

---

## 常见问题

### Q1: 部署后 API 返回 500 错误

**检查：**

1. 数据库连接字符串是否正确
2. 环境变量是否配置
3. 数据库迁移是否运行
4. 查看错误日志

### Q2: 数据库连接失败

**解决：**

```bash
# 检查连接字符串
echo $DATABASE_URL

# 测试连接
npx prisma db pull

# 检查 SSL 配置
# 生产环境通常需要添加 ?sslmode=require
```

### Q3: NextAuth 认证失败

**检查：**

1. NEXTAUTH_URL 是否匹配实际域名
2. NEXTAUTH_SECRET 是否设置
3. Cookie 设置是否正确

### Q4: 构建失败

**常见原因：**

- 依赖版本冲突
- TypeScript 错误
- 环境变量缺失

**解决：**

```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

### Q5: 性能慢

**优化：**

1. 启用数据库索引
2. 使用 CDN
3. 优化图片
4. 启用缓存
5. 升级数据库套餐

---

## 部署检查清单

### 部署前

- [ ] 本地测试通过
- [ ] 数据库已准备
- [ ] 环境变量已配置
- [ ] 代码已推送到 Git

### 部署中

- [ ] 应用成功部署
- [ ] 数据库迁移已运行
- [ ] 环境变量已验证
- [ ] SSL 证书已启用

### 部署后

- [ ] 访问应用正常
- [ ] 注册登录功能正常
- [ ] 数据库读写正常
- [ ] API 响应正常
- [ ] 移动端适配正常
- [ ] 监控已配置
- [ ] 备份已启用

---

## 成本估算

### 免费方案

| 服务     | 提供商        | 成本      |
| -------- | ------------- | --------- |
| 应用托管 | Vercel        | $0        |
| 数据库   | Supabase      | $0        |
| SSL 证书 | Let's Encrypt | $0        |
| **总计** |               | **$0/月** |

### 付费方案

| 服务     | 提供商       | 成本        |
| -------- | ------------ | ----------- |
| 应用托管 | Vercel Pro   | $20/月      |
| 数据库   | Supabase Pro | $25/月      |
| 域名     | Namecheap    | $12/年      |
| CDN      | Cloudflare   | $0          |
| **总计** |              | **~$46/月** |

---

## 扩展方案

### 小规模（< 1000 用户）

```
Vercel Free + Supabase Free
成本: $0/月
```

### 中等规模（1000-10000 用户）

```
Vercel Pro + Supabase Pro
成本: $45/月
```

### 大规模（> 10000 用户）

```
自建服务器 + 负载均衡 + 数据库集群
成本: $200+/月
```

---

## 技术支持

### 遇到问题？

1. 查看 [项目文档](./PROJECT_DOCUMENTATION.md)
2. 检查错误日志
3. 搜索相关问题
4. 提交 Issue

### 有用资源

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Prisma 部署](https://www.prisma.io/docs/guides/deployment)

---

**祝部署顺利！** 🎉

如有问题，请查看完整文档或提交 Issue。
