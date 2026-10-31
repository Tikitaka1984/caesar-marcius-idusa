import { test, expect } from "@playwright/test";
import {
  StoryStore,
  freshState,
  normalizeSave,
  currentQuest,
} from "../src/story/state.js";
import { NPCS } from "../src/story/data.js";
import { REGIONS } from "../src/world/regions.js";
import { memory, completedSecond } from "./helpers/campaign.js";
function prepareFirst(s) {
  for (const id of ["marcus", "lucius", "quintus"])
    s.ask(id, NPCS[id].questions[0].id);
  s.examineTablet();
  s.conclude("B");
}
test("fresh campaign requires the Subura clue and cannot replace it with a wrong answer", () => {
  const s = new StoryStore(memory());
  prepareFirst(s);
  expect(currentQuest(s.state).id).toBe("city-subura");
  expect(s.deliver("lucius")).toBe(false);
  expect(s.inspectSeal("limited")).toBe(false);
  s.startCourier();
  s.courierCheckpoint(3);
  const r = new StoryStore(s.storage);
  expect(r.state.city.courierStep).toBe(3);
  r.startCourier();
  expect(r.state.city.courierStep).toBe(1);
  expect(r.state.city.courierRun).toBe(2);
  r.arriveCourier();
  expect(r.inspectSeal("accuse")).toBe(false);
  expect(r.inspectSeal("limited")).toBe(true);
  expect(r.startCourier()).toBe(false);
  expect(new StoryStore(r.storage).state.city.seal).toBe(true);
  expect(r.deliver("lucius")).toBe(true);
  expect(currentQuest(r.state).id).toBe("complete");
});
test("schemas one through three keep the earlier campaign without inventing city completions", () => {
  for (const version of [1, 2, 3]) {
    const raw = completedSecond("quintus", "investigate");
    raw.version = version;
    delete raw.city;
    delete raw.regionPositions;
    const s = normalizeSave(raw);
    expect(s.version).toBe(4);
    expect(s.city.legacyRoute).toBe(true);
    expect(s.city.seal).toBe(false);
    expect(s.city.delivered).toBe(false);
    expect(s.city.dockConclusion).toBe(false);
    expect(s.chapter2.decision).toBe("investigate");
    expect(s.decisions.messageRecipient).toBe("quintus");
  }
});
test("five-region travel checkpoints each position and rejects a locked curia", () => {
  const s = new StoryStore(memory());
  expect(s.travelCity("campus")).toBe(false);
  expect(s.travelCity("unknown")).toBe(false);
  s.checkpoint(
    { x: 1, z: 12, yaw: 0.4, pitch: 0.2, region: "rome" },
    { scrolls: [0], visited: ["VIA SACRA"] },
  );
  for (const id of ["subura", "boarium", "domus"]) {
    expect(s.travelCity(id)).toBe(true);
    expect(s.state.player.region).toBe(id);
    s.checkpoint(
      { ...REGIONS[id].spawn, x: 5, z: 15, region: id },
      { scrolls: [0], visited: ["VIA SACRA", REGIONS[id].short] },
    );
    s.travelCity("rome");
    expect(s.state.player.x).toBe(1);
    expect(s.state.player.z).toBe(12);
    s.travelCity(id);
    expect(s.state.player.z).toBe(15);
  }
  const r = new StoryStore(s.storage);
  expect(r.state.player.region).toBe("domus");
  expect(r.state.regionPositions.subura.z).toBe(15);
  expect(r.state.world.scrolls).toEqual([0]);
});
test("dock and garden tasks validate their evidence and persist independently", () => {
  const s = new StoryStore(memory());
  expect(s.dockRecord("manifest")).toBe(false);
  expect(s.openGarden("origin")).toBe(false);
  expect(s.deliverGarden()).toBe(false);
  prepareFirst(s);
  s.startCourier();
  s.arriveCourier();
  s.inspectSeal("limited");
  s.deliver("titus");
  s.enterForum();
  expect(s.dockRecord("unknown")).toBe(false);
  s.dockRecord("manifest");
  expect(s.concludeDock("delivery")).toBe(false);
  s.dockRecord("cargo");
  expect(s.concludeDock("accuse")).toBe(false);
  expect(s.concludeDock("delivery")).toBe(true);
  expect(s.openGarden("accuse")).toBe(false);
  expect(s.openGarden("origin")).toBe(true);
  expect(s.deliverGarden()).toBe(true);
  const r = new StoryStore(s.storage);
  expect(r.state.city).toEqual(s.state.city);
});
test("new campaign final choice waits for city tasks, while a migrated route remains playable", () => {
  const raw = completedSecond();
  raw.city.legacyRoute = false;
  raw.city.seal = true;
  raw.city.courierStarted = true;
  raw.city.courierArrived = true;
  raw.chapter2.decision = null;
  const s = new StoryStore(memory(raw));
  expect(s.finish2("warn")).toBe(false);
  expect(currentQuest(s.state).id).toBe("city-boarium");
  s.dockRecord("manifest");
  s.dockRecord("cargo");
  s.concludeDock("delivery");
  expect(currentQuest(s.state).id).toBe("city-domus");
  s.openGarden("origin");
  s.deliverGarden();
  expect(s.finish2("warn")).toBe(true);
});
test("malformed city state, unknown regions and unsafe coordinates recover safely", () => {
  const s = normalizeSave({
    ...freshState(),
    city: {
      delivered: true,
      gateOpen: true,
      seal: true,
      dockRecords: "bad",
      dockConclusion: true,
      courierStep: 900,
    },
    player: { x: 0, z: 0, yaw: 0, pitch: 0, region: "unknown" },
  });
  expect(s.city.seal).toBe(false);
  expect(s.city.gateOpen).toBe(false);
  expect(s.city.delivered).toBe(false);
  expect(s.city.dockRecords).toEqual([]);
  expect(s.player.region).toBe("rome");
  const p = normalizeSave({
    ...freshState(),
    player: { x: 999, z: 0, yaw: 0, pitch: 0, region: "boarium" },
  });
  expect(p.player).toEqual({ ...REGIONS.boarium.spawn, region: "boarium" });
});
