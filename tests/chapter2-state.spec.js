import { test, expect } from "@playwright/test";
import {
  StoryStore,
  SAVE_KEY,
  normalizeSave,
  currentQuest,
} from "../src/story/state.js";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  CLAIMS,
  FINAL_CHOICES,
} from "../src/story/chapter2.js";
export function oldSave(recipient) {
  return {
    version: 1,
    storyVersion: "1.1",
    answers: {
      marcus: ["war"],
      lucius: ["soldiers"],
      quintus: ["senators"],
      titus: ["help"],
    },
    responses: {},
    trust: { marcus: 1, lucius: 1, quintus: 1, titus: 1 },
    evidence: ["wax-tablet"],
    interpretation: "B",
    conclusionAttempts: 2,
    deliveryTarget: recipient,
    decisions: { messageRecipient: recipient },
    chapterComplete: true,
    nextChapterReady: true,
    journal: ["tablet", "interpretation", `delivery:${recipient}`, "forum"],
    player: { x: 0, z: -1, yaw: 0, pitch: 0 },
    world: { scrolls: [0], visited: ["VIA SACRA", "FORUM ROMANUM"] },
  };
}
export function memory(raw) {
  const m = new Map(raw ? [[SAVE_KEY, JSON.stringify(raw)]] : []);
  return { getItem: (k) => m.get(k) || null, setItem: (k, v) => m.set(k, v) };
}
const answers = () => Object.fromEntries(CLAIMS.map((q) => [q.id, q.category]));
for (const recipient of Object.keys(BRANCHES))
  test(`v1.1 migration and full chapter for ${recipient}`, () => {
    const raw = oldSave(recipient),
      storage = memory(raw),
      s = new StoryStore(storage);
    for (const field of [
      "answers",
      "evidence",
      "decisions",
      "journal",
      "player",
      "world",
    ])
      expect(s.state[field]).toEqual(raw[field]);
    expect(s.state.version).toBe(2);
    expect(s.state.chapterComplete).toBe(true);
    expect(currentQuest(s.state).id).toBe("allies");
    expect(s.finish2("warn")).toBe(false);
    expect(s.document2("power")).toBe(false);
    expect(s.introduce2("invalid")).toBe(false);
    expect(s.introduce2(BRANCHES[recipient].guide)).toBe(true);
    if (recipient === "quintus") expect(s.document2("power")).toBe(true);
    if (recipient === "lucius") expect(s.document2("power")).toBe(false);
    if (recipient === "titus") {
      expect(s.document2("secret")).toBe(false);
      expect(s.access2()).toBe(true);
    }
    for (const [id, n] of Object.entries(POLITICIANS))
      for (const q of n.questions) expect(s.ask2(id, q[0])).toBe(q[2]);
    expect(s.politics2("traitors")).toBe(false);
    expect(s.politics2("balanced")).toBe(true);
    for (const d of DOCUMENTS) expect(s.document2(d.id)).toBe(true);
    expect(s.compare2({})).toBe(false);
    expect(s.compare2(answers())).toBe(true);
    expect(s.distinguish2("accuse")).toBe(false);
    expect(s.distinguish2("limited")).toBe(true);
    expect(s.inform2()).toBe(true);
    const c = s.state.chapter2;
    expect(new StoryStore(storage).state.chapter2).toEqual(c);
    for (const choice of Object.keys(FINAL_CHOICES)) {
      const branch = new StoryStore(memory(s.state));
      expect(branch.finish2(choice)).toBe(true);
      expect(branch.finish2("warn")).toBe(false);
      branch.compare2({title:"fiction"});
      expect(branch.state.chapter2.comparisonComplete).toBe(true);
      expect(new StoryStore(branch.storage).state.chapter2.decision).toBe(
        choice,
      );
      expect(branch.state.decisions.messageRecipient).toBe(recipient);
    }
  });
test("partial progress and malformed nested saves normalize safely", () => {
  const storage = memory(oldSave("titus")),
    s = new StoryStore(storage);
  s.introduce2("courier");
  s.access2();
  s.document2("secret");
  s.ask2("publius", "war");
  expect(new StoryStore(storage).state.chapter2).toEqual(s.state.chapter2);
  for (const raw of [
    null,
    [],
    { answers: null, documents: null, decision: "warn" },
    {
      answers: { aulus: ["invented"] },
      introduced: true,
      classification: { title: "invented" },
    },
  ])
    expect(() =>
      normalizeSave({ ...oldSave("lucius"), chapter2: raw }),
    ).not.toThrow();
  const forged = normalizeSave({
    ...oldSave("lucius"),
    chapter2: { decision: "warn", informed: true, comparisonComplete: true },
  });
  expect(forged.chapter2.decision).toBe(null);
});
