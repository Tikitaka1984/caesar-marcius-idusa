# CAESAR – Március idusa

**[Játék indítása – CAESAR teljes történet](https://tikitaka1984.github.io/caesar-marcius-idusa/)**

Magyar nyelvű, böngészős, háromfejezetes történelmi játék, Three.js és Vite alapon. A **v2.0 teljes asztali története** a Via Sacrától a Forumon át Pompeius curiájáig vezet, saját befejezéssel és a döntéseid összegzésével. Az első két fejezetre épülő III. fejezet már játszható; a mobilos érintésvezérlés későbbre marad.

Nincs backend, fiók vagy API-kulcs. A grafikai assetek és a történeti adatok helyben töltődnek. A részletes játékmenet és mentési séma: [STORY.md](STORY.md). Történelmi keret és fikció: [HISTORICAL-NOTES.md](HISTORICAL-NOTES.md).

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

## A játék

A Via Sacra piacutcája, a porticusokkal és szobrokkal szegélyezett Forum Romanum és a Saturnus-templom ihlette középület előtere folyamatosan bejárható. Hét álló NPC, három felvehető tekercs, olvasható felirat, térkép, felfedezési számláló és magyar HUD szerepel a pályán. Falak, oszlopok, amforák, ládák, szobortalapzatok és NPC-k akadályozzák a mozgást. A lépcsők díszletek; a templombelső nem bejárható.

A Kr. e. 44-es városképet idéző művészi helyszín nem régészeti rekonstrukció. Colosseum, Hadrianus-kori Pantheon és Traianus-fórum nem szerepel benne. Nincs harc vagy sérülés; az életjelző dekoratív. Az első történeti fejezet négy fiktív szereplő beszélgetésein, egy viasztábla vizsgálatán és az információ továbbadásáról hozott döntésen vezet végig.

A II. fejezet négy küldetése három eltérő előzményből játszható végig: politikai közvetítő keresése, Publius és Aulus négy-négy érvének megismerése, három irat gyűjtése és forráskritikai összevetése, majd a titkos találkozó nyomának mérlegelése és háromféle záródöntés. A folytatás az I. fejezet mentett címzettjét használja, a Forumra érkezéskor indul. [Történeti jegyzetek](HISTORICAL-NOTES.md).

A III. fejezetben külön helyszínre, Pompeius porticusához és curiájához utazol. A Forumon választott cél három eltérő személyes feladatot ad. Két forrás vizsgálata után következik a március idusát elbeszélő jelenet, az írnoki beszámoló és a teljes játék lezárása. A mentett döntések visszanézhetők, az utóhang után pedig szabadon nézelődhetsz a korábbi Rómában.

## Felépítés

- `src/main.js`: renderelés, kamera, bemenet, HUD, interakciók és térkép.
- `src/world/rome.js`: pálya, építészet, objektumok és statikus geometria összevonása.
- `src/art/textures.js`: procedurális pixeltextúrák és karakteratlasz-kezelés.
- `src/game/physics.js`: ütközéskezelés és területazonosítás.
- `src/world/campus.js`: Pompeius porticusa, a curia és a régióváltás.
- `src/story/`: történeti adatok, küldetésállapotok, verziózott localStorage-mentés és panelek.
- `tests/demo.spec.js`: a meglévő fizika, vezérlés és három körzet regressziós ellenőrzése.
- `tests/story-state.spec.js`: küldetések, három címzett, mentési validálás és hibakezelés.
- `tests/story-browser.spec.js`: az I. fejezet és a Forum-átadás valódi Chromiumban.
- `tests/chapter2-state.spec.js`: v1.1 migráció, mindhárom hozzáférési ág, újrapróbálkozás és döntések.
- `tests/chapter2-browser.spec.js`: a II. fejezet mindhárom ága tényleges WASD-mozgással és újratöltéssel.
- `tests/chapter3-browser.spec.js`: három eltérő III. fejezeti út és a végső mentés.
- `tests/full-campaign.spec.js`: teljes friss kampány az első lépéstől a végső képernyőig.
- `scripts/verify-pages-build.mjs`: a production build ellenőrzése a Pages alkönyvtárát utánzó helyi HTTP-kiszolgálóval.
- `artifacts/`: valódi játékképernyőképek, tesztjelentés.

## Ismert korlátok

A mellékelt referencia kompozíciója, római motívumai és palettája szolgált célként; a jelenlegi szobrok és épületdíszek egyszerűbbek a képnél. Nem állítjuk a referencia részletességének elérését. Az I. fejezet becsült játékideje 6–10 perc, a párbeszédek elolvasásától és a kereséstől függően; emberi játékidőmérést nem végeztünk. A II. fejezet tervezési célja 10–15 perc olvasással; ezt sem igazoltuk tanulói időméréssel. A III. fejezet a porticusban és a curiánál zárja le a játékot. Az NPC-k nem járőröznek; a víz és az ég stilizált. A statikus árnyékok egyszer készülnek el. Mobil érintésvezérlés, hang és akadálymentes alternatív 3D-játéknézet nincs. A történeti panelek billentyűzettel kezelhetők. A mentés helyi böngészőadat, nem eszközök között szinkronizált fiókmentés. A WebGL-képesség vagy egérzár böngészőnként eltérhet.

A forrás repositoryja: [Tikitaka1984/caesar-marcius-idusa](https://github.com/Tikitaka1984/caesar-marcius-idusa). A GitHub Pages-publikálás és ellenőrzés lépéseit a [PUBLISHING.md](PUBLISHING.md) írja le.

A külön build-csomag Node.js nélkül is kiszolgálható: kicsomagolás után `python3 -m http.server 8080`. A böngészővel a helyi HTTP-szerver címét kell megnyitni; a HTML fájl közvetlen megnyitása nem megfelelő.

A Vite relatív erőforrásútvonalakat használ, ezért ugyanaz a build a domain gyökerében és GitHub Pages-projekt alkönyvtárában is kiszolgálható. A `main` ágra történő push tesztelést, buildet és Pages-telepítést indít. Az első telepítéshez a repository Settings → Pages oldalán a Source értéke **GitHub Actions** legyen.

A történeti fejezet mentése automatikus. A szünetmenüben visszatöltés és megerősítést kérő újrakezdés is elérhető. Az érvényes v1.1-es és v1.2-es mentés megmarad és 3-as sémára migrálódik, ugyanazon localStorage-kulcson. Sérült vagy nem támogatott mentés esetén a játék biztonságosan új fejezetből indul; letiltott tárolásnál figyelmeztet, és munkameneten belül tovább játszható.

A v1.1 ellenőrzési jegyzőkönyve: [STORY-TEST-RESULTS.md](artifacts/STORY-TEST-RESULTS.md). Játékképek: [beszélgetés](artifacts/05-story-dialogue.png), [bizonyíték](artifacts/06-story-evidence.png), [fejezetlezárás](artifacts/07-story-ending.png).

A v1.2 tesztjelentése és képernyőképei: [CHAPTER-2-TEST-RESULTS.md](artifacts/CHAPTER-2-TEST-RESULTS.md). A PR-ellenőrzés tesztel és buildel; Pages-telepítés csak a `main` ágra érkező push esetén fut.

A II. fejezet összevonása utáni, 2026. október 31-i ismételt ellenőrzés: **18/18 sikeres teszt**, sikeres build és production prefix-próba. [Részletes jegyzőkönyv és gépi eredmények](artifacts/resume-2026-10-31/README.md).

A főmenü **A teljes történet** gombja mutatja a kampányt. A III. fejezet befejezése után visszanézhetők a döntések és a történeti utóhang, vagy folytatható a szabad nézelődés. Az **Új játék** mindhárom fejezetet újrakezdi, megerősítéssel.

A teljes asztali v2.0 kiadás: **26/26 sikeres helyi teszt**, sikeres build és production-próba; [sikeres GitHub CI és Pages-telepítés](https://github.com/Tikitaka1984/caesar-marcius-idusa/actions/runs/41186390060). [Részletes tesztjelentés és kiadási bizonyítékok](artifacts/DESKTOP-V2-TEST-RESULTS.md). A felhőkörnyezet Pages-domainre vonatkozó hálózati tiltása miatt friss, közvetlen éles böngészős próbát nem állítunk.
