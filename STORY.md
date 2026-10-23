# CAESAR – Story System v1.2

A játék két megvalósított történeti fejezetből áll. Mindkettő a meglévő Three.js-városban játszódik, Kr. e. 44. március 15-én. A római grafika, a karakteratlasz, az eredeti tekercsek, a fizika és az asztali irányítás megmaradt. A III. fejezet még nincs megvalósítva.

## I. fejezet – A város suttogása

**Kezdőhelyszín:** Via Sacra. **Tervezett játékidő:** 6–10 perc olvasással; emberi időmérést nem végeztünk.

Az írnoksegédként induló játékos három nézőpontot ismer meg, megvizsgál egy névtelen viasztáblát, majd dönt az információ útjáról.

1. E-vel kérdezd meg Quintust az utca közepén, Marcust a keleti piaci standnál és Luciust a Forum nyugati oldalán. Mindegyiküktől legalább egy érdemi válasz szükséges; a HUD ezt 0/3–3/3 között mutatja. Az ismételt kérdezés nem növeli újra a bizalmat.
2. Vizsgáld meg a viasztáblát a Via Sacra nyugati szélén, Quintus és Marcus között. Korábban is felvehető; a bizonyíték megmarad.
3. A B panelen válaszd külön az üzenet szövegét a feltételezéstől. A helyes következtetés: találkozót említ, de annak célját nem bizonyítja. Hibás válasz után újrapróbálhatsz.
4. Válassz Lucius, Quintus és Titus közül, keresd fel személyesen, majd erősítsd meg az átadást. Titus az utca déli végén vár. A kijelölés az átadásig módosítható; az átadott címzett tartós döntés.
5. Az átadás lezárja az I. fejezetet. Ezután indulj a Forum Romanumra: az odaérkezés rögzíti a II. fejezet belépését és aktiválja annak első küldetését.

Az I. fejezet saját adatai: `answers`, `responses`, `trust`, `evidence`, `interpretation`, `deliveryTarget`, `decisions.messageRecipient`, `chapterComplete`, `nextChapterReady`, `journal`. A `chapterComplete` továbbra is kizárólag az I. fejezet lezárását jelenti; a II. fejezet nem írja át az első címzettet.

## II. fejezet – A köztársaság árnyéka

**Kezdőhelyszín:** Forum Romanum. **Előfeltétel:** az I. fejezet személyes átadása és a Forumra érkezés. **Tervezett játékidő:** 10–15 perc olvasással; nincs mesterséges várakoztatás vagy időkorlát, tanulói időmérést nem végeztünk.

A négy küldetés sorrendben válik aktívvá. A korán megszerzett iratok megmaradnak, de az összevetéshez mindkét politikai szereplő mind a négy válasza és a kiegyensúlyozott politikai következtetés is szükséges.

### 1. Politikai szövetségesek

A mentett `decisions.messageRecipient` ténylegesen eltérő információhoz és hozzáférési lépéshez vezet:

| Korábbi címzett | Első közvetítő | Hozzáférési különbség |
| --- | --- | --- |
| Lucius | Decimus, veterán közvetítő (−5, −5) | Katonai kapcsolatokról ad háttérinformációt. A diadém irata korán hozzáférhető; a hatalmi irathoz Aulus négy válasza kell. |
| Quintus | Servius, senatorsegéd (−5, −15) | Rendkívüli hatalomról mutat feljegyzést. A hatalmi irat korán hozzáférhető; a diadémhoz Publius négy válasza kell. |
| Titus | Livia, futárközvetítő (2, −4) | Egyik politikai kör sem tekint szövetségesének. A külön futárjegyzék vizsgálata (10, −5) nyitja meg az iratokat. |

A futárjegyzék a meglévő keleti szobor mellett található: a piacépület és a szobor közötti szabad sávból közelíthető meg. Az akadályt meg kell kerülni. A közvetítő mellett fekvő irathoz közelebb lépve az irat célozható. Az új tárgyak nem adnak útzáró kollidereket. A koordináták a stilizált játékpálya egységei, nem földrajzi koordináták.

### 2. A köztársaság mérlegen

Publius (9, −8) Caesar támogatójának, Aulus (−8, −20) köztársaságpárti senatornak a nézőpontját mutatja be. Mindkét fiktív szereplőnek négy érdemi kérdése van. A játékosnak valamennyi választ meg kell ismernie.

A J napló következtetése akkor helyes, ha egyszerre ismeri el a stabilitás és reformok iránti igényt, valamint a köztársasági intézmények kiüresedésétől való félelmet. A játék nem ír elő politikai pártállást. A hibás általánosítások magyarázatot és újrapróbálkozást kapnak.

### 3. A senatorok iratai

Három külön helyszínen vizsgálható tárgy:

- A rendkívüli hatalom (−6, −17): történeti összefoglaló Caesar élethosszig tartó dictatori címéről.
- A diadém ügye (8, −18): a Lupercalia eseménye és annak vitatott politikai értelmezése.
- A titkos feljegyzés (1, −25): kifejezetten fiktív, ismeretlen célú találkozóra utaló játékbeli üzenet.

Mindhárom irat és a politikai következtetés után a B panel öt állítást vet össze. Kategóriák: történelmileg alátámasztott tény; történeti értelmezés vagy vitatott állítás; fiktív játékbeli információ. Minden állításhoz ellenőrzött megoldás és magyarázat tartozik. Hibás besorolás után nincs végleges elakadás. A már helyesen lezárt összevetés későbbi használata nem törli az előrehaladást vagy a záródöntést.

### 4. A titkos találkozó és a záródöntés

Az összevetés után külön következtetés rögzíti: a politikai elégedetlenség és a találkozó nyoma nem azonos konkrét személyek meghatározott merényleti tervének bizonyításával. Ezután Naso fiktív informátor (−4, −27) Pompeius curiájának környéke felé vezető nyomot ad.

A játékos három intézkedés közül választ és külön megerősíti azt. A mentett `chapter2.decision` értékei:

- `warn`: Caesar környezetét próbálja figyelmeztetni.
- `investigate`: további bizonyítékot keres az összeesküvők személyéről.
- `locate`: ellenőrzi a senatus ülésének pontos helyszínét és a találkozó időpontját.

A megerősítés lezárja a II. fejezetet: „II. fejezet teljesítve – Az összeesküvés következik.” A döntés a későbbi III. fejezet kezdőhelyzetét készíti elő; annak története és Pompeius curiájának bejárható helyszíne még nem játszható. A curia a Forumtól nyugatra, Pompeius színházának épületegyüttesében volt, nem a Forum Saturnus-temploma.

## Közös irányítás és kezelőfelület

WASD: mozgás; egér vagy nyilak: nézet; E: közeli, célzott interakció; M: térkép; J: küldetésnapló; B: bizonyítékok. Esc panelt zár vagy szüneteltet. A panelek alatt a mozgás szünetel. Bezárás után kattintással kérhető újra egérzár; a nyilas fordulás addig is használható.

A paneleken 1–9 választ, Tab navigál, Enter aktivál. A szövegterület fókuszában a nyilak görgetnek; a legördülő besorolások saját billentyűkezelése megmarad. A HUD az aktuális fejezet feladatát mutatja; a II. fejezetben a dokumentumok és a két politikai beszélgetés számlálóját is. A napló a következtetéseket és a végső döntést is rögzíti.

## Adatmodell, mentés és v1.1-migráció

| Fájl | Feladat |
| --- | --- |
| `src/story/data.js` | Az I. fejezet változatlan szereplői, kérdései, bizonyítéka és küldetései. |
| `src/story/state.js` | Közös mentéstároló, az I. fejezet állapotátmenetei és a fejezetválasztás. |
| `src/story/ui.js` | Közös panelkezelés és az I. fejezet felülete. |
| `src/story/chapter2.js` | A II. fejezet tartalma, állapotátmenetei és validálása. |
| `src/story/chapter2-ui.js` | A II. fejezet párbeszédei, naplója, iratai és összevetése. |
| `src/world/chapter2.js` | A meglévő anyagokra és karakterképekre épülő új interakciók. |

A kulcs változatlan: `caesar.story.save.v1`. A kulcsban szereplő v1 névtér, nem a jelenlegi séma száma. Az aktuális JSON `version: 2`, `storyVersion: "1.2"`; a betöltő a korábbi 1-es sémát is elfogadja. A v1.1 érvényes mentése az eredeti címzett, lezárás, válaszok és válaszváltozatok, levezetett bizalom, bizonyíték, napló, játékospozíció, tekercsek és felfedezett körzetek megőrzésével migrálódik. A II. fejezet új állapota külön `chapter2` objektumba kerül.

A validálás szűri az ismeretlen azonosítókat és csak teljes előfeltételekkel fogad el lezárást. A részleges párbeszédek, korai iratok és hibás besorolások újratölthetők; a migráció nem választ új címzettet. Mentés történik érdemi interakciónál, panelnyitás előtt, szüneteltetéskor, oldalelhagyáskor és játék közben ellenőrzőpontokon. A főmenüben visszatöltés és külön megerősítést kérő teljes újrakezdés van; ez utóbbi az I. és II. fejezet előrehaladását is törli.

Sérült vagy nem támogatott mentés nem okoz összeomlást. Letiltott vagy betelt tárolás esetén figyelmeztetés jelenik meg, a munkamenetben tovább lehet játszani. A mentés böngészőhöz és originhez kötött, nem szinkronizálódik eszközök között. Az adatok kézi törlése vagy a privát mód elveszítheti az előrehaladást.

## Történeti keret

A polgárháborúk öröksége, a rendkívüli hatalom, a Lupercalia diadémjelenete és Pompeius curiája történeti háttér. A szereplők párbeszédei, a játékos szerepe, a viasztábla, a titkos feljegyzés és a futárjegyzék fikció. A királyi szándékot és a diadémjelenet célját nem kezeljük bizonyított tényként. A névtelen üzenet vagy politikai ellenzékiség önmagában nem bizonyít konkrét merényleti részvételt. A város stilizált, nem régészeti rekonstrukció. Források és megkülönböztetések: [HISTORICAL-NOTES.md](HISTORICAL-NOTES.md).

## Ellenőrzés

```sh
npm ci
npm test
npm run build
npm run test:pages
```

A teljes `npm test` 18 tesztesetet futtat egy munkással: 11 korábbi demó/I. fejezeti regressziót és 7 új II. fejezeti tesztet. A három új böngészőteszt v1.1-mentésből indulva, WASD-vel, teleportálás nélkül járja végig a három előzményt, majd visszatölti a záródöntést. Az állapotteszt mindhárom előzményből mindhárom záródöntést ellenőrzi. A production próba a tényleges `dist/` fájlokat szolgálja ki a Pages projektprefixe alatt; külön mentési fixture-rel ellenőrzi az új paneleket is. Végső eredmények és ellenőrzött commit: [CHAPTER-2-TEST-RESULTS.md](artifacts/CHAPTER-2-TEST-RESULTS.md).

## A következő mobil-first fejlesztési fázis határa

Telefonos és tabletes érintésvezérlés ebben a változatban nincs implementálva. A történeti állapotátmenetek a megjelenítéstől külön modulban maradnak; a közös mozgás a meglévő fizikai függvényen keresztül történik. A későbbi érintéses bemenet ezekhez a meglévő műveletekhez kapcsolható, az egér- és billentyűvezérlés megőrzésével. A végső minőségbiztosítás nem vezet be mobil UI-t, új bemeneti módot vagy új grafikai elemet.
