# 平台配置说明

## 如何配置各平台的跳转链接

### 1. Xiaohongshu (小红书)

- **App Scheme**: `xhsdiscover://item/new` - 打开发布新笔记页面
- **Fallback URL**: 可以配置为您的小红书主页或探索页
- 需要配置：将 `https://www.xiaohongshu.com/explore` 改为您的店铺/品牌页面

### 2. Yelp

- **App Scheme**: `yelp:///write_review` - 打开写评论页面
- **Fallback URL**: 需要替换业务ID
- **当前配置的业务ID**: `-YfNM7V52zpRuA9_DqBeUA`
- **如何获取您的Yelp业务ID**:
  1. 访问您的Yelp商家页面
  2. URL格式为: `https://www.yelp.com/biz/[您的业务ID]`
  3. 将代码中的业务ID替换为您的实际ID

### 3. Google Maps

- **App Scheme**: `comgooglemaps://?q=YourBusinessName&center=40.7484,-73.9857`
- **Fallback URL**: `https://www.google.com/maps/search/?api=1&query=YourBusinessName`
- **需要配置**:
  1. 将 `YourBusinessName` 替换为您的实际商家名称
  2. 将 `40.7484,-73.9857` 替换为您的实际经纬度坐标
  3. **如何获取坐标**:
     - 在Google Maps上找到您的商家
     - 右键点击位置，选择坐标
     - 格式: `纬度,经度`

### 4. Instagram

- **App Scheme**: `instagram://camera` - 打开相机拍摄页面
- **Fallback URL**: `https://www.instagram.com/create/story` - 创建故事
- 可选：将fallback URL改为 `https://www.instagram.com/你的用户名` 引导到主页

## 配置步骤

1. 打开 `app/page.js` 文件
2. 找到 `reviewPlatforms` 数组（大约在第13-47行）
3. 根据上述说明修改各平台的配置
4. 保存文件并测试

## 测试建议

1. **在真实手机上测试**: 必须在安装了各平台App的手机上测试
2. **测试流程**:
   - 点击某个平台按钮
   - 生成评论文本
   - 点击"Go to Publish"
   - 应该自动跳转到相应App
   - 如果App未安装，会打开网页版

## 重要提示

⚠️ **App Schemes的限制**:

- 某些平台（如小红书）的App Scheme可能因版本不同而变化
- 建议同时配置好fallback URL以确保用户始终能访问
- iOS和Android的App Scheme可能不同，当前配置尽量兼容两个平台

## 移动端最佳实践

- 确保fallback URL指向移动友好的页面
- 测试时清除浏览器缓存
- 在Safari (iOS) 和 Chrome (Android) 上分别测试
