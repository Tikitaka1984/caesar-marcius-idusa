import { expect } from "@playwright/test";
import { controls } from "./campaign.js";
export async function travel(page, id) {
  await page.keyboard.press("KeyV");
  await expect(page.locator("#storyTitle")).toHaveText("Róma városrészei");
  await page.getByTestId("travel-" + id).click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState.region))
    .toBe(id);
  await expect
    .poll(() => page.evaluate(() => window.caesarState.active))
    .toBe(true);
}
export async function playSubura(page, pictures = false) {
  await travel(page, "subura");
  const c = controls(page);
  if (pictures)
    await expect(page.locator("#message")).toHaveText("", { timeout: 7000 });
  if (pictures)
    await page.screenshot({ path: "test-results/screenshots/city-subura.png" });
  await c.walk(0, 16);
  await c.interact("courier");
  await page.getByTestId("courier-start").click();
  await c.interact("courier");
  await page.getByTestId("courier-start").click();
  expect((await c.pos()).story.city.courierRun).toBe(2);
  // Follow the winding route with real WASD, using the same accessible bends as the courier.
  await c.move("x", -3);
  await c.move("z", 3);
  await c.move("x", 4);
  await c.move("z", -9);
  await c.move("x", -8);
  await c.move("z", -15.8);
  await expect
    .poll(
      () => page.evaluate(() => window.caesarState.story.city.courierArrived),
      { timeout: 90000 },
    )
    .toBe(true);
  await c.interact("seal");
  await page.getByTestId("seal-accuse").click();
  await expect(page.locator("#storyPanel")).toContainText("próbáld újra");
  await page.getByTestId("seal-limited").click();
  await page.getByTestId("seal-done").click();
  expect((await c.pos()).story.city.seal).toBe(true);
  await travel(page, "rome");
}
export async function playBoarium(page, pictures = false) {
  await travel(page, "boarium");
  const c = controls(page);
  if (pictures)
    await expect(page.locator("#message")).toHaveText("", { timeout: 7000 });
  if (pictures)
    await page.screenshot({
      path: "test-results/screenshots/city-boarium.png",
    });
  for (const [id, x, z] of [
    ["manifest", 8, 3],
    ["cargo", -11, -11],
  ]) {
    await c.walk(x, z);
    await c.interact(id);
    await page.getByTestId("city-close").click();
  }
  await c.move("x", -16.4);
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyA");
  expect((await c.pos()).x).toBeGreaterThan(-16.85);
  await c.move("x", 0);
  await c.walk(2, -14);
  await c.interact("witness");
  await page.getByTestId("loading-observe").click();
  await page.getByTestId("loading-skip").click();
  await page.getByTestId("dock-accuse").click();
  await expect(page.locator("#storyPanel")).toContainText("Próbáld újra");
  await page.getByTestId("dock-delivery").click();
  await page.getByTestId("dock-done").click();
  await travel(page, "rome");
}
export async function playDomus(page, pictures = false) {
  await travel(page, "domus");
  const c = controls(page);
  if (pictures)
    await expect(page.locator("#message")).toHaveText("", { timeout: 7000 });
  if (pictures)
    await page.screenshot({ path: "test-results/screenshots/city-domus.png" });
  // The still-closed gate physically blocks the central passage into the garden.
  await c.move("z", -3.1);
  const before = (await c.pos()).z;
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(350);
  await page.keyboard.up("KeyW");
  expect((await c.pos()).z).toBeGreaterThan(-3.5);
  expect(before).toBeGreaterThan(-3.5);
  await c.move("z", 10.1);
  await c.move("x", 4);
  await c.interact("doorkeeper");
  await page.getByTestId("garden-accuse").click();
  await expect(page.locator("#storyPanel")).toContainText(
    "Nem tudsz ilyet igazolni",
  );
  await page.getByTestId("garden-origin").click();
  await page.getByTestId("garden-open-done").click();
  await c.move("x", 0);
  await c.move("z", -12.9);
  await c.move("x", 5);
  await c.interact("host");
  await page.getByTestId("garden-deliver").click();
  await page.getByTestId("garden-done").click();
  if (pictures)
    await expect(page.locator("#message")).toHaveText("", { timeout: 7000 });
  if (pictures)
    await page.screenshot({
      path: "test-results/screenshots/city-domus-garden.png",
    });
  await travel(page, "rome");
}
