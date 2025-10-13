# 数据库迁移说明

## 更改内容

本次更新对数据库schema进行了以下修改：

1. **删除了 `logoUrl` 字段** - 不再在网页端显示logo
2. **新增了 `followPlatforms` 字段** - 用于控制关注模块显示哪些平台（JSON数组格式）
3. **新增了 `reviewPlatforms` 字段** - 用于控制评价模块显示哪些平台（JSON数组格式）

## 如何运行迁移

当数据库可用时，运行以下命令之一：

### 方法 1: 使用 db push（推荐用于开发环境）

```bash
npx prisma db push
```

这将直接将schema更改推送到数据库，不会创建迁移文件。

### 方法 2: 使用 migrate deploy（推荐用于生产环境）

如果你想创建迁移历史记录，可以使用：

```bash
# 生成迁移文件
npx prisma migrate dev --name add_platform_controls_remove_logo

# 或者在生产环境中
npx prisma migrate deploy
```

## Schema 更改详情

### Profile 模型

**删除的字段：**

- `logoUrl` (String?)

**新增的字段：**

- `followPlatforms` (String) - 默认值: `["website","tiktok","instagram","facebook","wechat","xiaohongshu"]`
- `reviewPlatforms` (String) - 默认值: `["xiaohongshu","yelp","googlemap","instagram"]`

这些字段以JSON字符串格式存储平台ID数组，允许用户在后台管理中灵活选择要显示的平台。

## 验证迁移

迁移成功后，你可以通过以下方式验证：

1. 检查数据库中的Profile表是否有新字段
2. 访问 `/dashboard` 页面，在"显示设置"标签页中应该能看到可视化的平台选择器
3. 选择平台后保存，然后预览名片页面，确认只显示选中的平台

## 故障排除

如果遇到迁移问题：

1. **数据库连接失败**：检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. **Schema 冲突**：如果提示schema不同步，可以使用 `npx prisma migrate reset` 重置数据库（注意：会清空所有数据）
3. **权限问题**：确保数据库用户有修改表结构的权限

## 注意事项

- 运行迁移后，Prisma Client已经重新生成，代码中可以直接使用新字段
- 所有相关的API和前端代码已经更新，无需额外修改
- 现有数据不会丢失，只是删除了logoUrl字段的数据
