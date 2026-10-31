import { REGIONS, REGION_IDS, cleanPosition } from "../world/regions.js";
import {
  freshCity,
  normalizeCity,
  installCity,
  needsSubura,
  needsCity2,
  suburaQuest,
} from "./city.js";
import {
  freshChapter3,
  normalizeChapter3,
  chapter3Quests,
  activeChapter3,
  installChapter3,
} from "./chapter3.js";
import {
  freshChapter2,
  normalizeChapter2,
  chapter2Quests,
  activeChapter2,
  installChapter2,
} from "./chapter2.js";
import { NPCS, VOICES, RECIPIENTS, QUESTS, TABLET } from "./data.js";
export const SAVE_KEY = "caesar.story.save.v1";
export function freshState() {
  return {
    version: 4,
    city: freshCity(),
    regionPositions: {},
    chapter3: freshChapter3(),
    chapter2: freshChapter2(),
    storyVersion: "2.1",
    answers: Object.fromEntries(Object.keys(NPCS).map((id) => [id, []])),
    responses: Object.fromEntries(Object.keys(NPCS).map((id) => [id, {}])),
    trust: Object.fromEntries(Object.keys(NPCS).map((id) => [id, 0])),
    evidence: [],
    interpretation: null,
    conclusionAttempts: 0,
    deliveryTarget: null,
    decisions: { messageRecipient: null },
    chapterComplete: false,
    nextChapterReady: false,
    journal: [],
    player: { x: 0, z: 33, yaw: 0, pitch: 0, region: "rome" },
    world: { scrolls: [], visited: ["VIA SACRA"] },
  };
}
export function voicesCount(s) {
  return VOICES.filter((id) => s.answers[id].length > 0).length;
}
export function quests(s) {
  if (activeChapter3(s)) return chapter3Quests(s);
  if (activeChapter2(s)) return chapter2Quests(s);
  const done = [
    voicesCount(s) === 3,
    s.evidence.includes(TABLET.id),
    s.interpretation === "B",
    !!s.decisions.messageRecipient,
  ];
  let unlocked = true;
  const original = QUESTS.map((q, i) => {
    const status = unlocked ? (done[i] ? "complete" : "active") : "locked";
    unlocked = unlocked && done[i];
    return {
      ...q,
      status,
      progress: i === 0 ? `${voicesCount(s)}/3` : done[i] ? "1/1" : "0/1",
    };
  });
  if (!s.city.legacyRoute) {
    const active = !!s.interpretation;
    if (!s.city.seal) original[3].status = "locked";
    original.splice(3, 0, {
      ...suburaQuest(s),
      status: s.city.seal ? "complete" : active ? "active" : "locked",
    });
  }
  return original;
}
export function currentQuest(s) {
  if (activeChapter3(s))
    return (
      chapter3Quests(s).find((q) => q.status === "active") || {
        id: "campaign-complete",
        title: "Játék teljesítve",
        task: "A háromfejezetes történet lezárult. A J naplóban újranézheted döntéseidet.",
        progress: "3/3 fejezet",
      }
    );
  if (activeChapter2(s))
    return (
      chapter2Quests(s).find((q) => q.status === "active") || {
        id: "chapter2-complete",
        title: "II. fejezet teljesítve",
        task: "Indulj a Forum nyugati útjelzőjéhez (−7, −28), vagy a naplóban válaszd a III. fejezet megkezdését.",
        progress: "4/4",
      }
    );
  return (
    quests(s).find((q) => q.status === "active") || {
      id: "complete",
      title: s.nextChapterReady ? "A Forumon vagy" : "Irány a Forum",
      task: s.nextChapterReady
        ? "A köztársaság árnyéka elkezdődött. Nyisd meg a küldetésnaplót."
        : "A döntésed megmaradt. Indulj a Forum Romanum felé, az utca északi végén.",
      progress: "4/4",
    }
  );
}
export function normalizeSave(raw) {
  if (
    !raw ||
    ![1, 2, 3, 4].includes(raw.version) ||
    typeof raw.answers !== "object" ||
    !raw.answers ||
    Array.isArray(raw.answers)
  )
    throw new Error("unsupported-save");
  const s = freshState();
  s.city = normalizeCity(raw.city, raw.version < 4);
  for (const id of Object.keys(NPCS)) {
    s.answers[id] = [
      ...new Set(Array.isArray(raw.answers[id]) ? raw.answers[id] : []),
    ].filter((q) => NPCS[id].questions.some((v) => v.id === q));
    for (const qid of s.answers[id]) {
      const q = NPCS[id].questions.find((q) => q.id === qid);
      s.responses[id][qid] =
        q.beforeEvidence && raw.responses?.[id]?.[qid] === "beforeEvidence"
          ? "beforeEvidence"
          : "answer";
    }
    s.trust[id] = s.answers[id].reduce(
      (n, q) => n + NPCS[id].questions.find((v) => v.id === q).trust,
      0,
    );
  }
  s.evidence =
    Array.isArray(raw.evidence) && raw.evidence.includes(TABLET.id)
      ? [TABLET.id]
      : [];
  if (voicesCount(s) === 3 && s.evidence.length && raw.interpretation === "B")
    s.interpretation = "B";
  s.conclusionAttempts = Number.isInteger(raw.conclusionAttempts)
    ? Math.max(0, Math.min(10000, raw.conclusionAttempts))
    : 0;
  if (s.interpretation && RECIPIENTS.includes(raw.deliveryTarget))
    s.deliveryTarget = raw.deliveryTarget;
  const recipient = raw.decisions?.messageRecipient;
  if (s.interpretation && !needsSubura(s) && RECIPIENTS.includes(recipient)) {
    s.decisions.messageRecipient = recipient;
    s.deliveryTarget = recipient;
    s.chapterComplete = true;
    s.trust[recipient]++;
    s.nextChapterReady = raw.nextChapterReady === true;
  }
  s.journal = Array.isArray(raw.journal)
    ? [
        ...new Set(
          raw.journal.filter(
            (id) =>
              typeof id === "string" &&
              /^(talk:(marcus|lucius|quintus|titus):[a-z]+|tablet|interpretation|delivery:(lucius|quintus|titus)|forum)$/.test(
                id,
              ),
          ),
        ),
      ].slice(0, 30)
    : [];
  for (const key of ["x", "z", "yaw", "pitch"])
    if (Number.isFinite(raw.player?.[key])) s.player[key] = raw.player[key];
  s.player.yaw = ((s.player.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  s.player.pitch = Math.max(-1.1, Math.min(1.1, s.player.pitch));
  s.world.scrolls = Array.isArray(raw.world?.scrolls)
    ? [
        ...new Set(
          raw.world.scrolls.filter(
            (i) => Number.isInteger(i) && i >= 0 && i < 3,
          ),
        ),
      ]
    : [];
  s.world.visited = Array.isArray(raw.world?.visited)
    ? [
        ...new Set([
          "VIA SACRA",
          ...raw.world.visited.filter((v) =>
            [
              "VIA SACRA",
              "FORUM ROMANUM",
              "TEMPLUM SATURNI",
              "PORTICVS POMPEI",
              "CVRIA POMPEIA",
              "SVBVRA",
              "FORVM BOARIVM",
              "DOMVS PALATINA",
            ].includes(v),
          ),
        ]),
      ]
    : ["VIA SACRA"];
  if (s.nextChapterReady)
    s.chapter2 = normalizeChapter2(raw.chapter2, s.decisions.messageRecipient);
  if (!s.chapterComplete) {
    s.city.dockRecords = [];
    s.city.dockConclusion = false;
    s.city.gateOpen = false;
    s.city.delivered = false;
  }
  if (needsCity2(s)) s.chapter2.decision = null;
  s.chapter3 = normalizeChapter3(raw.chapter3, !!s.chapter2.decision);
  const savedRegion =
    REGION_IDS.includes(raw.player?.region) &&
    (raw.player.region !== "campus" || s.chapter3.started)
      ? raw.player.region
      : "rome";
  s.player = cleanPosition({ ...s.player }, savedRegion);
  for (const id of REGION_IDS) {
    if (raw.regionPositions?.[id] && (id !== "campus" || s.chapter3.started))
      s.regionPositions[id] = cleanPosition(raw.regionPositions[id], id);
  }
  s.regionPositions[savedRegion] = { ...s.player };
  return s;
}
export class StoryStore {
  constructor(storage) {
    this.storage = storage;
    this.listeners = new Set();
    this.notice = "";
    this.state = freshState();
    this.load();
  }
  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit() {
    for (const fn of this.listeners) fn(this.state);
  }
  load() {
    try {
      if (!this.storage) throw new Error("storage-unavailable");
      const text = this.storage.getItem(SAVE_KEY);
      this.state = text ? normalizeSave(JSON.parse(text)) : freshState();
      this.notice = text ? "Mentés visszatöltve." : "";
    } catch {
      this.state = freshState();
      this.notice =
        "A mentés sérült, régebbi vagy nem elérhető. A fejezet biztonságosan újrakezdhető.";
    }
    this.emit();
    return this.state;
  }
  persist() {
    try {
      if (!this.storage) throw new Error("storage-unavailable");
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.state));
      return true;
    } catch {
      this.notice =
        "A böngésző nem tud menteni. A fejezet ebben a munkamenetben játszható, de az előrehaladás nem biztos, hogy megmarad.";
      return false;
    }
  }
  changed(event) {
    if (event && !this.state.journal.includes(event))
      this.state.journal.push(event);
    this.persist();
    this.emit();
  }
  ask(id, questionId) {
    const npc = NPCS[id],
      q = npc?.questions.find((q) => q.id === questionId);
    if (!q) return null;
    const s = this.state,
      variant =
        !s.evidence.length && q.beforeEvidence ? "beforeEvidence" : "answer";
    const first = !s.answers[id].includes(q.id);
    if (first) {
      s.answers[id].push(q.id);
      s.trust[id] += q.trust;
    }
    if (first || s.responses[id][q.id] !== variant) {
      s.responses[id][q.id] = variant;
      this.changed(`talk:${id}:${q.id}`);
    }
    return q[variant];
  }

  examineTablet() {
    if (!this.state.evidence.includes(TABLET.id)) {
      this.state.evidence.push(TABLET.id);
      this.changed("tablet");
    }
  }
  conclude(choice) {
    if (currentQuest(this.state).id !== "interpretation") return false;
    this.state.conclusionAttempts++;
    if (choice === "B") {
      this.state.interpretation = "B";
      this.changed("interpretation");
      return true;
    }
    this.changed();
    return false;
  }
  chooseRecipient(id) {
    if (
      !this.state.interpretation ||
      this.state.chapterComplete ||
      !RECIPIENTS.includes(id)
    )
      return false;
    this.state.deliveryTarget = id;
    this.changed();
    return true;
  }
  deliver(id) {
    const s = this.state;
    if (
      !s.interpretation ||
      s.chapterComplete ||
      needsSubura(s) ||
      !RECIPIENTS.includes(id)
    )
      return false;
    s.decisions.messageRecipient = id;
    s.deliveryTarget = id;
    s.chapterComplete = true;
    s.trust[id]++;
    this.changed(`delivery:${id}`);
    return true;
  }
  enterForum() {
    if (!this.state.chapterComplete || this.state.nextChapterReady)
      return false;
    this.state.nextChapterReady = true;
    this.changed("forum");
    return true;
  }
  checkpoint(player, world) {
    this.state.player = { ...player };
    this.state.regionPositions[player.region || "rome"] = { ...player };
    this.state.world = {
      scrolls: [...world.scrolls],
      visited: [...world.visited],
    };
    return this.persist();
  }
  reset() {
    this.state = freshState();
    this.notice = "Új fejezet indult.";
    this.changed();
  }
}

installChapter2(StoryStore);

installChapter3(StoryStore);

installCity(StoryStore);
