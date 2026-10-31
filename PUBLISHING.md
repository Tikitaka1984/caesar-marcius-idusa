# CAESAR v2.0 – publikálás

A teljes, háromfejezetes asztali játék forrása: https://github.com/Tikitaka1984/caesar-marcius-idusa

GitHub Pages: https://tikitaka1984.github.io/caesar-marcius-idusa/

## Kiadási ellenőrzés

```sh
npm ci
npm test
npm run build
npm run test:pages
```

A teljes csomag 26 teszteset: a korábbi 18 regresszió; négy III. fejezeti állapotteszt; három, korábbi mentésből induló, ténylegesen végiggyalogolt III. fejezeti út; és egy friss játékból induló teljes kampány. A teljes kampányteszt nem hoz létre előrehaladott mentést és nem teleportál: az első beszélgetéstől a végső összegzésig használja a játékot, végül ellenőrzi az újratöltést és az újrakezdést.

A production-próba valódi `dist/` fájlokat szolgál ki a projekt alkönyvtárában. Az alapvető WebGL/működés ellenőrzése mellett külön érvényes mentési fixture-rel a II. fejezet felületét és a Campus régióban a kampány befejezését is megnyitja. Ez a fixture-próba nem helyettesíti a teljes, előrehaladott mentés nélkül induló kampánytesztet.

## Automatikus GitHub Actions

A `.github/workflows/pages.yml` minden `main` push után telepít, tesztel, buildel, elvégzi a production prefix-próbát, majd artifactot tölt fel és GitHub Pages-re telepít. A deploy csak sikeres ellenőrzések után fut. Az újabb push megszakítja az elavult, azonos ághoz tartozó folyamatot, hogy a javított kiadás ellenőrzése ne várjon a korábbi változatra. PR-futások csak ellenőriznek. A Pages forrása GitHub Actions.

A projekt relatív Vite-alapútvonalat használ. Mindkét régió és a teljes történeti adat a build része; nincs backend vagy saját API-kulcs. Az 1-es és 2-es mentések 3-as sémára migrálódnak, a régi `caesar.story.save.v1` kulcs alatt. A régió és a végleges kampányállapot is megmarad.

## Ellenőrzési környezet

Node.js 24, valódi Chromium, Playwright. A böngésző alapértelmezett helye `/usr/bin/chromium`, más telepítésnél `CHROMIUM_PATH` használható. A teljes szoftveres WebGL-futás több percet igényel. A játék mobil érintésvezérlése a felhasználó kérésére későbbi feladat.

Az éles telepítés aktuális állapotát külön kell ellenőrizni. A helyi production-próba önmagában nem bizonyítja az éles telepítést. Ha a felhőkörnyezet a GitHub API-t vagy a Pages domaint tiltja, a már mentett `api.github.com` és `tikitaka1984.github.io` szabályokat kell alkalmazni; az örökölt proxyt és a TLS-ellenőrzést meg kell őrizni. A `github.com` nyilvános Actions-oldalának megengedett olvasása CI-állapotot igazolhat, de közvetlen éles böngészős végigjátszást nem helyettesít.
