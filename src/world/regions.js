export const REGIONS = {
  rome: {
    name: "Via Sacra és Forum",
    short: "ROMA",
    bounds: { minX: -21, maxX: 21, minZ: -53, maxZ: 50 },
    spawn: { x: 0, z: 33, yaw: 0, pitch: 0 },
    description: "Politikai találkozások a Forumon és a Via Sacrán.",
  },
  subura: {
    name: "Subura sikátorai",
    short: "SVBVRA",
    bounds: { minX: -19, maxX: 19, minZ: -31, maxZ: 31 },
    spawn: { x: 0, z: 25, yaw: 0, pitch: 0 },
    description: "Kövesd a futárt a műhelyek és a lakóházak között.",
  },
  boarium: {
    name: "Forum Boarium és Tiberis-part",
    short: "FORVM BOARIVM",
    bounds: { minX: -27, maxX: 27, minZ: -27, maxZ: 27 },
    spawn: { x: 0, z: 21, yaw: 0, pitch: 0 },
    description: "Piac, raktár és rakodóhely a folyó mellett.",
  },
  domus: {
    name: "Palatinusi ház és kert",
    short: "DOMVS PALATINA",
    bounds: { minX: -23, maxX: 23, minZ: -27, maxZ: 27 },
    spawn: { x: 0, z: 22, yaw: 0, pitch: 0 },
    description: "Lépj be egy köztársaság kori magánház udvarára.",
  },
  campus: {
    name: "Pompeius porticusa és curiája",
    short: "PORTICVS POMPEI",
    bounds: { minX: -21, maxX: 21, minZ: -53, maxZ: 50 },
    spawn: { x: 0, z: 33, yaw: 0, pitch: 0 },
    description: "A senatus ülése és a történet befejezése.",
  },
};
export const REGION_IDS = Object.keys(REGIONS);
export const CITY_STOPS = {
  courier: { region: "subura", x: 0, z: 16, name: "Faustus, a futár" },
  seal: { region: "subura", x: -8, z: -18, name: "A műhely pecsétje" },
  manifest: { region: "boarium", x: 8, z: 3, name: "A raktár jegyzéke" },
  cargo: { region: "boarium", x: -11, z: -11, name: "A rakomány jelzése" },
  witness: { region: "boarium", x: 2, z: -14, name: "Doria, a rakodómunkás" },
  doorkeeper: { region: "domus", x: 4, z: 8, name: "Felix, a kapuőr" },
  host: { region: "domus", x: 5, z: -15, name: "Claudia, a közvetítő" },
};
export function validPosition(p, id) {
  const b = REGIONS[id]?.bounds;
  return (
    !!b &&
    [p?.x, p?.z, p?.yaw, p?.pitch].every(Number.isFinite) &&
    p.x > b.minX &&
    p.x < b.maxX &&
    p.z > b.minZ &&
    p.z < b.maxZ
  );
}
export function cleanPosition(p, id) {
  if (!validPosition(p, id)) return { ...REGIONS[id].spawn, region: id };
  return {
    x: p.x,
    z: p.z,
    yaw: ((p.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2),
    pitch: Math.max(-1.1, Math.min(1.1, p.pitch)),
    region: id,
  };
}
