import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [360, 768, 1280, 1440]) {
  test(`timeline is readable and navigable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("./");
    await expect(
      page.getByRole("heading", { name: "No date confirmed yet." }),
    ).toBeVisible();
    await expect(page.locator(".session-card")).toHaveCount(60);
    await expect(
      page.locator(".session-card .status", { hasText: "Proposed" }),
    ).toHaveCount(60);
    await expect(page.locator(".month-chapter")).toHaveCount(9);
    for (const chapter of await page.locator(".month-chapter").all()) {
      await expect(chapter.locator(".track-section.has-sessions")).toHaveCount(
        3,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const violations = (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations;
    expect(violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/timeline-${width}.png`,
      fullPage: true,
    });
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to the season" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#season")).toBeFocused();
    if (width !== 360) {
      await page
        .locator(".season-matrix:visible")
        .first()
        .getByRole("link", { name: /October 2026, Foundations/ })
        .click();
      await expect(page.locator('[id="2026-10-foundations"]')).toBeFocused();
    }
    if (width === 360) {
      await page.getByLabel("Explore a month").selectOption("2027-06");
      await expect(page.locator(".mobile-track-topics")).toContainText(
        "When to use AI",
      );
      await page.getByRole("link", { name: "View June 2027" }).click();
      await expect(page).toHaveURL(/#month-2027-06$/);
      await expect(page.locator("#month-2027-06")).toBeFocused();
    }
  });
}
for (const width of [360, 1440]) {
  test(`secondary pages and session navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./");
    await page.locator(".session-link").first().click();
    await expect(page).toHaveURL(/session=p01-talk/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "How Does an LLM Actually Work? Without the Maths",
    );
    await expect(
      page.getByText("Not confirmed yet.", { exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to this session" }).click();
    await expect(page).toHaveURL(/#p01-talk$/);
    for (const path of [
      "?page=about",
      "?page=voting",
      "?page=materials",
      "?session=p01-talk",
      "?session=missing",
    ]) {
      await page.goto(`./${path}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: `test-results/page-${path.slice(1).replace("=", "-")}-${width}.png`,
        fullPage: true,
      });
      if (path === "?page=voting") {
        await expect(
          page.getByText("Voting is not open.", { exact: true }),
        ).toBeVisible();
        await expect(page.getByRole("radio")).toHaveCount(0);
      }
    }
  });
}
test("hero preserves the original reference dimensions", async ({ page }) => {
  await page.setViewportSize({ width: 1672, height: 1000 });
  await page.goto("./");
  const hero = page.locator(".reference-hero");
  await expect(hero.locator("img").first()).toBeVisible();
  await hero
    .locator("img")
    .first()
    .evaluate((img: HTMLImageElement) => img.decode());
  expect(await hero.boundingBox()).toMatchObject({
    x: 0,
    y: 0,
    width: 1672,
    height: 281,
  });
  await expect(hero.locator(".hero-lettering")).toBeVisible();
  await hero
    .locator(".hero-lettering")
    .evaluate((img: HTMLImageElement) => img.decode());
  await hero.screenshot({ path: "test-results/hero-native.png" });
});
test("hero lettering renders as vectors on Retina displays", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1672, height: 1000 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  const vector = page.locator(".hero-lettering");
  await expect(vector).toHaveAttribute("src", /\.svg$/);
  await vector.evaluate((img: HTMLImageElement) => img.decode());
  await page
    .locator(".reference-hero")
    .screenshot({ path: "test-results/hero-retina.png" });
  await context.close();
});

// Ensure the index does not hide the second pair or double-count a talk/workshop.
test("season index exposes topics and both October engineering pairs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1672, height: 1000 });
  await page.goto("./");
  const matrix = page.locator(".wide-index .season-matrix");
  await expect(matrix.locator(".topic-labels > span")).toHaveCount(30);
  const october = matrix.getByRole("link", {
    name: /October 2026, Engineering/,
  });
  await expect(october).toContainText("AI architecture");
  await expect(october).toContainText("Human oversight");
  await expect(october).toContainText("2 topics");
  await expect(october).toHaveAccessibleName(/4 sessions$/);
  await page.evaluate(() => document.fonts.ready);
  await matrix.screenshot({ path: "test-results/season-grid-desktop.png" });
  await october.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('[id="2026-10-engineering"]')).toBeFocused();
  await page.setViewportSize({ width: 360, height: 1000 });
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".mobile-season-index")
    .screenshot({ path: "test-results/season-grid-mobile.png" });
});
