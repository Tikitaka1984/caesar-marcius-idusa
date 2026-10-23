# Story System v1.1 – A város suttogása

Az első fejezet a meglévő Three.js-pályán játszódik. Az épületek, az utcakép, a hét NPC sprite-ja, a három eredeti tekercs, a fizika és a három bejárható körzet megmarad. Négy meglévő NPC kapott nevet, témaválasztásos párbeszédet és bizalomértéket. Új környezeti tárgy csak a Via Sacrán elhagyott viasztábla.

## Végigjátszás

1. Quintus az utca közepén, Marcus a keleti piaci standnál, Lucius a Forum nyugati oldalán található. E-vel szólíthatók meg. Mindegyiktől legalább egy kérdésre választ kell kapni; a HUD 0/3-tól 3/3-ig követi ezt.
2. A viasztábla a Via Sacra nyugati szélén, Quintus és Marcus között hever. E-vel olvasható. Ha korábban találod meg, a bizonyíték akkor is megmarad, és nem kell újra összegyűjteni.
3. A bizonyítékból csak a B következtetés igazolható: találkozót említ, de a célját nem bizonyítja. A másik két válasz visszajelzést ad, és azonnal újrapróbálható.
4. Lucius, Quintus vagy Titus lehet a címzett. A kijelölés még módosítható; a végleges átadáshoz személyesen kell felkeresni az NPC-t, majd megerősíteni az átadást. Titus az utca déli végén vár.
5. Az átadás lezárja az I. fejezetet. A Forumra érkezés rögzíti a következő fejezet belépési állapotát. A II. fejezet története nincs megvalósítva.

A tervezett 6–10 perces játékidő a beszélgetések olvasására, a keresésre és az útvonal bejárására vonatkozó becslés. Emberi játékidőmérést nem végeztünk; az automatizált bejárás gyorsabb. Nincs mesterséges várakoztatás vagy időkorlát.

## Kezelés

A WASD, az egér, a nyilak, az M térkép és az E interakció megmaradt. J: küldetésnapló; B: bizonyítékok. A panelen 1–3 választ, Tab vagy a fel/le nyíl navigál, Enter aktivál. A hosszú napló görgethető; a szövegterület fókuszában a nyilak is görgetnek. Esc bezárja a panelt; az egérzár biztonsági szabályai miatt ezután a játéktérre kattintva kérhető újra az egérvezérlés. A nyilas fordulás addig is használható. Panel nélkül az Esc a szünetmenüt nyitja.

A beszélgetések közben a kamera és a mozgás szünetel. A jobb oldali panel az eredeti római színpalettát használja, és a 3D-kép nagyobbik részét asztali képernyőn láthatóan hagyja.

## Adatmodell és mentés

- `src/story/data.js`: NPC-k, kérdések, válaszok, bizalomváltozások, tárgyi bizonyíték, következtetések, címzettek és küldetésdefiníciók.
- `src/story/state.js`: a küldetésállapotok levezetése, események, bizalom, mentési validálás és tárolás. A nyitómondat megtekintése nem számít információszerzésnek; csak egy kérdés megválaszolása.
- `src/story/ui.js`: párbeszéd, napló, bizonyítékok, következtetés, címzettválasztás és fejezetlezárás.

A mentés kulcsa `caesar.story.save.v1`, a sémaverzió `version: 1`, a történetverzió `storyVersion: "1.1"`. Megmaradnak a megkérdezett témák és válaszváltozatok, a bizalom, a bizonyíték, a következtetés, a végleges címzett, a Forum-átvezetés, a kamera és az eredeti demó tekercsei/felfedezett körzetei. A következő fejezet a `decisions.messageRecipient` és `nextChapterReady` mezőkből indulhat.

Az automatikus mentés érdemi interakciónál, panelváltás előtt, szüneteltetéskor és játék közben három másodpercenként történik. A főmenüben külön visszatöltés és megerősítést kérő újrakezdés is van. A hibás, ismeretlen verziójú vagy hiányos mentés nem okoz összeomlást. A tárolás letiltása vagy betelt kvótája esetén a fejezet tovább játszható, és a menü figyelmeztet a mentés korlátjára.

A mentés böngészőhöz és webes originhez kötött. Másik eszközre, másik domainre vagy másik böngészőre nem szinkronizálódik. A privát böngészési mód és az adatok kézi törlése elveszítheti az előrehaladást. Szerveres mentés nincs.

## Történelmi keret

A dátum Kr. e. 44. március 15. A polgárháború öröksége, Caesar élethosszig tartó dictatori címe és a senatori aggodalmak valós háttérként jelennek meg. Pompeius kúriája a senatus aznapi ülésének történelmi helyszíne; a játék bejárható városrésze stilizált, nem régészeti rekonstrukció.

Marcus, Lucius, Quintus és Titus fiktív személyek. A párbeszédek nem ókori idézetek. A viasztábla szövege kitalált történetvezetési eszköz, és ezt a játék olvasáskor és a bizonyítékok között is kimondja. Caesar feltételezett királyi szándékát nem kezeljük bizonyított tényként. A névtelen üzenetet nem tekintjük önmagában merénylet bizonyítékának. A különböző politikai nézőpontok nem képviselik minden kereskedő, veterán vagy senator álláspontját.

Az átadási döntés az információ útját rögzíti; nem állítjuk, hogy a játékos ezzel megváltoztatja a történelmi eseményeket.

## Ellenőrzés

```sh
npm ci
npm run build
npm test
npm run test:pages
```

A fizika és az eredeti demó bejárása mellett külön tesztek ellenőrzik a sorrendfüggetlen bizonyítékszerzést, a hibás következtetés utáni újrapróbálást, a három címzettet, az ismételt kérdezéssel nem növelhető bizalmat, a hibás/régi/tárolhatatlan mentést és az állapotvalidálást. A történeti böngészőteszt WASD-vel, teleportálás nélkül teljesíti a fejezetet, majd újratöltés után ellenőrzi a döntést és a Forum-átvezetést.


## Story System v1.2 – II. fejezet

A `src/story/chapter2.js` az új tartalom és ellenőrzött állapotátmenetek, a `chapter2-ui.js` az új panelek, a `src/world/chapter2.js` a meglévő anyagokra és karakterképekre épülő tárgyak helye. A motor, fizika és az I. fejezet párbeszédadatai változatlanok.

A II. fejezet az I. fejezet személyes átadása és a Forumra érkezés után indul. A négy küldetés sorrendben aktív; az iratok korai megszerzése megengedett, de összevetésükhöz mindkét szereplő négy válasza és a kiegyensúlyozott politikai következtetés kell. Hibás válasz nem zár ki későbbi próbát.

- Lucius → Decimus (−5, −5), veteráni háttér és közvetlen hozzáférés a diadémhoz; a hatalmi irathoz Aulus négy válasza kell.
- Quintus → Servius (−5, −15), senatorsegédi feljegyzés és közvetlen hozzáférés a hatalmi irathoz; a diadémhoz Publius négy válasza kell.
- Titus → Livia (2, −4), majd külön futárjegyzék (10, −5); ez nyitja meg az iratokat. Enélkül a politikai párbeszédek akkor is befejezhetők, tehát nincs visszafordíthatatlan elakadás.

Publius (9, −8), Aulus (−8, −20); iratok (−6, −17), (8, −18), (1, −25); Naso (−4, −27). A koordináták a stilizált játékpálya egységei. Minden cél a térképen is jelölést kap. Az új tárgyak nem adnak útzáró kollidereket. A két meglévő Forum-polgár képe és ütközése megmarad, II. fejezetbeli interakciójuk új párbeszédre vált.

### Mentésmigráció

A kulcs változatlan: `caesar.story.save.v1`. A kulcsban szereplő v1 névtér, a tényleges séma a JSON `version` mezőjében van. A betöltő a korábbi 1-es és az új 2-es sémát fogadja. Az új állapot `version: 2`, `storyVersion: "1.2"`, külön `chapter2` objektummal. Érvényes v1.1 esetén megmaradnak a korábbi válaszok, válaszváltozatok, levezetett bizalom, viasztábla, címzett, lezárás, Forum-belépés, napló, pozíció és világállapot. A migráció nem választ új címzettet. A II. fejezet részállapotait minden történeti művelet menti; a pozíció továbbra is ellenőrzőpontokon mentődik.

A `chapter2` ellenőrzése szűri az ismeretlen azonosítókat és csak teljes előfeltételekkel fogad el lezárást. Korai iratfelvétel, részleges kérdések és hibás besorolások újratölthetők. Az újrakezdés továbbra is külön megerősítő panelhez kötött. A régi tesztek séma- és Forum-átadási elvárásait v1.2-re igazítottuk; a mozgási és I. fejezetbeli viselkedésellenőrzések megmaradtak.

A III. fejezet nyitójelzője `chapter2.decision`: `warn`, `investigate` vagy `locate`. Ezek nem módosítják a `decisions.messageRecipient` előzményt. Teljes III. fejezet még nincs.

A célzott 10–15 perc olvasással tervezett játékidő, nincs mesterséges időkorlát; tanulói játékidőt e munkamenet nem mért. Történeti források: `HISTORICAL-NOTES.md`. Futtatási eredmények: `artifacts/CHAPTER-2-TEST-RESULTS.md`.
