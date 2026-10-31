# CAESAR – Róma városrészei: bővítési terv

Állapot: konkrét javaslat felhasználói felülvizsgálatra; a bővítés még nincs implementálva.

## Cél és jelenlegi helyzet

A felhasználó izgalmasabb játékot és több római helyszínt kér. A v2.0 jelenleg két külön bejárható pályát tartalmaz: a Via Sacra–Forum–templom környezetet és Pompeius porticusát a curiával. Az első két fejezet nagyrészt ugyanazon a pályán marad. Az új kiadás célja, hogy már a történet elejétől legyen hová elindulni, és a helyszínekhez eltérő cselekvések kapcsolódjanak.

A korábbi továbbhaladási panasz továbbra is nyitott: a felhasználó képe a II. fejezet „Politikai szövetségesek” feladatát 0/1 állapotban mutatja, de a saját mentését nem ismerjük. Egy hasonló, szabályos templom előtti mentésből Decimus elérése és a közvetítés elfogadása működött. Ez nem bizonyítja, hogy a felhasználó saját mentésében nincs hiba. A bővítésnek egyértelműbb feladat-visszajelzést kell adnia, és meg kell őriznie a meglévő előrehaladást.

## Mérlegelt változatok

| Változat | Tartalom | Előny és ráfordítás |
| --- | --- | --- |
| Öt külön pálya – javasolt | Három új városrész a két meglévő mellé, a háromfejezetes történetbe kapcsolva. | Jól elkülönülő látvány és feladatok; a jelenlegi motor és történeti keret tovább használható. |
| Nyolc kisebb pálya | További városrészek, rövidebb jelenetekkel. | Több helyszínnév és átmenet; több környezetet kell kidolgozni és ellenőrizni. |
| Egyetlen nagy várostérkép | Folyamatos bejárás a városrészek között. | Erősebb térbeli folytonosság; jelentős pálya-, teljesítmény- és mentési átalakítás szükséges. |

## Javasolt helyszínek: összesen öt külön pálya

| Pálya | Látvány és alaprajz | Játékmeneti szerep |
| --- | --- | --- |
| Via Sacra és Forum | A meglévő széles főutca, középületek, szobrok és templomelőtere. | Kiindulópont, politikai találkozások és visszatérési csomópont. |
| Subura – új | Szűk, kanyarodó sikátorok, többemeletes lakóházak, műhelyek, mellékudvar. | Fiktív futár követése, az üzenethez tartozó pecsétmásolat ellenőrzése. |
| Forum Boarium és Tiberis-part – új | Nyitott piac, raktár, fa rakodóhely, csónak és mozgó vízfelület. A folyó lezárt pályahatár. | Tanú felkeresése, rakományjegyzék és kézbesítési állítás összevetése. |
| Palatinus: köztársaság kori domus és kert – új | Bejárható előtér, átrium, oldalszoba és zárt kert. A ház fiktív magánház, nem császári palota vagy Caesar igazolt lakóhelye. | Közvetítő elérése, az üzenet eredetének igazolása, társadalmi kapcsolatok vizsgálata. |
| Pompeius porticusa és curiája | A meglévő porticus és tanácsterem. | A három korábbi döntési út és a történeti befejezés megmarad. |

A három új pálya eltérő útvonalakat, térarányokat és felismerhető tájékozódási pontokat kap. Egyik sem a jelenlegi főutca átszínezése. A helyszínek stilizált, egy járószinten működő rekonstrukciók; nem készül régészeti pontosságú vagy teljes Róma-modell.

## Izgalmasabb cselekvések

- **Subura:** a futár láthatóan mozog két megálló között. A játékos követheti és azonosíthatja a megfelelő udvart. Lemaradás esetén a következő megálló jelölhető, a jelenet újrapróbálható.
- **Tiberis-part:** a játékos a raktárban és a rakodóhelynél két külön tárgyat vizsgál, majd a tanú állítását ellenőrzi. Egy rövid, kihagyható rakodási jelenet és mozgó csónak ad életet a helyszínnek.
- **Domus:** az előtérből a kertbe jutás egy rövid, újrapróbálható párbeszédhez és az üzenet eredetének igazolásához kapcsolódik. A megszerzett információ konkrét átjárót nyit meg.
- **Küldetés-visszajelzés:** sikeres feladat után látható teljesítési üzenet és konkrét következő lépés jelenik meg. A szükséges megerősítés külön, egyértelmű gombot kap. A napló az aktuális lépést a hosszabb korábbi feljegyzések előtt mutatja.
- **Tájékozódás:** a térkép kiemeli az aktív célpontot, és helyszínváltásnál megmutatja a cél városrész nevét. Útjelzők és céljelzés segítik a haladást.

Nincs harc, végleges időkorlát, üldözés miatti mentésvesztés vagy történelmileg eltérő Caesar-megmentés. A feszültséget a mozgó szereplő, a helyszíni cselekvés, a bizonytalan információ és a döntések következménye adja. A telefonos támogatás továbbra is az utolsó, külön szakasz.

## Kapcsolódás a három fejezethez

A Subura, a Forum Boarium és a domus már az I. fejezettől elérhető, az ottani történeti feladatok a megfelelő fejezetben aktiválódnak. A Forum útjelzői és a várostérkép megmutatják a kapcsolatokat; minden új pályáról van szabad visszaút.

Új játékban az I. fejezet a Suburába vezető futárszálat is tartalmazza. A II. fejezetben a Forum Boarium tanúja és a domus közvetítője kapcsolja össze a politikai érveket az üzenet útjával. A játékos a helyszíni ellenőrzések után hozza meg a II. fejezet záródöntését. A III. fejezet meglévő három útja és befejezése ezekre az előzményekre reagál.

Korábbi mentésből folytatva a meglévő főszál továbbra is teljesíthető marad; az új városi feladatok külön, választható szálként jelennek meg. Nem állítunk be el nem végzett új feladatot teljesítettnek, és nem vonunk vissza korábbi fejezetet vagy döntést.

## Műszaki megvalósítás

1. **Közös helyszínkezelés:** a `rome`/`campus` kétágú kiválasztást régiójegyzék váltja fel. Régiónként azonos szerződés adja a renderelhető gyökércsoportot, az ütközési objektumokat, az interakciókat, a határokat, a belépési pontokat és a térkép adatait. A meglévő gyűjthető tárgyak kezelése is a megfelelő régióhoz kapcsolódik.
2. **Külön világmodulok:** `subura.js`, `boarium.js`, `domus.js`; közösen használható anyagokkal és építési segédekkel. A pályák első belépéskor készülnek el. Egyszerre egy régió látható és aktív. A meglévő karakteratlasz és textúrák tovább használhatók.
3. **Fizika:** a pályahatár régiónként megadható; a meglévő pályák alapértékei és ütközéskezelése megmarad. A víz, a falak és a bezárt kertkapu valódi ütközési akadályok. A futár nem zárhatja el az egyetlen továbbvezető utat.
4. **Történeti állapot:** külön városi történetmodul kezeli a három új feladatot, a mozgó jelenet előrehaladását és a feloldott kaput. A feladatok eredménye tartós, az ismételt interakció nem ad ismételt jutalmat vagy új befejezést.
5. **Mentés:** 4-es séma, a jelenlegi localStorage-kulcs megtartásával. Az 1–3-as mentések migrálhatók. A régió és az utolsó biztonságos pozíció régiónként megmarad. Külön migrációs jelzés őrzi meg a régi kampány útját; az új feladatok saját teljesítése ettől független.
6. **Hibakezelés:** ismeretlen régió vagy érvénytelen pozíció esetén biztonságos belépési pontra áll vissza a játék. Megszakított jelenet újranyitható. A tárolási hibák a jelenlegi módon jelzést kapnak. A III. fejezet befejezése továbbra is véges és visszanézhető.

## Történeti keret

A játék időpontja Kr. e. 44. március 15. A városrészek korabeli jellegét és elhelyezkedését külön történeti jegyzet rögzíti a megvalósításkor. A futár, a rakományjegyzék, a tanú és a domus lakói fiktív szereplők és tárgyak. Nem jelenhet meg Colosseum, Augustus-forum vagy császári palota. A városrészek közti átmenet kifejezetten stilizált utazás, nem földrajzilag pontos útvonal.

## Ellenőrzés és készültségi feltételek

- Mind az öt pálya ténylegesen bejárható, és a három új helyszín felismerhetően különbözik a meglévőktől.
- Az új városrészek az I. fejezetben elérhetők; a visszaút nem függ küldetés teljesítésétől.
- Egy teljes, friss játékból induló böngészőteszt mind az öt pályán valódi irányítással halad végig, és eléri a kampány lezárását.
- Külön ellenőrzés lefedi a három új feladatot, a futár újrapróbálását, a kapu feloldását, az ütközéseket, a régióváltást és a félbehagyott játék visszatöltését.
- Az 1–3-as sémából származó részleges és befejezett mentések megőrzik a döntéseket; migráció nem talál ki teljesített új feladatot.
- A régi kampány három címzetti és három záródöntési útja továbbra is működik. A tesztek csak a jóváhagyott új játékút miatt változhatnak; az eredeti ellenőrzések nem tűnhetnek el az eredmények javítása érdekében.
- A továbbhaladási jelzés egyértelműen megkülönbözteti az elolvasott párbeszédet, a megerősített feladatot és a következő aktív célpontot. A felhasználó konkrét mentési hibáját csak reprodukálás után tekintjük javítottnak.
- Sikeres build, helyi production-próba, GitHub CI és Pages-telepítés szükséges. Mindhárom új helyszínről valódi képernyőkép készül.
- A közvetlen éles böngészős ellenőrzés hálózati korlátját külön jelenteni kell, ha a futó felhőkörnyezet továbbra is tiltja a Pages-domain elérését.

## Határ és jóváhagyás

Ez a terv öt külön pályát, három új helyszíni feladatot és egyértelműbb továbbhaladást javasol. Nem tartalmaz teljes, szabadon bejárható Róma-modellt, új harcrendszert vagy mobilos vezérlést. A bővítés implementálása a terv felhasználói jóváhagyása után kezdődik.
