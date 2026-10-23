# CAESAR – Március idusa

Magyar nyelvű, böngészős, belső nézetes római játék. A Story System v1.1 első fejezete: **A város suttogása**. A részletes játékmenet, mentési séma és történelmi keret a [STORY.md](STORY.md) fájlban található. Three.js, Vite és JavaScript; nincs backend, belépés vagy API-kulcs. A faltextúrák helyben, determinisztikusan készülnek. A kőburkolat külön, helyben tárolt grafikai asset. A részletes karakteratlasz a projektben található generált grafikai asset; futás közben nincs külső kép- vagy betűtípus-szolgáltatás.

## Futtatás

Node.js 24 alatt ellenőrizve.

```sh
npm ci
npm run dev -- --port 5173
```

A böngészőben a Vite által kiírt címet nyisd meg. A „Belépés Rómába” gomb aktiválja az irányítást és kéri az egérzárat. Az egérzárhoz böngészőengedély kell; a nyilakkal enélkül is lehet fordulni. WebGL-képes asztali böngésző és billentyűzet szükséges.

```sh
npm run build
npm run preview -- --port 4173
npm test
npm run test:pages
```

A böngészős tesztek a `/usr/bin/chromium` programot használják. Más telepítésnél a `CHROMIUM_PATH` változóval adható meg a böngésző. A Playwright valódi billentyű- és egéreseményekkel járja be a pályát; nem teleportálja a kamerát. A teszt szoftveres WebGL-lel is fut, ezért lassabb lehet. Eredményei az `artifacts/` könyvtárban található tényleges képernyőképek.

## Irányítás

| Billentyű       | Művelet                                             |
| --------------- | --------------------------------------------------- |
| W / S           | Előre / hátra                                       |
| A / D           | Oldalazás                                           |
| Egér            | Körülnézés                                          |
| Bal / jobb nyíl | Fordulás                                            |
| E               | Közeli, a látóirányba eső tárgy vagy NPC használata |
| M               | Térkép megnyitása / bezárása                        |
| Esc             | Panel bezárása vagy szünet; egér felszabadítása     |
| J               | Küldetésnapló                                       |
| B               | Bizonyítékok és következtetés                       |

## A demó

A Via Sacra piacutcája, a porticusokkal és szobrokkal szegélyezett Forum Romanum és a Saturnus-templom ihlette középület előtere folyamatosan bejárható. Hét álló NPC, három felvehető tekercs, olvasható felirat, térkép, felfedezési számláló és magyar HUD szerepel a pályán. Falak, oszlopok, amforák, ládák, szobortalapzatok és NPC-k akadályozzák a mozgást. A lépcsők díszletek; a templombelső nem bejárható.

A Kr. e. 44-es városképet idéző művészi helyszín nem régészeti rekonstrukció. Colosseum, Hadrianus-kori Pantheon és Traianus-fórum nem szerepel benne. Nincs harc vagy sérülés; az életjelző dekoratív. Az első történeti fejezet négy fiktív szereplő beszélgetésein, egy viasztábla vizsgálatán és az információ továbbadásáról hozott döntésen vezet végig.

## Felépítés

- `src/main.js`: renderelés, kamera, bemenet, HUD, interakciók és térkép.
- `src/world/rome.js`: pálya, építészet, objektumok és statikus geometria összevonása.
- `src/art/textures.js`: procedurális pixeltextúrák és karakteratlasz-kezelés.
- `src/game/physics.js`: ütközéskezelés és területazonosítás.
- `src/story/`: történeti adatok, küldetésállapotok, verziózott localStorage-mentés és panelek.
- `tests/demo.spec.js`: a meglévő fizika, vezérlés és három körzet regressziós ellenőrzése.
- `tests/story-state.spec.js`: küldetések, három címzett, mentési validálás és hibakezelés.
- `tests/story-browser.spec.js`: teljes fejezet és mentés-visszatöltés valódi Chromiumban.
- `scripts/verify-pages-build.mjs`: a production build ellenőrzése a Pages alkönyvtárát utánzó helyi HTTP-kiszolgálóval.
- `artifacts/`: valódi játékképernyőképek, tesztjelentés.

## Ismert korlátok

A mellékelt referencia kompozíciója, római motívumai és palettája szolgált célként; a jelenlegi szobrok és épületdíszek egyszerűbbek a képnél. Nem állítjuk a referencia részletességének elérését. A fejezet becsült játékideje 6–10 perc, a párbeszédek elolvasásától és a kereséstől függően; emberi játékidőmérést nem végeztünk. Az NPC-k nem járőröznek; a víz és az ég stilizált. A statikus árnyékok egyszer készülnek el. Mobil érintésvezérlés, hang és akadálymentes alternatív 3D-játéknézet nincs. A történeti panelek billentyűzettel kezelhetők. A mentés helyi böngészőadat, nem eszközök között szinkronizált fiókmentés. A WebGL-képesség vagy egérzár böngészőnként eltérhet.

A forrás repositoryja: [Tikitaka1984/caesar-marcius-idusa](https://github.com/Tikitaka1984/caesar-marcius-idusa). A GitHub Pages-publikálás és ellenőrzés lépéseit a [PUBLISHING.md](PUBLISHING.md) írja le.

A külön build-csomag Node.js nélkül is kiszolgálható: kicsomagolás után `python3 -m http.server 8080`. A böngészővel a helyi HTTP-szerver címét kell megnyitni; a HTML fájl közvetlen megnyitása nem megfelelő.

A Vite relatív erőforrásútvonalakat használ, ezért ugyanaz a build a domain gyökerében és GitHub Pages-projekt alkönyvtárában is kiszolgálható. A `main` ágra történő push tesztelést, buildet és Pages-telepítést indít. Az első telepítéshez a repository Settings → Pages oldalán a Source értéke **GitHub Actions** legyen.

A történeti fejezet mentése automatikus. A szünetmenüben visszatöltés és megerősítést kérő újrakezdés is elérhető. Sérült vagy régi mentés esetén a játék biztonságosan új fejezetből indul; letiltott tárolásnál figyelmeztet, és munkameneten belül tovább játszható.

A v1.1 ellenőrzési jegyzőkönyve: [STORY-TEST-RESULTS.md](artifacts/STORY-TEST-RESULTS.md). Játékképek: [beszélgetés](artifacts/05-story-dialogue.png), [bizonyíték](artifacts/06-story-evidence.png), [fejezetlezárás](artifacts/07-story-ending.png).
