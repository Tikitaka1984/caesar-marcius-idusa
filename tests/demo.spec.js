import { test, expect } from "@playwright/test";
import { canOccupy, movePlayer } from "../src/game/physics.js";
test("solid objects, wall sliding and high-delta tunnelling", () => {
  const c = [{ x: 2, z: 0, w: 1, d: 10 }],
    p = { x: 0, z: 0 };
  expect(canOccupy(2, 0, c)).toBe(false);
  movePlayer(p, 10, 2, c);
  expect(p.x).toBeLessThan(1.21);
  expect(p.z).toBeCloseTo(2);
});
test("three districts, input, collisions, interactions, map and pause", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400)
      errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`);
  });
  await page.goto("/");
  await expect(page.locator("#play")).toBeVisible();
  await page.screenshot({ path: "artifacts/00-menu.png" });
  await page.locator("#play").click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState.active))
    .toBe(true);
  const hold = async (key, ms) => {
    await page.keyboard.down(key);
    await page.waitForTimeout(ms);
    await page.keyboard.up(key);
  };
  await page.screenshot({ path: "artifacts/01-via-sacra.png" });
  // Approach the first scroll using actual WASD controls.
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeLessThan(28);
  await page.keyboard.up("KeyW");
  await page.keyboard.press("KeyE");
  await expect(page.locator("#scrolls")).toContainText("1");
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeLessThan(21.5);
  await page.keyboard.up("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.interaction))
    .toBe("npc");
  await page.keyboard.press("KeyE");
  await expect(page.locator("#message")).toContainText("szenátor");
  // Walk into the senator: collision must stop progress.
  await page.keyboard.down("KeyA");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeLessThan(-0.8);
  await page.keyboard.up("KeyA");
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 15000,
      intervals: [30],
    })
    .toBeLessThan(19.8);
  await hold("KeyW", 700);
  const stopped = await page.evaluate(() => window.caesarState.z);
  await hold("KeyW", 350);
  expect(
    Math.abs((await page.evaluate(() => window.caesarState.z)) - stopped),
  ).toBeLessThan(0.2);
  await page.keyboard.down("KeyD");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeGreaterThan(1.1);
  await page.keyboard.up("KeyD");
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 40000,
      intervals: [30],
    })
    .toBeLessThan(-7);
  await page.keyboard.up("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.district))
    .toBe("FORUM ROMANUM");
  await page.screenshot({ path: "artifacts/02-forum.png" });
  // Visit the second collectible along the west portico.
  await page.keyboard.down("KeyA");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeLessThan(-6.8);
  await page.keyboard.up("KeyA");
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeLessThan(-10);
  await page.keyboard.up("KeyW");
  await page.keyboard.press("KeyE");
  await expect(page.locator("#scrolls")).toContainText("2");
  await page.keyboard.down("KeyD");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeGreaterThan(0);
  await page.keyboard.up("KeyD");
  await page.keyboard.press("KeyM");
  await expect(page.locator("#map")).toBeVisible();
  await page.keyboard.press("KeyM");
  await expect(page.locator("#map")).toBeHidden();
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 40000,
      intervals: [30],
    })
    .toBeLessThan(-25);
  await page.keyboard.up("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.district))
    .toBe("TEMPLUM SATURNI");
  await page.screenshot({ path: "artifacts/03-temple.png" });
  // Third scroll and the inscription are independent interaction types.
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeLessThan(-28.5);
  await page.keyboard.up("KeyW");
  await page.keyboard.down("KeyD");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeGreaterThan(6.8);
  await page.keyboard.up("KeyD");
  await page.keyboard.press("KeyE");
  await expect(page.locator("#scrolls")).toContainText("3");
  await page.keyboard.down("KeyA");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.x), {
      timeout: 20000,
      intervals: [30],
    })
    .toBeLessThan(-2.8);
  await page.keyboard.up("KeyA");
  await page.keyboard.down("KeyW");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeLessThan(-31.8);
  await page.keyboard.up("KeyW");
  await page.keyboard.press("KeyE");
  await expect(page.locator("#message")).toContainText("SENATUS");
  const beforeBack = await page.evaluate(() => window.caesarState.z);
  await page.keyboard.down("KeyS");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.z), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeGreaterThan(beforeBack + 1);
  await page.keyboard.up("KeyS");
  const oldYaw = await page.evaluate(() => window.caesarState.yaw);
  await page.keyboard.down("ArrowRight");
  await expect
    .poll(() => page.evaluate(() => window.caesarState.yaw), {
      timeout: 10000,
      intervals: [30],
    })
    .toBeLessThan(oldYaw - 0.4);
  await page.keyboard.up("ArrowRight");
  expect(await page.evaluate(() => window.caesarState.yaw)).toBeLessThan(
    oldYaw - 0.3,
  );
  const before = await page.evaluate(() => window.caesarState.yaw);
  await page.mouse.move(600, 400);
  await page.mouse.move(710, 425);
  await expect
    .poll(
      async () =>
        Math.abs((await page.evaluate(() => window.caesarState.yaw)) - before),
      { timeout: 5000 },
    )
    .toBeGreaterThan(0.005);
  expect(await page.evaluate(() => window.caesarState.visited.length)).toBe(3);
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu")).toBeVisible();
  const z = await page.evaluate(() => window.caesarState.z);
  await hold("KeyW", 400);
  expect(await page.evaluate(() => window.caesarState.z)).toBe(z);
  await page.locator("#play").click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState.active))
    .toBe(true);
  expect(errors).toEqual([]);
});
