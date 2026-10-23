export const CHAPTER = {
  id: 1,
  title: "I. fejezet – A város suttogása",
  intro:
    "Fiatal írnoksegédként indulsz a Via Sacrán. Kr. e. 44. március 15-e van: a polgárháború emléke eleven, Caesar élethosszig tartó dictatori hatalma pedig megosztja Rómát. Hallgasd meg a város különböző hangjait, és válaszd külön azt, amit tudsz, attól, amit csak sejtesz.",
  fiction:
    "Marcus, Lucius, Quintus és Titus kitalált szereplők. Párbeszédeik és a viasztábla a történelmi háttérre épülő fikciók, nem fennmaradt ókori források.",
  ending: "I. fejezet teljesítve – A köztársaság árnyéka következik.",
};
export const NPCS = {
  marcus: {
    name: "Marcus",
    role: "kereskedő",
    x: 4,
    z: 9,
    direction: "Via Sacra · keleti piaci stand, a Forum felőli utcaszakaszon",
    opening:
      "Ma alig vásárolnak az emberek. A senatusról beszél mindenki. Én csak azt szeretném, hogy ne legyen újabb háború.",
    questions: [
      {
        id: "war",
        text: "Miért tartanak az újabb háborútól?",
        trust: 1,
        answer:
          "Még emlékszünk rá, amikor a polgárháború miatt akadozott az áru, a katonák pedig úton voltak Itália-szerte. Ha a tehetősek elrejtik a pénzüket, nekem akkor is fizetnem kell a raktárért. A politikusok győzelmekről beszélnek; mi azt számoljuk, marad-e holnapra kenyerünk.",
      },
      {
        id: "caesar",
        text: "Mit gondolsz Caesarról?",
        trust: 0,
        answer:
          "Sokan remélik, hogy Caesar végre tartós rendet hoz, és az adósságok körüli intézkedései is sok embert érintenek. Mások attól félnek, hogy túl sok függ egyetlen ember akaratától. Én nem a címeket nézem: nekem az számít, biztonságban megérkezik-e az áru, és hazatér-e a családom.",
      },
      {
        id: "rumour",
        text: "Hallottál valami különöset?",
        trust: 1,
        answer:
          "Két vásárló ma a senatus ülését emlegette, és hirtelen elhallgattak, amikor közelebb mentem. Pompeius színházának környéke is szóba került. Nem hallottam tervet vagy fenyegetést; néhány félmondatból nem akarok olyasmit állítani, amiért más kerül bajba.",
      },
    ],
  },
  lucius: {
    name: "Lucius",
    role: "veterán katona",
    x: -3,
    z: -8,
    direction: "Forum Romanum · a nyugati szoborsor előtt",
    opening:
      "Évekig meneteltem Caesar katonájaként. Nem felejtjük el, ki vezetett minket győzelemre.",
    questions: [
      {
        id: "soldiers",
        text: "Miért népszerű Caesar a katonái között?",
        trust: 1,
        answer:
          "Gallia hadjáratai alatt osztozott a menetelés terhében, és a győzelmek dicsőségéből nekünk is jutott. Sok veterán jutalmat és földet remél a szolgálatáért. Nem minden katona gondolkodik egyformán, de aki éveket töltött mellette, gyakran jobban bízik a hadvezérében, mint a távoli szónokokban.",
      },
      {
        id: "republic",
        text: "Nem veszélyezteti a köztársaságot?",
        trust: -1,
        answer:
          "Értem, miért nyugtalanít másokat az élethosszig tartó dictatori cím. Mi viszont azt is láttuk, hogy a köztársaság vezetői egymás ellen vezettek hadseregeket. Attól, hogy én hű vagyok Caesarhoz, a törvények kérdése még nem válik egyszerűvé; békét szeretnék, de nem tudom megmondani, milyen rend tartja majd fenn.",
      },
      {
        id: "strangers",
        text: "Láttál gyanús embereket?",
        trust: 1,
        answer:
          "Reggel néhány senator sietősen haladt el, a kísérőik pedig lemaradtak mögöttük. Ma ülésezik a senatus, tehát a sietség önmagában nem rendkívüli. Nem láttam fegyvert vagy támadást, és nem fogok puszta tekintetek alapján árulót kiáltani.",
      },
    ],
  },
  quintus: {
    name: "Quintus",
    role: "egy senator írnoka",
    x: -1,
    z: 19,
    direction: "Via Sacra · az utca közepén, bordó szegélyű ruhában",
    opening:
      "A szabadság nem csupán azt jelenti, hogy nincsenek ellenségeink. Azt is, hogy senki sem állhat a törvények fölött.",
    questions: [
      {
        id: "senators",
        text: "Miért aggódnak egyes senatorok?",
        trust: 1,
        answer:
          "A köztársaság tisztségeit korlátok és szokások tartották egymás mellett, még ha gyakran meg is sértették őket. Caesar most élethosszig dictator, ezért sokan attól tartanak, hogy a versengő tisztségek mögött már csak egyetlen akarat marad. De a senatorok sem egyformák: van, akit a közrend, mást a saját tekintélyének elvesztése aggaszt.",
      },
      {
        id: "king",
        text: "Caesar király akar lenni?",
        trust: 0,
        answer:
          "Erről beszélnek a házakban és a Forumon, de szándékot nehéz bizonyítani. A királyi jelvények és a neki ajánlott tiszteletek körüli jelenetek sokakat nyugtalanítottak; az ajánlott koronát ugyanakkor nyilvánosan visszautasította. Abból, amit mások róla állítanak, még nem tudhatjuk biztosan, mit akar ő maga.",
      },
      {
        id: "meeting",
        text: "Mit tudsz a mai gyűlésről?",
        trust: 1,
        answer:
          "A senatus ma Pompeius kúriájában gyűlik össze, a színházhoz tartozó épületegyüttesben. Én iratokat másolok, nem a tanácskozás minden résztvevőjének szándékait. Ha valaki találkozót emleget, előbb azt kell megtudni, kikről és milyen ügyről beszél, nem rögtön ítéletet mondani.",
      },
    ],
  },
  titus: {
    name: "Titus",
    role: "futár",
    x: -4,
    z: 31,
    direction: "Via Sacra · az utca déli végén, a bal oldali piaci standnál",
    opening:
      "Ne állj ilyen közel! Nem tudom, kinek dolgozol. Ma minden rossz szó veszélyes lehet.",
    questions: [
      {
        id: "tablet",
        text: "A tiéd ez a viasztábla?",
        trust: 0,
        beforeEvidence:
          "Miféle viasztábláról beszélsz? Az utca nyugati szélén láttam valamit leesni, Quintus és a kereskedő standja között. Nézd meg, mielőtt valakit a tulajdonosának nevezel; én nem fogok egy ismeretlen iratért felelősséget vállalni.",
        answer:
          "Ma több üzenetet is vittem, de ezen nem látok olyan jelet, amiből biztosan megmondhatnám, ki írta. Attól, hogy egy futár közelében találtad, még nem lesz az övé. Ne mondd másnak, hogy én adtam neked: azt nem tudnád igazolni.",
      },
      {
        id: "fear",
        text: "Mitől félsz?",
        trust: 1,
        answer:
          "Aki üzenetet visz, néha többet hall, mint amennyit értenie kellene. Ha két hatalmas ember összevész, a futárt könnyű számon kérni, akkor is, ha csak a megbízását teljesítette. Ma mindenki a másik hűségét figyeli, és én szeretnék épségben hazajutni.",
      },
      {
        id: "help",
        text: "Segíthetek?",
        trust: 1,
        answer:
          "Először azzal, hogy nem teszel biztos állítást arról, amit csak sejtesz. Ha átadsz valamit, olyan embernek add, akiben megbízol, és mondd el, hol találtad. Egy üzenet útja számít: mire a harmadik emberhez ér, a suttogásból könnyen bizonyosság lesz.",
      },
    ],
  },
};
export const VOICES = ["marcus", "lucius", "quintus"];
export const RECIPIENTS = ["lucius", "quintus", "titus"];
export const TABLET = {
  id: "wax-tablet",
  x: -3,
  z: 14,
  title: "Az elveszett viasztábla",
  text: "A találkozó napja elérkezett. A többiek tudják, hol kell megjelenniük. A figyelmeztetés nem késlekedhet.",
  provenance:
    "Találási hely: Via Sacra, az utca nyugati széle. A szerző, a címzett és a találkozó célja ismeretlen. Fiktív történeti kellék; nem fennmaradt ókori forrás.",
};
export const CONCLUSIONS = [
  {
    id: "A",
    text: "Biztosan Caesar meggyilkolását tervezik.",
    feedback:
      "A szöveg nem nevezi meg Caesart, és gyilkosságról sem beszél. A város feszültsége okot adhat aggodalomra, de a későbbi események ismeretét nem olvashatod bele egy névtelen üzenetbe. Próbáld újra: mi az, amit maga a szöveg igazol?",
  },
  {
    id: "B",
    text: "Az üzenet egy találkozóra utal, de a célja még nem bizonyított.",
    feedback:
      "Az üzenet találkozót és sürgető figyelmeztetést említ. A résztvevőkről, a célról és a szerzőről viszont nem árul el eleget. Az óvatosság indokolt, a biztos vád még nem.",
  },
  {
    id: "C",
    text: "Biztosan jelentéktelen kereskedelmi üzenet.",
    feedback:
      "Árukról vagy üzletről sincs szó, ezért a kereskedelmi magyarázatot sem nevezheted biztosnak. A jelentéktelenség ugyanolyan bizonyítatlan állítás lenne, mint egy konkrét merénylet terve. Próbáld újra, és hagyd nyitva azt, amit nem tudsz.",
  },
];
export const DELIVERY = {
  lucius:
    "Caesar támogatói felé indul el az információ. Lucius figyelmeztetésként kezeli, de a bizonytalanságot is továbbadja.",
  quintus:
    "A senatorok környezetébe kerül az információ. Quintus feljegyzi a találás helyét, és nem nevezi bizonyított tervnek az üzenetet.",
  titus:
    "A futáron keresztül próbálod továbbítani az üzenetet. Titus vállalja az utat, de nem ígéri, hogy a figyelmeztetés időben célba ér.",
};
export const QUESTS = [
  {
    id: "voices",
    title: "Róma hangjai",
    task: "Beszélj Marcusszal, Luciusszal és Quintusszal. Mindegyiküktől kérdezz legalább egyet.",
  },
  {
    id: "tablet",
    title: "Az elveszett üzenet",
    task: "Vizsgáld meg a viasztáblát a Via Sacra nyugati szélén, Quintus és Marcus között.",
  },
  {
    id: "interpretation",
    title: "Mit bizonyít az üzenet?",
    task: "A bizonyítékok paneljén különítsd el a megfigyelést a feltételezéstől.",
  },
  {
    id: "delivery",
    title: "Kinek adod át az üzenetet?",
    task: "Válassz Lucius, Quintus és Titus közül, majd személyesen add át neki az üzenetet az E billentyűvel.",
  },
];
