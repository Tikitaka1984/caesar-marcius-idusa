// Chapter II content: facts, interpretations and gameplay fiction are explicit.
export const TITLE = "II. fejezet – A köztársaság árnyéka";
export const BRANCHES = {
  lucius: {
    guide: "veteran",
    name: "Decimus",
    role: "veterán közvetítő",
    x: -5,
    z: -5,
    opening:
      "Lucius elmondta, hogy a bizonytalanságot is továbbadtad. Caesar katonái között ezért meghallgatnak. A senatorok írnoka viszont előbb mindkét oldal érveit kéri tőled.",
    step: "veteran",
    detail:
      "Gallia győzelmei, a közös szolgálat és a földjuttatás reménye személyes hűséget is teremtett. Ez kapcsolat, nem minden veteránra érvényes politikai vélemény.",
  },
  quintus: {
    guide: "assistant",
    name: "Servius",
    role: "senatorsegéd",
    x: -5,
    z: -15,
    opening:
      "Quintus feljegyezte, honnan származott az üzeneted. Megmutatom a rendkívüli hatalomról készült feljegyzést. Publius a diadémról szóló irat előtt a katonák szempontját is hallani szeretné.",
    step: "senate",
    detail:
      "A dictator hagyományosan rendkívüli feladatra kapott hatalmat. Az élethosszig tartó cím az időbeli korlátozást bontja meg. E feljegyzés modern játékbeli rekonstrukció.",
  },
  titus: {
    guide: "courier",
    name: "Livia",
    role: "futárhálózati közvetítő",
    x: 2,
    z: -4,
    opening:
      "Titus szerint nem nevezted bizonyosságnak a pletykát. Egyik politikai kör sem tekint szövetségesének. A futárút jegyzékét a Forum keleti szélén vizsgáld meg: ez ad hozzáférést az iratokhoz.",
    step: "courier",
    detail:
      "A másolatok útját ellenőrizheted a futárjegyzékkel. A kézbesítés ténye nem jelenti azt, hogy a futár egyetért a tartalommal.",
  },
};
export const POLITICIANS = {
  publius: {
    name: "Publius",
    role: "Caesar támogatója",
    x: 9,
    z: -8,
    opening:
      "Én a rendet remélem Caesartól. Kérdezz, de ne tekints minden támogatót vak követőnek.",
    questions: [
      [
        "war",
        "Mit hagytak maguk után a polgárháborúk?",
        "Az egymás ellen forduló római hadseregek megtörték a biztonságot. Családok szakadtak szét, a kereskedelem és a hitel is megsínylette a harcot. A győztes Caesar sokak számára a háború lezárásának reményét jelenti, bár a béke tartósságát még nem tudhatjuk.",
      ],
      [
        "order",
        "Miért fontosabb számodra a stabilitás?",
        "A törvények akkor érnek valamit a piacon, ha holnap is van áru és biztonságos út. Caesar adósságokat rendező intézkedései és telepítései sokaknak kínálnak kiutat. Ettől még jogos megkérdezni, ki szab határt a hatalmának; a rend iránti igény nem oldja meg automatikusan az intézmények válságát.",
      ],
      [
        "victory",
        "Mit jelentenek Caesar katonai sikerei?",
        "Gallia meghódítása tekintélyt, zsákmányt és személyes kapcsolatokat hozott neki. A sikert sokan rátermettségnek látják. A hadjáratok ugyanakkor pusztítással jártak; a győzelem nem önmagában bizonyíték arra, hogy egyetlen ember korlátlanul kormányozhat.",
      ],
      [
        "veterans",
        "Miért bíznak benne a veteránok?",
        "A közös hadjáratok, a jutalmak és a föld reménye erősítik a hadvezérhez fűződő hűséget. A leszerelt katonának megélhetés kell. A katonák sem egyformák: a személyes hála mellett lehetnek kétségeik a köztársaság jövőjéről is.",
      ],
    ],
  },
  aulus: {
    name: "Aulus",
    role: "köztársaságpárti senator",
    x: -8,
    z: -20,
    opening:
      "A közös ügy nem lehet egyetlen ember tulajdona. De attól, hogy vitatom Caesar hatalmát, még nem beszélek erőszakos tervről.",
    questions: [
      [
        "senate",
        "Mi a senatus hagyományos szerepe?",
        "A senatus nagy tekintélyű tanács: a külügyekben, pénzügyekben és a magistratusok munkájában meghatározó. Nem modern parlament, és a népgyűléseknek is saját szerepük van. Ha minden döntés egyetlen ember jóváhagyásától függ, a tanácskozás súlya elvész.",
      ],
      [
        "offices",
        "Miért számítanak a magistratusok?",
        "A consulok és más tisztségviselők hatalmát időbeli korlátok, társak és szokások ellensúlyozzák. A rendszer nem volt egyenlő vagy hibátlan, és a versengés sokszor erőszakba fordult. Mégis fontos, hogy a hivatal és a személy ne váljon végleg elválaszthatatlanná.",
      ],
      [
        "dictator",
        "Miért veszélyes a rendkívüli személyes hatalom?",
        "A dictatura köztársasági rendkívüli tisztség volt; Caesar élethosszig tartó címe azonban eltávolodik a rövid megbízatás hagyományától. A kegyelem és a reform is függővé teheti az embereket az adományozótól. A jó szándék nem helyettesíti a hatalom ellenőrzését.",
      ],
      [
        "king",
        "Bizonyítja a diadém, hogy király akart lenni?",
        "Antonius a Lupercalián diadémot ajánlott fel, Caesar pedig visszautasította. Rómában a királyság emléke politikailag terhelt. Van, aki próbának, más őszinte visszautasításnak értelmezi a jelenetet. A szándékot az esemény önmagában nem bizonyítja, és a királyságtól való félelem sem bizonyít merényletet.",
      ],
    ],
  },
};
export const DOCUMENTS = [
  {
    id: "power",
    x: -6,
    z: -17,
    title: "A rendkívüli hatalom",
    text: "Caesar Kr. e. 44-ben dictator perpetuo, élethosszig tartó dictator lett. A cím a rendkívüli személyes hatalom tartósságát jelezte.",
    provenance:
      "Modern történeti összefoglaló játékbeli táblán. A tény ókori forrásokkal alátámasztott; ez a tárgy nem fennmaradt ókori irat.",
  },
  {
    id: "diadem",
    x: 8,
    z: -18,
    title: "A diadém ügye",
    text: "A Kr. e. 44. februári Lupercalián Antonius diadémot ajánlott Caesarnak, aki azt nyilvánosan visszautasította. Hogy a jelenet próba, politikai színjáték vagy őszinte elutasítás volt-e, értelmezési kérdés.",
    provenance:
      "Modern összefoglaló; Cicero, Plutarchos és Suetonius beszámolói eltérő nézőpontból őrzik az eseményt.",
  },
  {
    id: "secret",
    x: 1,
    z: -25,
    title: "A titkos feljegyzés",
    text: "„A zárt megbeszélés résztvevői a színházhoz tartozó tanácsterem környékén keressék a közvetítőt. Ne keverjék össze a nyilvános vitát a magánüggyel.”",
    provenance:
      "FIKTÍV játékbeli üzenet, ismeretlen szerzővel és céllal. Nem fennmaradt ókori dokumentum, nem bizonyítja konkrét személyek merényleti szándékát.",
  },
];
export const CLAIMS = [
  {
    id: "title",
    text: "Caesar élethosszig tartó dictatori címet kapott.",
    category: "fact",
    explanation:
      "A dictator perpetuo cím történelmileg alátámasztott (Suetonius, Caesar 76).",
  },
  {
    id: "refusal",
    text: "Caesar visszautasította Antonius diadémját a Lupercalián.",
    category: "fact",
    explanation:
      "Az ajánlatot és az elutasítást több ókori beszámoló rögzíti; a politikai jelentésük ettől külön kérdés.",
  },
  {
    id: "intent",
    text: "A diadém visszautasítása biztosan előre megrendezett királysági próba volt.",
    category: "interpretation",
    explanation:
      "A szereplők szándéka vitatott; a nyilvános esemény nem teszi ezt bizonyossá.",
  },
  {
    id: "note",
    text: "A talált titkos feljegyzés zárt találkozót említ.",
    category: "fiction",
    explanation:
      "Ez a játék számára írt üzenet: játékmeneti nyom, nem történeti forrás.",
  },
  {
    id: "opposition",
    text: "Minden Caesar-ellenes senator merénylő volt.",
    category: "interpretation",
    explanation:
      "Bizonyítatlan és hibás általánosítás. A politikai ellenzékiség nem igazolja a részvételt az összeesküvésben.",
  },
];
export const CATEGORIES = {
  fact: "Történelmileg alátámasztott tény",
  interpretation: "Történeti értelmezés vagy vitatott állítás",
  fiction: "Fiktív, játékbeli információ",
};
export const FINAL_CHOICES = {
  warn: "Caesar környezetét próbálom figyelmeztetni.",
  investigate: "További bizonyítékot keresek az összeesküvők személyéről.",
  locate:
    "Kiderítem a senatus ülésének pontos helyszínét és a találkozó időpontját.",
};
export const INFORMANT = {
  id: "informant",
  name: "Naso",
  role: "fiktív informátor",
  x: -4,
  z: -27,
};
export const LEDGER = {
  id: "ledger",
  x: 10,
  z: -5,
  title: "A futárút jegyzéke",
};
export function freshChapter2() {
  return {
    introduced: false,
    access: null,
    answers: { publius: [], aulus: [] },
    documents: [],
    politicalConclusion: null,
    classification: {},
    comparisonComplete: false,
    distinction: null,
    informed: false,
    decision: null,
    attempts: 0,
  };
}
export function chapter2Quests(s) {
  const c = s.chapter2,
    b = BRANCHES[s.decisions.messageRecipient];
  const done = [
    c.introduced,
    !!c.politicalConclusion,
    c.comparisonComplete,
    !!c.decision,
  ];
  const tasks = [
    `Derítsd ki, kinek a segítségére számíthatsz a Forumon! Keresd: ${b?.name || "a közvetítő"} (${b?.x}, ${b?.z}).`,
    "Ismerd meg Publius és Aulus mind a négy érvét, majd a J naplóban fogalmazz meg következtetést.",
    `Vizsgáld meg a három iratot! ${c.documents.length}/3. Hozzáférés: ${c.access ? "megnyitva" : s.decisions.messageRecipient === "titus" ? "futárjegyzék a keleti szélen (10, −5)" : "a másik oldal négy érdemi válasza szükséges"}. A B panelen vesd össze őket.`,
    "A politikai elégedetlenség nem bizonyít konkrét merényletet. A B panelen mérlegelj, majd keresd Nasót (−4, −27), és dönts.",
  ];
  let unlocked = true;
  return [
    "Politikai szövetségesek",
    "A köztársaság mérlegen",
    "A senatorok iratai",
    "A titkos találkozó",
  ].map((title, i) => {
    const status = unlocked ? (done[i] ? "complete" : "active") : "locked";
    unlocked = unlocked && done[i];
    return {
      id: ["allies", "politics", "documents", "meeting"][i],
      title,
      task: tasks[i],
      status,
      progress: i === 2 ? `${c.documents.length}/3` : done[i] ? "1/1" : "0/1",
    };
  });
}
export function activeChapter2(s) {
  return s.chapterComplete && s.nextChapterReady;
}
export function normalizeChapter2(raw, recipient) {
  const c = freshChapter2();
  if (!raw || typeof raw !== "object" || !BRANCHES[recipient]) return c;
  c.introduced = raw.introduced === true;
  for (const id of Object.keys(POLITICIANS))
    c.answers[id] = [
      ...new Set(Array.isArray(raw.answers?.[id]) ? raw.answers[id] : []),
    ].filter((q) => POLITICIANS[id].questions.some((v) => v[0] === q));
  if (c.introduced && raw.access === BRANCHES[recipient].step)
    c.access = raw.access;
  if (
    c.introduced &&
    Object.values(c.answers).every((a) => a.length === 4) &&
    raw.politicalConclusion === "balanced"
  )
    c.politicalConclusion = "balanced";
  if (c.introduced)
    c.documents = DOCUMENTS.filter(
      (d) => Array.isArray(raw.documents) && raw.documents.includes(d.id),
    ).map((d) => d.id);
  if (c.politicalConclusion && c.documents.length === 3) {
    for (const q of CLAIMS)
      if (Object.keys(CATEGORIES).includes(raw.classification?.[q.id]))
        c.classification[q.id] = raw.classification[q.id];
    c.comparisonComplete = CLAIMS.every(
      (q) => c.classification[q.id] === q.category,
    );
  }
  if (c.comparisonComplete && raw.distinction === "limited")
    c.distinction = "limited";
  c.informed = !!c.distinction && raw.informed === true;
  if (c.informed && Object.hasOwn(FINAL_CHOICES, raw.decision))
    c.decision = raw.decision;
  c.attempts = Number.isInteger(raw.attempts)
    ? Math.max(0, Math.min(raw.attempts, 10000))
    : 0;
  return c;
}
export function installChapter2(Store) {
  Object.assign(Store.prototype, {
    introduce2(id) {
      const s = this.state,
        b = BRANCHES[s.decisions.messageRecipient];
      if (!activeChapter2(s) || b?.guide !== id) return false;
      if (!s.chapter2.introduced) {
        s.chapter2.introduced = true;
        if (b.step !== "courier") s.chapter2.access = b.step;
        this.changed();
      }
      return true;
    },
    ask2(id, qid) {
      const s = this.state,
        c = s.chapter2,
        q = POLITICIANS[id]?.questions.find((q) => q[0] === qid);
      if (!activeChapter2(s) || !c.introduced || !q) return null;
      if (!c.answers[id].includes(qid)) {
        c.answers[id].push(qid);
        this.changed();
      }
      return q[2];
    },
    access2() {
      const s = this.state,
        c = s.chapter2;
      if (!activeChapter2(s) || !c.introduced) return false;
      const r = s.decisions.messageRecipient;
      if (r === "titus") c.access = "courier";
      else if (c.answers[r === "lucius" ? "aulus" : "publius"].length < 4)
        return false;
      this.changed();
      return true;
    },
    politics2(choice) {
      const c = this.state.chapter2;
      if (
        !activeChapter2(this.state) ||
        !c.introduced ||
        !Object.values(c.answers).every((a) => a.length === 4)
      )
        return false;
      c.attempts++;
      if (choice === "balanced") c.politicalConclusion = choice;
      this.changed();
      return !!c.politicalConclusion;
    },
    document2(id) {
      const s = this.state,
        c = s.chapter2;
      if (
        !activeChapter2(s) ||
        !c.introduced ||
        !DOCUMENTS.some((d) => d.id === id)
      )
        return false;
      const r = s.decisions.messageRecipient;
      if (r === "titus" && !c.access) return false;
      if (r === "lucius" && id === "power" && c.answers.aulus.length < 4)
        return false;
      if (r === "quintus" && id === "diadem" && c.answers.publius.length < 4)
        return false;
      if (!c.documents.includes(id)) {
        c.documents.push(id);
        this.changed();
      }
      return true;
    },
    compare2(answers) {
      const c = this.state.chapter2;
      if (c.comparisonComplete) return true;
      if (
        !activeChapter2(this.state) ||
        !c.politicalConclusion ||
        c.documents.length !== 3
      )
        return false;
      for (const q of CLAIMS)
        if (Object.hasOwn(CATEGORIES, answers?.[q.id]))
          c.classification[q.id] = answers[q.id];
      c.attempts++;
      c.comparisonComplete = CLAIMS.every(
        (q) => c.classification[q.id] === q.category,
      );
      this.changed();
      return c.comparisonComplete;
    },
    distinguish2(choice) {
      const c = this.state.chapter2;
      if (!activeChapter2(this.state) || !c.comparisonComplete) return false;
      c.attempts++;
      if (choice === "limited") c.distinction = choice;
      this.changed();
      return !!c.distinction;
    },
    inform2() {
      const c = this.state.chapter2;
      if (!activeChapter2(this.state) || !c.distinction) return false;
      c.informed = true;
      this.changed();
      return true;
    },
    finish2(choice) {
      const c = this.state.chapter2;
      if (
        !activeChapter2(this.state) ||
        !c.informed ||
        c.decision ||
        !Object.hasOwn(FINAL_CHOICES, choice)
      )
        return false;
      c.decision = choice;
      this.changed();
      return true;
    },
  });
}
