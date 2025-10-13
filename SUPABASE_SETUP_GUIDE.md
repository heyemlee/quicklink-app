# 🚀 Supabase 云服务完整设置指南

> 跟着这个指南，5分钟完成 Supabase 配置

## 📋 设置步骤

### 步骤 1：注册 Supabase 账号

**访问**: https://supabase.com/

1. 点击右上角 **"Start your project"** 或 **"Sign Up"**
2. 选择登录方式：

   - GitHub（推荐，快速）
   - Google
   - Email

3. 完成登录后会自动跳转到控制台

---

### 步骤 2：创建新项目

在 Supabase Dashboard：

```
1. 点击 "New Project" 按钮
2. 选择或创建 Organization（如果是第一次使用）
```

**填写项目信息：**

| 字段                  | 填写内容                 | 说明                    |
| --------------------- | ------------------------ | ----------------------- |
| **Name**              | `review-app`             | 项目名称（可自定义）    |
| **Database Password** | `设置一个强密码`         | ⚠️ 非常重要，务必保存！ |
| **Region**            | `Northeast Asia (Tokyo)` | 选择离你最近的地区      |
| **Pricing Plan**      | `Free`                   | 免费版足够开发使用      |

```
✅ 密码建议：至少12位，包含大小写字母、数字和特殊字符
   示例：Review2024!Secure
```

**点击 "Create new project"**，等待 2-3 分钟初始化完成。

---

### 步骤 3：获取数据库连接字符串

项目创建完成后：

```
左侧菜单 → Settings (⚙️ 齿轮图标) → Database → Connection string
```

**重要选择：**

<function_calls>
找到 **"Connection string"** 部分，有两个选项：

1. ✅ **Session mode** (推荐用于开发)

   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

2. ✅ **Transaction mode** (推荐用于生产环境的 Prisma)
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

````

**对于我们的项目，优先使用 Transaction mode（连接池）**

---

### 步骤 4：配置项目环境变量

#### 4.1 打开 .env 文件

```bash
# 在项目根目录，编辑 .env 文件
code .env   # 或用其他编辑器打开
````

#### 4.2 填写数据库连接字符串

从 Supabase 复制的连接字符串（Transaction mode）：

```bash
# 示例（从 Supabase 复制的）
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**替换 `[YOUR-PASSWORD]` 为你在步骤2设置的密码：**

```bash
# .env 文件内容
DATABASE_URL="postgresql://postgres.abcdefgh:Review2024!Secure@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

⚠️ **注意**：如果密码包含特殊字符，需要 URL 编码：

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

---

### 步骤 5：配置其他必需的环境变量

在 `.env` 文件中继续添加：

```bash
# 数据库连接（已填写）
DATABASE_URL="postgresql://postgres.xxx:你的密码@aws-0-xxx.pooler.supabase.com:6543/postgres"

# 认证配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="生成一个密钥（见下方）"

# AI 功能（可选）
OPENAI_API_KEY=""
```

**生成 NEXTAUTH_SECRET：**

在终端运行：

```bash
openssl rand -base64 32
```

复制输出的字符串，填入 `.env` 文件。

---

### 步骤 6：初始化数据库

在项目目录运行以下命令：

```bash
# 1. 安装依赖（如果还没装）
npm install

# 2. 生成 Prisma Client
npm run db:generate

# 3. 推送数据库架构到 Supabase
npm run db:push
```

**预期输出：**

```
✅ Environment variables loaded from .env
✅ Prisma schema loaded from prisma/schema.prisma
✅ Your database is now in sync with your Prisma schema. Done in XXXms
```

---

### 步骤 7：创建测试数据（可选）

```bash
npm run db:seed
```

这会创建一个测试账号：

- Email: `test@example.com`
- Password: `password123`
- 访问链接: `http://localhost:3000/card/test-company`

---

### 步骤 8：启动应用

```bash
npm run dev
```

**访问：**

- 首页: http://localhost:3000
- 登录: http://localhost:3000/login
- 测试名片: http://localhost:3000/card/test-company

---

## ✅ 验证配置成功

### 检查清单

- [ ] Supabase 项目创建成功
- [ ] 数据库密码已保存
- [ ] 连接字符串已复制到 .env
- [ ] NEXTAUTH_SECRET 已生成
- [ ] `npm run db:push` 成功执行
- [ ] 应用可以启动
- [ ] 可以注册/登录账号

### 测试步骤

1. **测试数据库连接**

   ```bash
   npm run db:studio
   ```

   应该能打开 Prisma Studio (http://localhost:5555)

2. **测试应用启动**

   ```bash
   npm run dev
   ```

   访问 http://localhost:3000 应该能看到首页

3. **测试用户注册**
   - 访问 http://localhost:3000/login
   - 注册一个新账号
   - 检查 Prisma Studio 中是否有新用户数据

---

## ⚠️ 常见问题排查

### 问题 1: 连接失败 (P1001)

```
Error: P1001: Can't reach database server
```

**解决方案：**

1. **检查密码是否正确**
   - 确认密码中的特殊字符是否需要 URL 编码
2. **使用 Connection Pooling（重要！）**

   - 在 Supabase 确保选择的是 **Transaction mode** 的连接字符串
   - 它的格式是：`postgresql://postgres.xxx:pwd@aws-xxx.pooler.supabase.com:6543/postgres`
   - 注意端口是 `6543` 不是 `5432`

3. **添加 pgbouncer=true 参数**

   ```bash
   DATABASE_URL="postgresql://postgres.xxx:pwd@aws-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

4. **检查网络连接**
   ```bash
   ping aws-0-us-west-1.pooler.supabase.com
   ```

### 问题 2: 密码包含特殊字符

如果密码是 `Pass@word#123`，需要编码：

```bash
# 编码后
DATABASE_URL="postgresql://postgres.xxx:Pass%40word%23123@aws-xxx.pooler.supabase.com:6543/postgres"
```

### 问题 3: 项目还在初始化

等待 2-3 分钟，Supabase 项目初始化需要时间。

### 问题 4: Prisma 版本问题

确保 Prisma 版本是最新的：

```bash
npm install prisma@latest @prisma/client@latest
```

---

## 🎯 完整的 .env 示例

```bash
# ===========================================
# 数据库配置
# ===========================================
# 使用 Transaction mode (Connection Pooling)
DATABASE_URL="postgresql://postgres.abcdefgh:YourPassword123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# ===========================================
# NextAuth 配置
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="用 openssl rand -base64 32 生成的密钥"

# ===========================================
# AI 服务（可选）
# ===========================================
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
DEEPSEEK_API_KEY=""

# ===========================================
# 应用配置
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🎁 Supabase 免费额度

✅ **数据库**: 500MB PostgreSQL  
✅ **存储**: 1GB 文件存储  
✅ **带宽**: 5GB 出站流量  
✅ **API 请求**: 无限制  
✅ **认证**: 50,000 月活用户  
✅ **实时订阅**: 200 并发连接

对于开发和小型项目完全足够！

---

## 📞 需要帮助？

1. **查看 Supabase 文档**: https://supabase.com/docs
2. **查看项目文档**: [ENV_SETUP.md](./ENV_SETUP.md)
3. **检查数据库**: 运行 `npm run db:studio`
4. **Supabase Dashboard**: https://supabase.com/dashboard

---

## 🚀 下一步

配置成功后，你可以：

1. **自定义你的名片** - 登录后台修改信息
2. **分享名片链接** - `/card/你的slug`
3. **部署到生产环境** - 查看 [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

---

**创建时间**: 2025-10-10  
**适用版本**: Supabase v2+, Next.js 14+, Prisma 5+
