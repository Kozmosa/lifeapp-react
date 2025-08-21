# 生活任务管理器 PWA

一个支持安装的渐进式网页应用（PWA），帮助您管理每日、每周、每月任务。

## PWA 功能特性

### ✅ 已实现功能

1. **可安装性**
   - 支持在桌面和移动设备上安装
   - 自动显示安装提示
   - 独立窗口运行，类似原生应用

2. **离线功能** 
   - 缓存静态资源（JS、CSS、HTML）
   - 音效文件离线缓存
   - 离线状态下可继续使用核心功能
   - 离线页面提示

3. **任务管理**
   - 数据持久化存储（localStorage）
   - 任务完成音效提醒
   - 全部任务完成通知
   - 响应式设计适配各种设备

4. **PWA 标准**
   - Web App Manifest 配置
   - Service Worker 离线支持
   - 适配各种设备尺寸的图标
   - 符合 PWA 安装条件

## 安装方式

### 在桌面浏览器安装
1. 使用 Chrome、Edge 或 Firefox 访问应用
2. 点击地址栏右侧的安装图标
3. 或等待自动弹出的安装提示
4. 点击"安装"按钮

### 在移动设备安装
1. 使用 Chrome（Android）或 Safari（iOS）访问应用
2. Android: 点击浏览器菜单中的"添加到主屏幕"
3. iOS: 点击分享按钮，选择"添加到主屏幕"

## 开发说明

### 构建 PWA
```bash
npm run build
npm start
```

### PWA 配置文件
- `public/manifest.json` - PWA 清单文件
- `next.config.ts` - PWA 和 Service Worker 配置
- `public/icons/` - PWA 图标目录

### 技术栈
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- next-pwa (Service Worker)
- Web APIs (Notifications, Audio)

## 离线功能

应用在离线状态下仍可使用以下功能：
- ✅ 查看已缓存的任务列表
- ✅ 标记任务完成/未完成
- ✅ 本地数据保存
- ❌ 实时数据同步（需网络连接）

## 浏览器支持

| 功能 | Chrome | Firefox | Safari | Edge |
|------|---------|---------|---------|------|
| 安装 | ✅ | ✅ | ✅ | ✅ |
| 离线 | ✅ | ✅ | ✅ | ✅ |
| 通知 | ✅ | ✅ | ⚠️ | ✅ |
| 音效 | ✅ | ✅ | ⚠️ | ✅ |

⚠️ Safari 对某些功能有限制

## 注意事项

1. **图标文件**: 当前使用占位符图标，实际部署时请替换为真实图标
2. **音效文件**: 需要添加真实的 MP3 音效文件到 `/public/` 目录
3. **HTTPS**: PWA 需要在 HTTPS 环境下才能正常工作
4. **通知权限**: 首次使用需要用户授权通知权限