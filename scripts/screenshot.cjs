const puppeteer = require("puppeteer-core");
const path = require("path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "C:/Users/Asus/AppData/Local/Temp/opencode/palei-shots";

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Event page - scroll through to find countdown
  await page.goto("http://localhost:3000/e/aarav-ananya-wedding", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Screenshot countdown area (right sidebar top)
  const cd = await page.evaluate(() => {
    const el = document.querySelector('aside');
    const r = el.getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: Math.min(r.height, 600) };
  });
  await page.screenshot({ path: path.join(OUT, "event-countdown.png"), clip: { x: cd.x, y: cd.y, width: cd.w, height: cd.h } });
  console.log("saved event-countdown.png");

  // Homepage - scroll to memories section
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 3000));
  const mem = await page.evaluate(() => {
    const el = document.getElementById("memories");
    el.scrollIntoView();
    const r = el.getBoundingClientRect();
    return { x: r.x + window.scrollX, y: r.y + window.scrollY, w: r.width, h: r.height };
  });
  await page.screenshot({ path: path.join(OUT, "memories-section.png"), clip: { x: mem.x, y: mem.y, width: mem.w, height: Math.min(mem.h, 900) } });
  console.log("saved memories-section.png");

  await browser.close();
})();