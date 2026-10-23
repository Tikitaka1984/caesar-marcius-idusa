import { test, expect } from "@playwright/test";
import { SAVE_KEY } from "../src/story/state.js";
test("chapter one: all quests, retry, delivery, Forum handoff and reload", async ({
  page,
}) => {
  test.setTimeout(360000);
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
  await page.locator("#play").click();

  const go = async (key, axis, target, less = true) => {
    await page.keyboard.down(key);
    try {
      const assertion = expect.poll(
        () => page.evaluate((prop) => window.caesarState[prop], axis),
        { timeout: 45000, intervals: [30] },
      );
      if (less) await assertion.toBeLessThan(target);
      else await assertion.toBeGreaterThan(target);
    } finally {
      await page.keyboard.up(key);
    }
  };
  const interact = async (id) => {
    await expect
      .poll(() => page.evaluate(() => window.caesarState.interactionId))
      .toBe(id);
    await page.keyboard.press("KeyE");
    await expect(page.locator("#storyPanel")).toBeVisible();
    await expect(page.locator("#menu")).toBeHidden();
  };
  const closeAnswer = async () => {
    await page.getByTestId("close-dialogue").click();
    await expect(page.locator("#storyPanel")).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => window.caesarState.active))
      .toBe(true);
    await expect
      .poll(() => page.evaluate(() => document.pointerLockElement?.id))
      .toBe("game");
  };
  // Movement is real WASD input throughout; the telemetry is read-only.
  await go("KeyW", "z", 21.3);
  await interact("quintus");
  const z = await page.evaluate(() => window.caesarState.z);
  await page.keyboard.press("KeyW");
  expect(await page.evaluate(() => window.caesarState.z)).toBe(z);
  await page.keyboard.press("Digit1");
  await expect(page.locator("#questProgress")).toHaveText("1/3");
  await page.screenshot({ path: "artifacts/05-story-dialogue.png" });
  await closeAnswer();
  // ESC closes an overlay without unexpectedly opening the pause menu.
  await page.keyboard.press("KeyJ");
  await expect(page.locator("#storyTitle")).toHaveText("Küldetésnapló");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.getElementById("storyPanel").contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator("#storyPanel")).toBeHidden();
  await expect(page.locator("#menu")).toBeHidden();
  await page.locator("#game").click();
  await expect
    .poll(() => page.evaluate(() => document.pointerLockElement?.id))
    .toBe("game");
  await go("KeyD", "x", 2.8, false);
  await go("KeyW", "z", 11.2);
  await interact("marcus");
  await page.getByTestId("question-marcus-war").click();
  await expect(page.locator("#questProgress")).toHaveText("2/3");
  await closeAnswer();
  await go("KeyA", "x", 0.1);
  await go("KeyW", "z", -5.5);
  await go("KeyA", "x", -2.9);
  await interact("lucius");
  await page.getByTestId("question-lucius-soldiers").click();
  await expect(page.locator("#questTitle")).toHaveText("Az elveszett üzenet");
  await closeAnswer();
  await go("KeyS", "z", 16.5, false);
  await interact("tablet");
  await expect(page.locator("#storyPanel")).toContainText(
    "nem fennmaradt ókori forrás",
  );
  await page.getByTestId("open-conclusion").click();
  await page.getByTestId("conclusion-A").click();
  await expect(page.locator('#storyPanel [role="status"]')).toContainText(
    "nem nevezi meg Caesart",
  );
  expect(
    await page.evaluate(() => window.caesarState.story.interpretation),
  ).toBe(null);
  await expect(page.getByTestId("conclusion-B")).toBeVisible();
  await page.screenshot({ path: "artifacts/06-story-evidence.png" });
  await page.getByTestId("conclusion-C").click();
  await expect(page.locator('#storyPanel [role="status"]')).toContainText(
    "bizonyítatlan",
  );
  await page.getByTestId("conclusion-B").click();
  await expect(page.locator("#questTitle")).toHaveText(
    "Kinek adod át az üzenetet?",
  );
  await page.getByTestId("open-delivery").click();
  await page.getByTestId("recipient-titus").click();
  expect(
    await page.evaluate(() => window.caesarState.story.chapterComplete),
  ).toBe(false);
  await page.getByTestId("follow-recipient").click();
  await go("KeyS", "z", 33, false);
  await interact("titus");
  await page.getByTestId("question-titus-fear").click();
  await page.getByTestId("more-questions").click();
  await page.getByTestId("deliver-message").click();
  await page.getByTestId("confirm-delivery").click();
  await expect(page.locator("#storyPanel")).toContainText(
    "I. fejezet teljesítve – A köztársaság árnyéka következik.",
  );
  await page.screenshot({ path: "artifacts/07-story-ending.png" });
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    SAVE_KEY,
  );
  expect(saved.version).toBe(1);
  expect(saved.decisions.messageRecipient).toBe("titus");
  expect(saved.interpretation).toBe("B");
  expect(saved.conclusionAttempts).toBe(3);
  await page.getByTestId("continue-forum").click();
  await go("KeyW", "z", -0.7);
  await expect
    .poll(() => page.evaluate(() => window.caesarState.story.nextChapterReady))
    .toBe(true);
  await expect(page.locator("#questTitle")).toHaveText("A Forumon vagy");
  await page.reload();
  await expect(page.locator("#play")).toBeEnabled();
  expect(
    await page.evaluate(
      () => window.caesarState.story.decisions.messageRecipient,
    ),
  ).toBe("titus");
  expect(
    await page.evaluate(() => window.caesarState.story.nextChapterReady),
  ).toBe(true);
  await page.locator("#play").click();
  await page.keyboard.press("KeyB");
  await expect(page.locator("#storyPanel")).toContainText(
    "Az elveszett viasztábla",
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu")).toBeVisible();
  await page.locator("#loadSave").click();
  await expect(page.locator("#saveStatus")).toContainText(
    "Mentés visszatöltve",
  );
  expect(errors).toEqual([]);
});
test("a corrupt or obsolete browser save recovers to a playable chapter", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, '{"version":0}'),
    SAVE_KEY,
  );
  await page.goto("/");
  await expect(page.locator("#play")).toBeEnabled();
  await expect(page.locator("#saveStatus")).toContainText("sérült");
  await page.locator("#newChapter").click();
  await expect(page.locator("#storyPanel")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu")).toBeVisible();
  expect(await page.evaluate(() => window.caesarState.active)).toBe(false);
  await page.locator("#play").click();
  await page.keyboard.press("KeyJ");
  await expect(page.locator("#storyPanel")).toContainText("Róma hangjai");
  expect(await page.evaluate(() => window.caesarState.story.voices)).toBe(0);
});
