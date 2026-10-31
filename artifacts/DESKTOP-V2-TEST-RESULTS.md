# CAESAR v2.0 – a teljes asztali játék ellenőrzése

Dátum: 2026. október 31. Ellenőrzött játékcommit: `a22ee4412454698c4bc8fea3aeff5beadd8cd07d`. Az eredmények erre a forrásra és a vele együtt verziózott tesztekre vonatkoznak; a CI-konfiguráció `c3e0949` commitja ugyanazt az alkalmazás- és tesztfát használja; a későbbi jelentéscommit csak dokumentációt és bizonyítékokat tartalmaz.

## Elkészült játék

Az I. és II. fejezetre épülő III. fejezet saját porticus–curia régióval, négy feladattal és három korábbi döntést folytató úttal készült el. A kampánynak végső lezárása, döntésösszegzése és történeti utóhangja van. A befejezés visszanézhető; a teljes játék újrakezdhető, vagy szabadon felfedezhető a korábbi Róma. A mobilos érintésvezérlés a felhasználó kérésére későbbi fejlesztés.

## Végső ellenőrzés

- `npm ci --cache /workspace/.npm-cache`: sikeres, új függőség nélkül.
- `npm test -- --reporter=list,json`: **26/26 sikeres; 0 hibás, 0 kihagyott, 0 flaky**. Egyetlen megszakítás nélküli folyamat, egy munkás, minden teszt egy próbálkozásból. Futásidő: 13.4 perc. A futás alatt alkalmazáskód és teszt nem változott.
- `npm run build`: sikeres v2.0.0 production build. A Three.js-t tartalmazó, körülbelül 666 kB-os JavaScript-csomag Vite-méretfigyelmeztetést ad; a build nem hibás.
- `npm run test:pages`: sikeres a tényleges `dist/` fájlokkal a `/caesar-marcius-idusa/` projektprefix alatt. WebGL, mozgás, térkép, mindkét textúra, II. fejezeti migráció és kezelőszervek, Campus régió, teljes kampánylezárás és utóhang. **0 ellenőrzött konzol-, JavaScript- és HTTP-erőforráshiba.**

A 26 teszt tartalmazza a korábbi 18 regressziót, négy III. fejezeti állapottesztet, három III. fejezeti böngészős bejárást és egy teljes friss kampányt. A célzott előzetes futások nem növelik a végső futás tesztszámát.

### Mit igazol a végigjátszás?

A `full-campaign.spec.js` üres böngészőadatból indul, nem készít előrehaladott mentést, nem teleportál és nem írja a kamera állapotát. Valódi WASD- és panelműveletekkel halad az első beszélgetéstől az I. fejezet átadásán és a teljes II. fejezeten át a III. fejezeti befejezésig. Ellenőrzi a történeti utóhangot, az újratöltött kampányzárást és a teljes újrakezdést.

A három külön III. fejezeti böngészőteszt szabályos, II. fejezetet lezáró v1.2 mentésből indul. Mindhárom folytatási út ténylegesen bejárható, végigvihető és visszatölthető; a befejezés után a korábbi Rómába visszatérés is ellenőrzött. Ezek nem három teljes, friss kezdésű kampányfutásnak számítanak. Az állapotteszt mind a kilenc korábbi címzett–folytatási út kombinációt vizsgálja.

Az 1-es és 2-es mentési séma 3-asra migrálása, a korábbi döntések megőrzése, a félbehagyott jelenet folytatása és az előfeltételek nélküli hamis befejezés elutasítása is ellenőrzött. A production-próba külön érvényes mentési fixture-rel nyitja meg a kampányzárást; ez a teljes friss végigjátszástól külön ellenőrzés.

### A kiadás előtt javított regresszió

Az első összesített futásban a III. fejezeti felület delegálása elnyelte a II. fejezet bizonyíték-összevetésének visszajelzését. A három régi böngészőteszt ezt valóban jelezte. Ezt a futást megszakítottuk, a visszajelzési paraméter átadását az `a22ee44` commitban javítottuk, majd a teljes 26 tesztet elölről, megszakítás nélkül futtattuk. A fenti eredmény kizárólag az új, teljes futásé.

## GitHub és GitHub Pages

A végső `c3e0949` változat [41186390060 számú workflow-ja](https://github.com/Tikitaka1984/caesar-marcius-idusa/actions/runs/41186390060) jelenleg fut. A korábbi hibás változat nem települt. Sikeres friss telepítést a CI lezárásáig nem állítunk.

Repository: https://github.com/Tikitaka1984/caesar-marcius-idusa

Játék: https://tikitaka1984.github.io/caesar-marcius-idusa/

A futó felhőkörnyezet HTTP-szabályai a Pages-domainhez való közvetlen kapcsolódást CONNECT 403 válasszal tiltják. A domain már szerepel a mentett konfigurációtervezetben, de a futó példányban még nem alkalmazott. Ezért **friss, közvetlen éles böngészős végigjátszást nem állítunk**. A helyi production-próba és a GitHubon megfigyelt CI-/deploy-állapot külön bizonyíték. A hálózati szabályt nem kerültük meg.

A CI-feladat neve már a teljes háromfejezetes kampányt jelöli. A konkurenciabeállítás az elavult futások megszakítását engedi; a teszt/build/production/deploy lépések és azok függősége nem változott.

## Bizonyítékok és korlátok

- [Teljes gépi teszteredmény](desktop-v2-2026-10-31/full-suite.json), [folyamatnapló](desktop-v2-2026-10-31/full-suite.log), [összefoglaló](desktop-v2-2026-10-31/summary.json).
- [Buildnapló](desktop-v2-2026-10-31/build.log), [production-próba naplója](desktop-v2-2026-10-31/pages-build.log), [buildazonosítók és SHA-256 lenyomatok](desktop-v2-2026-10-31/build-manifest.json).
- [Porticus](chapter3-porticus.png), [curia](chapter3-curia.png), [figyelmeztetési út lezárása](campaign-ending-warn.png), [nyomozási út](campaign-ending-investigate.png), [helyszín-ellenőrzési út](campaign-ending-locate.png), [production lezárás](production-campaign-ending.png). A képek tényleges játékfutásból származnak.

Környezet: Node.js 24.19.0, npm 11.9.0, Chromium 154.0.8037.57, Playwright, szoftveres WebGL, 1440×1000 böngészőablak. Az automatizált tesztek nem igazolnak emberi játékidőt vagy valamennyi eszköz teljesítményét. A grafika stilizált, a referencia részletességét nem állítjuk. Hang, harcrendszer és telefonos érintésvezérlés nincs ebben az asztali kiadásban.
