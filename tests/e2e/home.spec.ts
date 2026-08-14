import { expect, test } from "@playwright/test";

function isIgnoredDevConsoleError(message: string) {
  return (
    message.includes("/_next/webpack-hmr") &&
    message.includes("WebSocket connection") &&
    message.includes("ERR_INVALID_HTTP_RESPONSE")
  );
}

test.describe("home page", () => {
  test("renders the portfolio shell without browser errors", async ({ page }) => {
    const browserErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !isIgnoredDevConsoleError(message.text())) {
        browserErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      browserErrors.push(error.message);
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("img", { name: "SAWADESIGN" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("link", { name: /ABOUT/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /WHO AM I/ })).toBeVisible();
    await expect(page.getByText("TECH STACK")).toBeVisible();
    await expect(page.getByRole("button", { name: /詳細/ }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /INITIATE\s+CONTACT/ })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });

  test("shows category information on work cards", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const firstCard = page.locator(".work-card:visible").first();
    await expect(firstCard.locator(".work-card__category")).toBeVisible();
    await expect(firstCard.locator(".work-card__category")).not.toHaveText("");
  });

  test("opens and closes a work detail modal", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("works-interactive")).toHaveAttribute("data-ready", "true");

    await page.getByRole("button", { name: /の詳細/ }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /TECH STACK/ })).toBeVisible();

    await page.locator(".work-modal__close").click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("keeps the desktop slider shadows fixed while the rail scrolls", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Desktop slider behavior");
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const frame = page.locator(".works__viewport-frame");
    const viewport = page.locator(".works__viewport--desktop");
    await expect(frame).toBeVisible();
    await expect
      .poll(() => viewport.evaluate((element) => element.scrollLeft))
      .toBe(0);

    const shadowPlacement = await page.evaluate(() => {
      const frameElement = document.querySelector(".works__viewport-frame");
      const viewportElement = document.querySelector(".works__viewport--desktop");
      if (!frameElement || !viewportElement) return null;

      return {
        frameBefore: getComputedStyle(frameElement, "::before").content,
        frameAfter: getComputedStyle(frameElement, "::after").content,
        viewportBefore: getComputedStyle(viewportElement, "::before").content,
        viewportAfter: getComputedStyle(viewportElement, "::after").content,
      };
    });

    expect(shadowPlacement).toEqual({
      frameBefore: '\"\"',
      frameAfter: '\"\"',
      viewportBefore: "none",
      viewportAfter: "none",
    });

    await page.getByRole("button", { name: "次のWORKSを表示" }).click();
    await expect
      .poll(() => viewport.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
    await expect(frame).toBeVisible();
  });

  test("opens the matching character image from a thumbnail", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "講師実績スライド 1を拡大表示" }).click();
    const dialog = page.getByRole("dialog", { name: "講師実績スライド 1の拡大表示" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img", { name: "講師実績スライド 1" })).toHaveAttribute(
      "src",
      /gp-exp-instructor-01\.png/,
    );

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("contact form accepts input", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("you@domain.net").fill("test@example.com");
    await page.getByPlaceholder("PROJECT / BUDGET / TIMELINE").fill("E2E smoke test");

    await expect(page.getByPlaceholder("John Doe")).toHaveValue("Test User");
    await expect(page.getByPlaceholder("you@domain.net")).toHaveValue("test@example.com");
    await expect(page.getByPlaceholder("PROJECT / BUDGET / TIMELINE")).toHaveValue(
      "E2E smoke test",
    );
  });
});
