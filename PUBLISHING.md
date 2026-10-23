# GitHub és GitHub Pages

Repository: https://github.com/Tikitaka1984/caesar-marcius-idusa

Játékoldal: https://tikitaka1984.github.io/caesar-marcius-idusa/

A repository `main` ága tartalmazza a forrást, a helyi grafikai asseteket, a teszteket és az `artifacts/` képernyőképeit. A `node_modules`, a `dist` és az ideiglenes Playwright-eredmények nincsenek verziókezelve. A Pages forrása **GitHub Actions**.

## Telepítési folyamat

A `.github/workflows/pages.yml` minden `main` push után Node.js 24 alatt:

1. `npm ci` segítségével telepíti a zárolt függőségeket és a Chromium tesztböngészőt.
2. Lefuttatja a fizikai, vezérlési, mentési és történeti teszteket (`npm test`).
3. Elkészíti a Vite-buildet (`npm run build`).
4. A `/caesar-marcius-idusa/` alkönyvtár alatt külön böngészőpróbával ellenőrzi a buildet (`npm run test:pages`).
5. Feltölti a `github-pages` artifactot és telepíti az oldalt.

A helyi siker nem bizonyítja a távoli telepítést. A repository Actions oldalán a **build** és **deploy** feladatnak is sikeresnek kell lennie, majd az éles oldalt böngészőben ellenőrizni kell. Sikertelen teszt vagy build megakadályozza a telepítést.

## Helyi ellenőrzés

```sh
npm ci
npm test
npm run build
npm run test:pages
```

A WebGL-tesztekben `/usr/bin/chromium` az alapértelmezett böngésző. Más telepítéshez a `CHROMIUM_PATH` változó használható. A GitHub workflow ezt a Playwright által telepített Chromium elérési útjára állítja. A teljes történeti teszt lassabb szoftveres renderelés mellett több percet is igénybe vehet.

A relatív Vite-alapútvonal és az `import.meta.env.BASE_URL` miatt a szkriptek, a favicon és a két textúra projektalkönyvtár alatt is betöltődnek. A történeti mentés a böngésző `localStorage`-ában marad; a telepítés nem igényel backendet vagy saját API-kulcsot.

## Hibakeresés

Ha a telepítés 404-es Pages-hibát ad, a repository **Settings → Pages → Source** értéke legyen **GitHub Actions**, majd a sikertelen deploy újraindítható. Ha a Git push 403-at ad, a kapcsolódó GitHub-integráció írási jogosultsága ellenőrizendő; a fiók adminisztrátori jogát jelző metadata nem feltétlenül jelenti az integráció írhatóságát.

A korábbi v1.0 feltöltési akadályokat a GitHub-hozzáférés engedélyezése megoldotta; a Pages beállítását az API olvasási ellenőrzése már engedélyezettnek mutatta. Az aktuális változat konkrét teszt- és telepítési eredménye a verzióhoz tartozó ellenőrzési jegyzőkönyvben található.

## Story System v1.1 kiadás

A `9636f39354a71b7e89b8364e5aea6c38f6a56e5b` játékcommit sikeresen települt a [39993560402 számú workflow-futással](https://github.com/Tikitaka1984/caesar-marcius-idusa/actions/runs/39993560402). Az éles oldalon a WebGL, a párbeszéd, a vezérlés és a mentés visszatöltése is böngészőben ellenőrizve. Részletek és ismert korlátok: [STORY-TEST-RESULTS.md](artifacts/STORY-TEST-RESULTS.md).
