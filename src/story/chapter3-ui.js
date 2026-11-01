import { inRandomOrder } from "./choice.js";
import {
  TITLE3,
  GUIDE3,
  ROUTES3,
  RECORDS3,
  SCENES3,
  activeChapter3,
  chapter3Quests,
} from "./chapter3.js";
import { NPCS } from "./data.js";
import { REFLECTION } from "./sources.js";
import { buildRecord } from "./record.js";
import { FINAL_CHOICES } from "./chapter2.js";
const node = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
export function installChapter3UI(UI) {
  const journal = UI.prototype.journal,
    evidence = UI.prototype.evidence;
  Object.assign(UI.prototype, {
    campaign() {
      this.open("CAESAR – a teljes történet", "campaign");
      const s = this.store.state;
      this.text("Kr. e. 44. március 15. · Történelmi fikció", "story-caption");
      this.text(
        "Öt külön bejárható helyszín: Forum és Via Sacra; Subura; Forum Boarium és Tiberis-part; palatinusi ház; Pompeius porticusa és curiája.",
      );
      this.button(
        "Várostérkép és utazás",
        () => this.cityMap(),
        "campaign-city-map",
      );
      for (const [title, description, done] of [
        [
          "I. A város suttogása",
          "Via Sacra: három nézőpont, egy névtelen viasztábla, az üzenet címzettje.",
          s.chapterComplete,
        ],
        [
          "II. A köztársaság árnyéka",
          "Forum Romanum: politikai érvek, források és a következő lépés megválasztása.",
          !!s.chapter2.decision,
        ],
        [
          "III. Az összeesküvés",
          "Pompeius porticusa és curiája: cselekvés, történeti esemény és az írnok beszámolója.",
          s.chapter3.finished,
        ],
      ]) {
        this.text((done ? "✓ " : "") + title, "story-quote");
        this.text(description);
      }
      if (s.chapter3.finished)
        this.button(
          "A befejezés és a döntéseim",
          () => this.ending3(),
          "review-campaign-ending",
        );
      else
        this.button(
          "Folytatom a játékot",
          () => {
            this.hooks.onContinue?.();
            this.close(true);
          },
          "campaign-continue",
        );
      this.button(
        "Irányítás és tudnivalók",
        () => this.help3(),
        "campaign-help",
      );
      this.text(
        "A játék teljes asztali története három fejezetből áll. A telefonos érintésvezérlés külön, későbbi fejlesztés.",
        "story-caption",
      );
      this.finish(true);
    },
    help3() {
      this.open("Irányítás és mentés", "help");
      this.text(
        "W / A / S / D: mozgás. Egér: körülnézés; bal / jobb nyíl: fordulás. E: a célkereszt irányába eső, közeli szereplő vagy tárgy használata. M: térkép; J: napló; B: bizonyítékok.",
      );
      this.text(
        "A panelen a számok, Tab, nyilak és Enter is használhatók. Esc bezárja a panelt, vagy szünetelteti a játékot. Panelbezárás után a játéktérre kattintva kérhető vissza az egérzár.",
      );
      this.text(
        "A böngésző helyben, automatikusan ment. A mentés ehhez a böngészőhöz és címhez tartozik. A főmenüben visszatölthetsz vagy megerősítéssel új játékot kezdhetsz.",
      );
      this.button("Vissza a történethez", () => this.campaign(), "help-back");
      this.finish(true);
    },
    travel3() {
      this.open("Út a Campus Martiusra", "travel3");
      this.text(
        "A Forumtól nyugatra indulsz, Pompeius színházának és porticusának környékére. A két városrész közti út stilizált helyszínváltás; a curia nem a Forum temploma.",
      );
      if (!this.store.state.chapter2.decision)
        this.text("Előbb zárd le a II. fejezetet Nasónál.", "story-caption");
      else
        this.button(
          "Elindulok Pompeius porticusához",
          () => {
            if (this.store.start3()) this.close(true);
          },
          "travel-campus",
        );
      this.finish();
    },
    journal() {
      if (!activeChapter3(this.store.state)) return journal.call(this);
      this.open("Küldetésnapló", "journal3");
      this.text(TITLE3, "story-quote");
      const s = this.store.state,
        c = s.chapter3;
      for (const q of chapter3Quests(s)) {
        this.text(
          `${q.status === "complete" ? "✓" : q.status === "active" ? "→" : "·"} ${q.title} · ${q.progress}`,
          "story-quote",
        );
        this.text(q.task);
      }
      this.text(
        "Korábbi címzett: " + NPCS[s.decisions.messageRecipient].name + ".",
      );
      this.text(
        "A Forumon választott cél: " + FINAL_CHOICES[s.chapter2.decision],
      );
      if (c.actionComplete)
        this.text(ROUTES3[s.chapter2.decision].result, "story-feedback good");
      this.button("Bizonyítékok", () => this.evidence(), "journal3-evidence");
      if (c.finished)
        this.button(
          "A játék befejezése",
          () => this.ending3(),
          "journal3-ending",
        );
      this.button(
        "Teljes történet áttekintése",
        () => this.campaign(),
        "journal3-campaign",
      );
      this.button(
        "Források és fogalmak",
        () => this.sources(),
        "journal-sources",
      );
      this.finish(true);
    },
    guide3() {
      this.open(`${GUIDE3.name} – ${GUIDE3.role}`, "guide3");
      this.text(
        "Fiktív szereplő, történeti háttérre épülő eligazítás.",
        "story-caption",
      );
      this.text(
        "Ez Pompeius porticusa, a színházhoz tartozó térség. A curia az épületegyüttes tanácsterme; a senatus ma itt ülésezik. A bejáratot az oszlopsor északi végén találod, de előbb ellenőrizd, mire alapozod a cselekvésedet.",
        "story-quote",
      );
      this.button(
        "Rögzítem a helyszínt, merre tovább?",
        () => {
          this.store.guide3();
          this.open("A választott feladatod", "guide3");
          const r = ROUTES3[this.store.state.chapter2.decision];
          this.text(`${r.name} – ${r.role}: (${r.x}, ${r.z}).`);
          this.text(r.opening);
          this.button("Elindulok", () => this.close(true), "guide3-close");
          this.finish();
        },
        "guide3-confirm",
      );
      this.finish();
    },
    route3() {
      const r = ROUTES3[this.store.state.chapter2.decision],
        c = this.store.state.chapter3;
      this.open(`${r.name} – ${r.role}`, "route3");
      this.text("Fiktív szereplő és cselekvési ág.", "story-caption");
      this.text(r.opening, "story-quote");
      if (!c.guideHeard) {
        this.text("Előbb beszélj Flaccusszal a déli porticusnál (−4, 25).");
        this.finish();
        return;
      }
      this.button(
        "Mit tudsz biztosan?",
        () => {
          this.store.route3();
          this.open(`${r.name} válasza`, "route3-answer");
          this.text(r.answer, "story-quote");
          this.button(
            "Vissza a beszélgetéshez",
            () => this.route3(),
            "route3-back",
          );
          this.finish();
        },
        "route3-question",
      );
      if (c.actionComplete) this.text(r.result, "story-feedback good");
      else if (c.routeHeard && c.assessment)
        this.button(
          r.action,
          () => {
            if (this.store.act3()) {
              this.open("A feladatodat végrehajtottad", "action3");
              this.text(r.result);
              this.text(
                "Most menj a curia bejáratához (0, −22). A történeti esemény kimenetelét ez a fiktív cselekvés nem írja át.",
                "story-caption",
              );
              this.button(
                "A curiához indulok",
                () => this.close(true),
                "action3-close",
              );
              this.finish();
            }
          },
          "route3-action",
        );
      else
        this.text(
          "A cselekvéshez olvasd el a két feljegyzést, és a B panelen fogalmazz meg megalapozott következtetést.",
          "story-caption",
        );
      this.finish();
    },
    record3(id) {
      const r = RECORDS3.find((r) => r.id === id);
      if (!r || !this.store.record3(id)) return;
      this.open(r.title, "record3");
      this.text(r.text, "story-quote");
      this.text(r.source, "story-caption");
      this.button(
        "Összevetem, amit tudok",
        () => this.evidence(),
        "record3-compare",
      );
      this.button(
        "Vissza a porticusba",
        () => this.close(true),
        "record3-close",
      );
      this.finish();
    },
    evidence(feedback = "") {
      if (!activeChapter3(this.store.state))
        return evidence.call(this, feedback);
      const c = this.store.state.chapter3;
      this.open("Bizonyítékok – III. fejezet", "evidence3");
      for (const r of RECORDS3) {
        this.text(
          (c.records.includes(r.id) ? "✓ " : "· ") + r.title,
          "story-quote",
        );
        if (c.records.includes(r.id)) {
          this.text(r.text);
          this.text(r.source, "story-caption");
        }
      }
      if (feedback) this.text(feedback, "story-feedback");
      if (c.assessment)
        this.text(
          "Rögzített következtetés: a helyszín történelmileg azonosítható, a fiktív tanú megfigyelése viszont nem igazol konkrét merényleti tervet.",
          "story-feedback good",
        );
      else if (c.guideHeard && c.records.length === 2) {
        for (const { id, text } of inRandomOrder("assess3", [
          {
            id: "accuse",
            text: "A félrevonuló emberek valószínűleg merényletet készítettek elő, ezért a gyanú megalapozott.",
          },
          {
            id: "limited",
            text: "A helyszín azonosítható, de a félrevonulás céljára a két feljegyzésből nem lehet következtetni.",
          },
          {
            id: "ignore",
            text: "A félrevonulás rendes politikai szokás volt, ezért a megfigyelésnek nincs bizonyító értéke.",
          },
        ]))
          this.button(
            text,
            () => {
              const ok = this.store.assess3(id);
              this.evidence(
                ok
                  ? "Helyes különbségtétel. Most visszatérhetsz a közvetítődhöz."
                  : "A megfigyelés nem bizonyít szándékot, és az ártalmatlanságot sem igazolja. Próbáld újra.",
              );
            },
            "assessment3-" + id,
          );
      } else
        this.text(
          "Flaccus eligazítása és mindkét feljegyzés szükséges. A korán megtalált bizonyíték megmarad.",
          "story-caption",
        );
      this.finish(true);
    },
    event3() {
      const c = this.store.state.chapter3;
      this.open(
        c.eventStep < 3 ? SCENES3[c.eventStep].title : "Az ülés után",
        "event3",
      );
      if (!c.actionComplete) {
        this.text("Előbb fejezd be a választott feladatodat a közvetítődnél.");
        this.finish();
        return;
      }
      if (c.eventStep < 3) {
        this.text(SCENES3[c.eventStep].text, "story-quote");
        this.text(
          "Elbeszélt történeti jelenet · nincs grafikus erőszak.",
          "story-caption",
        );
        this.button(
          c.eventStep === 2 ? "Rögzítem, amit megtudtam" : "Tovább",
          () => {
            this.store.scene3();
            this.event3();
          },
          "scene3-next",
        );
      } else {
        this.text(
          "A történeti eseményt megismerted. Az írnok asztalánál (4, −25) fogalmazd meg a beszámolódat.",
        );
        this.button(
          "Az asztalhoz indulok",
          () => this.close(true),
          "event3-close",
        );
      }
      this.finish();
    },
    account3(feedback = "") {
      const c = this.store.state.chapter3;
      this.open("Az írnok feljegyzése", "account3");
      if (c.finished) {
        this.ending3();
        return;
      }
      if (c.eventStep !== 3) {
        this.text("Előbb kövesd az eseményeket a curia bejáratánál.");
        this.finish();
        return;
      }
      this.text("Melyik beszámolót hagyod az utókorra?", "story-quote");
      if (feedback) this.text(feedback, "story-feedback");
      if (c.report) {
        this.text(
          "A feljegyzésed külön kezeli az esemény előtti bizonytalan nyomokat és a később megismert kimenetelt.",
          "story-feedback good",
        );
        this.button(
          "Lezárom a történetemet",
          () => {
            if (this.store.finish3()) this.ending3();
          },
          "finish-campaign",
        );
      } else
        for (const { id, text } of inRandomOrder("report3", [
          {
            id: "certainty",
            text: "Leírom, hogy a névtelen üzenetből már előre következtetni lehetett az eseményre, és a nyomok ezt igazolták.",
          },
          {
            id: "accountable",
            text: "Külön leírom a korábban ismert nyomokat és azok korlátait, majd a később megismert történeti eseményt.",
          },
          {
            id: "all",
            text: "Mindazokat, akik korábban Caesar ellen szóltak, a történtek résztvevőiként nevezem meg.",
          },
        ]))
          this.button(
            text,
            () => {
              const ok = this.store.report3(id);
              this.account3(
                ok
                  ? "A feljegyzésed elkészült."
                  : "Az utólagos tudás nem volt korábban bizonyosság. A politikai ellenzékiség pedig nem részvételi bizonyíték. Javíthatod a beszámolót.",
              );
            },
            "report3-" + id,
          );
      this.finish();
    },
    ending3() {
      const s = this.store.state;
      if (!s.chapter3.finished) return;
      this.open("CAESAR – a történet véget ért", "campaign-ending");
      this.text(
        "Városi nyomok: " +
          (s.city.seal ? "Subura ✓ · " : "Subura — · ") +
          (s.city.dockConclusion ? "Tiberis-part ✓ · " : "Tiberis-part — · ") +
          (s.city.delivered ? "Palatinusi kert ✓" : "Palatinusi kert —"),
        "story-caption",
      );
      this.text(
        "Három fejezetet jártál végig. Nem láttál minden szándékot előre, de döntöttél arról, mit teszel a rád bízott információval.",
        "story-quote",
      );
      this.text(
        `I. fejezet: az üzenetet ${NPCS[s.decisions.messageRecipient].name} kapta.`,
      );
      this.text("II. fejezet: " + FINAL_CHOICES[s.chapter2.decision]);
      this.text(
        "III. fejezet: " + ROUTES3[s.chapter2.decision].result,
        "story-feedback good",
      );
      this.text(
        "A beszámolódban megőrizted a tény, az értelmezés és a fikció különbségét. A kampány befejezése és minden döntésed mentve.",
      );
      this.button(
        "Történeti utóhang és források",
        () => this.epilogue3(),
        "campaign-epilogue",
      );
      this.button(
        "Feljegyzés másolása vagy mentése",
        () => this.exportRecord(),
        "campaign-export",
      );
      this.button(
        "Szabad felfedezés a korábbi Rómában",
        () => {
          this.store.returnRome();
          this.hooks.onContinue?.();
          this.close(true);
        },
        "campaign-explore",
      );
      this.button(
        "Teljes történet áttekintése",
        () => this.campaign(),
        "campaign-overview",
      );
      this.finish();
    },
    exportRecord() {
      this.open("Feljegyzés a döntéseimről", "record");
      this.text(
        "Add meg a neved (nem kötelező), majd másold ki vagy mentsd el a feljegyzést. Az önreflexiós kérdésekre a szövegben válaszolhatsz. A név nem kerül mentésre.",
        "story-caption",
      );
      const label = node("label", "Név (nem kötelező)");
      const input = node("input");
      input.type = "text";
      input.maxLength = 60;
      input.autocomplete = "off";
      input.dataset.testid = "record-name";
      label.append(input);
      const area = node("textarea");
      area.readOnly = true;
      area.rows = 14;
      area.dataset.testid = "record-text";
      area.setAttribute("aria-label", "A feljegyzés szövege");
      const refresh = () =>
        (area.value = buildRecord(this.store.state, { name: input.value }));
      input.addEventListener("input", refresh);
      refresh();
      this.content.append(label, area);
      const status = node("p", "", "story-feedback good");
      status.setAttribute("role", "status");
      this.button(
        "Másolás a vágólapra",
        async () => {
          try {
            await navigator.clipboard.writeText(area.value);
            status.textContent = "A feljegyzés a vágólapra került.";
          } catch {
            area.focus();
            area.select();
            status.textContent =
              "A böngésző nem engedte a másolást; a kijelölt szöveg a Ctrl+C billentyűvel másolható.";
          }
        },
        "record-copy",
      );
      this.button(
        "Mentés szövegfájlként",
        () => {
          const url = URL.createObjectURL(
            new Blob([area.value], { type: "text/plain;charset=utf-8" }),
          );
          const link = node("a");
          link.href = url;
          link.download = "caesar-feljegyzes.txt";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          status.textContent = "A feljegyzés letöltése elindult.";
        },
        "record-download",
      );
      this.button("Vissza", () => this.ending3(), "record-back");
      this.content.append(status);
      this.finish();
    },
    epilogue3() {
      this.open("Utóhang – amit az utókor tud", "epilogue3");
      this.text(
        "Caesart Kr. e. 44. március 15-én Pompeius curiájában senatorok egy csoportja, köztük Brutus és Cassius ölte meg. A merénylet nem állította helyre tartósan a régi köztársasági rendet: további polgárháborúk következtek. Augustus principatusának kialakulása későbbi történet.",
        "story-quote",
      );
      this.text(
        "Ezek az utókor történeti ismeretei, nem a játékosnak a merénylet előtt rendelkezésére álló bizonyítékok. A figyelmeztetés, a tanúk és az írnok személyes útja szerzői fikció; a játék nem állítja, hogy te megakadályozhattad a történeti merényletet.",
      );
      this.text(
        "Forráshelyek: Suetonius, Divus Iulius 80–82; Plutarchos, Caesar 66–69. A beszámolók nézőpontját és keletkezési idejét is mérlegelni kell. A városrész stilizált, nem régészeti rekonstrukció.",
        "story-caption",
      );
      this.content.append(node("h3", "Önreflexiós kérdések"));
      REFLECTION.forEach((q, i) => this.text(`${i + 1}. ${q}`));
      this.button(
        "Források és fogalmak",
        () => this.sources(() => this.epilogue3()),
        "epilogue-sources",
      );
      this.text(
        "CAESAR – Március idusa · Háromfejezetes asztali történelmi játék. Three.js / Vite. A szereplők és játékbeli iratok fikciók; a grafikai assetek a projekthez készültek. Köszönjük, hogy végigjátszottad!",
      );
      this.button(
        "A döntéseim összegzése",
        () => this.ending3(),
        "epilogue-back",
      );
      this.finish(true);
    },
  });
}
