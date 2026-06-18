import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Check the very first paint already has property cards (no client fetch flash)
await page.goto("http://localhost:3000/properties", { waitUntil: "domcontentloaded" });
const immediateCardCount = await page.locator("h3").count();
console.log("h3 count at domcontentloaded:", immediateCardCount);

await page.waitForTimeout(1500);
const finalCardCount = await page.locator("h3").count();
console.log("h3 count after settle:", finalCardCount);

await page.screenshot({ path: "scripts/_listing.png" });
await browser.close();
