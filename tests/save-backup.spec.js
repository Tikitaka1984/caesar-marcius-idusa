import { test, expect } from "@playwright/test";
import {
  StoryStore,
  SAVE_KEY,
  BACKUP_KEY,
  freshState,
} from "../src/story/state.js";
function storage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    m,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
  };
}
test("an unreadable save is copied aside before it can be overwritten", () => {
  const original = JSON.stringify({ version: 99, answers: {}, future: true });
  const s = storage({ [SAVE_KEY]: original });
  const store = new StoryStore(s);
  expect(store.notice).toContain("sérült");
  expect(s.m.get(BACKUP_KEY)).toBe(original);
  store.persist();
  expect(s.m.get(SAVE_KEY)).not.toBe(original);
  expect(s.m.get(BACKUP_KEY)).toBe(original);
});
test("corrupt JSON is kept too, and an existing backup is not replaced", () => {
  const s = storage({ [SAVE_KEY]: "{not json", [BACKUP_KEY]: "older" });
  new StoryStore(s);
  expect(s.m.get(BACKUP_KEY)).toBe("older");
  const t = storage({ [SAVE_KEY]: "{not json" });
  new StoryStore(t);
  expect(t.m.get(BACKUP_KEY)).toBe("{not json");
});
test("a valid save and an empty store create no backup", () => {
  const valid = storage({ [SAVE_KEY]: JSON.stringify(freshState()) });
  const a = new StoryStore(valid);
  expect(a.notice).toBe("Mentés visszatöltve.");
  expect(valid.m.has(BACKUP_KEY)).toBe(false);
  const empty = storage();
  new StoryStore(empty);
  expect(empty.m.has(BACKUP_KEY)).toBe(false);
});
test("missing storage still gives a playable fresh state", () => {
  const store = new StoryStore(undefined);
  expect(store.state.version).toBe(4);
  expect(store.persist()).toBe(false);
});
