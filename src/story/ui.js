import {
  CHAPTER,
  NPCS,
  VOICES,
  RECIPIENTS,
  TABLET,
  CONCLUSIONS,
  DELIVERY,
} from "./data.js";
import { currentQuest, quests, voicesCount } from "./state.js";
const node = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
export class StoryUI {
  constructor(store, { onOpen, onClose, onReset }) {
    this.store = store;
    this.hooks = { onOpen, onClose, onReset };
    this.root = document.getElementById("storyPanel");
    this.root.hidden = true;
    this.content = this.root.querySelector(".story-content");
    this.content.tabIndex = 0;
    this.title = this.root.querySelector("h2");
    this.closeButton = this.root.querySelector(".story-close");
    this.closeButton.onclick = () => this.close(true);
    this.root.addEventListener("keydown", (e) => this.keyboard(e));
  }
  get isOpen() {
    return !this.root.hidden;
  }
  open(title, kind) {
    if (!this.isOpen) this.hooks.onOpen();
    this.root.hidden = false;
    document.body.dataset.storyPanel = "open";
    this.root.dataset.kind = kind;
    this.title.textContent = title;
    this.content.replaceChildren();
    this.content.scrollTop = 0;
    return this.content;
  }
  finish(read = false) {
    if (read) {
      this.content.focus();
      this.content.scrollTop = 0;
      return;
    }
    (
      this.root.querySelector(".story-content button") || this.closeButton
    ).focus();
  }
  text(value, cls) {
    this.content.append(node("p", value, cls));
  }
  button(label, fn, testId) {
    const b = node("button", label, "story-action");
    b.type = "button";
    if (testId) b.dataset.testid = testId;
    b.onclick = fn;
    this.content.append(b);
    return b;
  }
  close(lock = false) {
    if (!this.isOpen) return;
    this.root.hidden = true;
    delete document.body.dataset.storyPanel;
    this.hooks.onClose(lock);
  }
  keyboard(e) {
    if (e.code === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this.close(false);
      return;
    }
    const all = [
      ...this.root.querySelectorAll(
        'button:not([disabled]), .story-content[tabindex="0"]',
      ),
    ];
    if (e.code === "Tab") {
      if (e.shiftKey && document.activeElement === all[0]) {
        e.preventDefault();
        all.at(-1)?.focus();
      } else if (!e.shiftKey && document.activeElement === all.at(-1)) {
        e.preventDefault();
        all[0]?.focus();
      }
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(e.code)) {
      if (document.activeElement === this.content) return;
      e.preventDefault();
      const i = all.indexOf(document.activeElement),
        step = e.code === "ArrowDown" ? 1 : -1;
      all[(i + step + all.length) % all.length]?.focus();
      return;
    }
    if (/^Digit[1-9]$/.test(e.code)) {
      e.preventDefault();
      const choices = [...this.content.querySelectorAll("button.story-action")];
      choices[Number(e.code.slice(-1)) - 1]?.click();
    }
  }
  dialogue(id) {
    const n = NPCS[id],
      s = this.store.state;
    if (!n) return;
    this.open(`${n.name} – ${n.role}`, "dialogue");
    this.text("Fiktív szereplő · " + n.direction, "story-caption");
    this.text(n.opening, "story-quote");
    const trust = s.trust[id];
    this.text(
      `Bizalom: ${trust < 0 ? "tartózkodó" : trust === 0 ? "óvatos" : "nyitott"} · ${s.answers[id].length}/3 témát beszéltetek meg`,
      "story-caption",
    );
    n.questions.forEach((q, i) =>
      this.button(
        `${i + 1}. ${q.text}${s.answers[id].includes(q.id) ? " ✓" : ""}`,
        () => {
          const answer = this.store.ask(id, q.id);
          this.open(`${n.name} – ${n.role}`, "answer");
          this.text(q.text, "story-caption");
          this.text(answer, "story-quote");
          if (VOICES.includes(id))
            this.text(
              `Róma hangjai: ${voicesCount(this.store.state)}/3 · Érdemi információ feljegyezve a naplóba.`,
              "story-caption",
            );
          this.button(
            "Másik kérdésem is van",
            () => this.dialogue(id),
            "more-questions",
          );
          this.button(
            "Befejezem a beszélgetést",
            () => this.close(true),
            "close-dialogue",
          );
          this.finish();
        },
        `question-${id}-${q.id}`,
      ),
    );
    if (s.interpretation && !s.chapterComplete && RECIPIENTS.includes(id))
      this.button(
        `Átadom az üzenetet ${n.name} számára`,
        () => this.confirmDelivery(id),
        "deliver-message",
      );
    if (s.decisions.messageRecipient === id)
      this.text(
        "Az üzenetet már átadtad neki. A döntést a következő fejezet is megőrzi.",
        "story-caption",
      );
    this.finish();
  }
  tablet() {
    this.store.examineTablet();
    this.open(TABLET.title, "tablet");
    this.text(TABLET.text, "story-quote");
    this.text(TABLET.provenance, "story-caption");
    if (currentQuest(this.store.state).id === "interpretation")
      this.button(
        "Mit bizonyít az üzenet?",
        () => this.conclusion(),
        "open-conclusion",
      );
    else if (!this.store.state.interpretation)
      this.text(
        "Előbb hallgasd meg Marcus, Lucius és Quintus legalább egy-egy válaszát. A bizonyíték addig is megmarad.",
        "story-caption",
      );
    else if (!this.store.state.chapterComplete)
      this.button("Kinek adom át?", () => this.delivery(), "open-delivery");
    this.button("Vissza az utcára", () => this.close(true), "close-tablet");
    this.finish();
  }
  conclusion(feedback = "", correct = false) {
    this.open("Mit bizonyít az üzenet?", "conclusion");
    this.text(TABLET.text, "story-quote");
    this.text(
      "Az üzenet fiktív, ismeretlen szerzőjű. Csak azt állítsd biztosan, amit a szöveg alátámaszt.",
      "story-caption",
    );
    if (feedback) {
      const p = node(
        "p",
        feedback,
        correct ? "story-feedback good" : "story-feedback",
      );
      p.setAttribute("role", "status");
      this.content.append(p);
    }
    if (correct || this.store.state.interpretation) {
      if (!this.store.state.chapterComplete)
        this.button(
          "Tovább: kinek adom át?",
          () => this.delivery(),
          "open-delivery",
        );
    } else if (currentQuest(this.store.state).id === "interpretation")
      CONCLUSIONS.forEach((c) =>
        this.button(
          `${c.id}) ${c.text}`,
          () => {
            const ok = this.store.conclude(c.id);
            this.conclusion(c.feedback, ok);
          },
          `conclusion-${c.id}`,
        ),
      );
    else
      this.text(
        "A következtetéshez előbb három nézőpont és a viasztábla vizsgálata szükséges.",
        "story-caption",
      );
    this.finish();
  }
  delivery() {
    this.open("Kinek adod át az üzenetet?", "delivery");
    this.text(
      "A bizonyíték bizonytalan, a döntésed következménye viszont megmarad. Jelölj ki egy címzettet, majd keresd fel a városban és add át neki az üzenetet.",
    );
    for (const id of RECIPIENTS) {
      this.button(
        `${NPCS[id].name} – ${NPCS[id].role}`,
        () => {
          this.store.chooseRecipient(id);
          this.deliveryRoute(id);
        },
        `recipient-${id}`,
      );
      this.text(DELIVERY[id], "story-caption");
    }
    this.finish();
  }
  deliveryRoute(id) {
    this.open("Címzett kijelölve", "route");
    this.text(`${NPCS[id].name} várható helye: ${NPCS[id].direction}.`);
    this.text(
      "A térképen névvel jelöljük. Keresd fel, nyomj E-t, majd válaszd az üzenet átadását. A címzettet addig szabadon megváltoztathatod, amíg nem adtad át.",
      "story-caption",
    );
    this.button("Megkeresem", () => this.close(true), "follow-recipient");
    this.button(
      "Másik címzettet választok",
      () => this.delivery(),
      "change-recipient",
    );
    this.finish();
  }
  confirmDelivery(id) {
    this.open(`Üzenet átadása – ${NPCS[id].name}`, "confirm-delivery");
    this.text(DELIVERY[id]);
    this.text(
      "Átadás után ezt a döntést a mentés és a következő fejezet is megőrzi.",
      "story-caption",
    );
    this.button(
      "Átadom az üzenetet",
      () => {
        if (this.store.deliver(id)) this.ending();
      },
      "confirm-delivery",
    );
    this.button("Még átgondolom", () => this.dialogue(id), "cancel-delivery");
    this.finish();
  }
  ending() {
    this.open("I. fejezet teljesítve", "ending");
    this.text(CHAPTER.ending, "story-quote");
    this.text(DELIVERY[this.store.state.decisions.messageRecipient] || "");
    this.text(
      "A döntés mentve. Indulj a Forum Romanum felé; a következő fejezet belépési állapotát ott rögzítjük. A II. fejezet története még nem része ennek a változatnak.",
    );
    this.button(
      "Tovább a Forum felé",
      () => this.close(true),
      "continue-forum",
    );
    this.button("Megnézem a naplót", () => this.journal(), "ending-journal");
    this.finish();
  }
  journal() {
    this.open("Küldetésnapló", "journal");
    this.text(CHAPTER.title, "story-quote");
    this.text(CHAPTER.intro);
    for (const q of quests(this.store.state)) {
      this.content.append(
        node(
          "h3",
          `${q.status === "complete" ? "✓" : q.status === "locked" ? "·" : "→"} ${q.title} · ${q.progress}`,
        ),
      );
      this.text(q.task, "story-caption");
    }
    if (this.store.state.chapterComplete)
      this.text(currentQuest(this.store.state).task, "story-feedback good");
    if (this.store.state.deliveryTarget)
      this.text(
        `Kijelölt címzett: ${NPCS[this.store.state.deliveryTarget].name}. ${NPCS[this.store.state.deliveryTarget].direction}`,
      );
    this.content.append(node("h3", "Feljegyzett beszélgetések"));
    for (const [id, n] of Object.entries(NPCS)) {
      this.text(`${n.name} · ${n.direction}`, "story-caption");
      for (const question of this.store.state.answers[id]) {
        const q = n.questions.find((v) => v.id === question);
        this.text(
          `${q.text} — ${q[this.store.state.responses[id][question] || "answer"]}`,
        );
      }
    }
    this.button(
      "Bizonyítékok és következtetés",
      () => this.evidence(),
      "journal-evidence",
    );
    if (this.store.state.interpretation && !this.store.state.chapterComplete)
      this.button(
        "Címzett kiválasztása",
        () => this.delivery(),
        "journal-delivery",
      );
    if (this.store.state.chapterComplete)
      this.button(
        "Fejezetlezárás megtekintése",
        () => this.ending(),
        "review-ending",
      );
    this.text(CHAPTER.fiction, "story-caption");
    this.finish(true);
  }
  evidence() {
    this.open("Bizonyítékok", "evidence");
    if (this.store.state.evidence.includes(TABLET.id)) {
      this.text(TABLET.title, "story-quote");
      this.text(TABLET.text);
      this.text(TABLET.provenance, "story-caption");
      this.button(
        this.store.state.interpretation
          ? "A megfontolt következtetésem"
          : "Mit bizonyít az üzenet?",
        () => this.conclusion(),
        "evidence-conclusion",
      );
    } else
      this.text(
        "Még nincs tárgyi bizonyítékod. A Via Sacra nyugati szélén, Quintus és Marcus között egy viasztábla hever.",
      );
    this.text(
      `Meghallgatott nézőpontok: ${voicesCount(this.store.state)}/3. A hallomás és a névtelen üzenet önmagában nem bizonyít egy konkrét tervet.`,
      "story-caption",
    );
    this.finish();
  }
  resetConfirmation() {
    this.open("Újrakezded a fejezetet?", "reset");
    this.text(
      "A jelenlegi beszélgetések, bizonyítékok és döntés helyére új fejezet kerül.",
    );
    this.button(
      "Igen, új fejezetet kezdek",
      () => {
        this.hooks.onReset();
        this.close(true);
      },
      "confirm-reset",
    );
    this.button(
      "Megtartom az előrehaladást",
      () => this.close(false),
      "cancel-reset",
    );
    this.finish();
  }
}
