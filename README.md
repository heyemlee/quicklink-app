# 🤞🏾 QuickLink

> A smart link platform for businesses, allowing users to quickly save contact info, jump to multiple platforms, and generate high-quality reviews with AI, making communication and promotion effortless.

---

## 📑 目录

- [✨ 功能特性](#-功能特性)
- [🚀 快速开始](#-快速开始)
- [🛠️ 技术栈](#️-技术栈)
- [📦 项目结构](#-项目结构)
- [⚙️ 环境配置](#️-环境配置)
- [🗄️ 数据库设置](#️-数据库设置)
- [🎨 开发指南](#-开发指南)
- [📱 部署指南](#-部署指南)
- [🔧 API 文档](#-api-文档)
- [📄 License](#-license)

---

## ✨ 功能特性

### 核心功能

- ✅ **数字名片** - 个性化的数字名片展示
- ✅ **多平台集成** - 支持微信、Instagram、Facebook、TikTok等
- ✅ **评价生成** - AI驱动的评价内容生成
- ✅ **联系人保存** - 一键保存到手机通讯录
- ✅ **后台管理** - 完整的配置管理界面

### 技术亮点

- 🎯 **TypeScript** - 100% TypeScript，完整类型安全
- ⚡ **性能优化** - Next.js 14 App Router，服务端渲染
- 🎨 **现代UI** - Tailwind CSS，流畅动画效果
- 🔐 **安全认证** - NextAuth.js 会话管理
- 💾 **数据库ORM** - Prisma，类型安全的数据库访问
- 📱 **PWA就绪** - 支持离线模式和触觉反馈

---

## 🚀 快速开始

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/yourusername/quicklink-app.git
cd quicklink-app
```

#### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

#### 3. 配置环境变量

创建 `.env` 文件：

```bash
# 复制示例文件
cp .env.example .env
```

编辑 `.env` 文件，填入必需配置：

```bash
# 数据库连接（必需）
DATABASE_URL="postgresql://user:password@localhost:5432/quicklink_app"

# NextAuth 配置（必需）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# OpenAI API（可选 - 用于AI评价生成）
OPENAI_API_KEY="sk-..."
```

**生成 NEXTAUTH_SECRET：**

```bash
# 方法1：使用 OpenSSL
openssl rand -base64 32

# 方法2：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库架构
npm run db:push

# （可选）填充示例数据
npm run db:seed
```

#### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用！

---

## 🛠️ 技术栈

### 前端

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image

### 后端

- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js 4.x
- **Database ORM**: Prisma 6.x
- **Password Hashing**: bcryptjs

### 数据库

- **Database**: PostgreSQL 14+
- **Hosting**: Supabase / Railway / Neon

### 开发工具

- **Linter**: ESLint
- **Type Checking**: TypeScript Compiler
- **Version Control**: Git

---

## 📦 项目结构

```
quicklink-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 认证相关
│   │   │   ├── [...nextauth]/   # NextAuth 路由
│   │   │   └── register/        # 注册接口
│   │   ├── profile/             # 用户配置接口
│   │   └── generate_review/     # 评价生成接口
│   ├── card/[slug]/             # 动态名片页面
│   ├── components/              # React 组件
│   │   ├── Header.tsx
│   │   ├── FollowSection.tsx
│   │   ├── ReviewSection.tsx
│   │   ├── ReviewModal.tsx
│   │   ├── SaveContactButton.tsx
│   │   └── Toast.tsx
│   ├── config/                  # 配置文件
│   │   └── platformsConfig.ts   # 平台配置
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useAppOpener.ts
│   │   ├── useHapticFeedback.ts
│   │   ├── useNetworkStatus.ts
│   │   └── useReviewGenerator.ts
│   ├── utils/                   # 工具函数
│   │   ├── clipboard.ts
│   │   └── vcard.ts
│   ├── providers/               # Context Providers
│   │   └── SessionProvider.tsx
│   ├── dashboard/               # 后台管理
│   │   └── page.tsx
│   ├── login/                   # 登录页面
│   │   └── page.tsx
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   └── globals.css              # 全局样式
├── lib/                         # 核心库
│   ├── prisma.ts               # Prisma Client
│   ├── auth.ts                 # 认证工具
│   └── auth-options.ts         # NextAuth 配置
├── prisma/                      # 数据库
│   ├── schema.prisma           # 数据模型
│   └── seed.js                 # 种子数据
├── types/                       # TypeScript 类型
│   ├── index.ts                # 全局类型
│   └── next-auth.d.ts          # NextAuth 类型扩展
├── public/                      # 静态资源
│   └── icons/                  # 图标文件
├── .env                        # 环境变量（不提交）
├── .env.example                # 环境变量示例
├── tsconfig.json               # TypeScript 配置
├── next.config.mjs             # Next.js 配置
├── tailwind.config.js          # Tailwind 配置
└── package.json                # 项目依赖
```

---

## ⚙️ 环境配置

### 必需环境变量

#### 1. DATABASE_URL

PostgreSQL 数据库连接字符串。

**本地开发：**

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/quicklink_app"
```

**云数据库（Supabase）：**

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

#### 2. NEXTAUTH_URL

应用的完整URL地址。

```bash
# 开发环境
NEXTAUTH_URL="http://localhost:3000"

# 生产环境
NEXTAUTH_URL="https://yourdomain.com"
```

#### 3. NEXTAUTH_SECRET

用于加密会话的密钥，**必须保密且足够随机**。

```bash
NEXTAUTH_SECRET="生成的32位以上随机字符串"
```

### 可选环境变量

#### OpenAI API（AI评价生成）

```bash
OPENAI_API_KEY="sk-proj-..."
```

如果不配置，系统会使用内置的模拟评价。

---

## 🗄️ 数据库设置

### 数据模型

项目使用 Prisma ORM 管理数据库，包含以下模型：

- **User** - 用户账户
- **Profile** - 用户配置（名片信息）

### 数据库初始化

#### 方案 A: 本地 PostgreSQL

**1. 安装 PostgreSQL**

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql-14
sudo systemctl start postgresql

# Windows
# 下载并安装：https://www.postgresql.org/download/windows/
```

**2. 创建数据库**

```bash
# 连接到 PostgreSQL
psql postgres

# 创建数据库
CREATE DATABASE quicklink_app;

# 创建用户（可选）
CREATE USER review_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quicklink_app TO quicklink_user;

# 退出
\q
```

**3. 配置环境变量**

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/quicklink_app"
```

**4. 推送数据库架构**

```bash
npm run db:push
```

#### 方案 B: Supabase（推荐生产环境）

**1. 创建项目**

- 访问 [supabase.com](https://supabase.com)
- 点击 "New Project"
- 填写项目信息：
  - Name: `review-app`
  - Database Password: `设置强密码`
  - Region: `Northeast Asia (Tokyo)` - 最近的亚洲节点

**2. 获取连接字符串**

- 进入项目面板
- Settings → Database
- 复制 Connection String (URI格式)
- 替换 `[YOUR-PASSWORD]` 为实际密码

```bash
DATABASE_URL="postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres"
```

**3. 同步数据库**

```bash
npm run db:push
```

#### 方案 C: Railway

**1. 创建项目**

- 访问 [railway.app](https://railway.app)
- New Project → Provision PostgreSQL

**2. 获取连接信息**

- 点击 PostgreSQL 服务
- Connect → 复制 Database URL

**3. 配置并同步**

```bash
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
npm run db:push
```

### 数据库命令

```bash
# 生成 Prisma Client（类型定义）
npm run db:generate

# 推送架构到数据库
npm run db:push

# 运行迁移
npm run db:migrate

# 重置数据库
npm run db:reset

# 打开 Prisma Studio（可视化管理）
npm run db:studio

# 填充示例数据
npm run db:seed
```

---

## 🎨 开发指南

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 类型检查
npx tsc --noEmit

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 添加新功能

#### 1. 创建新的 API 路由

```typescript
// app/api/example/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Hello" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body });
}
```

#### 2. 添加新的数据模型

编辑 `prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

运行迁移：

```bash
npm run db:migrate
```

#### 3. 创建自定义 Hook

```typescript
// app/hooks/useCustomHook.ts
import { useState, useEffect } from "react";

export const useCustomHook = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    // 逻辑代码
  }, []);

  return { data };
};
```

### 代码规范

- 使用 TypeScript 编写所有代码
- 为组件定义 Props 接口
- 使用 async/await 处理异步操作
- 使用 Tailwind CSS 类名进行样式设计
- 遵循 ESLint 规则

---

## 📱 部署指南

### 🎯 方案 1: Vercel（推荐）

#### 优势

- ✅ 零配置部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 免费额度充足
- ✅ 与 Next.js 完美集成

#### 部署步骤

**步骤 1: 准备代码**

```bash
# 确保代码已提交
git add .
git commit -m "Ready for deployment"

# 推送到 GitHub
git push origin main
```

**步骤 2: 连接 Vercel**

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. Import 你的 quicklink-app 仓库
5. 配置项目设置（通常自动检测）：
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

**步骤 3: 配置环境变量**

在 Vercel Dashboard → Settings → Environment Variables 添加：

```bash
# 数据库（必需）
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# 认证（必需）
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key

# AI服务（可选）
OPENAI_API_KEY=sk-...
```

⚠️ **重要**:

- 选择应用到所有环境 (Production, Preview, Development)
- 使用 Supabase/Railway 等云数据库的连接字符串
- NEXTAUTH_SECRET 必须是强随机字符串

**步骤 4: 部署**

1. 点击 "Deploy" 按钮
2. 等待 2-3 分钟构建
3. 部署完成！

**步骤 5: 运行数据库迁移**

```bash
# 方法1：本地连接生产数据库
DATABASE_URL="your-production-database-url" npx prisma migrate deploy

# 方法2：使用 Vercel CLI
npm install -g vercel
vercel login
vercel env pull .env.production
npm run db:migrate
```

**步骤 6: 测试应用**

访问 `https://your-project.vercel.app` 测试：

- ✅ 注册新账号
- ✅ 登录功能
- ✅ 创建名片
- ✅ 分享名片链接

#### 自动部署

配置完成后，每次推送到 `main` 分支会自动触发部署：

```bash
git add .
git commit -m "Update feature"
git push

# Vercel 自动检测并部署
```

#### 自定义域名

**1. 添加域名**

- Vercel Dashboard → Settings → Domains
- 输入域名：`yourdomain.com`

**2. 配置 DNS**

在域名注册商添加记录：

```
类型: A
名称: @
值: 76.76.21.21

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

**3. 等待 DNS 传播**（10分钟 - 48小时）

**4. 更新环境变量**

```bash
NEXTAUTH_URL=https://yourdomain.com
```

重新部署应用。

---

### 🐳 方案 2: Docker 部署

#### Dockerfile

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

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
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=quicklink_app
      - POSTGRES_USER=postgres
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
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

---

### 🚀 方案 3: 传统服务器（VPS）

#### 系统要求

- Ubuntu 20.04+ / Debian 11+
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2

#### 部署步骤

**1. 服务器准备**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt install nginx -y
```

**2. 配置数据库**

```bash
# 切换到 postgres 用户
sudo -i -u postgres

# 创建数据库和用户
psql
CREATE DATABASE quicklink_app;
CREATE USER review_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE quicklink_app TO quicklink_user;
\q
exit
```

**3. 部署应用**

```bash
# 克隆代码
git clone https://github.com/yourusername/quicklink-app.git
cd quicklink-app

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env

# 构建应用
npm run build

# 运行数据库迁移
npm run db:migrate
```

**4. 使用 PM2 启动**

```bash
# 启动应用
pm2 start npm --name "review-app" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs review-app
```

**5. 配置 Nginx**

创建 `/etc/nginx/sites-available/review-app`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/review-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**6. 配置 SSL（Let's Encrypt）**

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 测试自动续期
sudo certbot renew --dry-run
```

**7. 更新应用**

```bash
cd /path/to/quicklink-app
git pull
npm install
npm run build
npm run db:migrate
pm2 restart review-app
```

---

### 📊 部署对比

| 特性     | Vercel     | Docker    | VPS         |
| -------- | ---------- | --------- | ----------- |
| 难度     | ⭐ 简单    | ⭐⭐ 中等 | ⭐⭐⭐ 复杂 |
| 成本     | $0-20/月   | $5-50/月  | $5-100/月   |
| 自动扩展 | ✅         | ❌        | ❌          |
| CDN      | ✅ 内置    | ❌ 需配置 | ❌ 需配置   |
| SSL      | ✅ 自动    | ❌ 手动   | ❌ 手动     |
| 推荐场景 | 小中型项目 | 开发/测试 | 大型项目    |

---

### 🌍 数据库选择

| 服务            | 免费额度   | 付费起价 | 推荐场景        |
| --------------- | ---------- | -------- | --------------- |
| **Supabase**    | 500MB      | $25/月   | ⭐⭐⭐ 推荐     |
| **Railway**     | $5免费额度 | $5/月    | ⭐⭐ 简单项目   |
| **Neon**        | 无限存储   | $0       | ⭐⭐ Serverless |
| **PlanetScale** | 5GB        | $29/月   | ⭐⭐⭐ 大型项目 |

---

## 🔧 API 文档

### 认证接口

#### POST /api/auth/register

注册新用户

**请求：**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**

```json
{
  "message": "注册成功",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "slug": "user-abc123"
  }
}
```

#### POST /api/auth/[...nextauth]

NextAuth.js 认证端点（登录、登出等）

### 用户配置接口

#### GET /api/profile

获取当前用户配置（需要认证）

**响应：**

```json
{
  "user": {
    "id": "...",
    "email": "...",
    "slug": "..."
  },
  "profile": {
    "companyName": "我的公司",
    "phone": "...",
    ...
  }
}
```

#### PUT /api/profile

更新用户配置（需要认证）

**请求：**

```json
{
  "companyName": "新公司名",
  "phone": "123-456-7890",
  "primaryColor": "#7c3aed",
  ...
}
```

#### GET /api/profile/[slug]

获取公开名片信息（无需认证）

**URL:** `/api/profile/user-abc123`

**响应：**

```json
{
  "profile": {
    "companyName": "...",
    "phone": "...",
    "address": "...",
    "followPlatforms": [...],
    "reviewPlatforms": [...]
  }
}
```

### 评价生成接口

#### POST /api/generate_review

生成评价内容

**请求：**

```json
{
  "platform": "xiaohongshu"
}
```

**响应：**

```json
{
  "review": "Amazing experience! ..."
}
```

---

## 🐛 故障排除

### 常见问题

#### Q1: 数据库连接失败

**错误信息：**

```
Error: P1001: Can't reach database server
```

**解决方案：**

1. 检查数据库是否运行

   ```bash
   # PostgreSQL
   sudo systemctl status postgresql
   ```

2. 验证连接字符串

   ```bash
   echo $DATABASE_URL
   ```

3. 测试连接

   ```bash
   npx prisma db pull
   ```

4. 检查防火墙/安全组设置

#### Q2: NextAuth 错误

**错误信息：**

```
[next-auth][error][NO_SECRET]
```

**解决方案：**

确保设置了 `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

将生成的密钥添加到 `.env`:

```bash
NEXTAUTH_SECRET="生成的密钥"
```

#### Q3: TypeScript 编译错误

**解决方案：**

```bash
# 清除缓存
rm -rf .next node_modules

# 重新安装依赖
npm install

# 重新生成 Prisma Client
npm run db:generate

# 类型检查
npx tsc --noEmit
```

#### Q4: 构建失败

**错误信息：**

```
Error: Build failed
```

**解决方案：**

1. 检查 TypeScript 错误

   ```bash
   npx tsc --noEmit
   ```

2. 检查环境变量

   ```bash
   # 确保所有必需变量已设置
   cat .env
   ```

3. 清除并重新构建
   ```bash
   rm -rf .next
   npm run build
   ```

#### Q5: 部署后 API 返回 500

**检查清单：**

- [ ] 环境变量是否正确配置
- [ ] 数据库迁移是否运行
- [ ] 数据库连接字符串是否包含 `sslmode=require`
- [ ] 查看应用日志

```bash
# Vercel
vercel logs [deployment-url]

# Docker
docker-compose logs -f app
```

#### Q6: Prisma Client 未生成

**解决方案：**

```bash
# 生成 Prisma Client
npm run db:generate

# 如果还是失败，手动生成
npx prisma generate
```

---

## 🤝 贡献

欢迎贡献！请查看贡献指南。

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 License

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 📞 联系方式

- **Issue**: [GitHub Issues](https://github.com/yourusername/quicklink-app/issues)
- **Email**: heyemlee@gmail.com

---


