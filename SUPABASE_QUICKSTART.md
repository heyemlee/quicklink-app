# 🚀 Supabase 快速配置指南

## 📝 3步完成 Supabase 数据库配置

### 第 1 步：创建 Supabase 项目

访问 https://supabase.com/，注册/登录后：

```
1. 点击 "New Project"
2. 填写信息：
   - Organization: 选择或创建组织
   - Name: review-app（或你喜欢的名字）
   - Database Password: ⚠️ 设置一个强密码并保存好！
   - Region: 选择 Northeast Asia (Tokyo) 或其他近的地区
3. 点击 "Create new project"
4. 等待 2-3 分钟初始化完成
```

### 第 2 步：获取数据库连接字符串

项目创建完成后：

```
左侧菜单栏 → Settings ⚙️ → Database → Connection string → URI
```

你会看到：

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmn.supabase.co:5432/postgres
                      ^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^
                      这里需要替换密码      这是你的项目专属地址
```

### 第 3 步：配置到你的项目

在项目根目录的 `.env` 文件中：

```bash
# 复制 Supabase 提供的连接字符串
# 将 [YOUR-PASSWORD] 替换为你的实际密码
DATABASE_URL="postgresql://postgres:你的密码@db.abcdefghijklmn.supabase.co:5432/postgres"
```

---

## 🔑 关键信息说明

| 参数 | 值 | 说明 |
|------|-----|------|
| **username** | `postgres` | 固定值，Supabase 默认用户名 |
| **password** | 你创建项目时设置的密码 | ⚠️ 必须保密 |
| **host** | `db.[你的项目ID].supabase.co` | 每个项目唯一 |
| **port** | `5432` | PostgreSQL 默认端口 |
| **database** | `postgres` | 默认数据库名 |

---

## ✅ 验证配置

配置完成后，在项目目录运行：

```bash
# 1. 生成 Prisma Client
npm run db:generate

# 2. 同步数据库结构
npm run db:push

# 3. 查看数据库（可选）
npm run db:studio
```

如果没有错误，说明配置成功！🎉

---

## 💡 实际示例

假设：
- 你的密码是：`MyStrongPassword123!`
- Supabase 给你的 host 是：`db.xyzabcdefghijk.supabase.co`

那么你的 `.env` 配置应该是：

```bash
DATABASE_URL="postgresql://postgres:MyStrongPassword123!@db.xyzabcdefghijk.supabase.co:5432/postgres"
```

---

## ⚠️ 常见问题

### Q: 忘记密码怎么办？

A: 在 Supabase 项目中：
```
Settings → Database → Database Password → Reset Database Password
```

### Q: 连接失败？

检查：
1. ✅ 密码是否正确（特殊字符需要 URL 编码）
2. ✅ 网络是否正常
3. ✅ Supabase 项目是否在运行状态

### Q: 密码中有特殊字符？

如果密码包含特殊字符（如 `@`, `#`, `%` 等），需要 URL 编码：

| 字符 | 编码 |
|------|------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `/` | `%2F` |

示例：
```bash
# 密码: Pass@word#123
# 编码后: Pass%40word%23123
DATABASE_URL="postgresql://postgres:Pass%40word%23123@db.xyz.supabase.co:5432/postgres"
```

---

## 🎁 Supabase 优势

✅ **免费额度**：500MB 数据库，500MB 文件存储  
✅ **自动备份**：每日自动备份  
✅ **全球 CDN**：快速访问  
✅ **内置功能**：认证、存储、实时订阅等  
✅ **开发友好**：Web 界面管理数据库

---

## 📚 相关文档

- [ENV_SETUP.md](./ENV_SETUP.md) - 完整环境变量配置指南
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - 生产部署指南
- [Supabase 官方文档](https://supabase.com/docs)

---

**更新时间**: 2025-10-10  
**适用版本**: Supabase v2+
