import { test, expect } from "@playwright/test";
import {
  StoryStore,
  SAVE_KEY,
  freshState,
  normalizeSave,
  voicesCount,
  currentQuest,
  quests,
} from "../src/story/state.js";
import { NPCS, RECIPIENTS, TABLET } from "../src/story/data.js";
const memory = () => {
  const values = new Map();
  return {
    getItem: (k) => values.get(k) || null,
    setItem: (k, v) => values.set(k, v),
  };
};
function gather(store) {
  for (const id of ["marcus", "lucius", "quintus"])
    store.ask(id, NPCS[id].questions[0].id);
}
test("only meaningful, distinct conversations count and trust cannot be farmed", () => {
  const s = new StoryStore(memory());
  s.ask("titus", "help");
  expect(voicesCount(s.state)).toBe(0);
  s.ask("marcus", "war");
  s.ask("marcus", "war");
  expect(voicesCount(s.state)).toBe(1);
  expect(s.state.trust.marcus).toBe(1);
  expect(s.state.answers.marcus).toEqual(["war"]);
  expect(s.deliver("titus")).toBe(false);
  expect(s.conclude("B")).toBe(false);
  expect(currentQuest(s.state).id).toBe("voices");
  gather(s);
  expect(voicesCount(s.state)).toBe(3);
  expect(currentQuest(s.state).id).toBe("tablet");
  expect(quests(s.state)[2].status).toBe("locked");
});
test("early evidence survives; both wrong conclusions allow retry", () => {
  const s = new StoryStore(memory());
  const before = s.ask("titus", "tablet");
  expect(before).toContain("Miféle");
  s.examineTablet();
  expect(s.state.evidence).toEqual([TABLET.id]);
  expect(currentQuest(s.state).id).toBe("voices");
  gather(s);
  expect(currentQuest(s.state).id).toBe("interpretation");
  expect(s.conclude("A")).toBe(false);
  expect(s.conclude("C")).toBe(false);
  expect(s.state.interpretation).toBe(null);
  expect(s.conclude("B")).toBe(true);
  expect(s.state.conclusionAttempts).toBe(3);
  expect(currentQuest(s.state).id).toBe("delivery");
  s.ask("titus", "tablet");
  expect(s.state.responses.titus.tablet).toBe("answer");
  expect(s.state.trust.titus).toBe(0);
});
for (const id of RECIPIENTS)
  test(`recipient ${id}, trust and next chapter survive reload`, () => {
    const storage = memory(),
      s = new StoryStore(storage);
    gather(s);
    s.examineTablet();
    s.conclude("B");
    s.chooseRecipient(id);
    expect(s.state.chapterComplete).toBe(false);
    expect(s.state.decisions.messageRecipient).toBe(null);
    expect(s.deliver(id)).toBe(true);
    expect(s.deliver("lucius")).toBe(false);
    expect(s.chooseRecipient("quintus")).toBe(false);
    s.enterForum();
    s.checkpoint(
      { x: 0, z: -2, yaw: 0.2, pitch: 0.1 },
      { scrolls: [0, 2], visited: ["VIA SACRA", "FORUM ROMANUM"] },
    );
    const restored = new StoryStore(storage);
    expect(restored.state.decisions.messageRecipient).toBe(id);
    expect(restored.state.trust).toEqual(s.state.trust);
    expect(restored.state.nextChapterReady).toBe(true);
    expect(restored.state.player.z).toBe(-2);
    expect(restored.state.world.scrolls).toEqual([0, 2]);
    expect(restored.state.journal).toEqual(s.state.journal);
    expect(restored.state.version).toBe(1);
    expect(quests(restored.state).every((q) => q.status === "complete")).toBe(
      true,
    );
  });
test("invalid, obsolete and unavailable storage never prevents play", () => {
  for (const raw of [
    "{oops",
    JSON.stringify({ version: 0 }),
    JSON.stringify({ version: 99 }),
    JSON.stringify({ version: 1, answers: [] }),
    "null",
  ]) {
    const storage = memory();
    storage.setItem(SAVE_KEY, raw);
    const s = new StoryStore(storage);
    expect(s.state).toEqual(freshState());
    expect(s.notice).toBeTruthy();
    s.ask("marcus", "war");
    expect(voicesCount(s.state)).toBe(1);
  }
  const broken = {
    getItem() {
      throw Error("blocked");
    },
    setItem() {
      throw Error("quota");
    },
  };
  const s = new StoryStore(broken);
  expect(() => s.ask("marcus", "war")).not.toThrow();
  expect(s.state.answers.marcus).toEqual(["war"]);
  expect(s.notice).toContain("nem tud menteni");
  expect(() => new StoryStore(undefined)).not.toThrow();
});
test("save validation rejects forged progression and unsafe runtime values", () => {
  const raw = {
    ...freshState(),
    interpretation: "B",
    decisions: { messageRecipient: "titus" },
    chapterComplete: true,
    nextChapterReady: true,
    trust: { marcus: 999 },
    player: { x: 999, z: Infinity, yaw: NaN, pitch: 900 },
    world: { scrolls: [0, 0, 99, "1"], visited: ["FORUM ROMANUM", "invalid"] },
  };
  const s = normalizeSave(raw);
  expect(s.interpretation).toBe(null);
  expect(s.chapterComplete).toBe(false);
  expect(s.nextChapterReady).toBe(false);
  expect(s.trust.marcus).toBe(0);
  expect(s.player).toEqual(freshState().player);
  expect(s.world.scrolls).toEqual([0]);
  expect(s.world.visited).toEqual(["VIA SACRA", "FORUM ROMANUM"]);
});
