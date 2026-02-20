🚀 NodeSeek 自动签到 Worker

基于 Cloudflare Workers 实现的 NodeSeek 自动签到脚本，支持：

⏰ 定时自动签到（随机概率触发）

🖱 手动触发签到

📩 Telegram 通知结果

🧠 KV 防重复签到锁

✨ 功能说明
⏰ 自动签到机制

Worker 使用 scheduled 事件：

仅在指定 UTC 时间段执行

每日只尝试一次（KV 锁）

随机 25% 概率触发

成功 / 失败均发送 TG 通知

START_HOUR = 0   // UTC 00:00 → 新加坡 08:00
END_HOUR   = 4   // UTC 04:00 → 新加坡 12:00
🖱 手动签到入口

访问：

https://你的worker域名/s

返回签到执行结果。

📩 Telegram 测试入口

访问：

https://你的worker域名/tg

发送测试消息到 Telegram。

🔧 环境变量配置

在 Cloudflare Worker → Settings → Variables 中添加：

变量名	必填	说明
NODESEEK_COOKIE	✅	NodeSeek 登录 Cookie
TG_BOT_TOKEN	❌	Telegram Bot Token
TG_CHAT_ID	❌	Telegram Chat ID
USER_AGENT	❌	自定义 UA（可不填）
🍪 获取 NodeSeek Cookie

登录 https://www.nodeseek.com

打开浏览器开发者工具 → Network

找任意请求 → Headers → Cookie

复制完整 Cookie 填入 Worker

⚠ 务必保密 Cookie

🧠 KV 绑定（必须）

用于每日签到锁。

Worker → Settings → KV Namespace Bindings：

Binding name: KV
Namespace: 你的KV
⏰ Cron 触发器示例

Worker → Triggers → Cron：

*/20 0-4 * * *

说明：

UTC 00:00–04:59

每 20 分钟触发一次

实际签到仍受概率控制

📩 Telegram Bot 获取方法

1️⃣ 创建 Bot
👉 https://t.me/BotFather

2️⃣ 获取 Chat ID
👉 https://t.me/userinfobot

✅ 成功通知示例
✅ NodeSeek签到请求完成
状态: 200
{"success":true}
❌ 失败通知示例
❌ NodeSeek签到失败
状态: 403
未登录或Cookie失效
⚠ 注意事项

Cookie 失效会导致签到失败

Worker 免费额度完全够用

建议配合随机概率防风控

KV 锁避免重复签到

📜 License

MIT License
