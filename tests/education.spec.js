import { test, expect } from "@playwright/test";
import { inRandomOrder } from "../src/story/choice.js";
import { CONCLUSIONS } from "../src/story/data.js";
import { buildRecord } from "../src/story/record.js";
import { REFLECTION } from "../src/story/sources.js";
import { StoryStore } from "../src/story/state.js";
const memory = () => ({ getItem: () => null, setItem() {} });
test("answer order is a stable permutation per question", () => {
  const items = ["a", "b", "c", "d", "e"].map((id) => ({ id }));
  const first = inRandomOrder("unit-test", items).map((i) => i.id);
  expect([...first].sort()).toEqual(["a", "b", "c", "d", "e"]);
  expect(inRandomOrder("unit-test", items).map((i) => i.id)).toEqual(first);
});
test("the correct conclusion is not marked by wording", () => {
  const correct = CONCLUSIONS.find((c) => c.id === "B");
  const others = CONCLUSIONS.filter((c) => c.id !== "B");
  // No option leads with a certainty word that the correct option lacks.
  for (const c of CONCLUSIONS) expect(c.text).not.toMatch(/^Biztosan/);
  // Lengths are comparable (within a third of the longest).
  const lengths = CONCLUSIONS.map((c) => c.text.length);
  expect(Math.min(...lengths)).toBeGreaterThan(Math.max(...lengths) * 0.66);
  expect(others.length).toBe(3);
  expect(correct.text.length).toBeGreaterThan(0);
});
test("the student record lists decisions, attempts and reflection questions", () => {
  const store = new StoryStore(memory());
  const text = buildRecord(store.state, {
    name: "  Kiss Éva  ",
    date: new Date("2026-11-02T10:00:00Z"),
  });
  expect(text).toContain("Név: Kiss Éva");
  expect(text).toContain("Dátum: 2026-11-02");
  expect(text).toContain(
    "Következtetési kísérletek (I./II./III. fejezet): 0 / 0 / 0",
  );
  for (const q of REFLECTION) expect(text).toContain(q);
  expect(buildRecord(store.state)).not.toContain("Név:");
});
test("the record name is capped at 60 characters", () => {
  const store = new StoryStore(memory());
  const text = buildRecord(store.state, { name: "x".repeat(200) });
  expect(text).toContain("Név: " + "x".repeat(60) + "\n");
});
