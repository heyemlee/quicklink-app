# 环境变量配置指南

## 📋 快速开始

### 1. 创建环境变量文件

```bash
# 复制示例文件
cp .env.example .env
```

### 2. 编辑 .env 文件

使用文本编辑器打开 `.env` 文件，填写以下必需配置：

```bash
# 必需配置
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/review_app"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"
```

---

## 🔧 详细配置说明

### 数据库配置（必需）

#### 本地开发环境

如果使用本地 PostgreSQL：

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/review_app?schema=public"
```

**配置步骤：**

1. 安装 PostgreSQL

   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu
   sudo apt install postgresql
   sudo systemctl start postgresql
   ```

2. 创建数据库

   ```bash
   # 登录 PostgreSQL
   psql -U postgres

   # 创建数据库
   CREATE DATABASE review_app;

   # 退出
   \q
   ```

3. 配置连接字符串
   ```bash
   DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/review_app?schema=public"
   ```

#### 云数据库（推荐生产环境）

##### Supabase（推荐）

**步骤 1：创建项目**

1. 访问 [Supabase](https://supabase.com/)
2. 点击 "New Project"
3. 填写项目信息：
   - **Name**: 项目名称（例如：review-app）
   - **Database Password**: 设置数据库密码（⚠️ 务必保存好！）
   - **Region**: 选择地区（建议选择离你最近的）
4. 点击 "Create new project"，等待初始化（约2分钟）

**步骤 2：获取连接字符串**

1. 进入项目面板
2. 点击左侧菜单 **Settings** ⚙️（齿轮图标）
3. 选择 **Database** 选项卡
4. 滚动到 **Connection string** 部分
5. 选择 **URI** 格式
6. 你会看到类似这样的字符串：
   ```bash
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmn.supabase.co:5432/postgres
   ```

**步骤 3：配置到项目**

将 `[YOUR-PASSWORD]` 替换为你在步骤1中设置的密码：

```bash
# 示例（请替换为你的实际信息）
DATABASE_URL="postgresql://postgres:your_actual_password_here@db.abcdefghijklmn.supabase.co:5432/postgres"
```

**关键信息说明：**

- **Username**: 固定是 `postgres`（Supabase 默认）
- **Password**: 你创建项目时设置的密码
- **Host**: `db.[PROJECT-REF].supabase.co`（每个项目不同）
- **Port**: `5432`（PostgreSQL 默认端口）
- **Database**: `postgres`（默认数据库名）

##### Railway

1. 访问 [Railway](https://railway.app/)
2. 创建新项目，添加 PostgreSQL
3. 复制 `DATABASE_URL` 环境变量
4. 配置：
   ```bash
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
   ```

##### Neon

1. 访问 [Neon](https://neon.tech/)
2. 创建新项目
3. 复制连接字符串
4. 配置：
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
   ```

---

### 认证配置（必需）

#### NEXTAUTH_URL

应用的公开访问地址：

```bash
# 开发环境
NEXTAUTH_URL="http://localhost:3000"

# 生产环境
NEXTAUTH_URL="https://yourdomain.com"
```

#### NEXTAUTH_SECRET

用于加密 session 的密钥，**必须保密**。

**生成方法：**

```bash
# 方法 1：使用 OpenSSL
openssl rand -base64 32

# 方法 2：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3：在线生成
# 访问 https://generate-secret.vercel.app/32
```

**配置：**

```bash
NEXTAUTH_SECRET="生成的随机字符串"
```

⚠️ **安全提示：**

- 生产环境必须使用强密码
- 不同环境使用不同的密钥
- 永远不要提交到 Git

---

### AI 服务配置（可选）

如果需要使用 AI 生成评价内容功能：

#### OpenAI

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建 API Key
3. 配置：
   ```bash
   OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxx"
   ```

#### Anthropic Claude（备选）

```bash
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxx"
```

#### DeepSeek（备选）

```bash
DEEPSEEK_API_KEY="sk-xxxxxxxxxxxxx"
```

如果不使用 AI 功能，可以留空或删除这些配置。

---

### 应用配置（可选）

```bash
# 应用的公开 URL（用于生成分享链接等）
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 验证配置

### 1. 检查环境变量

```bash
# 检查 .env 文件
cat .env | grep -v "^#" | grep -v "^$"
```

### 2. 测试数据库连接

```bash
# 生成 Prisma Client
npm run db:generate

# 同步数据库架构
npm run db:push

# 打开 Prisma Studio 查看数据库
npm run db:studio
```

### 3. 运行应用

```bash
# 开发模式
npm run dev

# 访问 http://localhost:3000
```

---

## 🔒 安全最佳实践

### 1. 环境变量管理

✅ **应该做的：**

- 使用强密码和密钥
- 不同环境使用不同的配置
- 定期更换敏感密钥
- 使用环境变量管理工具（如 Vercel、Railway 的内置工具）

❌ **不应该做的：**

- 将 `.env` 提交到 Git
- 在代码中硬编码密钥
- 在公共渠道分享配置
- 在多个项目重用相同密钥

### 2. 数据库安全

- 使用强数据库密码
- 限制数据库访问 IP
- 启用 SSL 连接
- 定期备份数据

### 3. 生产环境

- 使用云数据库服务
- 启用 HTTPS
- 配置 CORS
- 启用日志监控

---

## 📝 配置检查清单

### 开发环境

- [ ] 已创建 `.env` 文件
- [ ] 已配置 `DATABASE_URL`
- [ ] 已配置 `NEXTAUTH_URL`
- [ ] 已配置 `NEXTAUTH_SECRET`
- [ ] 数据库连接成功
- [ ] 应用可以正常启动

### 生产环境

- [ ] 已配置生产数据库
- [ ] 已配置生产域名
- [ ] 已使用强 `NEXTAUTH_SECRET`
- [ ] 已配置 SSL/HTTPS
- [ ] 已配置环境变量（Vercel/Railway）
- [ ] 已运行数据库迁移
- [ ] 已测试应用功能

---

## ❓ 常见问题

### Q1: 数据库连接失败

```
Error: P1001: Can't reach database server
```

**解决方案：**

1. 检查数据库是否运行
2. 检查连接字符串是否正确
3. 检查网络和防火墙设置
4. 检查数据库用户权限

### Q2: NextAuth 错误

```
[next-auth][error][NO_SECRET]
```

**解决方案：**
确保 `NEXTAUTH_SECRET` 已配置：

```bash
openssl rand -base64 32
```

### Q3: Prisma 错误

```
Error: Environment variable not found: DATABASE_URL
```

**解决方案：**

1. 检查 `.env` 文件是否存在
2. 检查 `DATABASE_URL` 是否配置
3. 重启开发服务器

### Q4: 生产环境配置

在 Vercel 或 Railway 部署时：

1. 在平台的环境变量设置中添加所有变量
2. 确保 `NEXTAUTH_URL` 使用生产域名
3. 运行数据库迁移：
   ```bash
   npx prisma migrate deploy
   ```

---

## 📚 相关文档

- [README.md](./README.md) - 项目快速开始
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - 完整技术文档
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - 生产部署指南

---

## 💡 提示

1. **本地开发**：可以使用简单的配置快速开始
2. **生产环境**：务必使用云数据库和强密码
3. **团队协作**：分享 `.env.example`，不要分享 `.env`
4. **持续集成**：使用平台的环境变量管理工具

---

更新时间：2025-10-10
