import { test, expect } from "@playwright/test";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  CLAIMS,
} from "../src/story/chapter2.js";
import { SAVE_KEY } from "../src/story/state.js";
const oldSave = (recipient) => ({
  version: 1,
  answers: {
    marcus: ["war"],
    lucius: ["soldiers"],
    quintus: ["senators"],
    titus: [],
  },
  evidence: ["wax-tablet"],
  interpretation: "B",
  decisions: { messageRecipient: recipient },
  chapterComplete: true,
  nextChapterReady: true,
  player: { x: 0, z: -1, yaw: 0, pitch: 0 },
  world: { scrolls: [0], visited: ["VIA SACRA", "FORUM ROMANUM"] },
});
for (const recipient of Object.keys(BRANCHES))
  test(`Chapter II actual walking: ${recipient}`, async ({ page }) => {
    test.setTimeout(480000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push("HTTP " + r.status() + " " + r.url());
    });
    await page.addInitScript(
      ({ key, save }) => {
        if (!localStorage.getItem(key))
          localStorage.setItem(key, JSON.stringify(save));
      },
      { key: SAVE_KEY, save: oldSave(recipient) },
    );
    await page.goto("/");
    await expect(page.locator("#play")).toBeEnabled();
    await page.locator("#play").click();
    const pos = () => page.evaluate(() => window.caesarState);
    const move = async (axis, target) => {
      const before = await pos();
      if (Math.abs(before[axis] - target) < 0.12) return;
      const positive = before[axis] < target;
      const key =
        axis === "x"
          ? positive
            ? "KeyD"
            : "KeyA"
          : positive
            ? "KeyS"
            : "KeyW";
      await page.keyboard.down(key);
      try {
        await expect
          .poll(
            async () => {
              const s = await pos();
              return positive ? s[axis] >= target : s[axis] <= target;
            },
            { timeout: 45000, intervals: [30] },
          )
          .toBe(true);
      } finally {
        await page.keyboard.up(key);
      }
    };
    // Use the open central lane; never assign camera position or mutate runtime state.
    const walk = async (x, z) => {
      await move("x", 0);
      await move("z", z + 2.1);
      await move("x", x);
    };
    const interact = async (id) => {
      await expect.poll(async () => (await pos()).interactionId).toBe(id);
      await page.keyboard.press("KeyE");
      await expect(page.locator("#storyPanel")).toBeVisible();
    };
    const close = async () => {
      await page.keyboard.press("Escape");
      await expect.poll(async () => (await pos()).active).toBe(true);
    };
    const b = BRANCHES[recipient];
    await walk(b.x, b.z);
    await interact(b.guide);
    await page.getByTestId("introduce2").click();
    await close();
    if (recipient === "titus") {
      // Go around the existing east statue before approaching the ledger.
      await move("x", 0);
      await move("z", 0);
      await move("x", 10.5);
      await move("z", -3.5);
      await interact("ledger");
      await page.getByTestId("ledger-access").click();
      await close();
      await move("z", 0);
    }
    for (const [id, n] of Object.entries(POLITICIANS)) {
      await walk(n.x, n.z);
      await interact(id);
      for (const [index, q] of n.questions.entries()) {
        await page.getByTestId(`question2-${id}-${q[0]}`).click();
        await expect(page.locator("#storyPanel")).toContainText(q[2]);
        if (recipient === "lucius" && index === 0)
          await page.screenshot({
            path: `artifacts/chapter2-${id}-dialogue.png`,
          });
        await page.getByTestId("more2").click();
      }
      await close();
    }
    await page.keyboard.press("KeyJ");
    await page.getByTestId("politics-open").click();
    await page.getByTestId("politics-traitors").click();
    await expect(page.locator("#storyPanel")).toContainText("újra");
    await page.getByTestId("politics-balanced").click();
    await close();
    for (const d of DOCUMENTS) {
      await walk(d.x, d.z);
      await move("z", d.z + 1.2);
      await interact(d.id);
      await expect(page.locator("#storyPanel")).toContainText(d.text);
      if (recipient === "lucius")
        await page.screenshot({
          path: `artifacts/chapter2-document-${d.id}.png`,
        });
      await close();
    }
    await page.keyboard.press("KeyB");
    await page.getByTestId("compare-submit").click();
    await expect(page.locator("#storyPanel")).toContainText("javítandó");
    for (const q of CLAIMS)
      await page.getByTestId("classify-" + q.id).selectOption(q.category);
    await page.getByTestId("compare-submit").click();
    await expect(page.locator("#storyPanel")).toContainText(
      "Helyes összevetés",
    );
    if (recipient === "lucius") {
      await page.getByTestId("classify-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: "artifacts/chapter2-comparison.png" });
    }
    await page.getByTestId("distinction-open").click();
    await page.getByTestId("distinction-accuse").click();
    await expect(page.locator("#storyPanel")).toContainText("Próbáld újra");
    await page.getByTestId("distinction-limited").click();
    await close();
    await walk(-4, -27);
    await interact("informant");
    await expect(page.locator("#storyPanel")).toContainText("Campus Martius");
    const choice = { lucius: "warn", quintus: "investigate", titus: "locate" }[
      recipient
    ];
    await page.getByTestId("final-" + choice).click();
    await page.getByTestId("final-confirm").click();
    await expect(page.locator("#storyTitle")).toHaveText(
      "II. fejezet teljesítve – Az összeesküvés következik.",
    );
    await page.screenshot({
      path: `artifacts/chapter2-ending-${recipient}.png`,
    });
    const final = (await pos()).story;
    await page.reload();
    await expect(page.locator("#play")).toBeEnabled();
    expect((await pos()).story.chapter2).toEqual(final.chapter2);
    expect((await pos()).story.decisions.messageRecipient).toBe(recipient);
    expect((await pos()).story.quest).toBe("chapter2-complete");
    expect(errors).toEqual([]);
  });
