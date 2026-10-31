import { test, expect } from "@playwright/test";
import {
  StoryStore,
  normalizeSave,
  freshState,
  currentQuest,
} from "../src/story/state.js";
import { ROUTES3, RECORDS3 } from "../src/story/chapter3.js";
import { completedSecond, memory } from "./helpers/campaign.js";
test("v1.2 completed saves migrate without losing either chapter", () => {
  const raw = completedSecond("quintus", "investigate");
  raw.version = 2;
  delete raw.chapter3;
  delete raw.player.region;
  const s = normalizeSave(raw);
  expect(s.version).toBe(3);
  expect(s.chapter2).toEqual(raw.chapter2);
  expect(s.decisions).toEqual(raw.decisions);
  expect(s.answers).toEqual(raw.answers);
  expect(s.player.region).toBe("rome");
  expect(s.chapter3.started).toBe(false);
  expect(currentQuest(s).id).toBe("chapter2-complete");
});
test("chapter three cannot skip prerequisites and a scene resumes mid-way", () => {
  const invalid = new StoryStore(memory());
  expect(invalid.start3()).toBe(false);
  expect(invalid.finish3()).toBe(false);
  const s = new StoryStore(memory(completedSecond()));
  s.start3();
  expect(s.scene3()).toBe(false);
  s.record3("venue");
  s.record3("witness");
  expect(s.assess3("limited")).toBe(false);
  s.guide3();
  s.route3();
  expect(s.act3()).toBe(false);
  expect(s.assess3("accuse")).toBe(false);
  expect(s.assess3("limited")).toBe(true);
  expect(s.act3()).toBe(true);
  s.scene3();
  const reload = new StoryStore(s.storage);
  expect(reload.state.chapter3.eventStep).toBe(1);
  expect(reload.state.player.region).toBe("campus");
  expect(reload.report3("accountable")).toBe(false);
  reload.scene3();
  reload.scene3();
  expect(reload.report3("all")).toBe(false);
  expect(reload.report3("accountable")).toBe(true);
  expect(reload.finish3()).toBe(true);
  expect(reload.finish3()).toBe(false);
});
test("all nine earlier decision combinations reach a persistent campaign ending", () => {
  for (const recipient of ["lucius", "quintus", "titus"])
    for (const choice of Object.keys(ROUTES3)) {
      const before = completedSecond(recipient, choice),
        s = new StoryStore(memory(before));
      s.start3();
      s.guide3();
      s.route3();
      for (const r of RECORDS3) s.record3(r.id);
      s.assess3("limited");
      s.act3();
      for (let i = 0; i < 3; i++) s.scene3();
      s.report3("accountable");
      s.finish3();
      const reloaded = new StoryStore(s.storage);
      expect(reloaded.state.chapter3.finished).toBe(true);
      expect(reloaded.state.decisions.messageRecipient).toBe(recipient);
      expect(reloaded.state.chapter2.decision).toBe(choice);
      expect(currentQuest(reloaded.state).id).toBe("campaign-complete");
      s.returnRome();
      expect(s.state.player.region).toBe("rome");
      expect(s.state.chapter3.finished).toBe(true);
    }
});
test("malformed final saves cannot invent a completion or an unlocked region", () => {
  const raw = {
    ...freshState(),
    player: { x: 0, z: 0, region: "campus" },
    chapter3: {
      started: true,
      finished: true,
      eventStep: 3,
      report: "accountable",
    },
  };
  expect(normalizeSave(raw).chapter3.finished).toBe(false);
  expect(normalizeSave(raw).player.region).toBe("rome");
  for (const c of [
    null,
    [],
    { started: true, finished: true },
    { started: true, records: "bad", eventStep: 99, report: "accountable" },
  ]) {
    const s = normalizeSave({ ...completedSecond(), chapter3: c });
    expect(s.chapter3.finished).toBe(false);
    expect(s.chapter3.eventStep).toBe(0);
  }
});
