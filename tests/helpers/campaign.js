import { expect } from "@playwright/test";
import { StoryStore, freshState } from "../../src/story/state.js";
import { NPCS } from "../../src/story/data.js";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  CLAIMS,
} from "../../src/story/chapter2.js";
export function memory(raw) {
  const m = new Map(raw ? [["caesar.story.save.v1", JSON.stringify(raw)]] : []);
  return { getItem: (k) => m.get(k) || null, setItem: (k, v) => m.set(k, v) };
}
export function completedSecond(recipient = "lucius", choice = "warn") {
  const s = new StoryStore(memory({ ...freshState(), version: 3 }));
  for (const id of ["marcus", "lucius", "quintus"])
    s.ask(id, NPCS[id].questions[0].id);
  s.examineTablet();
  s.conclude("B");
  s.deliver(recipient);
  s.enterForum();
  s.introduce2(BRANCHES[recipient].guide);
  if (recipient === "titus") s.access2();
  for (const [id, n] of Object.entries(POLITICIANS))
    for (const q of n.questions) s.ask2(id, q[0]);
  s.politics2("balanced");
  for (const d of DOCUMENTS) s.document2(d.id);
  s.compare2(Object.fromEntries(CLAIMS.map((q) => [q.id, q.category])));
  s.distinguish2("limited");
  s.inform2();
  s.finish2(choice);
  s.checkpoint(
    { x: 0, z: -25, yaw: 0, pitch: 0, region: "rome" },
    { scrolls: [], visited: ["VIA SACRA", "FORUM ROMANUM"] },
  );
  return s.state;
}
export function controls(page) {
  const pos = () => page.evaluate(() => window.caesarState);
  const move = async (axis, target) => {
    const p = await pos();
    if (Math.abs(p[axis] - target) < 0.12) return;
    const positive = p[axis] < target,
      key =
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
            const v = (await pos())[axis];
            return positive ? v >= target : v <= target;
          },
          { timeout: 45000, intervals: [30] },
        )
        .toBe(true);
    } finally {
      await page.keyboard.up(key);
    }
  };
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
  return { pos, move, walk, interact, close };
}
