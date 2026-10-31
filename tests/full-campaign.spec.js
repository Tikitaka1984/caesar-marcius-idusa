import { test, expect } from "@playwright/test";
import { playFirst, playSecond, playThird } from "./helpers/play-chapters.js";
test("complete fresh campaign: Via Sacra to Forum to curia to ending, without seeded state", async ({
  page,
}) => {
  test.setTimeout(900000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400)
      errors.push("HTTP " + r.status() + " " + new URL(r.url()).pathname);
  });
  await page.goto("/");
  await page.locator("#campaignButton").click();
  await expect(page.locator("#storyPanel")).toContainText(
    "III. Az összeesküvés",
  );
  await page.getByTestId("campaign-continue").click();
  await playFirst(page);
  await playSecond(page);
  await playThird(page, "warn");
  await page.getByTestId("campaign-epilogue").click();
  await expect(page.locator("#storyPanel")).toContainText(
    "Köszönjük, hogy végigjátszottad",
  );
  const final = await page.evaluate(() => window.caesarState.story);
  expect(final.chapterComplete).toBe(true);
  expect(final.chapter2.decision).toBe("warn");
  expect(final.chapter3.finished).toBe(true);
  await page.reload();
  await expect(page.locator("#play")).toBeEnabled();
  expect(
    await page.evaluate(() => window.caesarState.story.chapter3.finished),
  ).toBe(true);
  expect(await page.evaluate(() => window.caesarState.story.quest)).toBe(
    "campaign-complete",
  );
  await page.locator("#newChapter").click();
  await page.getByTestId("confirm-reset").click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState.story.quest))
    .toBe("voices");
  expect(await page.evaluate(() => window.caesarState.region)).toBe("rome");
  expect(
    await page.evaluate(() => window.caesarState.story.chapter3.finished),
  ).toBe(false);
  expect(errors).toEqual([]);
});
