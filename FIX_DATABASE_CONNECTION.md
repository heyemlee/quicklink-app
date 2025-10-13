# 🔧 修复 Supabase 数据库连接

## ❌ 当前问题

你使用的连接字符串地址不正确，导致无法连接到数据库。

## ✅ 解决方案

你需要从 Supabase Dashboard 获取正确的 **Session mode** 连接字符串。

---

## 📋 详细步骤

### 步骤 1：打开 Supabase Dashboard

访问：https://supabase.com/dashboard/project/lnqrighofdykncgxzqyv

（或者访问 https://supabase.com/dashboard 然后选择你的项目）

---

### 步骤 2：进入 Database 设置

```
左侧菜单 → Settings (⚙️ 齿轮图标) → Database
```

---

### 步骤 3：找到 Connection String

向下滚动页面，找到 **"Connection string"** 部分

你会看到两个选项卡：

1. **Session mode** ⬅️ 选这个！
2. Transaction mode

---

### 步骤 4：复制连接字符串

**选择 "Session mode"** 选项卡后，你会看到类似这样的字符串：

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

**注意事项：**

- `[YOUR-PASSWORD]` 是占位符，需要替换成你的实际密码
- 你的密码是：`1748Office`（你创建项目时设置的）
- 确保复制的是 **Session mode** 而不是 Transaction mode

---

### 步骤 5：更新 .env 文件

1. 打开项目中的 `.env` 文件

2. 找到 `DATABASE_URL` 这一行

3. 替换成从 Supabase 复制的连接字符串（记得把 `[YOUR-PASSWORD]` 替换成 `1748Office`）

**示例：**

```bash
# 假设 Supabase 给你的是这样：
# postgresql://postgres:[YOUR-PASSWORD]@db.abcdefg.supabase.co:5432/postgres

# 那么你应该填：
DATABASE_URL="postgresql://postgres:1748Office@db.abcdefg.supabase.co:5432/postgres"
```

---

### 步骤 6：验证配置

保存 `.env` 文件后，在终端运行：

```bash
npm run db:push
```

**预期成功输出：**

```
✅ Environment variables loaded from .env
✅ Prisma schema loaded from prisma/schema.prisma
✅ Your database is now in sync with your Prisma schema. Done in XXXms
```

---

## 🎯 关键点对比

### ❌ 错误的 (Transaction mode / Pooling)

```
postgresql://postgres.lnqrighofdykncgxzqyv:1748Office@aws-1-us-east-2.pooler.supabase.com:6543/postgres
                      ^                                ^^^^^^^^                             ^^^^
                      多了项目ID                        pooler                              6543
```

**用途**：生产环境的应用运行时  
**问题**：不支持 Prisma 的 migrate/push 命令

### ✅ 正确的 (Session mode / Direct)

```
postgresql://postgres:1748Office@db.xxx.supabase.co:5432/postgres
              ^^^^^^^^            ^^                   ^^^^
              只有postgres         db                  5432
```

**用途**：开发环境、数据库迁移、Prisma Studio  
**优点**：完全兼容 Prisma 的所有命令

---

## 💡 提示

### 找不到正确的地址？

如果你不确定正确的地址，可以在 Supabase Dashboard 的 Database 设置页面：

1. 找到 "Connection parameters" 部分
2. 查看 **Host** 字段
3. 应该类似：`db.xxx.supabase.co`（不是 `aws-x-xx.pooler.supabase.com`）

### 密码包含特殊字符？

你的密码 `1748Office` 不包含特殊字符，可以直接使用。

如果以后更改密码，包含了 `@`, `#`, `%` 等特殊字符，需要进行 URL 编码。

---

## 📞 仍然有问题？

### 检查清单

- [ ] 确认使用的是 Session mode（不是 Transaction mode）
- [ ] 确认端口是 5432（不是 6543）
- [ ] 确认 host 是 `db.xxx.supabase.co`（不是 `pooler.supabase.com`）
- [ ] 确认密码正确替换（不是 `[YOUR-PASSWORD]`）
- [ ] 确认 Supabase 项目状态是 active（绿色）

### 测试数据库状态

在 Supabase Dashboard：

```
左侧菜单 → Database → 应该能看到 Tables, Functions 等选项
```

如果看不到或显示错误，说明项目还在初始化或有问题。

---

## 🚀 下一步

配置成功后：

```bash
# 1. 推送数据库架构
npm run db:push

# 2. 创建测试数据
npm run db:seed

# 3. 查看数据库
npm run db:studio

# 4. 启动应用
npm run dev
```

---

**更新时间**: 2025-10-10
