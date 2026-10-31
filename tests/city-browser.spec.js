import { test, expect } from "@playwright/test";
import { SAVE_KEY } from "../src/story/state.js";
import { freshChapter2 } from "../src/story/chapter2.js";
import { completedSecond, controls } from "./helpers/campaign.js";
import {
  playSubura,
  playBoarium,
  playDomus,
  travel,
} from "./helpers/city-play.js";
test("old completed campaign visits three new city scenes, solves tasks and reloads without losing decisions", async ({
  page,
}) => {
  test.setTimeout(600000);
  const raw = completedSecond("quintus", "investigate");
  raw.version = 3;
  delete raw.city;
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(raw));
    },
    { key: SAVE_KEY, raw },
  );
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await page.locator("#play").click();
  await playSubura(page, true);
  await playBoarium(page, true);
  await playDomus(page, true);
  const before = await page.evaluate(() => window.caesarState.story);
  expect(before.chapter2.decision).toBe("investigate");
  expect(before.decisions.messageRecipient).toBe("quintus");
  expect(
    before.city.seal && before.city.dockConclusion && before.city.delivered,
  ).toBe(true);
  await travel(page, "domus");
  await page.reload();
  await expect(page.locator("#play")).toBeEnabled();
  expect(await page.evaluate(() => window.caesarState.region)).toBe("domus");
  expect(await page.evaluate(() => window.caesarState.story.city)).toEqual(
    before.city,
  );
  await page.locator("#play").click();
  await travel(page, "rome");
  expect(
    await page.evaluate(() => window.caesarState.story.chapter2.decision),
  ).toBe("investigate");
  expect(errors).toEqual([]);
});
test("a temple checkpoint can travel early, return and visibly complete the Forum introduction", async ({
  page,
}) => {
  test.setTimeout(240000);
  const raw = completedSecond();
  raw.version = 3;
  raw.chapter2 = freshChapter2();
  raw.player = { x: 0, z: -31, yaw: 0, pitch: 0, region: "rome" };
  delete raw.city;
  delete raw.regionPositions;
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(key, JSON.stringify(raw));
    },
    { key: SAVE_KEY, raw },
  );
  await page.goto("/");
  await page.locator("#play").click();
  await travel(page, "boarium");
  expect(await page.evaluate(() => window.caesarState.story.quest)).toBe(
    "allies",
  );
  await travel(page, "rome");
  expect(await page.evaluate(() => window.caesarState.z)).toBeCloseTo(-31, 1);
  const c = controls(page);
  await c.walk(-5, -5);
  await c.interact("veteran");
  await page.getByTestId("introduce2").click();
  await expect(page.locator(".current-step")).toContainText(
    "A köztársaság mérlegen",
  );
  await expect(page.locator("#storyPanel")).toContainText(
    "ez a feladat teljesült",
  );
  await page.reload();
  await expect(page.locator("#play")).toBeEnabled();
  expect(await page.evaluate(() => window.caesarState.story.quest)).toBe(
    "politics",
  );
});
