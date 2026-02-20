# 🚀 NodeSeek 自动签到助手

一个基于 **GitHub Actions + Puppeteer** 的 NodeSeek 自动签到工具。

无需 VPS / 服务器，即可每天自动签到。

---

## ✨ 功能特点

- ✅ 自动每日签到
- ✅ 真实浏览器模拟（Puppeteer）
- ✅ 可绕过 Cloudflare Challenge
- ✅ Telegram 通知
- ✅ GitHub Actions 免费运行
- ✅ 支持手动触发

---

## 🧠 工作原理

GitHub Actions 定时运行  
→ 启动 Chromium 浏览器  
→ 注入登录 Cookie  
→ 发送签到请求  
→ 推送 Telegram 通知  

---

# 📦 使用教程

---

## 1️⃣ Fork 本仓库

点击右上角 **Fork** 按钮。

---

## 2️⃣ 设置 Repository Secrets（重要）


添加以下参数：

---

### 🔐 必填 Secrets

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `NODESEEK_COOKIE` | 浏览器登录后的完整 Cookie | `session=xxx; fog=xxx; smac=xxx;` |
| `TG_BOT_TOKEN` | Telegram 机器人 Token | `123456:ABCxxxxx` |
| `TG_CHAT_ID` | Telegram 聊天 ID | `123456789` |

---

## 🧾 如何获取 NODESEEK_COOKIE

1. 打开 NodeSeek 并确保已登录  
2. 按 F12 → Application  
3. 点击 Cookies → www.nodeseek.com  
4. 复制所有 Cookie 拼成一行，例如： session=xxx; fog=xxx; smac=xxx;


⚠️ 不要漏掉分号

---

## 🤖 如何获取 Telegram 参数

### 获取 BOT TOKEN

1. Telegram 搜索 `@BotFather`
2. 发送 `/newbot`
3. 按提示创建
4. 得到： 123456:ABCxxxxxx



---

### 获取 CHAT ID

浏览器访问：
https://api.telegram.org/bot你的BOT_TOKEN/getUpdates

给机器人发送一条消息，然后刷新页面，找到：

"chat": {
"id": 123456789
}


这个数字就是你的 `TG_CHAT_ID`

---

## 3️⃣ 启用 GitHub Actions

进入：
Actions → Enable workflows  → NodeSeek Checkin → Run workflow

日志会显示：

- 浏览器启动状态
- Cookie 注入情况
- HTTP 状态码
- 接口返回内容
- 是否已签到

---

## ⚠️ 常见问题

### 1️⃣ 返回 401

Cookie 已过期，请重新复制更新。

---

### 2️⃣ 返回 "Enable JavaScript and cookies"

被 Cloudflare Challenge 拦截，请重新运行或更新 Cookie。

---

### 3️⃣ 返回 500 + 已完成签到

代表今天已经签到成功。

---

## 📜 License

MIT License

---

## ⚠️ 免责声明

本项目仅供学习自动化技术使用，请遵守 NodeSeek 平台相关规定。
