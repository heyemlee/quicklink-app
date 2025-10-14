# 数据库迁移指南

## 当前状态

项目当前使用 `prisma db push` 进行数据库同步。对于已有数据的生产环境，需要按照以下步骤迁移到正式的迁移系统。

## 为已有数据库创建迁移历史

### 步骤 1: 备份数据库

```bash
# 使用 pg_dump 备份（推荐）
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 或使用 Prisma Studio 导出数据
npm run db:studio
```

### 步骤 2: 为现有数据库创建基准迁移

```bash
# 创建迁移目录
mkdir -p prisma/migrations/0_init

# 导出当前数据库结构为迁移文件
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
```

### 步骤 3: 标记迁移为已应用

```bash
# 将迁移标记为已应用（不实际执行）
npx prisma migrate resolve --applied 0_init
```

### 步骤 4: 未来的变更使用迁移

从现在开始，所有数据库变更都应该使用迁移：

```bash
# 开发环境：创建并应用迁移
npx prisma migrate dev --name your_migration_name

# 生产环境：仅应用迁移
npx prisma migrate deploy
```

## 新项目的迁移流程

如果是全新项目（没有生产数据）：

### 开发环境

```bash
# 1. 创建并应用迁移
npx prisma migrate dev --name init

# 2. 生成 Prisma Client
npx prisma generate

# 3. 填充示例数据（可选）
npm run db:seed
```

### 生产环境

```bash
# 1. 仅应用迁移（不创建新迁移）
npx prisma migrate deploy

# 2. 生成 Prisma Client
npx prisma generate
```

## 常用命令

```bash
# 查看迁移状态
npx prisma migrate status

# 重置数据库（仅开发环境，会删除所有数据）
npx prisma migrate reset

# 打开 Prisma Studio
npx prisma studio

# 格式化 schema 文件
npx prisma format

# 验证 schema 文件
npx prisma validate
```

## 迁移最佳实践

1. **总是备份**：在生产环境应用迁移前，先备份数据库
2. **测试迁移**：在测试环境先测试迁移
3. **版本控制**：将 `prisma/migrations` 目录提交到 Git
4. **向后兼容**：确保迁移可以回滚
5. **生产环境**：使用 `migrate deploy` 而不是 `migrate dev`

## 故障排除

### 迁移冲突

```bash
# 查看冲突
npx prisma migrate status

# 解决方案1：标记为已解决
npx prisma migrate resolve --applied migration_name

# 解决方案2：回滚迁移
npx prisma migrate resolve --rolled-back migration_name
```

### 数据库不同步

```bash
# 查看差异
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma

# 同步数据库（仅开发环境）
npx prisma db push
```

## 部署注意事项

### Vercel 部署

在 `package.json` 中添加 postinstall 脚本：

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Docker 部署

确保在构建阶段生成 Prisma Client：

```dockerfile
RUN npx prisma generate
```

在启动阶段应用迁移：

```dockerfile
CMD npx prisma migrate deploy && node server.js
```

## 更多资源

- [Prisma 迁移文档](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [生产环境迁移指南](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)
