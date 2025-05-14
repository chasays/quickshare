# HTML-Go 代码分享平台

一个基于 Node.js/Express + MySQL 的在线 HTML/Markdown/SVG/Mermaid 代码片段分享工具，支持密码保护、内容渲染和云端部署，适配 Vercel Serverless 环境。

---

## 主要功能

- 在线分享 HTML、Markdown、SVG、Mermaid 代码片段
- 支持密码保护，私密分享
- 支持内容类型自动检测与高亮渲染
- 支持最近页面列表
- 支持用户登录认证（可选）
- 兼容 Vercel Serverless 部署，所有数据存储于云端 MySQL

---

## 快速开始

### 1. 环境准备
- Node.js 16+
- MySQL 5.7+/8.0+（推荐使用云数据库，如 PlanetScale、阿里云、腾讯云等）

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在项目根目录创建 `.env` 文件，内容示例：
```
MYSQL_HOST=your-mysql-host
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=your-mysql-db
AUTH_ENABLED=true
AUTH_PASSWORD=your-admin-password
```

### 4. 启动本地开发
```bash
npm run dev
```
访问 http://localhost:5678

---

## Vercel 部署指南

### 1. 配置 `vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "app.js" }]
}
```

### 2. 设置环境变量
在 Vercel 控制台为项目添加以下环境变量：
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `AUTH_ENABLED`（如需登录认证）
- `AUTH_PASSWORD`（如需登录认证）

### 3. 部署到 Vercel
- 安装 Vercel CLI（如未安装）：
  ```bash
  npm install -g vercel
  ```
- 登录 Vercel：
  ```bash
  vercel login
  ```
- 部署（推荐生产环境）：
  ```bash
  vercel --prod
  ```

---

## 目录结构

```
html-go-express/
├── app.js                # 主应用入口
├── models/
│   ├── db.js             # MySQL 数据库封装
│   └── pages.js          # 页面数据操作
├── routes/
│   └── pages.js          # API 路由
├── middleware/
│   └── auth.js           # 认证中间件
├── utils/                # 工具函数
├── public/               # 静态资源
├── views/                # EJS 模板
├── config.js             # 配置加载
├── vercel.json           # Vercel 部署配置
├── package.json
└── ...
```

---

## 常见问题与注意事项

- **Vercel 环境不支持本地文件存储**，所有会话和数据均存储于 MySQL。
- **首次部署会自动建表**，如遇权限问题请检查 MySQL 用户权限。
- **如需本地测试，需先启动 MySQL 并配置好环境变量。**
- **如需关闭认证，将 `AUTH_ENABLED` 设为 `false`。**
- **如需自定义端口，请修改 `config.js` 或设置 `PORT` 环境变量。**

---

## 联系与反馈

如有问题或建议，欢迎提交 Issue 或 PR。 