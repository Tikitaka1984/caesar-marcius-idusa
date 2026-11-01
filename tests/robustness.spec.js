import { test, expect } from "@playwright/test";
test("the game starts with procedural art when the images cannot load", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/assets/roman-*.png", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#play")).toBeEnabled();
  await page.locator("#play").click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState?.active))
    .toBe(true);
  await expect
    .poll(() => page.evaluate(() => window.caesarState.renderer.calls))
    .toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
test("missing WebGL gives a readable message instead of a dead menu", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (/webgl/i.test(type)) return null;
      return original.call(this, type, ...rest);
    };
  });
  await page.goto("/");
  await expect(page.locator("#saveStatus")).toContainText("WebGL");
  await expect(page.locator("#play")).toBeDisabled();
});
test("all regions are prepared while the menu is open", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#play")).toBeEnabled();
  // Regions are built while the menu is open, one per idle slice.
  await expect
    .poll(() => page.evaluate(() => window.caesarState.loadedRegions.length), {
      timeout: 60000,
    })
    .toBe(5);
});
