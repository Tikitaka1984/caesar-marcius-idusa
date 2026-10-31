export const TITLE3 = "III. fejezet – Az összeesküvés";
export const GUIDE3 = {
  id: "flaccus",
  name: "Flaccus",
  role: "helyismerettel rendelkező írnok",
  x: -4,
  z: 25,
};
export const ROUTES3 = {
  warn: {
    id: "sabina",
    name: "Sabina",
    role: "a személyzet közvetítője",
    x: 4,
    z: 17,
    opening:
      "A figyelmeztetést Caesar környezetéhez próbálod eljuttatni. Meghallgatlak, de egy névtelen irat és a suttogás nem jelenti azt, hogy minden ajtó megnyílik előtted.",
    answer:
      "Átvehetem a másolatot a találás körülményeivel együtt. Nem ígérhetem, hogy Caesar elolvassa, és azt sem, hogy ebből bárki megérti a pontos veszélyt. A bizonytalanságot is fel kell tüntetnünk.",
    action: "Átadom a figyelmeztetés másolatát",
    result:
      "A másolatot a személyzet egyik tagjának adtad. A kézbesítés további útját nem láttad; nem állíthatod, hogy Caesar elolvasta.",
  },
  investigate: {
    id: "valeria",
    name: "Valeria",
    role: "iratmásoló",
    x: -6,
    z: 12,
    opening:
      "További bizonyítékot kerestél, nem rögtön bűnöst neveztél meg. Az ülés körül sok a siető ember, de a köpeny és a sietség nem személyazonosító bizonyíték.",
    answer:
      "Két beszélgető ember valóban félrevonult, de a szavaikat nem értettem. Nem készíthetünk névsort abból, amit nem hallottunk. Jegyezd fel pontosan a látottakat, és válaszd külön a tanút a szóbeszédtől.",
    action: "Rögzítem a tanúvallomás határait",
    result:
      "Elkülönítetted a megfigyelést a szóbeszédtől. A tanú szavai nem bizonyították előre konkrét személyek merényleti tervét.",
  },
  locate: {
    id: "rufus",
    name: "Rufus",
    role: "a tanácsterem környékén dolgozó szolga",
    x: 3,
    z: 7,
    opening:
      "Az ülés helyét keresed. A curia itt, Pompeius színházának épületegyüttesében található; nem a Forumon álló templomban.",
    answer:
      "A senatorok a tanácsteremhez érkeznek. Nem tudok neked pontos órát mondani, és az ülés helyének ismerete önmagában nem árulja el a résztvevők szándékát. A helyszínt ellenőrizted; az időpontról csak annyit tudsz, hogy a mai üléshez kapcsolódik.",
    action: "Ellenőrzött helyszínként rögzítem a curiát",
    result:
      "Ellenőrizted Pompeius curiájának helyét. Az ülés résztvevőinek teljes szándékát és a merénylet pontos idejét ebből nem ismerhetted.",
  },
};
export const RECORDS3 = [
  {
    id: "venue",
    title: "Az ülés helye",
    x: -5,
    z: -6,
    text: "A senatus Kr. e. 44. március 15-én Pompeius curiájában ülésezett, a színház épületegyüttesében, a Campus Martius déli részén.",
    source:
      "Történeti összefoglaló; Suetonius, Caesar 80–82; Plutarchos, Caesar 66. Ez a tábla modern játékbeli rekonstrukció, nem fennmaradt ókori irat.",
  },
  {
    id: "witness",
    title: "Egy bizonytalan tanú feljegyzése",
    x: 6,
    z: -12,
    text: "„Ketten félrevonultak a porticusban. Siettek, de nem hallottam, miről beszéltek. Azt sem tudom, hogy az ülésre tartottak-e.”",
    source:
      "FIKTÍV tanúvallomás. A találkozás megfigyelése nem bizonyítja annak célját, és nem nevez meg történelmi összeesküvőket.",
  },
];
export const SCENES3 = [
  {
    title: "Az ülés küszöbén",
    text: "A tanácsterem ajtaja mögött gyülekeznek a senatorok. Te a porticusban maradsz. Az előző órák feljegyzései a kezedben vannak, de a zárt ajtók mögötti szándékok még nem váltak bizonyossá számodra.",
  },
  {
    title: "Március idusa",
    text: "A tanácsteremből kiáltások hallatszanak, majd a környéken futó emberek viszik tovább a hírt. A játék nem ábrázolja a támadást és a sebeket. A történeti esemény: Caesart senatorok egy csoportja megölte Pompeius curiájában Kr. e. 44. március 15-én.",
  },
  {
    title: "A hír és a bizonyíték",
    text: "A most megismert kimenetel nem teszi utólag bizonyítottá a korábbi névtelen üzenet minden lehetséges értelmezését. Amit az esemény után tudsz, azt nem tudhattad automatikusan előtte. Írnokként a források sorrendjét és határait is meg kell őrizned.",
  },
];
export const GATE3 = { id: "curia", name: "A curia bejárata", x: 0, z: -22 };
export const DESK3 = { id: "account", name: "Az írnok asztala", x: 4, z: -25 };
export const TRAVEL3 = {
  id: "campus-road",
  name: "Út Pompeius porticusához",
  x: -7,
  z: -28,
};
export function freshChapter3() {
  return {
    started: false,
    guideHeard: false,
    routeHeard: false,
    records: [],
    assessment: null,
    actionComplete: false,
    eventStep: 0,
    report: null,
    finished: false,
    attempts: 0,
  };
}
export function activeChapter3(s) {
  return !!s.chapter2?.decision && s.chapter3?.started === true;
}
export function chapter3Quests(s) {
  const c = s.chapter3,
    r = ROUTES3[s.chapter2?.decision];
  const done = [c.guideHeard, c.actionComplete, c.eventStep === 3, c.finished];
  const descriptions = [
    "Keresd Flaccust a porticus déli részén (−4, 25), és azonosítsd a helyszínt.",
    `Keresd: ${r?.name || "a közvetítő"} (${r?.x}, ${r?.z}). Vizsgáld meg az ülés tábláját (−5, −6) és a tanú feljegyzését (6, −12), mérlegelj a B panelen, majd hajtsd végre választott feladatodat.`,
    `Lépj a curia bejáratához (0, −22), és E-vel kövesd az eseményeket. A félbehagyott jelenet folytatható.`,
    `Az írnok asztalánál (4, −25) fejezd be a beszámolót. Őrizd meg a tény és az utólagos feltételezés különbségét.`,
  ];
  let open = true;
  return [
    "Pompeius nyomában",
    "A döntés határa",
    "Az ülés küszöbén",
    "Az írnok feljegyzése",
  ].map((title, i) => {
    const status = open ? (done[i] ? "complete" : "active") : "locked";
    open = open && done[i];
    return {
      id: ["arrival3", "action3", "event3", "report3"][i],
      title,
      task: descriptions[i],
      status,
      progress: i === 1 ? `${c.records.length}/2` : done[i] ? "1/1" : "0/1",
    };
  });
}
export function normalizeChapter3(raw, eligible) {
  const c = freshChapter3();
  if (!eligible || !raw || typeof raw !== "object") return c;
  c.started = raw.started === true;
  if (!c.started) return c;
  c.guideHeard = raw.guideHeard === true;
  c.routeHeard = c.guideHeard && raw.routeHeard === true;
  c.records = RECORDS3.filter(
    (r) => Array.isArray(raw.records) && raw.records.includes(r.id),
  ).map((r) => r.id);
  if (c.guideHeard && c.records.length === 2 && raw.assessment === "limited")
    c.assessment = "limited";
  c.actionComplete =
    c.routeHeard && !!c.assessment && raw.actionComplete === true;
  c.eventStep =
    c.actionComplete && Number.isInteger(raw.eventStep)
      ? Math.max(0, Math.min(3, raw.eventStep))
      : 0;
  if (c.eventStep === 3 && raw.report === "accountable")
    c.report = "accountable";
  c.finished = !!c.report && raw.finished === true;
  c.attempts = Number.isInteger(raw.attempts)
    ? Math.max(0, Math.min(10000, raw.attempts))
    : 0;
  return c;
}
export function installChapter3(Store) {
  Object.assign(Store.prototype, {
    start3() {
      if (!this.state.chapter2?.decision) return false;
      this.state.chapter3.started = true;
      this.state.player = { x: 0, z: 33, yaw: 0, pitch: 0, region: "campus" };
      this.changed();
      return true;
    },
    returnRome() {
      if (!activeChapter3(this.state)) return false;
      this.state.player = { x: 0, z: -25, yaw: 0, pitch: 0, region: "rome" };
      this.changed();
      return true;
    },
    guide3() {
      if (!activeChapter3(this.state)) return false;
      this.state.chapter3.guideHeard = true;
      this.changed();
      return true;
    },
    route3() {
      if (!activeChapter3(this.state) || !this.state.chapter3.guideHeard)
        return false;
      this.state.chapter3.routeHeard = true;
      this.changed();
      return true;
    },
    record3(id) {
      if (!activeChapter3(this.state) || !RECORDS3.some((r) => r.id === id))
        return false;
      const c = this.state.chapter3;
      if (!c.records.includes(id)) {
        c.records.push(id);
        this.changed();
      }
      return true;
    },
    assess3(choice) {
      const c = this.state.chapter3;
      if (
        !activeChapter3(this.state) ||
        !c.guideHeard ||
        c.records.length !== 2
      )
        return false;
      c.attempts++;
      if (choice === "limited") c.assessment = choice;
      this.changed();
      return !!c.assessment;
    },
    act3() {
      const c = this.state.chapter3;
      if (!activeChapter3(this.state) || !c.routeHeard || !c.assessment)
        return false;
      c.actionComplete = true;
      this.changed();
      return true;
    },
    scene3() {
      const c = this.state.chapter3;
      if (!activeChapter3(this.state) || !c.actionComplete || c.eventStep >= 3)
        return false;
      c.eventStep++;
      this.changed();
      return true;
    },
    report3(choice) {
      const c = this.state.chapter3;
      if (!activeChapter3(this.state) || c.eventStep !== 3) return false;
      c.attempts++;
      if (choice === "accountable") c.report = choice;
      this.changed();
      return !!c.report;
    },
    finish3() {
      const c = this.state.chapter3;
      if (!activeChapter3(this.state) || !c.report || c.finished) return false;
      c.finished = true;
      this.changed();
      return true;
    },
  });
}
