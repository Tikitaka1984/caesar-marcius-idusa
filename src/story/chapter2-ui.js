import {
  TITLE,
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  CLAIMS,
  CATEGORIES,
  FINAL_CHOICES,
  INFORMANT,
  LEDGER,
  chapter2Quests,
  activeChapter2,
} from "./chapter2.js";
export function installChapter2UI(UI) {
  const journal1 = UI.prototype.journal,
    evidence1 = UI.prototype.evidence;
  Object.assign(UI.prototype, {
    journal() {
      if (!activeChapter2(this.store.state)) return journal1.call(this);
      this.open("Küldetésnapló", "journal");
      this.text(TITLE, "story-quote");
      this.text("Forum Romanum · Kr. e. 44. március 15.");
      for (const q of chapter2Quests(this.store.state)) {
        this.text(
          `${q.status === "complete" ? "✓" : q.status === "active" ? "→" : "·"} ${q.title} · ${q.progress}`,
          "story-quote",
        );
        this.text(q.task);
      }
      const c = this.store.state.chapter2;
      this.text(
        `Korábbi címzett: ${this.store.state.decisions.messageRecipient}. Iratok: ${c.documents.length}/3.`,
      );
      for (const [id, n] of Object.entries(POLITICIANS)) {
        this.text(
          `${n.name}: ${c.answers[id].length}/4 · Helye: (${n.x}, ${n.z}).`,
        );
        for (const q of n.questions)
          if (c.answers[id].includes(q[0])) {
            this.text(q[1], "story-caption");
            this.text(q[2]);
          }
      }
      if (c.politicalConclusion)
        this.text(
          "Elfogadott következtetés: a stabilitás igénye és az intézmények féltése egyszerre érthető.",
        );
      if (c.distinction)
        this.text(
          "Elfogadott különbségtétel: az elégedetlenség nem bizonyít konkrét merényletet.",
        );
      if (c.decision) this.text("Döntés: " + FINAL_CHOICES[c.decision]);
      if (
        !c.politicalConclusion &&
        Object.values(c.answers).every((a) => a.length === 4)
      )
        this.button(
          "Politikai következtetés",
          () => this.politics2(),
          "politics-open",
        );
      this.button(
        "Bizonyítékok összevetése",
        () => this.evidence(),
        "comparison-open",
      );
      if (c.decision)
        this.button("Fejezetzárás", () => this.ending2(), "ending2-review");
      this.text(
        "Az új szereplők, párbeszédek, iratok és futáresemények fiktívek. A történeti háttér forrásait a HISTORICAL-NOTES.md ismerteti.",
        "story-caption",
      );
      this.finish(true);
    },
    guide2(id) {
      const b = BRANCHES[this.store.state.decisions.messageRecipient];
      if (!b || b.guide !== id) return;
      this.open(`${b.name} – ${b.role}`, "dialogue2");
      this.text("Fiktív közvetítő", "story-caption");
      this.text(b.opening, "story-quote");
      this.text(b.detail);
      this.button(
        "Elfogadom a közvetítést",
        () => {
          this.store.introduce2(id);
          this.journal();
        },
        "introduce2",
      );
      this.finish();
    },
    dialogue2(id) {
      const n = POLITICIANS[id],
        c = this.store.state.chapter2;
      this.open(`${n.name} – ${n.role}`, "dialogue2");
      this.text(
        "Fiktív szereplő · történeti háttérre épülő párbeszéd",
        "story-caption",
      );
      if (!c.introduced) {
        this.text("Előbb keresd fel a címzettedhez kapcsolódó közvetítőt!");
        this.finish();
        return;
      }
      const r = this.store.state.decisions.messageRecipient;
      this.text(
        r === "lucius" && id === "publius"
          ? "Lucius ajánlásával könnyebben szóba állunk."
          : r === "quintus" && id === "aulus"
            ? "Quintus ajánlását megkaptam."
            : r === "titus"
              ? "A futárok útja még nem jelent politikai szövetséget."
              : "Előbb szeretném látni, hogy a másik fél érveit is meghallgatod.",
      );
      this.text(n.opening, "story-quote");
      this.text(`Megismert érvek: ${c.answers[id].length}/4`);
      for (const q of n.questions)
        this.button(
          q[1] + (c.answers[id].includes(q[0]) ? " ✓" : ""),
          () => {
            const answer = this.store.ask2(id, q[0]);
            this.open(`${n.name} válasza`, "answer2");
            this.text(answer, "story-quote");
            this.button(
              "Másik kérdésem is van",
              () => this.dialogue2(id),
              "more2",
            );
            this.button(
              "Befejezem a beszélgetést",
              () => this.close(true),
              "close2",
            );
            this.finish();
          },
          `question2-${id}-${q[0]}`,
        );
      this.finish();
    },
    politics2(feedback = "") {
      this.open("A köztársaság mérlegen", "politics2");
      this.text(
        "Miért támogathatták egyes rómaiak Caesart, miközben mások veszélyesnek tartották a hatalmát?",
        "story-quote",
      );
      if (feedback) this.text(feedback, "story-feedback");
      for (const [id, label] of [
        [
          "loyal",
          "Minden támogató csak jutalmat akart, az ellenfeleknek volt igazuk.",
        ],
        [
          "balanced",
          "Sokan stabilitást és reformokat reméltek; mások a köztársasági intézmények kiüresedésétől tartottak.",
        ],
        [
          "traitors",
          "Minden ellenfele áruló volt; a rend minden személyes hatalmat igazol.",
        ],
      ])
        this.button(
          label,
          () => {
            if (this.store.politics2(id)) this.journal();
            else
              this.politics2(
                "Ez általánosítás. Vizsgáld a rend iránti igényt és a hatalom korlátait is; újra próbálkozhatsz.",
              );
          },
          `politics-${id}`,
        );
      this.finish();
    },
    ledger2() {
      this.open(LEDGER.title, "ledger2");
      this.text(
        "FIKTÍV kézbesítési jegyzék. A futárhálózat másolatai három Forumon fekvő irathoz vezetnek. Nem maradt fenn ilyen ókori jegyzék.",
      );
      this.text(
        "Nyugati irat: (−6, −17); keleti irat: (8, −18); északi feljegyzés: (1, −25).",
      );
      if (this.store.state.decisions.messageRecipient === "titus") {
        this.button(
          "Ellenőrzöm a futárutat",
          () => {
            this.store.access2();
            this.journal();
          },
          "ledger-access",
        );
      }
      this.finish();
    },
    document2(id) {
      const d = DOCUMENTS.find((d) => d.id === id);
      if (!d) return;
      this.open(d.title, "document2");
      if (!this.store.document2(id)) {
        this.text(
          "Az irat egyelőre nem hozzáférhető. Előbb keresd fel a közvetítődet. Lucius ágán a rendkívüli hatalom iratához Aulus négy válasza kell; Quintus ágán a diadém iratához Publius négy válasza; Titus ágán vizsgáld meg a keleti futárjegyzéket.",
        );
      } else {
        this.text(d.text, "story-quote");
        this.text(d.provenance, "story-caption");
        this.text(
          `Megtalált iratok: ${this.store.state.chapter2.documents.length}/3`,
        );
        if (this.store.state.chapter2.documents.length === 3)
          this.button(
            "Összevetem az állításokat",
            () => this.evidence(),
            "document-compare",
          );
      }
      this.finish();
    },
    evidence(feedback = "") {
      if (!activeChapter2(this.store.state)) return evidence1.call(this);
      this.open("Bizonyítékok – II. fejezet", "evidence2");
      const c = this.store.state.chapter2;
      this.text(`Megtalált iratok: ${c.documents.length}/3`, "story-quote");
      this.text(
        "I. fejezet megőrzött bizonyítéka: Az elveszett viasztábla. Az üzenet találkozóra utal, de célja nem bizonyított.",
        "story-caption",
      );
      for (const d of DOCUMENTS) {
        this.text(
          `${c.documents.includes(d.id) ? "✓" : "·"} ${d.title} (${d.x}, ${d.z})`,
        );
        if (c.documents.includes(d.id)) {
          this.text(d.text);
          this.text(d.provenance, "story-caption");
        }
      }
      if (feedback) this.text(feedback, "story-feedback");
      if (c.documents.length === 3 && !c.politicalConclusion)
        this.text(
          "Előbb fejezd be mindkét politikai párbeszédet, majd következtess a J naplóban.",
        );
      if (c.documents.length === 3 && c.politicalConclusion) {
        const selects = {};
        for (const q of CLAIMS) {
          const p = document.createElement("label");
          p.textContent = q.text;
          const select = document.createElement("select");
          select.dataset.testid = "classify-" + q.id;
          select.setAttribute("aria-label", q.text);
          const placeholder = document.createElement("option");
          placeholder.value = "";
          placeholder.textContent = "Válassz kategóriát";
          select.append(placeholder);
          for (const [key, value] of Object.entries(CATEGORIES)) {
            const o = document.createElement("option");
            o.value = key;
            o.textContent = value;
            select.append(o);
          }
          select.value = c.classification[q.id] || "";
          p.append(select);
          this.content.append(p);
          selects[q.id] = select;
          if (c.comparisonComplete) this.text(q.explanation, "story-caption");
        }
        this.button(
          "Ellenőrzöm az összevetést",
          () => {
            const ok = this.store.compare2(
              Object.fromEntries(
                Object.entries(selects).map(([id, s]) => [id, s.value]),
              ),
            );
            this.evidence(
              ok
                ? "Helyes összevetés. Olvasd el a magyarázatokat."
                : "Még van javítandó besorolás. " +
                    CLAIMS.filter(
                      (q) =>
                        this.store.state.chapter2.classification[q.id] !==
                        q.category,
                    )
                      .map((q) => q.explanation)
                      .join(" ") +
                    " Újra próbálkozhatsz.",
            );
          },
          "compare-submit",
        );
        if (c.comparisonComplete)
          this.button(
            "Mit bizonyít a titkos találkozó?",
            () => this.distinction2(),
            "distinction-open",
          );
      }
      this.finish(true);
    },
    distinction2(feedback = "") {
      this.open("A titkos találkozó – következtetés", "distinction2");
      this.text(
        "A nyilvános politikai vita, a fiktív feljegyzés és a vallomások alapján mit állíthatsz?",
        "story-quote",
      );
      if (feedback) this.text(feedback, "story-feedback");
      this.button(
        "Az elégedetlenség és egy találkozó nyoma nem bizonyítja konkrét személyek meghatározott merényleti tervét.",
        () => {
          this.store.distinguish2("limited");
          this.open("Új nyom", "distinction2");
          this.text(
            "Helyes: a két állítás nem azonos. Naso informátort keresd a Forum északi részén (−4, −27).",
          );
          this.finish();
        },
        "distinction-limited",
      );
      this.button(
        "Minden Caesar-ellenes senator bizonyítottan merényletet tervez.",
        () => {
          this.store.distinguish2("accuse");
          this.distinction2(
            "A politikai ellenzékiség nem részvételi bizonyíték. A feljegyzés nem nevez meg merénylőket. Próbáld újra.",
          );
        },
        "distinction-accuse",
      );
      this.finish();
    },
    informant2() {
      this.open(`${INFORMANT.name} – ${INFORMANT.role}`, "informant2");
      if (!this.store.inform2()) {
        this.text(
          "Előbb vesd össze az iratokat, és különítsd el az elégedetlenséget a konkrét vád bizonyításától a B panelen.",
        );
        this.finish();
        return;
      }
      this.text(
        "„A színházhoz tartozó tanácsterem környékén keress tovább. A Forumról nyugat felé, a Campus Martius déli része felé induló út vezet Pompeius épületegyütteséhez. A pontos időt én sem tudom.”",
        "story-quote",
      );
      this.text(
        "Fiktív informátori közlés. Történeti háttér: a senatus március 15-én Pompeius curiájában ülésezett, ott történt a merénylet. Ez nem a Forum Saturnus-temploma. Az út és a következő helyszín a III. fejezetben következhet.",
        "story-caption",
      );
      if (this.store.state.chapter2.decision)
        this.button(
          "A döntésem megtekintése",
          () => this.ending2(),
          "ending2-review",
        );
      else
        for (const [id, label] of Object.entries(FINAL_CHOICES))
          this.button(label, () => this.confirm2(id), "final-" + id);
      this.finish();
    },
    confirm2(id) {
      this.open("Fejezetzáró döntés megerősítése", "confirm2");
      this.text(FINAL_CHOICES[id]);
      this.text(
        "Ezt a döntést a mentés a III. fejezet kezdőhelyzetéhez őrzi meg.",
      );
      this.button(
        "Megerősítem",
        () => {
          if (this.store.finish2(id)) this.ending2();
        },
        "final-confirm",
      );
      this.button("Még átgondolom", () => this.informant2(), "final-cancel");
      this.finish();
    },
    ending2() {
      this.open(
        "II. fejezet teljesítve – Az összeesküvés következik.",
        "ending2",
      );
      this.text(
        FINAL_CHOICES[this.store.state.chapter2.decision],
        "story-quote",
      );
      this.text(
        "A döntésed mentve. Pompeius curiája a Forumtól nyugatra, a színház épületegyüttesében található. A III. fejezet teljes története még nem játszható.",
      );
      this.button("Vissza a Forumra", () => this.close(true), "ending2-close");
      this.finish();
    },
  });
}
