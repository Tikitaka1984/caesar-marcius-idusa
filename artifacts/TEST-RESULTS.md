# Ellenőrzési jegyzőkönyv

Dátum: 2026-10-23. Környezet: Linux, Node.js 24.19.0, npm 11.9.0, Vite 8.3.5, Three.js 0.185.1, Playwright 1.64.1, valódi Chromium szoftveres WebGL-lel. Nem kézi végigjátszás, hanem automatizált böngészős bejárás történt.

## Reprodukálhatóság

- `npm ci --cache /workspace/.npm-cache`: sikeres, változatlan zárolt függőségek.
- `npm run build`: sikeres. A Vite a kb. 592 kB-os tömörítetlen JavaScript-csomag méretére figyelmeztet; ez nem buildhiba.
- `npm run dev -- --port 5173`: sikeres; HTTP-válasz és a valódi alkalmazás ellenőrizve.
- `npm test`: **2 sikeres teszt, 0 sikertelen**, az utolsó teljes futás kb. 1,8 perc.

A production build külön Chromium-próbája is sikeres: WebGL-kép, működő belépés és egérzár, 0 konzol-, JavaScript- és HTTP-hiba.

## Végrehajtott tesztek

1. Fizika: szilárd objektum elutasítása, fal melletti csúszás, nagy elmozdulás alatti áthaladás megakadályozása.
2. Chromium-integráció: belépőmenü, egérzár, W/A/S/D mozgás, nyilas fordulás, valódi egéreseményre változó kamera, NPC-ütközés, szenátori párbeszéd, mindhárom tekercs felvétele, a felirat megvizsgálása, mindhárom körzet tényleges bejárása, térkép nyitása és zárása, Esc-szünet, szünet közbeni mozgás tiltása és folytatás. Nincs konzolhiba, nem kezelt JavaScript-kivétel vagy hibás HTTP-erőforrásválasz.

A bejáróteszt billentyűeseményeket használ és a kamera állapotát figyeli; nem teleportál, nem módosítja a játék állapotát, nem helyettesíti a renderelőt.

## Valódi játékképek

- `00-menu.png`: kezdőmenü.
- `01-via-sacra.png`: piaci utca, amforák, ládák, tógás polgár.
- `02-forum.png`: oszlopsorok, szobrok, szökőkút és templomhomlokzat.
- `03-temple.png`: a középület lépcsős előtere.

## Vizuális összevetés és korlátok

A referencia nyomán meleg kőszínek, bordó drapériák, SPQR-motívumok, pixeles burkolat, emberalakú sprite-ok és klasszikus római oszlopos homlokzatok készültek. A screenshotok tényleges WebGL-képek, nem helyettesítő illusztrációk. A pálya világosabb, szabályosabb és kevésbé részletgazdag a referenciánál; a szobrok és az építészeti ornamentika továbbra is egyszerűsített. A referencia teljes vizuális színvonalának elérését nem állítjuk.

A templombelső nem bejárható, a lépcsők díszletek; nincs magasság szerinti lépcsőjárás. Az NPC-k álló billboardok. Nincs harc, hang, mentés vagy mobil érintésvezérlés. A 3–5 perces szabad felfedezési idő nincs felhasználói teszttel igazolva. A szoftveres renderelés nem reprezentálja a hardveresen gyorsított böngésző teljesítményét. Más böngészőket és mobilkészülékeket nem teszteltünk.

## Környezet

Az `install_script` és `start_skill` konfigurációmezők elmentve. Nincs új titok- vagy hálózati követelmény. A konfiguráció mentése nem publikálás; új feladatban történő visszaállítást nem ellenőriztünk. A felhasználó a környezet beállításainál mentheti és publikálhatja a tervezetet. A GitHub-publikálási eljárás a `PUBLISHING.md` fájlban található; a fenti ellenőrzések helyi tesztek, nem állítják a távoli telepítés sikerét.

## Publikálás előtti ismételt ellenőrzés

A meglévő demó 2026-10-23-án újra telepítve és ellenőrizve: `npm ci`, `npm run build`, `npm test` sikeres, 2/2 teszt átment. A Pages alatti betöltéshez a Vite relatív alapútvonalat kapott, a két JavaScriptből betöltött textúra az `import.meta.env.BASE_URL` értékét használja. A játékmenet nem változott.

A külön `npm run test:pages` ellenőrzés a production buildet a `/caesar-marcius-idusa/` alkönyvtár alatt szolgálja ki, és minden azon kívüli kérést elutasít. Chromiumban sikeresen megjelent a WebGL-játék, betöltődött mindkét textúra, működött az előremenet és a térkép; 0 konzol-, JavaScript- és HTTP-hiba. Bizonyítékkép: `04-pages-build.png`. Ez helyi, a publikálási útvonalat ellenőrző próba; nem bizonyítja a GitHub Pages telepítését.

A GitHub API-t a felhőkörnyezet hálózati proxyja 403-as tiltással blokkolta. A szükséges API- és Pages-domainek a környezet konfigurációtervezetébe kerültek. A távoli GitHub Actions-futás és az éles Pages-oldal állapotát ezek feloldása után külön kell ellenőrizni.
