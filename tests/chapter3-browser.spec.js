import { test, expect } from "@playwright/test";
import { SAVE_KEY } from "../src/story/state.js";
import { completedSecond } from "./helpers/campaign.js";
import { playThird } from "./helpers/play-chapters.js";
for (const [recipient, choice] of [
  ["lucius", "warn"],
  ["quintus", "investigate"],
  ["titus", "locate"],
])
  test(`Chapter III real walking and completed game: ${choice}`, async ({
    page,
  }) => {
    test.setTimeout(480000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400)
        errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`);
    });
    const save = completedSecond(recipient, choice);
    save.version = 2;
    delete save.chapter3;
    delete save.player.region;
    await page.addInitScript(
      ({ key, save }) => {
        if (!localStorage.getItem(key))
          localStorage.setItem(key, JSON.stringify(save));
      },
      { key: SAVE_KEY, save },
    );
    await page.goto("/");
    await page.locator("#play").click();
    await playThird(page, choice, true);
    const completed = await page.evaluate(() => window.caesarState.story);
    expect(completed.chapter3.finished).toBe(true);
    expect(completed.chapter2.decision).toBe(choice);
    expect(completed.decisions.messageRecipient).toBe(recipient);
    await page.reload();
    await expect(page.locator("#play")).toBeEnabled();
    expect(
      await page.evaluate(() => window.caesarState.story.chapter3),
    ).toEqual(completed.chapter3);
    expect(await page.evaluate(() => window.caesarState.region)).toBe("campus");
    await page.locator("#play").click();
    await page.keyboard.press("KeyJ");
    await page.getByTestId("journal3-ending").click();
    await page.getByTestId("campaign-epilogue").click();
    await expect(page.locator("#storyPanel")).toContainText("utókor");
    await expect(page.locator("#storyPanel")).toContainText(
      "Önreflexiós kérdések",
    );
    await page.getByTestId("epilogue-sources").click();
    await expect(page.locator("#storyPanel")).toContainText("Utólagos tudás");
    await page.getByTestId("sources-back").click();
    await expect(page.locator("#storyPanel")).toContainText("Önreflexiós");
    await page.getByTestId("epilogue-back").click();
    // The record export has a free-text name field: digits and letters typed
    // there must not trigger the panel's number-key shortcuts or game keys.
    await page.getByTestId("campaign-export").click();
    await page.getByTestId("record-name").fill("");
    await page.getByTestId("record-name").pressSequentially("Kiss Éva 12J");
    await expect(page.locator("#storyPanel")).toHaveAttribute(
      "data-kind",
      "record",
    );
    const record = await page.getByTestId("record-text").inputValue();
    expect(record).toContain("Név: Kiss Éva 12J");
    expect(record).toContain(`II. fejezet:`);
    expect(record).toContain("Önreflexió");
    await page.getByTestId("record-back").click();
    await page.getByTestId("campaign-explore").click();
    await expect
      .poll(() => page.evaluate(() => window.caesarState.region))
      .toBe("rome");
    expect(
      await page.evaluate(() => window.caesarState.story.chapter3.finished),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
