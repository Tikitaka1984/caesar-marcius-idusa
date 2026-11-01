import { inRandomOrder } from "./choice.js";
import { REGIONS, REGION_IDS } from "../world/regions.js";
import { needsSubura, needsCity2 } from "./city.js";
import { currentQuest } from "./state.js";
export function installCityUI(UI) {
  const journal = UI.prototype.journal;
  Object.assign(UI.prototype, {
    cityMap() {
      this.open("Róma városrészei", "city-map");
      const s = this.store.state;
      this.text("Öt külön bejárható helyszín · Kr. e. 44", "story-caption");
      const visited = s.world.visited;
      const count = [
        visited.some((v) =>
          ["VIA SACRA", "FORUM ROMANUM", "TEMPLUM SATURNI"].includes(v),
        ),
        visited.includes("SVBVRA"),
        visited.includes("FORVM BOARIVM"),
        visited.includes("DOMVS PALATINA"),
        visited.some((v) => ["PORTICVS POMPEI", "CVRIA POMPEIA"].includes(v)),
      ].filter(Boolean).length;
      this.text(
        "Bejárt városrészek: " +
          count +
          "/5. A HUD helyi felfedezése csak az aktuális pálya körzeteit számolja.",
        "story-caption",
      );
      this.text(
        "Most itt vagy: " + REGIONS[s.player.region || "rome"].name,
        "story-quote",
      );
      const q = currentQuest(s);
      this.text(
        "Aktuális feladat: " + q.title + ". " + q.task,
        "story-feedback good",
      );
      for (const id of REGION_IDS) {
        this.text(REGIONS[id].name, "story-quote");
        this.text(REGIONS[id].description);
        if (id === "campus" && !s.chapter2.decision)
          this.text(
            "A III. fejezetben, a Forumon hozott záródöntés után nyílik meg.",
            "story-caption",
          );
        else if (id === (s.player.region || "rome"))
          this.text("Ezen a helyszínen vagy.", "story-caption");
        else
          this.button(
            "Utazás: " + REGIONS[id].name,
            () => {
              this.hooks.onContinue?.();
              if (this.store.travelCity(id)) this.close(true);
            },
            "travel-" + id,
          );
      }
      this.text(
        "Az utazás az adott városrész legutóbbi biztonságos helyén folytatódik. Minden új városrészből szabad a visszaút.",
        "story-caption",
      );
      this.button(
        "Vissza a játékhoz",
        () => this.close(true),
        "city-map-close",
      );
      this.finish(true);
    },
    journal() {
      journal.call(this);
      const q = currentQuest(this.store.state),
        card = document.createElement("div");
      card.className = "current-step";
      const title = document.createElement("h3");
      title.textContent = "MOST KÖVETKEZIK · " + q.title;
      const text = document.createElement("p");
      text.textContent = q.task;
      card.append(title, text);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "story-action";
      b.dataset.testid = "journal-city-map";
      b.textContent = "Várostérkép és utazás";
      b.onclick = () => this.cityMap();
      card.append(b);
      this.content.prepend(card);
      this.content.scrollTop = 0;
      const c = this.store.state.chapter2;
      if (
        q.id === "politics" &&
        Object.values(c.answers).every((a) => a.length === 4)
      ) {
        const go = document.createElement("button");
        go.type = "button";
        go.className = "story-action";
        go.textContent = "Lezárom a meghallgatást: politikai következtetés";
        go.dataset.testid = "current-politics";
        go.onclick = () => this.politics2();
        card.append(go);
      }
    },
    cityInteraction(id, feedback = "") {
      const s = this.store.state,
        c = s.city;
      this.open("Róma nyomai", "city");
      this.text(
        "Fiktív szereplők és játékbeli iratok · történelmi környezet",
        "story-caption",
      );
      if (feedback) this.text(feedback, "story-feedback");
      if (id === "courier") {
        this.title.textContent = "Faustus – a Subura futára";
        this.text(
          "„A másolóműhelybe viszem a pecsétmintát. Gyere utánam a sikátorokon át; a jel azonossága még nem bizonyítja, hogy ki írta az üzenetet.”",
          "story-quote",
        );
        this.text(
          c.courierArrived
            ? "A futár megérkezett. A műhely előtt vizsgáld meg a pecsétmintát."
            : "A futár az udvar felé indul. Ha lemaradsz, a céljelzés és a térkép segít.",
        );
        if (!c.seal)
          this.button(
            c.courierStarted
              ? "Újrakezdem a futár követését"
              : "Követem a futárt",
            () => {
              this.store.startCourier();
              this.close(true);
            },
            "courier-start",
          );
      } else if (id === "seal") {
        this.title.textContent = "A műhely pecsétje";
        if (!c.courierArrived)
          this.text(
            "A műhelyben még várják Faustust. Előbb keresd fel a futárt és kövesd az udvarig.",
          );
        else {
          this.text(
            "A műhely mintáján ugyanaz a növényi jel látható, mint az üzenet másolatán. A másoló több megrendelőnek is dolgozik. Mit igazol ez?",
            "story-quote",
          );
          for (const o of inRandomOrder("seal", [
            {
              id: "accuse",
              text: "A közös növényi jel arra utal, hogy a megrendelők egy csoportot alkotnak, és ez a csoport tervezte az ügyet.",
              run: () =>
                this.cityInteraction(
                  id,
                  "A műhely több embernek dolgozik. A pecsét nem személyazonosító bizonyíték; próbáld újra.",
                ),
            },
            {
              id: "limited",
              text: "A jel a másolás útjához ad nyomot; a szerző szándékát és a megrendelők kapcsolatát nem bizonyítja.",
              run: () => {
                this.store.inspectSeal("limited");
                this.cityDone("A futár nyomát ellenőrizted.", "seal-done");
              },
            },
            {
              id: "ignore",
              text: "A közös jel valószínűleg jelentéktelen műhelyszokás, ezért a másolás útját nem érdemes tovább követni.",
              run: () =>
                this.cityInteraction(
                  id,
                  "A jel jelentéktelensége sem bizonyított: éppen a másolás útját mutatja meg. Ne zárd ki a nyomot; próbáld újra.",
                ),
            },
          ]))
            this.button(o.text, o.run, `seal-${o.id}`);
        }
      } else if (id === "manifest" || id === "cargo") {
        this.title.textContent =
          id === "manifest" ? "A raktár jegyzéke" : "A rakomány jelzése";
        this.text(
          id === "manifest"
            ? "„Olajos amforák és lezárt iratcsomag a nyugati rakodóhelyre. A csomag átvételét Doria tanúsítja.”"
            : "Az amforákon kereskedői jel, az iratcsomagon zsinór és viasz van. A lezárt csomag tartalma kívülről nem olvasható.",
          "story-quote",
        );
        if (this.store.dockRecord(id))
          this.text(
            "Megvizsgált parti feljegyzések: " +
              c.dockRecords.length +
              "/2. A két nyom után keresd Doriát.",
            "story-feedback good",
          );
        else
          this.text(
            "Nézelődhetsz a piacon. A tanú ellenőrzésének feladata az I. fejezet lezárása után indul.",
          );
      } else if (id === "witness") {
        this.title.textContent = "Doria – tanú a Tiberis-parton";
        this.text(
          "„Átvettem a csomagot és továbbadtam egy futárnak. A lezárt iratot nem olvastam. A kézbesítést láttam, a benne leírt tervet nem.”",
          "story-quote",
        );
        this.button(
          "Megfigyelem a rakodást",
          () => this.loadingCity(),
          "loading-observe",
        );
        if (!s.chapterComplete || c.dockRecords.length !== 2)
          this.text(
            "Előbb vizsgáld meg a raktár jegyzékét és a rakomány jelzését. A feladat a II. fejezethez kapcsolódik.",
          );
        else {
          for (const o of inRandomOrder("dock", [
            {
              id: "accuse",
              text: "Doria vallomása alapján valószínű, hogy ismerte a csomag tartalmát, ezért tanúként megbízhatatlan.",
              run: () =>
                this.cityInteraction(
                  id,
                  "A tanú a kézbesítést látta, de az iratot nem olvasta. Próbáld újra.",
                ),
            },
            {
              id: "delivery",
              text: "Doria vallomása a csomag átvételét és továbbadását igazolja; a tartalomról és a szándékról nem tud.",
              run: () => {
                this.store.concludeDock("delivery");
                this.cityDone(
                  "A Tiberis-parti tanú vallomását ellenőrizted.",
                  "dock-done",
                );
              },
            },
            {
              id: "dismiss",
              text: "Doria nem olvasta az iratot, ezért a vallomása semmilyen bizonyítékként nem használható.",
              run: () =>
                this.cityInteraction(
                  id,
                  "A vallomás korlátozott, de nem értéktelen: a kézbesítést igazolja. Próbáld újra.",
                ),
            },
          ]))
            this.button(o.text, o.run, `dock-${o.id}`);
        }
      } else if (id === "doorkeeper") {
        this.title.textContent = "Felix – a palatinusi ház kapuőre";
        this.text(
          "„Claudia a kertben fogad, de előbb mondd el: honnan van az üzenet, és mit tudsz biztosan róla?”",
          "story-quote",
        );
        if (!s.chapterComplete)
          this.text(
            "A közvetítő az I. fejezetben hozott átadási döntésed után fogad. A ház előtere és oldalszobája addig is bejárható.",
          );
        else {
          for (const o of inRandomOrder("garden", [
            {
              id: "accuse",
              text: "Elmondom, hogy az üzenet valószínűleg merényleti tervre utal, ezért sürgős lépést kérek.",
              run: () =>
                this.cityInteraction(
                  id,
                  "Nem tudsz ilyet igazolni. A kapuőr a forrást és annak határait kéri.",
                ),
            },
            {
              id: "origin",
              text: "Elmondom a találás és az átadás körülményeit; a célját bizonytalannak jelölöm.",
              run: () => {
                this.store.openGarden("origin");
                this.cityDone(
                  "A kapuőr megnyitotta a kertbe vezető átjárót. Keresd Claudiát.",
                  "garden-open-done",
                );
              },
            },
            {
              id: "silent",
              text: "Csak annyit mondok, hogy az üzenet fontos; a forrásról és a találás körülményeiről nem beszélek.",
              run: () =>
                this.cityInteraction(
                  id,
                  "A kapuőr a forrást is kéri: forrás nélkül az üzenet nem értékelhető. Próbáld újra.",
                ),
            },
          ]))
            this.button(o.text, o.run, `garden-${o.id}`);
        }
      } else if (id === "host") {
        this.title.textContent = "Claudia – a kert közvetítője";
        this.text(
          "„A másolat mellé írd oda azt is, amit nem tudsz. A figyelmeztetés felelősség, a névtelen vád nem helyettesíti a bizonyítékot.”",
          "story-quote",
        );
        if (c.gateOpen)
          this.button(
            "Átadom a másolatot a forrás megjelölésével",
            () => {
              this.store.deliverGarden();
              this.cityDone(
                "A másolatot átadtad Claudiának. A Forumon folytathatod a nyomozást.",
                "garden-done",
              );
            },
            "garden-deliver",
          );
        else this.text("A kertbe a kapuőr enged be.");
      } else if (id === "garden-gate")
        this.text(
          c.gateOpen
            ? "A kert kapuja nyitva áll."
            : "A kert kapuja zárva. Beszélj Felixszel az átriumban.",
        );
      else if (id === "domus-plaque")
        this.text(
          "Ez egy fiktív köztársaság kori magánház, átriummal és kerttel. A Palatinus ebben a történetben lakónegyed; a ház nem császári palota és nem Caesar lakóhelyének rekonstrukciója.",
        );
      else
        this.text(
          "A műhelyek, a piac és a házak közvetítőin át sok kézen megy keresztül egy üzenet. A városrészek közt a V várostérképpel utazhatsz.",
        );
      this.button("Vissza a helyszínre", () => this.close(true), "city-close");
      this.finish();
    },
    cityDone(text, id) {
      this.open("Feladat rögzítve", "city-done");
      this.text(text, "story-feedback good");
      const q = currentQuest(this.store.state);
      this.text("Következő lépés: " + q.title + ". " + q.task);
      this.button("Folytatom a helyszínen", () => this.close(true), id);
      this.button(
        "Várostérkép és utazás",
        () => this.cityMap(),
        "city-done-map",
      );
      this.finish();
    },
    loadingCity() {
      this.open("Rakodás a Tiberis partján", "loading");
      this.text(
        "A rakodók külön viszik az amforákat és a lezárt csomagot. A folyón egy csónak fordul a rakodóhely felé. A látható mozgás az átvételt igazolhatja; a csomag tartalmát nem tárja fel.",
      );
      this.button(
        "Visszatérek Doria vallomásához",
        () => this.cityInteraction("witness"),
        "loading-next",
      );
      this.button(
        "Kihagyom a megfigyelést",
        () => this.cityInteraction("witness"),
        "loading-skip",
      );
      this.finish();
    },
    requireCityFirst() {
      if (needsSubura(this.store.state)) {
        this.open("Még egy nyom a Suburában", "city-required");
        this.text(
          "Az üzenet átadása előtt ellenőrizd a futár útját és a műhely pecsétjét.",
        );
        this.button(
          "Megnyitom a várostérképet",
          () => this.cityMap(),
          "city-required-map",
        );
        this.finish();
        return true;
      }
      return false;
    },
    requireCitySecond() {
      if (needsCity2(this.store.state)) {
        this.open("A városi nyomok még hiányoznak", "city-required");
        this.text(
          "A végső döntés előtt ellenőrizd a Tiberis-parti tanút és add át a másolatot a palatinusi kertben. A J napló mutatja a következő lépést.",
        );
        this.button(
          "Várostérkép és utazás",
          () => this.cityMap(),
          "city-required-map",
        );
        this.finish();
        return true;
      }
      return false;
    },
  });
}
