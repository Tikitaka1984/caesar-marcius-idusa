import { currentQuest } from "./state.js";
import { NPCS, VOICES, TABLET } from "./data.js";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  INFORMANT,
  LEDGER,
} from "./chapter2.js";
import { GUIDE3, ROUTES3, RECORDS3, GATE3, DESK3 } from "./chapter3.js";
import { CITY_STOPS } from "../world/regions.js";
export function navigationTarget(s, region, world) {
  const point = (p, name, area = "rome") => ({
    ...p,
    name: name || p.name,
    region: area,
  });
  if (region === "subura")
    return s.city.seal
      ? { hint: "A pecsét nyoma rögzítve · V: visszaút" }
      : s.city.courierArrived
        ? CITY_STOPS.seal
        : point(
            world.interactables.find((o) => o.id === "courier") ||
              CITY_STOPS.courier,
            s.city.courierStarted ? "Kövesd a futárt" : "Faustus, a futár",
            "subura",
          );
  if (region === "boarium")
    return !s.chapterComplete
      ? { hint: "A parti feladat a II. fejezetben indul · V: várostérkép" }
      : !s.city.dockRecords.includes("manifest")
        ? CITY_STOPS.manifest
        : !s.city.dockRecords.includes("cargo")
          ? CITY_STOPS.cargo
          : !s.city.dockConclusion
            ? CITY_STOPS.witness
            : { hint: "A tanú vallomása rögzítve · V: visszaút" };
  if (region === "domus")
    return !s.chapterComplete
      ? { hint: "A közvetítő a II. fejezetben fogad · V: várostérkép" }
      : !s.city.gateOpen
        ? CITY_STOPS.doorkeeper
        : !s.city.delivered
          ? CITY_STOPS.host
          : { hint: "A másolat átadva · V: visszaút" };
  const q = currentQuest(s),
    c = s.chapter2,
    c3 = s.chapter3;
  switch (q.id) {
    case "voices": {
      const id = VOICES.find((id) => !s.answers[id].length);
      return point(NPCS[id], NPCS[id].name);
    }
    case "tablet":
      return point(TABLET, TABLET.title);
    case "interpretation":
      return { hint: "B: Mit bizonyít az üzenet?" };
    case "city-subura":
      return CITY_STOPS.courier;
    case "delivery":
      return s.deliveryTarget
        ? point(NPCS[s.deliveryTarget], NPCS[s.deliveryTarget].name)
        : { hint: "B: válassz címzettet az üzenetnek" };
    case "complete":
      return point({ x: 0, z: -1 }, "Forum Romanum");
    case "allies":
      return point(BRANCHES[s.decisions.messageRecipient]);
    case "politics": {
      const id = Object.keys(POLITICIANS).find(
        (id) => c.answers[id].length < 4,
      );
      return id
        ? point(POLITICIANS[id])
        : { hint: "J: Politikai következtetés – zárd le a meghallgatást" };
    }
    case "documents":
      if (s.decisions.messageRecipient === "titus" && !c.access)
        return point(LEDGER, LEDGER.title);
      return point(
        DOCUMENTS.find((d) => !c.documents.includes(d.id)) || INFORMANT,
        "A következő irat",
      );
    case "city-boarium":
      return CITY_STOPS.witness;
    case "city-domus":
      return CITY_STOPS.doorkeeper;
    case "meeting":
      return !c.comparisonComplete || !c.distinction
        ? { hint: "B: állítások összevetése és következtetés" }
        : point(INFORMANT);
    case "chapter2-complete":
      return { hint: "V: Utazás Pompeius porticusához" };
    case "arrival3":
      return point(GUIDE3, GUIDE3.name, "campus");
    case "action3":
      if (!c3.routeHeard)
        return point(ROUTES3[c.decision], ROUTES3[c.decision].name, "campus");
      {
        const r = RECORDS3.find((r) => !c3.records.includes(r.id));
        return r
          ? point(r, r.title, "campus")
          : !c3.assessment
            ? { hint: "B: Mérlegeld a porticusban talált forrásokat" }
            : point(ROUTES3[c.decision], ROUTES3[c.decision].name, "campus");
      }
    case "event3":
      return point(GATE3, GATE3.name, "campus");
    case "report3":
      return point(DESK3, DESK3.name, "campus");
    default:
      return { hint: "J: döntéseid és a történeti utóhang" };
  }
}
