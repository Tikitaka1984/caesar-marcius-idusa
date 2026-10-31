import { REGIONS, REGION_IDS, cleanPosition } from "../world/regions.js";
export function freshCity() {
  return {
    legacyRoute: false,
    courierStarted: false,
    courierRun: 0,
    courierStep: 1,
    courierArrived: false,
    seal: false,
    dockRecords: [],
    dockConclusion: false,
    gateOpen: false,
    delivered: false,
  };
}
export function normalizeCity(raw, legacy) {
  const c = freshCity();
  c.legacyRoute = legacy || raw?.legacyRoute === true;
  c.courierRun = Number.isInteger(raw?.courierRun)
    ? Math.max(0, Math.min(10000, raw.courierRun))
    : 0;
  c.courierStarted = raw?.courierStarted === true;
  c.courierStep = Number.isInteger(raw?.courierStep)
    ? Math.max(1, Math.min(5, raw.courierStep))
    : 1;
  c.courierArrived = c.courierStarted && raw?.courierArrived === true;
  c.seal = c.courierArrived && raw?.seal === true;
  c.dockRecords = ["manifest", "cargo"].filter(
    (id) => Array.isArray(raw?.dockRecords) && raw.dockRecords.includes(id),
  );
  c.dockConclusion = c.dockRecords.length === 2 && raw?.dockConclusion === true;
  c.gateOpen = raw?.gateOpen === true;
  c.delivered = c.gateOpen && raw?.delivered === true;
  return c;
}
export const needsSubura = (s) => !s.city.legacyRoute && !s.city.seal;
export const needsCity2 = (s) =>
  !s.city.legacyRoute && (!s.city.dockConclusion || !s.city.delivered);
export function suburaQuest(s) {
  return {
    id: "city-subura",
    title: "A futár nyomában",
    task: "Utazz a Suburába a V várostérképen. Keresd Faustust, kövesd a műhelyig, és vizsgáld meg a pecsétet.",
    progress: s.city.seal ? "1/1" : "0/1",
  };
}
export function city2Quests(s) {
  return [
    {
      id: "city-boarium",
      title: "Tanú a Tiberis-parton",
      task: "A V várostérképen utazz a Forum Boariumra. Vizsgáld meg a raktárjegyzéket és a rakományt, majd beszélj Doriával.",
      progress: `${s.city.dockRecords.length}/2`,
      done: s.city.dockConclusion,
    },
    {
      id: "city-domus",
      title: "Üzenet a kertben",
      task: "Utazz a palatinusi házhoz. Igazold a kapuőrnél az üzenet eredetét, majd a kertben add át a másolatot Claudiának.",
      progress: s.city.delivered ? "1/1" : "0/1",
      done: s.city.delivered,
    },
  ];
}
export function installCity(Store) {
  Object.assign(Store.prototype, {
    travelCity(id) {
      const s = this.state;
      if (!REGION_IDS.includes(id) || (id === "campus" && !s.chapter2.decision))
        return false;
      s.regionPositions[s.player.region || "rome"] = { ...s.player };
      if (id === "campus") s.chapter3.started = true;
      s.player = cleanPosition(s.regionPositions[id] || REGIONS[id].spawn, id);
      this.changed();
      return true;
    },
    startCourier() {
      const c = this.state.city;
      if (c.seal) return false;
      c.courierRun++;
      c.courierStarted = true;
      c.courierStep = 1;
      c.courierArrived = false;
      this.changed();
      return true;
    },
    courierCheckpoint(step) {
      if (
        !this.state.city.courierStarted ||
        !Number.isInteger(step) ||
        step < 1 ||
        step > 5
      )
        return false;
      this.state.city.courierStep = step;
      this.changed();
      return true;
    },
    arriveCourier() {
      const c = this.state.city;
      if (!c.courierStarted || c.courierArrived) return false;
      c.courierArrived = true;
      this.changed();
      return true;
    },
    inspectSeal(choice) {
      const c = this.state.city;
      if (!c.courierArrived || choice !== "limited") return false;
      c.seal = true;
      this.changed();
      return true;
    },
    dockRecord(id) {
      if (!this.state.chapterComplete || !["manifest", "cargo"].includes(id))
        return false;
      const c = this.state.city;
      if (!c.dockRecords.includes(id)) {
        c.dockRecords.push(id);
        this.changed();
      }
      return true;
    },
    concludeDock(choice) {
      const c = this.state.city;
      if (
        !this.state.chapterComplete ||
        c.dockRecords.length !== 2 ||
        choice !== "delivery"
      )
        return false;
      c.dockConclusion = true;
      this.changed();
      return true;
    },
    openGarden(choice) {
      if (!this.state.chapterComplete || choice !== "origin") return false;
      this.state.city.gateOpen = true;
      this.changed();
      return true;
    },
    deliverGarden() {
      if (!this.state.chapterComplete || !this.state.city.gateOpen)
        return false;
      this.state.city.delivered = true;
      this.changed();
      return true;
    },
  });
}
