export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleSchedule(env));
  },

  async fetch(request, env, ctx) {
  const url = new URL(request.url);

  // ===== 手动签到入口 =====
  if (url.pathname === "/s") {
    var ss = await doCheckin(env)
    return new Response("ssssss:"+ss);
  }
  else if (url.pathname === "/tg") {
  const COOKIE = env.NODESEEK_COOKIE;
  const TG_TOKEN = env.TG_BOT_TOKEN;
  const TG_CHAT_ID = env.TG_CHAT_ID;
    await sendTG(`❌ NodeSeek test`, TG_TOKEN, TG_CHAT_ID);
    return new Response("tg");
  }
  
    return new Response("NodeSeek Worker Alive");
  }
};

async function handleSchedule(env) {
  const now = new Date();
  const utcHour = now.getUTCHours();

  // ===== 时间范围（UTC）=====
  const START_HOUR = 0;   // 新加坡 08:00
  const END_HOUR = 4;     // 新加坡 12:00

  if (utcHour < START_HOUR || utcHour >= END_HOUR) return;

  const today = now.toISOString().slice(0, 10);
  const todayKey = `checkin-${today}`;

  // 今日是否已尝试
  const already = await env.KV.get(todayKey);
  if (already) return;

  // 随机触发概率
  if (Math.random() > 0.25) return;
  
  // ===== 只要开始尝试 → 立刻锁定当天 =====
  await env.KV.put(todayKey, "attempted", { expirationTtl: 86400 });

  await doCheckin(env);
}

async function doCheckin(env) {
  const COOKIE = env.NODESEEK_COOKIE;
  const TG_TOKEN = env.TG_BOT_TOKEN;
  const TG_CHAT_ID = env.TG_CHAT_ID;

  if (!COOKIE) {
    await sendTG("❌ NodeSeek签到失败\n原因: 未配置 COOKIE", TG_TOKEN, TG_CHAT_ID);
    return "未配置";
  }

  // ===== User-Agent 可配置 =====
  const ua = env.USER_AGENT || 
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0";

  try {
    const resp = await fetch("https://www.nodeseek.com/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": COOKIE,  // 使用 session Cookie

        // 拟真浏览器头
        "User-Agent": ua,
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Origin": "https://www.nodeseek.com",
        "Referer": "https://www.nodeseek.com/",
        "Connection": "keep-alive",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      body: "random=true"
    });

    const text = await resp.text();

    // ===== 无论成功失败都通知 =====
    if (resp.ok) {
      await sendTG(`✅ NodeSeek签到请求完成\n状态: ${resp.status}\n${text}`, TG_TOKEN, TG_CHAT_ID);
    return "66";
    } else {
      await sendTG(`❌ NodeSeek签到失败\n状态: ${resp.status}\n${text}`, TG_TOKEN, TG_CHAT_ID);
    return "11111111111111111"+text;
    }
  } catch (err) {
    await sendTG(`❌ NodeSeek签到异常\n错误: ${err.message}`, TG_TOKEN, TG_CHAT_ID);
    return err.message;
  }
}

async function sendTG(message, token, chatId) {
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });
}
