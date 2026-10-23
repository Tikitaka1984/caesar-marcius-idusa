# Story System v1.1 – ellenőrzési jegyzőkönyv

Dátum: 2026-10-23. Környezet: Linux, Node.js 24, Vite, Playwright és valódi Chromium szoftveres WebGL-lel. A történeti fejezet a meglévő motoron, pályán és grafikai assetekkel fut.

## Helyi vizsgálatok

- **7/7 állapot- és mentésteszt sikeres** (`tests/story-state.spec.js`).
- **2/2 eredeti motor-/demóteszt sikeres** (`tests/demo.spec.js`).
- **2/2 történeti böngészőteszt sikeres** (`tests/story-browser.spec.js`), a teljes fejezet bejárásával és visszatöltésével. Az utolsó történeti futás kb. 2,9 perc volt; a robot a párbeszédeket nem emberi olvasási idővel olvassa.

Az ellenőrzések külön vizsgálják a következőket:

1. Csak érdemi kérdés megválaszolása számít a három nézőpont megszerzésének. Azonos szereplő ismételt kérdezése nem duplázza a küldetéshaladást vagy a bizalmat.
2. Korán megtalált viasztábla sem vész el; a küldetésállapotok a szükséges előfeltételek után helyesen továbblépnek.
3. A és C hibás következtetés után B továbbra is választható. A helyes következtetés nélkül az üzenet nem adható át.
4. Lucius, Quintus és Titus ága külön állapottesztben végigmegy. A kijelölés még nem végleges döntés; az átadás igen. A címzett, a bizalom és a Forum-belépési állapot visszatöltés után is megmarad.
5. Hibás JSON, régi/ismeretlen sémaverzió, hiányos adatok, letiltott vagy betelt localStorage nem omlasztják össze a játékot. A validálás kizárja az előfeltételek nélküli befejezést és a pályán kívüli kameraértékeket.
6. A korábbi WASD, egér és nyilak, NPC-ütközés, három körzet, három eredeti tekercs, felirat, térkép és Esc-szünet működése megmaradt.
7. A történeti Chromium-teszt ténylegesen elgyalogol Quintushoz, Marcushoz és Luciushoz, megszerzi az információkat, megvizsgálja a viasztáblát, kipróbálja mindkét hibás következtetést, Titust választja és személyesen átadja az üzenetet. A fejezetlezárás után a Forumra sétál, újratölti az oldalt, és ellenőrzi a mentett döntést és bizonyítékot. Nincs teleportálás vagy a játékállapot tesztből történő módosítása.
8. A panelek alatt a kamera nem mozog; a napló Tab-bal kezelhető, Esc után a szünetmenü nem nyílik meg váratlanul, és kattintással visszakérhető az egérzár. A menüből nyitott újrakezdési panel megszakítása a menübe tér vissza.

A v1.1.0 zárolt telepítése (`npm ci`), kiadási buildje (`npm run build`) és a projektalkönyvtáras production böngészőpróba (`npm run test:pages`) is sikeres. A Vite csomagméret-figyelmeztetést ad, amely nem buildhiba.

## A QA során javított hibák

A kezdeti teljes bejárás feltárt egy késői Pointer Lock-eseményt, amely Esc-es panelbezárás után tévesen szüneteltette a játékot. A vezérlés most elkülöníti a szabad, kért és zárolt egérállapotot. Egy második teszt feltárta, hogy a célkereszt elkapta a canvas közepére adott kattintást; a díszítő rétegek most átengedik az egéreseményeket. A teljes fejezet ezek után újra végigjátszva, sikeresen tesztelve.

## Valódi képernyőképek

- `05-story-dialogue.png`: Quintus válasza és a 1/3 küldetésállapot.
- `06-story-evidence.png`: viasztábla és forráskritikus visszajelzés.
- `07-story-ending.png`: átadás Titusnak és az első fejezet lezárása.

Ezek tényleges játékbeli képek, nem illusztrációk vagy helyettesítő látványtervek.

## Korlátok

A tervezett 6–10 perces emberi játékidő becslés; felhasználói időmérést nem végeztünk. A második fejezet csak belépési állapotot kap, történeti tartalma nincs megvalósítva. Nincs szerveres vagy eszközök közötti mentésszinkronizálás. A böngészőadatok törlése elveszíti a mentést. Mobil érintésvezérlést és más böngészőmotorokat nem teszteltünk.

A korábbi környezetdemó ismert grafikai és pályakorlátai megmaradtak: az NPC-k álló billboardok, a templombelső nem járható, a szobrok egyszerűsítettek. A jelen bővítés ezeket nem egyszerűsítette tovább.

A távoli GitHub Actions-futás és a GitHub Pages-oldal állapota külön ellenőrzendő; a fenti helyi eredmények önmagukban nem bizonyítják a publikálást.
