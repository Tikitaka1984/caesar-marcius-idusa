# CAESAR – Március idusa · Róma városrészei

**[Játék indítása](https://tikitaka1984.github.io/caesar-marcius-idusa/)**

Magyar nyelvű, böngészős történelmi játék. A v2.1 három fejezetet és **öt külön bejárható pályát** kapcsol össze: Via Sacra és Forum; Subura; Forum Boarium és Tiberis-part; palatinusi magánház és kert; Pompeius porticusa és curiája.

Az új városrészek már az I. fejezetben elérhetők a **V · Város** gombbal. A Suburában mozgó futár vezet a műhelyhez; a folyóparton iratokat és tanúvallomást ellenőrzöl; a magánházban egy valóban lezárt kertkaput nyitsz meg és másolatot adsz át. A háromfejezetes történetnek saját befejezése, döntésösszegzése és történeti utóhangja van.

Nincs backend, fiók vagy API-kulcs. Az erőforrások helyben töltődnek. Asztali, WebGL-képes böngésző és billentyűzet szükséges. A telefonos érintésvezérlés a felhasználó kérésére külön, utolsó fejlesztési szakasz.

## Irányítás

| Billentyű | Művelet |
| --- | --- |
| W / A / S / D | Mozgás |
| Egér vagy bal / jobb nyíl | Körülnézés |
| E | Közeli, a nézés irányába eső szereplő vagy tárgy használata |
| V | Várostérkép és utazás az öt pálya között |
| M | A jelenlegi pálya térképe, kiemelt célponttal |
| J | Küldetésnapló, az aktuális következő lépéssel az elején |
| B | Bizonyítékok és következtetések |
| Esc | Panel bezárása vagy szüneteltetés |

Az egérzárhoz a böngésző engedélyt kérhet; a nyilakkal nélküle is lehet fordulni. Beszélgetésnél a feladatot lezáró megerősítést is válaszd ki. A II. fejezetben mindkét politikai szereplő négy-négy válasza után a naplóban politikai következtetés szükséges. A céljelzés ezt is kiírja. A részletes útvonal: [STORY.md](STORY.md).

## Mentés

A játék automatikusan, a böngésző helyi tárolójába ment. A régi 1–3-as sémájú mentések 4-esre migrálódnak ugyanazon `caesar.story.save.v1` kulcson. Az előrehaladás, a döntések, a felvett tekercsek és a bejárt körzetek megmaradnak. A pozíció régiónként tárolódik.

**Új játékban** a három új városi feladat a fő történet része. **Korábbi mentésből folytatva** az eddigi kampányút megmarad, és az új városi szálak külön választhatók. A migráció nem jelöl teljesítettnek el nem végzett új feladatot. A főmenü „Új játék” gombja megerősítéssel mindhárom fejezetet és a városi előrehaladást is újrakezdi. A mentés böngészőhöz és webcímhez kötött; eszközök közt nem szinkronizálódik.

## Futtatás és ellenőrzés

Node.js 24 alatt:

```sh
npm ci
npm run dev -- --port 5173
```

```sh
npm run build
npm run preview -- --port 4173
npm test
npm run test:pages
```

A böngészős tesztek alapértelmezés szerint a `/usr/bin/chromium` programot használják. Más telepítésnél `CHROMIUM_PATH` adható meg. A teljes csomag 34 teszteset, egy munkással. A friss kampány tesztje előrehaladott mentés nélkül, tényleges WASD- és panelműveletekkel járja be mind az öt pályát és a befejezést. A production-próba a valódi `dist/` fájlokat szolgálja ki a GitHub Pages projektprefixe alatt.

A build-csomag Node.js nélkül is kiszolgálható: kicsomagolás után `python3 -m http.server 8080`, majd `http://localhost:8080/`. A HTML fájl közvetlen megnyitása nem megfelelő. A relatív erőforrásútvonalak a domain gyökerében és a Pages alkönyvtárában is működnek.

## Szerkezet

- `src/main.js`: megjelenítés, bemenet, HUD, helyi térkép és régióváltás.
- `src/world/registry.js`, `regions.js`: az öt pálya gyárai, belépési pontok és pályahatárok.
- `src/world/rome.js`, `campus.js`: az eredeti római főpálya és Pompeius környéke.
- `src/world/subura.js`, `boarium.js`, `domus.js`, `kit.js`: új városrészek és közös építési segédek.
- `src/story/`: történet, mentés, állapotgépek, panelek és célpontok.
- `src/game/physics.js`: régiónkénti határok és ütközések.
- `tests/`: korábbi regressziók, városi állapot- és bejárástesztek, teljes friss kampány.
- `scripts/verify-pages-build.mjs`: a lefordított játék ellenőrzése a projektprefix alatt.

## Történeti keret és korlátok

Kr. e. 44. március 15-én járunk. A környezet stilizált művészi rekonstrukció. A szereplők, a futár, a pecsétek, a rakományjegyzék és a magánház fikció; a történeti állításokat és az utólagos tudást külön jelöljük. A palatinusi ház nem császári palota vagy Caesar igazolt lakóhelye. [Történeti jegyzetek](HISTORICAL-NOTES.md).

A helyszínek között stilizált utazás történik; nincs folyamatos, teljes Róma-modell. A karakteratlasz és az épületdíszek egyszerűbbek a felhasználó eredeti referenciájánál. Nincs harc, sérülés, hang vagy mobilos érintésvezérlés. Az életjelző dekoratív. A futár és a kikötői jelenet újrapróbálható, nincs végleges időkorlát. Emberi játékidőmérés nem történt.

A felhasználó korábbi konkrét elakadt mentése nem áll rendelkezésre. A hasonló templom előtti mentésből a Forum-feladat átmenetét külön teszt ellenőrzi; ez nem bizonyítja a felhasználó saját mentésének hibamentességét. A céljelzés és a napló egyértelműbben mutatja a még szükséges megerősítést.

Publikálás: [PUBLISHING.md](PUBLISHING.md). Korábbi ellenőrzött kiadás: [v2.0 tesztjelentés](artifacts/DESKTOP-V2-TEST-RESULTS.md). A v2.1 végső helyi ellenőrzése **34/34 sikeres teszt**. [Részletes tesztjelentés és kiadási bizonyítékok](artifacts/CITY-V21-TEST-RESULTS.md).
