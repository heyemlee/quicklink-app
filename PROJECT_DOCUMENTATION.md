# 📚 项目完整文档

> 名片管理系统 - 多租户 SaaS 平台完整技术文档

## 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [功能特性](#功能特性)
- [数据库设计](#数据库设计)
- [API 接口](#api-接口)
- [前端组件](#前端组件)
- [环境配置](#环境配置)
- [开发指南](#开发指南)
- [安全设计](#安全设计)
- [前后端分离方案](#前后端分离方案)

---

## 项目概述

### 简介

这是一个现代化的多租户名片管理系统，允许企业客户：

- 注册独立账号
- 自定义品牌配置（Logo、颜色、内容）
- 获得唯一的数字名片链接
- 管理社交媒体和评价链接
- 集成 AI 生成评价内容

### 应用场景

- **SaaS 名片服务** - 为多个客户提供名片托管
- **企业内部工具** - 员工数字名片管理
- **代理商平台** - 为客户提供品牌展示页面

### 核心价值

- ✅ 多租户架构，支持无限客户
- ✅ 完全自定义，每个客户独立品牌
- ✅ 移动优先，完美适配各种设备
- ✅ AI 增强，智能生成评价内容
- ✅ 一键分享，扫码或链接访问

---

## 技术架构

### 技术栈

#### 前端

- **Next.js 14** - React 框架（App Router）
- **React 18** - UI 库
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

#### 后端

- **Next.js API Routes** - RESTful API
- **NextAuth.js** - 认证系统
- **Prisma** - ORM
- **PostgreSQL** - 关系型数据库
- **bcryptjs** - 密码加密

#### AI 服务

- **OpenAI GPT-3.5** - 评价内容生成

### 架构图

```
┌─────────────────────────────────────────────┐
│           Next.js 应用 (Port 3000)           │
├─────────────────────────────────────────────┤
│  前端层                                      │
│  ├── 公共页面（/, /login, /card/[slug]）    │
│  └── 受保护页面（/dashboard）               │
├─────────────────────────────────────────────┤
│  API 层                                      │
│  ├── /api/auth/* - 认证接口                 │
│  ├── /api/profile/* - 配置管理              │
│  └── /api/generate_review - AI 生成         │
├─────────────────────────────────────────────┤
│  业务逻辑层                                  │
│  ├── Prisma ORM                             │
│  └── NextAuth.js                            │
├─────────────────────────────────────────────┤
│  数据层                                      │
│  └── PostgreSQL 数据库                      │
└─────────────────────────────────────────────┘
```

### 项目结构

```
review_app/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── auth/
│   │   │   ├── [...nextauth]/   # NextAuth 配置
│   │   │   └── register/        # 注册接口
│   │   ├── profile/             # 配置管理
│   │   │   ├── route.js         # GET/PUT 当前用户
│   │   │   └── [slug]/route.js # GET 公开配置
│   │   └── generate_review/     # AI 生成评价
│   ├── card/[slug]/             # 动态名片页面
│   ├── dashboard/               # 后台管理
│   ├── login/                   # 登录注册
│   ├── components/              # UI 组件
│   ├── hooks/                   # 自定义 Hooks
│   ├── utils/                   # 工具函数
│   ├── config/                  # 配置文件
│   ├── providers/               # Context Providers
│   ├── layout.js                # 根布局
│   ├── page.js                  # 首页
│   └── globals.css              # 全局样式
├── lib/                         # 核心库
│   ├── prisma.js                # Prisma 客户端
│   └── auth.js                  # 认证工具
├── prisma/                      # 数据库
│   ├── schema.prisma            # 数据模型
│   └── seed.js                  # 测试数据
├── public/                      # 静态资源
│   └── icons/                   # 图标文件
└── .env                         # 环境变量
```

---

## 功能特性

### 1. 用户认证系统

#### 注册功能

- 邮箱 + 密码注册
- 自动生成唯一 slug
- 创建默认配置
- 密码加密存储（bcrypt）

#### 登录功能

- 邮箱 + 密码登录
- JWT 会话管理
- 自动跳转到 dashboard

#### 会话管理

- 基于 JWT 的无状态会话
- 安全的 Cookie 存储
- 自动续期机制

### 2. 后台管理系统

#### 基本信息

- 公司名称
- Logo URL
- 电话号码
- 公司地址
- 联系邮箱

#### 社交媒体（7个平台）

- 微信 ID
- Instagram
- Facebook
- TikTok
- 小红书
- Yelp
- Google

#### 评价链接（3个平台）

- Google Reviews
- Yelp Reviews
- Facebook Reviews

#### 配色方案

- 主色调（Primary Color）
- 次要色调（Secondary Color）
- 强调色（Accent Color）
- 实时预览

#### 显示控制

- 显示/隐藏联系信息模块
- 显示/隐藏社交媒体模块
- 显示/隐藏评价模块

### 3. 动态名片系统

#### 唯一链接

- 格式：`/card/[slug]`
- 例如：`/card/john-abc123`

#### 自定义展示

- 使用客户的品牌配色
- 展示客户的 Logo
- 动态加载配置

#### 交互功能

- 保存联系人（vCard）
- 一键关注社交媒体
- 应用深链接跳转
- AI 生成评价内容

### 4. AI 评价生成

#### 功能

- 基于 OpenAI GPT-3.5
- 针对不同平台生成内容
- 一键刷新重新生成
- 复制到剪贴板

#### 支持平台

- Google
- Yelp
- Facebook
- Instagram
- 小红书

---

## 数据库设计

### ER 图

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (CUID)      │ PK
│ email          │ UNIQUE
│ password       │
│ slug           │ UNIQUE
│ createdAt      │
│ updatedAt      │
└─────────────────┘
        │
        │ 1:1
        ▼
┌─────────────────┐
│    Profile      │
├─────────────────┤
│ id (CUID)      │ PK
│ userId         │ FK → User.id
├─────────────────┤
│ companyName    │
│ logoUrl        │
│ phone          │
│ address        │
│ email          │
├─────────────────┤
│ wechatId       │
│ instagram      │
│ facebook       │
│ tiktok         │
│ xiaohongshu    │
│ yelp           │
│ google         │
├─────────────────┤
│ googleReviewUrl     │
│ yelpReviewUrl       │
│ facebookReviewUrl   │
├─────────────────┤
│ primaryColor   │
│ secondaryColor │
│ accentColor    │
├─────────────────┤
│ showContact    │
│ showFollow     │
│ showReview     │
├─────────────────┤
│ createdAt      │
│ updatedAt      │
└─────────────────┘
```

### Prisma Schema

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  slug          String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  profile       Profile?
}

model Profile {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 基本信息
  companyName         String   @default("我的公司")
  logoUrl             String?
  phone               String?
  address             String?
  email               String?

  // 社交媒体
  wechatId            String?
  instagram           String?
  facebook            String?
  tiktok              String?
  xiaohongshu         String?
  yelp                String?
  google              String?

  // 评价链接
  googleReviewUrl     String?
  yelpReviewUrl       String?
  facebookReviewUrl   String?

  // 配色方案
  primaryColor        String   @default("#7c3aed")
  secondaryColor      String   @default("#ec4899")
  accentColor         String   @default("#3b82f6")

  // 显示控制
  showContact         Boolean  @default(true)
  showFollow          Boolean  @default(true)
  showReview          Boolean  @default(true)

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([userId])
}
```

### 索引策略

- `User.email` - 唯一索引（登录查询）
- `User.slug` - 唯一索引（名片访问）
- `Profile.userId` - 普通索引（关联查询）

---

## API 接口

### 认证接口

#### 注册用户

```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 201
{
  "message": "注册成功",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "slug": "user-abc123"
  }
}
```

#### 登录

```
POST /api/auth/[...nextauth]
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "slug": "user-abc123"
  }
}
```

#### 获取当前用户

```
GET /api/auth/[...nextauth]/session

Response: 200
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "slug": "user-abc123"
  }
}
```

### 配置管理接口

#### 获取当前用户配置

```
GET /api/profile
Authorization: Required (Session)

Response: 200
{
  "user": {
    "id": "...",
    "email": "...",
    "slug": "..."
  },
  "profile": {
    "id": "...",
    "companyName": "...",
    "logoUrl": "...",
    // ... 所有配置字段
  }
}
```

#### 更新配置

```
PUT /api/profile
Authorization: Required (Session)
Content-Type: application/json

Request:
{
  "companyName": "My Company",
  "phone": "123-456-7890",
  "primaryColor": "#7c3aed",
  // ... 其他字段
}

Response: 200
{
  "message": "更新成功",
  "profile": { ... }
}
```

#### 获取公开配置

```
GET /api/profile/[slug]

Response: 200
{
  "profile": {
    "companyName": "...",
    "logoUrl": "...",
    // ... 公开字段（不包含敏感信息）
  }
}
```

### AI 生成接口

#### 生成评价

```
POST /api/generate_review
Content-Type: application/json

Request:
{
  "platform": "google"
}

Response: 200
{
  "review": "Great service! 🌟 Highly recommend..."
}
```

---

## 前端组件

### 页面组件

#### 1. 登录页面 (`/login`)

```jsx
- 双标签切换（登录/注册）
- 表单验证
- 错误提示
- 自动登录跳转
```

#### 2. 后台管理 (`/dashboard`)

```jsx
- 5个配置标签
  - 基本信息
  - 社交媒体
  - 评价链接
  - 样式配置
  - 显示设置
- 实时保存
- 名片链接展示
- 预览按钮
```

#### 3. 动态名片 (`/card/[slug]`)

```jsx
- 动态加载配置
- 自定义配色
- 保存联系人
- 社交媒体关注
- AI 评价生成
```

### UI 组件

#### Header.jsx

```jsx
- 公司名称/Logo 展示
- 联系信息显示
- 响应式设计
```

#### SaveContactButton.jsx

```jsx
- 生成 vCard
- 一键保存
- 触觉反馈
```

#### FollowSection.jsx

```jsx
-社交媒体按钮网格 - 应用深链接 - 降级到网页;
```

#### ReviewSection.jsx

```jsx
-评价平台卡片 - 打开评价模态框;
```

#### ReviewModal.jsx

```jsx
- AI 生成内容
- 刷新按钮
- 复制功能
- 发布到平台
```

### 自定义 Hooks

#### useAuth.js

```javascript
// 认证状态管理
const { user, login, logout } = useAuth();
```

#### useHapticFeedback.js

```javascript
// 触觉反馈
const { triggerHaptic } = useHapticFeedback();
```

#### useNetworkStatus.js

```javascript
// 网络状态监测
const { isOnline, showOfflineWarning } = useNetworkStatus();
```

#### useReviewGenerator.js

```javascript
// AI 评价生成
const { reviewText, isLoading, generateReview } = useReviewGenerator();
```

#### useAppOpener.js

```javascript
// 应用跳转
const { openApp } = useAppOpener();
```

---

## 环境配置

### 必需变量

```bash
# 数据库
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"  # 生成: openssl rand -base64 32

# OpenAI (可选)
OPENAI_API_KEY="sk-..."
```

### 开发环境

```bash
# .env.local
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/review_app_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key"
```

### 生产环境

```bash
NODE_ENV=production
DATABASE_URL="your-production-db-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-production-secret"
```

### 数据库选项

| 服务            | 类型       | 免费额度 | 推荐度     |
| --------------- | ---------- | -------- | ---------- |
| Supabase        | PostgreSQL | 500MB    | ⭐⭐⭐⭐⭐ |
| Railway         | PostgreSQL | $5/月    | ⭐⭐⭐⭐   |
| Neon            | PostgreSQL | 无限     | ⭐⭐⭐⭐   |
| Vercel Postgres | PostgreSQL | 256MB    | ⭐⭐⭐     |

---

## 开发指南

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 初始化数据库
npm run db:migrate

# 4. 创建测试数据
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

### 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 数据库
npm run db:migrate       # 运行迁移
npm run db:push          # 推送 schema
npm run db:studio        # 打开 Prisma Studio
npm run db:generate      # 生成 Prisma Client
npm run db:seed          # 创建测试数据

# 构建
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # ESLint 检查
```

### 添加新功能

#### 1. 添加数据库字段

```bash
# 1. 修改 prisma/schema.prisma
# 2. 运行迁移
npm run db:migrate -- --name add_new_field

# 3. 更新 TypeScript 类型
npm run db:generate
```

#### 2. 添加 API 端点

```javascript
// app/api/new-endpoint/route.js
export async function GET(request) {
  // 实现逻辑
}
```

#### 3. 添加页面

```javascript
// app/new-page/page.js
export default function NewPage() {
  return <div>New Page</div>;
}
```

### 测试

#### 手动测试清单

- [ ] 用户注册
- [ ] 用户登录
- [ ] 配置保存
- [ ] 名片访问
- [ ] AI 生成
- [ ] 移动端适配
- [ ] 跨浏览器兼容

---

## 安全设计

### 密码安全

- **哈希算法**: bcrypt
- **盐轮数**: 12 rounds
- **存储**: 只存储哈希值，不存储明文

### 会话安全

- **JWT Token**: 无状态会话管理
- **Cookie 配置**:
  - `httpOnly: true` - 防止 XSS
  - `secure: true` - 仅 HTTPS（生产）
  - `sameSite: 'lax'` - 防止 CSRF

### API 安全

- **认证中间件**: 保护敏感端点
- **输入验证**: 验证所有用户输入
- **SQL 注入防护**: Prisma 参数化查询
- **XSS 防护**: React 自动转义

### 环境变量安全

- 敏感信息不提交代码库
- `.env` 在 `.gitignore` 中
- 生产环境使用不同的密钥

---

## 前后端分离方案

### 为什么需要分离？

当项目需要：

- 支持多个客户端（Web + Mobile App）
- 前后端团队独立开发
- 独立扩展前端或后端
- API 被第三方调用

### 架构对比

#### 当前（全栈 Next.js）

```
Next.js (Port 3000)
├── 前端 + 后端 + 数据库
└── 简单部署，统一代码库
```

#### 分离后

```
React 前端 (3000) ←→ Express 后端 (4000) ←→ PostgreSQL
├── 独立部署
├── 技术栈灵活
└── API 可复用
```

### 技术栈变化

| 模块 | 当前           | 分离后          |
| ---- | -------------- | --------------- |
| 前端 | Next.js Pages  | React + Vite    |
| 路由 | Next.js Router | React Router    |
| 后端 | Next.js API    | Express.js      |
| 认证 | NextAuth.js    | Passport.js     |
| 会话 | JWT (内置)     | express-session |

### 实现建议

如需前后端分离架构，建议：

1. **后端**: 使用 Express.js + Prisma + Passport.js
2. **前端**: 使用 React + Vite + Axios
3. **参考**: 查看主项目的 API 设计和数据模型

可以根据当前全栈架构的 API 接口设计来实现分离版本。

---

## 性能优化

### 数据库优化

- 使用索引加速查询
- Prisma 连接池管理
- 查询优化（只选择需要的字段）

### 前端优化

- Next.js 自动代码分割
- 图片懒加载
- 组件懒加载
- Tailwind CSS 按需加载

### API 优化

- 响应缓存
- 压缩响应数据
- 限流保护

---

## 常见问题

### Q1: 如何重置密码？

A: 当前版本不支持，需要联系管理员或通过数据库手动重置。

### Q2: 支持多语言吗？

A: 当前不支持，可以通过添加 i18n 实现。

### Q3: 可以自定义域名吗？

A: 可以，在部署平台配置自定义域名即可。

### Q4: 数据如何备份？

A: 使用数据库提供商的备份功能，或使用 `pg_dump` 导出。

### Q5: 如何升级依赖？

```bash
npm outdated  # 查看过时依赖
npm update    # 更新依赖
```

---

## 技术支持

### 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 社区资源

- Next.js Discord
- Prisma Slack
- Stack Overflow

---

**文档版本**: 1.0  
**最后更新**: 2024年10月  
**维护者**: 项目团队
