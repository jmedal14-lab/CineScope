import { test, expect } from "@playwright/test";
test("title and keyword discovery, URL state, empty query and direct movie navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("textbox").fill("   ");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("textbox").fill(" Beyond the Quiet Stars ");
  await page.getByRole("textbox").press("Enter");
  await expect(page).toHaveURL(/\/search\?q=Beyond/);
  await page
    .getByRole("link", { name: "Beyond the Quiet Stars, 2026" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Beyond the Quiet Stars",
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Cast", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to results" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Beyond the Quiet Stars");
  await page.goto("/search?q=space&page=1&sort=relevance");
  await page.getByLabel("Sort", { exact: true }).selectOption("rating");
  await expect(page).toHaveURL(/page=1&sort=rating/);
  await page.getByRole("link", { name: "Next →" }).click();
  await expect(page).toHaveURL(/page=2&sort=rating/);
  await page.reload();
  await expect(page.getByLabel("Sort", { exact: true })).toHaveValue("rating");
  await page.goBack();
  await expect(page).toHaveURL(/page=1&sort=rating/);
  await page.goto("/search?q=zzzzunmatched");
  await expect(
    page.getByRole("heading", { name: "No movies found" }),
  ).toBeVisible();
  await page.goto("/movie/invalid");
  await expect(
    page.getByRole("heading", { name: "Movie or page not found" }),
  ).toBeVisible();
});
test("modal focus, Escape, backdrop, player unload, cast and recommendation identity", async ({
  page,
}) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      body: "<button>Play sample</button>",
      contentType: "text/html",
    }),
  );
  await page.goto("/movie/90000001");
  const trigger = page.getByRole("button", { name: "Watch sample video" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close trailer" }),
  ).toBeFocused();
  await expect(page.locator("iframe")).toHaveAttribute("src", /aqz-KE-bpKQ/);
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("dialog").contains(document.activeElement),
    ),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(1, 1);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.getByText("Show all cast (15)").click();
  await expect(
    page.getByRole("heading", { name: "Demo performer 15" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "The Last Picture House, 2025" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The Last Picture House",
  );
  await expect(
    page.getByText("Trailer unavailable.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Cast information is unavailable."),
  ).toBeVisible();
});
for (const width of [360, 768, 1440])
  for (const theme of ["light", "dark"])
    test(`layout ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (theme) => localStorage.setItem("cinescope-theme", theme),
        theme,
      );
      await page.route("https://www.youtube-nocookie.com/**", (route) =>
        route.fulfill({
          body: "<button>Play</button>",
          contentType: "text/html",
        }),
      );
      for (const route of [
        "/",
        "/catalog",
        "/search?q=space&page=1&sort=az",
        "/movie/90000003",
      ]) {
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
        await page.screenshot({
          path: `test-results/${width}-${theme}-${route === "/" ? "home" : route.startsWith("/movie") ? "detail" : route.startsWith("/search") ? "search" : "catalog"}.png`,
          fullPage: true,
        });
      }
      await page.getByRole("button", { name: "Watch sample video" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `test-results/${width}-${theme}-modal.png`,
      });
      await page.keyboard.press("Escape");
      await page.emulateMedia({ reducedMotion: "reduce" });
      const card = page.locator("a[aria-label]").last();
      await card.hover();
      expect(
        await card.evaluate((el) => getComputedStyle(el).transform),
      ).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
    });
