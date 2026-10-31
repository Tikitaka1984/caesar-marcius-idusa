# CAESAR v2.1 – öt római pálya, kiadási ellenőrzés

Dátum: 2026. október 31. Ellenőrzött játékcommit: `94b8057935a2a9a2ed97bdf390c59487fd604d0d`. A végső ellenőrzés alatt az alkalmazáskód és a tesztek nem változtak. A későbbi jelentéscommit csak dokumentációt és tényleges bizonyítékokat tartalmaz.

## Elkészült bővítés

Öt külön régió: a meglévő Via Sacra–Forum és Pompeius porticusa–curia mellett Subura, Forum Boarium–Tiberis-part, valamint egy palatinusi magánház és kert. Az új pályák önálló alaprajzzal és interakciókkal rendelkeznek. A V várostérkép már az I. fejezetben megnyitja a három új régiót. Minden új városrészből szabad a visszaút.

A Suburában mozgó futár követhető a másolóműhelyig; a folyóparton két tárgy és egy tanúvallomás vizsgálható, mozgó csónakkal és rakodóval; a magánházban valódi ütközési akadályként működő kertkapu nyílik meg, majd másolat adható át a kertben. A hibás következtetések javíthatók. Az új játék főszála mindhárom feladatot használja, a korábbi mentések megőrzik az eddigi főszálat.

A HUD külön jelzi a helyi felfedezést; az öt városrész bejárását a várostérkép mutatja. A céljelzés a következő személy, tárgy vagy szükséges döntési panel felé irányít. A napló az aktuális lépést az elején mutatja. A politikai beszélgetések után a szükséges következtetés közvetlenül is megnyitható.

## Végső eredmények

- **34/34 sikeres teszt**, 0 hibás, 0 kihagyott, 0 flaky. Egyetlen megszakítás nélküli folyamat, egy munkás; minden eset egy próbálkozásból. Időtartam: 17.5 perc. A célzott előzetes futások nem növelik ezt a tesztszámot.
- `npm run build`: sikeres v2.1.0 build. A Three.js-t tartalmazó, körülbelül 694 kB-os JavaScript-csomag Vite-méretfigyelmeztetést ad; ez nem buildhiba.
- `npm run test:pages`: sikeres a valódi `dist/` fájlokkal, a `/caesar-marcius-idusa/` projektprefix alatt. Az öt világ, a WebGL, a mozgás, a térképek, mindkét képtextúra, a II. fejezet felülete, a kampányzárás és az utóhang ellenőrzött. **0 ellenőrzött konzol-, JavaScript- és HTTP-erőforráshiba.**
- A végső GitHub CI még folyamatban; telepítési sikert egyelőre nem állítunk.

Az első összesített futást a céljelzés felülvizsgálata miatt megszakítottuk. Mindhárom irat összegyűjtése után a jelzésnek a B összevetési panelre kell irányítania. Ezt a `94b8057` commit javította, a városi állapotteszt pedig erre az átmenetre is ellenőrzést kapott. A fenti számok kizárólag a javítás utáni, teljes megszakítás nélküli futás eredményei.

### Mit fed le a 34 teszt?

A korábbi 26 eset megmarad. A mentési verzióra és a friss történeti útvonalra vonatkozó elvárások az új kiadáshoz igazodnak, a korábbi mozgási, fizikai, párbeszédes, kategorizálási és döntési ellenőrzések megmaradnak.

Hat új városi állapotteszt ellenőrzi a Subura előfeltételeit, a futár köztes megállójának mentését és újrakezdését, a már teljesített nyom megőrzését, az 1–3-as sémák migrációját, a külön régiópozíciókat, a lezárt III. fejezeti régiót, a tanú és a kert előfeltételeit, a végső döntés feltételeit és az érvénytelen mentési adatokat.

Két új böngészőteszt közül az egyik régi, érvényes mentésből valódi WASD-mozgással járja be a három új régiót, próbálja újra a futárt, ellenőrzi a rakpart és a zárt/nyitott kertkapu ütközését, megoldja a feladatokat és visszatölti az eredményt. A másik egy templom előtti mentésből utazik el és tér vissza, majd Decimus közvetítésének elfogadását, a következő lépés láthatóságát és a részleges II. fejezeti állapot visszatöltését ellenőrzi.

A **teljes friss kampányteszt** üres böngészőadatból indul, nem hoz létre előrehaladott mentést, és nem módosítja a kamera állapotát. Valódi irányítással halad végig az I. fejezettől a három új városi feladaton és a Forum politikai vizsgálatán át a curiáig és a befejezésig. Ellenőrzi mind az öt betöltött régiót, az új feladatok és a meglévő fejezetek teljesítését, az utóhangot, a végső mentés visszatöltését és a teljes újrakezdést.

A production-próba külön, szabályos történeti API-műveletekkel felépített mentési fixture-t használ a II. fejezet és a befejezés gyors felületi ellenőrzéséhez. Ez a teljes friss végigjátszástól eltérő bizonyíték. A régi mentésből induló bejárás sem második friss kampányfutásnak számít.

## Mentések és a korábbi elakadás

A 4-es séma ugyanazon `caesar.story.save.v1` kulcsot használja. Az 1–3-as mentések megőrzik a korábbi döntéseket, feladatokat és gyűjtött tárgyakat. Az új városi szálak régi mentésből választhatók; a migráció nem jelöli késznek az el nem végzett új feladatokat. A pozíció régiónként tárolódik. A futár újrakezdése a már megszerzett pecsétnyomot nem vonhatja vissza.

A felhasználó konkrét elakadt mentése nem áll rendelkezésre. A hasonló templom előtti állapotból az átmenetet ellenőriztük, és a felület egyértelműbbé teszi a szükséges elfogadást és következtetést. **A felhasználó saját mentésének hibáját reprodukció nélkül nem állítjuk javítottnak.**

## Publikálás és éles ellenőrzés

Repository: https://github.com/Tikitaka1984/caesar-marcius-idusa

Játék: https://tikitaka1984.github.io/caesar-marcius-idusa/

Workflow: https://github.com/Tikitaka1984/caesar-marcius-idusa/actions/runs/41191995380

A forrás a GitHubon van. A CI és a Pages-telepítés lezárását még ellenőrizzük.

A futó felhőkörnyezet hálózati szabálya továbbra sem engedi a `tikitaka1984.github.io` host közvetlen elérését. Ezért friss, közvetlen éles böngészős végigjátszást nem állítunk. A helyi production-próba és a GitHub CI/deploy megfigyelése külön bizonyíték. A hálózati szabályt nem kerültük meg.

## Bizonyítékok és korlátok

- [Teljes gépi eredmény](city-v21-2026-10-31/full-suite.json), [folyamatnapló](city-v21-2026-10-31/full-suite.log), [összefoglaló](city-v21-2026-10-31/summary.json).
- [Buildnapló](city-v21-2026-10-31/build.log), [production-próba](city-v21-2026-10-31/pages.log), [fájlazonosítók és SHA-256 lenyomatok](city-v21-2026-10-31/manifest.json).
- [Subura](city-subura.png), [Forum Boarium](city-boarium.png), [domus](city-domus.png), [kert](city-domus-garden.png). Valódi játékfutásból származó képek.

Környezet: Node.js 24.19.0, npm 11.9.0, Chromium 154.0.8037.57, Playwright, szoftveres WebGL, 1440×1000 ablak. Az automatizált ellenőrzés nem emberi játékidőmérés és nem minden eszközre kiterjedő teljesítményteszt. A helyszínek stilizáltak, nem régészeti rekonstrukciók. Harc, hang és mobilos érintésvezérlés nincs a kiadásban; a mobil a felhasználó kérésére külön, utolsó fázis.
