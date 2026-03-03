import puppeteer from "puppeteer";

const NODESEEK_URL = "https://www.nodeseek.com/";
const TG_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;
const COOKIE = process.env.NODESEEK_COOKIE;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function sendTG(message) {
  if (!TG_TOKEN || !TG_CHAT_ID) {
    log("⚠️ 未配置 TG，跳过通知");
    return;
  }

  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message
    })
  });

  log("📨 TG 通知已发送");
}

(async () => {
  log("🚀 NodeSeek 签到任务启动");

  if (!COOKIE) {
    log("❌ 未配置 COOKIE");
    await sendTG("❌ NodeSeek签到失败\n原因: 未配置 COOKIE");
    process.exit(1);
  }

  log("🌐 启动浏览器...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0";

  await page.setUserAgent(UA);
  log(`🧭 UA 已设置: ${UA}`);

  // 注入 Cookie
  log("🍪 注入 COOKIE...");
  const cookies = COOKIE.split(";").map(c => {
    const [name, ...rest] = c.trim().split("=");
    return {
      name,
      value: rest.join("="),
      domain: ".nodeseek.com",
      path: "/"
    };
  });

  await page.setCookie(...cookies);
  log(`✅ 已注入 ${cookies.length} 个 Cookie`);

  try {
    log(`➡️ 访问 ${NODESEEK_URL}`);
    await page.goto(NODESEEK_URL, { waitUntil: "networkidle2" });

    log("⏳ 等待页面稳定...");
    await sleep(3123);

    const title = await page.title();
log(`📄 当前页面标题: ${title}`);

if (title.includes("Just a moment") || title.includes("Attention")) {
  log("⚠️ 遇到 Cloudflare Challenge");
  await sendTG("⚠️ NodeSeek 被 Cloudflare Challenge 拦截");
  await browser.close();
  process.exit(1);
}

    
    log("📡 发送签到请求...");
    const result = await page.evaluate(async () => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.nodeseek.com/api/attendance", false);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send("");

  return {
    status: xhr.status,
    text: xhr.responseText
  };
});


    log(`📨 接口状态码: ${result.status}`);
    log(`📄 返回内容: ${result.text}`);

    if (result.status === 200) {
      log("🎉 签到成功");
      await sendTG(`✅ NodeSeek签到成功\n${result.text}`);
    } else {
      log("❌ 签到失败");
      await sendTG(`❌ NodeSeek签到失败\n状态:${result.status}\n${result.text}`);
    }

  } catch (err) {
    log(`💥 执行异常: ${err.message}`);
    await sendTG(`❌ NodeSeek签到异常\n${err.message}`);
  }

  await browser.close();
  log("🛑 浏览器已关闭");
  log("✅ 签到任务结束");
})();
