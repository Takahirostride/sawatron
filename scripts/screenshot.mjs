import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = "artifacts/screenshots";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function isServerReady() {
  try {
    const response = await fetch(baseURL, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 120_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerReady()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${baseURL}`);
}

async function primeLazyImages(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(300, Math.floor(window.innerHeight * 0.75));
    const maxY = document.documentElement.scrollHeight - window.innerHeight;

    for (let y = 0; y < maxY; y += step) {
      window.scrollTo(0, y);
      await delay(80);
    }

    window.scrollTo(0, maxY);
    await delay(250);
    window.scrollTo(0, 0);
    await delay(150);
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  let server = null;
  if (!(await isServerReady())) {
    server = spawn("npm", ["run", "dev", "--", "--hostname", "127.0.0.1"], {
      stdio: "inherit",
      env: process.env,
    });
    await waitForServer();
  }

  const browser = await chromium.launch();
  const captured = [];

  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const browserErrors = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          browserErrors.push(message.text());
        }
      });
      page.on("pageerror", (error) => {
        browserErrors.push(error.message);
      });

      await page.goto(baseURL, { waitUntil: "domcontentloaded" });
      await page.locator("main").waitFor({ state: "visible" });
      await page.waitForFunction(() => {
        return document
          .querySelector('[data-testid="works-interactive"]')
          ?.getAttribute("data-ready") === "true";
      });
      await primeLazyImages(page);
      await page.screenshot({
        path: `${outputDir}/home-${viewport.name}.png`,
        fullPage: true,
      });

      if (browserErrors.length) {
        throw new Error(`${viewport.name} browser errors:\n${browserErrors.join("\n")}`);
      }

      captured.push(`${outputDir}/home-${viewport.name}.png`);
      await page.close();
    }
  } finally {
    await browser.close();
    if (server) {
      server.kill("SIGTERM");
    }
  }

  console.log(`Captured screenshots:\n${captured.join("\n")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
