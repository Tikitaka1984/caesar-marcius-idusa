import { playSubura, playBoarium, playDomus } from "./city-play.js";
import { expect } from "@playwright/test";
import { controls } from "./campaign.js";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  CLAIMS,
} from "../../src/story/chapter2.js";
import {
  GUIDE3,
  ROUTES3,
  RECORDS3,
  GATE3,
  DESK3,
  TRAVEL3,
} from "../../src/story/chapter3.js";
export async function playFirst(page) {
  const { move, interact, close } = controls(page);
  await move("z", 21.3);
  await interact("quintus");
  await page.getByTestId("question-quintus-senators").click();
  await close();
  await move("x", 2.8);
  await move("z", 11.2);
  await interact("marcus");
  await page.getByTestId("question-marcus-war").click();
  await close();
  await move("x", 0);
  await move("z", -5.5);
  await move("x", -3);
  await interact("lucius");
  await page.getByTestId("question-lucius-soldiers").click();
  await close();
  await playSubura(page, true);
  await move("z", 16.2);
  await interact("tablet");
  await page.getByTestId("open-conclusion").click();
  await page.getByTestId("conclusion-B").click();
  await page.getByTestId("open-delivery").click();
  await page.getByTestId("recipient-lucius").click();
  await page.getByTestId("follow-recipient").click();
  await move("z", -5.5);
  await interact("lucius");
  await page.getByTestId("deliver-message").click();
  await page.getByTestId("confirm-delivery").click();
  await page.getByTestId("continue-forum").click();
  await expect
    .poll(() => page.evaluate(() => window.caesarState.story.quest))
    .toBe("allies");
}
export async function playSecond(
  page,
  recipient = "lucius",
  decision = "warn",
) {
  const { walk, move, interact, close } = controls(page),
    b = BRANCHES[recipient];
  await walk(b.x, b.z);
  await interact(b.guide);
  await page.getByTestId("introduce2").click();
  await close();
  if (recipient === "titus") {
    await move("x", 0);
    await move("z", -1.5);
    await move("x", 10.5);
    await move("z", -3.5);
    await interact("ledger");
    await page.getByTestId("ledger-access").click();
    await close();
    await move("z", -1.5);
  }
  for (const [id, n] of Object.entries(POLITICIANS)) {
    await walk(n.x, n.z);
    await interact(id);
    for (const q of n.questions) {
      await page.getByTestId(`question2-${id}-${q[0]}`).click();
      await page.getByTestId("more2").click();
    }
    await close();
  }
  await page.keyboard.press("KeyJ");
  await page.getByTestId("politics-open").click();
  await page.getByTestId("politics-balanced").click();
  await close();
  for (const d of DOCUMENTS) {
    await walk(d.x, d.z);
    await move("z", d.z + 1.2);
    await interact(d.id);
    await close();
  }
  await page.keyboard.press("KeyB");
  for (const q of CLAIMS)
    await page.getByTestId("classify-" + q.id).selectOption(q.category);
  await page.getByTestId("compare-submit").click();
  await page.getByTestId("distinction-open").click();
  await page.getByTestId("distinction-limited").click();
  await close();
  await playBoarium(page, true);
  await playDomus(page, true);
  await walk(-4, -27);
  await interact("informant");
  await page.getByTestId("final-" + decision).click();
  await page.getByTestId("final-confirm").click();
  await page.getByTestId("ending2-close").click();
}
export async function playThird(page, choice = "warn", pictures = false) {
  const c = controls(page),
    r = ROUTES3[choice];
  await c.walk(TRAVEL3.x, TRAVEL3.z);
  await c.interact("campus-road");
  await page.getByTestId("travel-campus").click();
  await expect.poll(async () => (await c.pos()).region).toBe("campus");
  if (pictures)
    await page.screenshot({
      path: "test-results/screenshots/chapter3-porticus.png",
    });
  await c.walk(GUIDE3.x, GUIDE3.z);
  await c.interact(GUIDE3.id);
  await page.getByTestId("guide3-confirm").click();
  await page.getByTestId("guide3-close").click();
  await c.walk(r.x, r.z);
  await c.interact(r.id);
  await page.getByTestId("route3-question").click();
  await page.getByTestId("route3-back").click();
  await c.close();
  for (const d of RECORDS3) {
    await c.walk(d.x, d.z);
    await c.interact(d.id);
    await expect(page.locator("#storyPanel")).toContainText(d.source);
    await page.getByTestId("record3-close").click();
  }
  await page.keyboard.press("KeyB");
  await page.getByTestId("assessment3-accuse").click();
  await expect(page.locator("#storyPanel")).toContainText("Próbáld újra");
  await page.getByTestId("assessment3-limited").click();
  await c.close();
  await c.walk(r.x, r.z);
  await c.interact(r.id);
  await page.getByTestId("route3-action").click();
  await page.getByTestId("action3-close").click();
  await c.walk(GATE3.x, GATE3.z);
  await c.interact(GATE3.id);
  for (let i = 0; i < 3; i++) await page.getByTestId("scene3-next").click();
  if (pictures)
    await page.screenshot({
      path: "test-results/screenshots/chapter3-curia.png",
    });
  await page.getByTestId("event3-close").click();
  await c.walk(DESK3.x, DESK3.z);
  await c.interact(DESK3.id);
  await page.getByTestId("report3-certainty").click();
  await expect(page.locator("#storyPanel")).toContainText("Javíthatod");
  await page.getByTestId("report3-accountable").click();
  await page.getByTestId("finish-campaign").click();
  await expect(page.locator("#storyTitle")).toHaveText(
    "CAESAR – a történet véget ért",
  );
  if (pictures)
    await page.screenshot({
      path: "test-results/screenshots/campaign-ending-" + choice + ".png",
    });
}
