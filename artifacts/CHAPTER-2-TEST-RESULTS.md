# II. fejezet – tényleges teszteredmények

Dátum: 2026. október 23. Alap: `6369a3268f5233e4efc32d845140352d1e9881bc` (elfogadott v1.1). Ellenőrzött alkalmazáskód: `4a9ae6a`. Node.js 24.19.0, Chromium 154.0.8037.57, Playwright, szoftveres WebGL.

## Végső eredmény

Mind a **18 különálló teszteset** sikeres végső ellenőrzéssel rendelkezik: **11 korábbi regressziós teszt**, továbbá **7 új teszt**. Ez a teljes futás és a javított új böngészőútvonalak célzott újrafuttatásának összesítése; nem állítjuk, hogy a korábbi teljes futás mind a 18 tesztje már akkor sikeres volt.

| Ellenőrzés | Tényleges eredmény |
| --- | --- |
| `npm run build` a végleges munkapéldányban | sikeres; a Three.js-t is tartalmazó JS-bundle 641.25 kB, gzip 171.57 kB; méretfigyelmeztetés, nem hiba |
| `npm test` teljes regressziós futás | 16 sikeres, 2 hibás tesztútvonal; az összes korábbi, 11 v1.1/demó regresszió sikeres |
| `npm test -- tests/chapter2-browser.spec.js tests/chapter2-state.spec.js --reporter=list,json` a pontosított útvonalakkal | 6 sikeres, 1 Titus-útvonalhiba; Lucius, Quintus és mind a négy állapotteszt sikeres; gépi eredmény: `chapter2-recheck.json` |
| `npm test -- tests/chapter2-browser.spec.js --grep 'actual walking: titus' --reporter=list,json` a végleges szabad útvonalon | 1/1 sikeres; gépi eredmény: `chapter2-titus-final.json` |
| `npm run test:pages` a végleges production builddel | sikeres WebGL, mozgás, térkép, textúrák és II. fejezet mentés/összevetés/napló ellenőrzés a `/caesar-marcius-idusa/` útvonal alatt |
| `git diff --check` | sikeres |
| `src/art/textures.js`, `src/game/physics.js`, `src/story/data.js`, `src/world/rome.js` összevetése a v1.1 alappal | változatlan fájlok a végleges PR-ban |

## Mit játszott végig a Chromium?

Mindhárom címzettnél egy érvényes, 1-es sémájú, lezárt I. fejezeti Forum-mentésből indul a teszt. A teszt csak a böngésző indulásakor helyezi el ezt a mentést; utána nem ír kamerakoordinátát, nem hív történeti állapotmódosító API-t és nem teleportál. A `window.caesarState` kizárólag olvasott telemetria.

A WASD-bejárás mindhárom ágon teljesíti a közvetítő felkeresését; Titus ágán a szobrot megkerülve a futárjegyzéket is. Ezután Publius és Aulus mind a négy válaszát megnyitja és ellenőrzi, hibás politikai következtetést javít, mindhárom irathoz odasétál és megvizsgálja azokat, hibás besorolás után helyesen kategorizál öt állítást, hibás általánosítás után megkülönbözteti az elégedetlenséget a merényleti bizonyítéktól. Végül felkeresi Nasót, megerősíti a záródöntést, majd újratölti az oldalt és összeveti a teljes II. fejezeti állapotot.

A böngészőben tesztelt döntések: Lucius → `warn`, Quintus → `investigate`, Titus → `locate`. Az állapotteszt ezen felül mindhárom előzményből mindhárom végső döntést menti és visszatölti, és ellenőrzi, hogy az első címzett nem változott meg. A már helyesen lezárt összevetés későbbi használata sem törli a döntést.

A három végső új böngészőteszt, az I. fejezeti teljes teszt, a demó regresszió és a production smoke teszt figyeli a konzolhibákat, JavaScript-kivételeket és a HTTP 4xx/5xx erőforrásválaszokat; a sikeres futásokban ezek száma **0**.

## Mentés és hozzáférési ágak

Az új állapotteszt megőrzi és összeveti az eredeti kérdéselőzményeket, bizonyítékot, címzettet, naplót, pozíciót és világállapotot. Az eredeti állapotteszt a bizalmi értékek és a Forum-átadás visszatöltését, valamint a válaszváltozatok kezelését is ellenőrzi. Részleges II. fejezeti mentésben korai irat és részleges párbeszéd is megmarad. Hibás és hiányos beágyazott állapot nem okoz kivételt; előfeltétel nélküli hamis lezárást nem fogadunk el.

A három kezdő közvetítő eltérő. Quintus ajánlásával a hatalom irata korán hozzáférhető, Lucius ágán ehhez Aulus négy válasza kell. Lucius ágán a diadém közvetlenül hozzáférhető, Quintus ágán Publius négy válasza szükséges. Titus ágán a futárjegyzék nélkül az iratok nem hozzáférhetők. Minden ág végigjátszható.

A régi tesztekben a szándékosan megváltozott séma-elvárást `version: 2`-re, a Forumra érkezés utáni küldetést az új aktív II. fejezeti küldetésre igazítottuk. A mozgás, interakció, visszatöltés és hibakezelés ellenőrzéseit nem kapcsoltuk ki.

## Production ellenőrzés határa

A Pages-próba a tényleges `dist/` fájlokat szolgálja ki, a projektprefixen kívüli kéréseket 404-gyel utasítja el. Az eredeti WebGL/mozgás/térkép/textúra próba mellett a II. fejezeti panelt érvényes, a történeti API-kon keresztül összeállított mentésből vizsgálja. Ez külön production smoke fixture; **nem** ezt nevezzük a három ág mozgásos végigjátszásának. A három teljes mozgásos útvonalat a fejlesztői build böngészőtesztjei ellenőrzik.

A GitHub által üzemeltetett éles oldalt nem frissítettük és nem állítjuk a II. fejezet ottani ellenőrzését. A PR CI-futása külön GitHub Actions-ellenőrzés; ez a jelentés a tényleges helyi futásokat rögzíti.

## Korábbi próbafutások és javításuk

Az első fejlesztés közbeni demófutást a Vite automatikus újratöltése megszakította; egy párhuzamos szoftveres Chromium-futás időtúllépett. Egy korai Lucius-próba eljutott a zárásig, de újratöltéskor a másik teszthez tartozó közös szerver már leállt. A production fixture első próbáján az új mentést túl korán írtuk be: az előző oldal pagehide-ellenőrzőpontja felülírta. A fixture most új oldalindításkor kerül be, és a production próbát újrafuttattuk. Ezeket a korábbi hibás próbákat nem tekintettük sikernek. Külön, stabil szerver és soros tesztfutás után a régi regressziók sikeresek lettek.

A későbbi teljes futás két új tesztútvonal-hibát talált: Quintus ágán az irat előtti megállás a közvetítőt célozta meg, Titus ágán az egyenes megközelítést a régi keleti szobor akadályozta. A teszt most közelebb lép az irathoz, illetve WASD-vel megkerüli a szobrot. Egy további Titus-újrapróba azt is megmutatta, hogy a kerülőt nem a piacépület szélén, hanem a tőle délre fekvő szabad sávban kell megtenni; a végleges teszt ezt az útvonalat járja. A pályát, az ütközést és a tesztelvárásokat nem gyengítettük; mindhárom ág újra sikeresen végigment.

## Képernyőképek

A `chapter2-*.png` fájlok tényleges Chromium-képernyőképek, nem tervek vagy illusztrációk:

- [Publius](chapter2-publius-dialogue.png) és [Aulus](chapter2-aulus-dialogue.png) párbeszéde.
- [Hatalmi irat](chapter2-document-power.png), [diadém irata](chapter2-document-diadem.png), [fiktív feljegyzés](chapter2-document-secret.png).
- [Összevetési panel és helyes besorolások](chapter2-comparison.png); [production panel](chapter2-comparison-controls.png).
- [Lucius-ág lezárása](chapter2-ending-lucius.png), [Quintus-ág lezárása](chapter2-ending-quintus.png), [Titus-ág lezárása](chapter2-ending-titus.png).

## Történeti és egyéb korlátok

Forráshelyek, értelmezések és fikció elkülönítése: [HISTORICAL-NOTES.md](../HISTORICAL-NOTES.md). A könyvészeti forrásokat megadtuk, a hivatkozott weboldalak élő elérhetőségét nem ellenőriztük. A 10–15 perc tervezési cél, nem tanulói játékidőmérés. A város stilizált; a III. fejezet és Pompeius curiájának bejárható tere nincs megvalósítva. Mobilvezérlés, hang és fiókok közötti mentésszinkron nincs. A Vite bundle-méretfigyelmeztetése megmarad.
