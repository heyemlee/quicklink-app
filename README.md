# 🎴 数字名片管理系统

> 多租户 SaaS 平台，为每个客户提供独立的数字名片

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791)](https://www.postgresql.org/)

## ✨ 核心功能

- 🔐 **用户系统** - 独立账号注册登录
- 🎨 **品牌定制** - Logo、配色、内容完全自定义
- 🔗 **唯一链接** - 每个客户专属名片 URL
- 📱 **移动优先** - 完美适配所有设备
- 🤖 **AI 增强** - 智能生成评价内容
- 📊 **后台管理** - 简单易用的管理界面

## 🚀 快速开始

### 前提条件

- Node.js 16+
- PostgreSQL 数据库
- npm 或 yarn

### 5分钟部署

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd review_app

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的数据库连接和密钥

# 4. 初始化数据库
npm run db:migrate

# 5. 创建测试数据（可选）
npm run db:seed

# 6. 启动应用
npm run dev
```

访问 http://localhost:3000 🎉

### 环境变量配置

在 `.env` 文件中配置：

```bash
# 数据库（必需）
DATABASE_URL="postgresql://user:pass@localhost:5432/review_app"

# 认证（必需）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="生成密钥: openssl rand -base64 32"

# AI功能（可选）
OPENAI_API_KEY="sk-..."
```

> 📘 详细的环境变量配置指南请查看 [ENV_SETUP.md](./ENV_SETUP.md)

## 📖 使用说明

### 1. 注册账号

访问 `/login` 页面，注册新账号

### 2. 配置信息

登录后进入 `/dashboard`，设置：

- 基本信息（公司名、Logo、联系方式）
- 社交媒体链接
- 评价平台链接
- 品牌配色方案

### 3. 分享名片

复制你的专属链接（如 `/card/john-abc123`），分享给客户！

## 📱 功能展示

### 后台管理

- 5个配置模块（基本信息、社交媒体、评价链接、样式、显示设置）
- 实时保存，即改即生效
- 一键预览和分享

### 动态名片

- 自动应用品牌配色
- 一键保存联系人
- 智能跳转社交应用
- AI 生成评价内容

## 🛠️ 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 数据库
npm run db:migrate       # 运行数据库迁移
npm run db:studio        # 打开数据库管理界面
npm run db:seed          # 创建测试数据

# 生产
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
```

## 📁 项目结构

```
review_app/
├── app/                    # Next.js 应用
│   ├── api/               # API 接口
│   ├── dashboard/         # 后台管理
│   ├── card/[slug]/       # 动态名片
│   ├── login/             # 登录页面
│   └── components/        # UI 组件
├── prisma/                # 数据库
│   └── schema.prisma      # 数据模型
├── lib/                   # 核心库
└── public/                # 静态资源
```

## 🚢 部署到生产

详细部署指南请查看 [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

### 快速部署到 Vercel

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 部署
vercel

# 3. 配置环境变量（在 Vercel Dashboard）
# 4. 运行数据库迁移
# 5. 完成！
```

### 推荐服务

| 服务类型 | 推荐平台  | 免费额度 |
| -------- | --------- | -------- |
| 应用托管 | Vercel    | ✅ 免费  |
| 数据库   | Supabase  | ✅ 500MB |
| 域名     | Namecheap | 💰 付费  |

## 📚 文档导航

- 📖 **[文档索引](./DOCS_INDEX.md)** - 文档结构说明
- 📕 **[完整项目文档](./PROJECT_DOCUMENTATION.md)** - 技术架构、API接口、开发指南
- 📗 **[生产部署指南](./PRODUCTION_DEPLOYMENT.md)** - 详细的部署步骤和配置

## 🎯 技术栈

- **前端**: Next.js 14, React 18, Tailwind CSS
- **后端**: Next.js API Routes, NextAuth.js
- **数据库**: PostgreSQL, Prisma ORM
- **AI**: OpenAI GPT-3.5

## 🔒 安全特性

- ✅ 密码 bcrypt 加密
- ✅ JWT 会话管理
- ✅ SQL 注入防护
- ✅ XSS 攻击防护
- ✅ 环境变量隔离

## 🌟 亮点特性

### 多租户架构

每个注册用户都是独立的租户，拥有完全独立的配置空间

### AI 驱动

集成 OpenAI，智能生成个性化评价内容

### 移动优先

完美的移动端体验，支持触觉反馈和应用深链接

### 品牌定制

Logo、配色、内容完全自定义，打造独特的品牌形象

## 💡 使用案例

- **SaaS 服务** - 为多个客户提供名片托管
- **企业工具** - 员工数字名片管理系统
- **代理商** - 为客户提供品牌展示页面
- **个人名片** - 专业的个人品牌展示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

- 📖 查看 [完整文档](./PROJECT_DOCUMENTATION.md)
- 🚀 查看 [部署指南](./PRODUCTION_DEPLOYMENT.md)
- 💬 提交 Issue

---

**开发**: 2024年  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
