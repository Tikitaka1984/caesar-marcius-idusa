# CAESAR v2.1 – publikálás és ellenőrzés

Repository: https://github.com/Tikitaka1984/caesar-marcius-idusa

Játék: https://tikitaka1984.github.io/caesar-marcius-idusa/

## Kiadási kapuk

```sh
npm ci
npm test
npm run build
npm run test:pages
```

A teljes csomag 34 teszteset. A korábbi 26 ellenőrzés megmarad, a friss kampány útvonala az új történeti feladatok miatt mind az öt pályát bejárja. Hat városi állapotteszt vizsgálja a migrációt, az előfeltételeket, a futár újrakezdését, a régiónkénti pozíciókat és az érvénytelen adatokat. Két új böngészőteszt régi mentésből járja be az új helyszíneket, illetve a templom előtti állapotból a Forum bemutatkozási feladatának átmenetét.

A teljes friss kampányteszt nem hoz létre előrehaladott mentést, és nem írja a kamera állapotát. Valódi WASD- és panelműveleteket használ az első beszélgetéstől az öt régión át a befejezésig, majd ellenőrzi az újratöltést és az újrakezdést. A külön, régi mentésből induló útvonal nem számít második teljes friss kampánynak.

A production-próba valódi `dist/` fájlokat szolgál ki a `/caesar-marcius-idusa/` alkönyvtár alatt. Utazással megnyitja a három új világot és azok térképét; külön, szabályos API-műveletekkel felépített mentési fixture-rel ellenőrzi a II. fejezet felületét és a kampány befejezését is. Ez a fixture-próba nem helyettesíti a teljes friss végigjátszást.

## GitHub Actions és Pages

A `.github/workflows/pages.yml` minden `main` push után telepít, tesztel, buildel, production-próbát futtat, majd Pages-artifactot tölt fel és telepít. A deploy csak sikeres build job után indul. Az újabb push leváltja az azonos ág elavult futását. A PR-futások ellenőriznek. A dokumentációs, `[skip ci]` commitok nem módosítják a kiadott játékkódot.

Node.js 24 és valódi Chromium szükséges. A böngésző alapértelmezett helye `/usr/bin/chromium`; más telepítésnél `CHROMIUM_PATH` adható meg. A teljes szoftveres WebGL-futás több percet igényel.

## Mentések és átadás

A kiadás 4-es mentéssémát használ ugyanazon kulccsal. Az 1–3-as mentések megőrzik a régi főszálat; új játékban az új városi szálak is szükségesek. A régió, a régiónkénti pozíció és a kinyitott kertkapu tartós. A telefonos támogatás külön, utolsó fázis.

A teszt alatt forrás és teszt nem változhat a végső megszakítás nélküli futásban. A jelentés rögzíti az ellenőrzött commitot, a tényleges eredményeket és a CI/deploy URL-jét. A közvetlen éles próbát nem helyettesíti a helyi production-próba: ha a futó környezet továbbra is tiltja a Pages-domaint, ezt külön kell jelezni.
