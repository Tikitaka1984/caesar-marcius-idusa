import * as THREE from "three";
let seed = 449;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
export function texture(kind) {
  if (kind === "ground" && pavement) return pavement;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const palette = {
    stone: [155, 143, 119],
    brick: [142, 85, 60],
    marble: [193, 185, 159],
    wood: [92, 61, 37],
    ground: [113, 108, 92],
    red: [111, 29, 29],
    plaster: [184, 161, 121],
  };
  const base = palette[kind] || palette.stone;
  g.fillStyle = `rgb(${base})`;
  g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y++)
    for (let x = 0; x < 128; x++) {
      const n = (rand() - 0.5) * 34;
      g.fillStyle = `rgba(${base.map((v) => Math.max(0, v + n)).join(",")},.65)`;
      g.fillRect(x, y, 1, 1);
    }
  if (["stone", "brick", "ground"].includes(kind)) {
    const h = kind === "ground" ? 25 : 16;
    for (let y = 0; y < 128; y += h) {
      g.fillStyle = "#302b235c";
      g.fillRect(0, y, 128, 2);
      for (
        let x = ((y / h) % 2) * -22;
        x < 128;
        x += kind === "ground" ? 36 : 43
      ) {
        g.fillRect(x, y, 2, h);
        g.fillStyle = "#eee0bc30";
        g.fillRect(x + 2, y + 2, 35, 1);
        g.fillStyle = "#302b235c";
      }
    }
  }
  if (kind === "wood") {
    for (let i = 0; i < 18; i++) {
      g.fillStyle = "#25170c55";
      g.fillRect(rand() * 128, 0, 1 + rand() * 2, 128);
    }
    g.fillRect(0, 28, 128, 5);
    g.fillRect(0, 98, 128, 5);
  }
  if (kind === "marble") {
    for (let i = 0; i < 12; i++) {
      g.strokeStyle = "#746f5b28";
      g.beginPath();
      g.moveTo(rand() * 128, 0);
      g.lineTo(rand() * 128, 128);
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipmapNearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function bannerTexture(text = "SPQR") {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 192;
  const g = c.getContext("2d");
  g.fillStyle = "#761f24";
  g.fillRect(0, 0, 128, 192);
  for (let x = 0; x < 128; x++) {
    g.fillStyle = `rgba(0,0,0,${0.12 + 0.12 * Math.sin(x / 7)})`;
    g.fillRect(x, 0, 1, 192);
  }
  g.strokeStyle = "#ba934e";
  g.lineWidth = 3;
  g.strokeRect(9, 8, 110, 174);
  g.textAlign = "center";
  g.fillStyle = "#c7a35e";
  g.font = "24px Georgia";
  g.fillText(text, 64, 104);
  g.font = "45px Georgia";
  g.fillText("❧", 64, 69);
  g.fillText("❧", 64, 155);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function proceduralCitizenTexture(role) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  const skin = "#bd9470",
    dark = "#433225",
    cloth =
      role === "soldier"
        ? "#8a3530"
        : role === "merchant"
          ? "#b99861"
          : "#ded6bb";
  function poly(points, color) {
    g.fillStyle = color;
    g.beginPath();
    points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  }
  poly(
    [
      [25, 8],
      [37, 8],
      [43, 17],
      [40, 34],
      [35, 39],
      [24, 33],
      [21, 19],
    ],
    skin,
  );
  poly(
    [
      [21, 20],
      [22, 9],
      [30, 5],
      [39, 8],
      [44, 18],
      [38, 17],
      [35, 12],
      [26, 15],
      [25, 23],
    ],
    "#29251e",
  );
  g.fillStyle = "#35291e";
  g.fillRect(28, 21, 3, 2);
  g.fillRect(37, 21, 3, 2);
  g.fillStyle = "#8a5e43";
  g.fillRect(33, 23, 2, 6);
  g.fillRect(30, 31, 7, 1);
  poly(
    [
      [23, 36],
      [38, 36],
      [46, 44],
      [49, 78],
      [42, 85],
      [42, 110],
      [21, 111],
      [19, 78],
      [12, 77],
      [15, 47],
    ],
    cloth,
  );
  poly(
    [
      [15, 46],
      [20, 49],
      [18, 73],
      [21, 83],
      [16, 88],
      [11, 81],
      [12, 62],
    ],
    skin,
  );
  poly(
    [
      [41, 46],
      [46, 47],
      [48, 72],
      [43, 79],
      [38, 70],
      [31, 61],
      [33, 57],
      [41, 63],
    ],
    skin,
  );
  for (let i = 0; i < 6; i++)
    poly(
      [
        [23 + i * 3, 47],
        [25 + i * 3, 55],
        [23 + i * 3, 106],
        [20 + i * 3, 107],
      ],
      i % 2 ? "#ffffff18" : "#332c241f",
    );
  if (role === "senator") {
    poly(
      [
        [40, 37],
        [46, 43],
        [39, 76],
        [40, 108],
        [31, 110],
        [30, 74],
        [22, 63],
      ],
      "#822e2d",
    );
    poly(
      [
        [24, 62],
        [40, 50],
        [42, 57],
        [27, 70],
      ],
      "#9c3c32",
    );
  }
  if (role === "soldier") {
    poly(
      [
        [23, 38],
        [39, 38],
        [43, 66],
        [20, 66],
      ],
      "#806f54",
    );
    g.fillStyle = "#c1a166";
    for (let y = 43; y < 65; y += 5) g.fillRect(22, y, 18, 2);
    g.fillStyle = "#928673";
    g.fillRect(22, 10, 20, 9);
    g.fillStyle = "#9d3328";
    g.fillRect(28, 2, 8, 8);
  }
  poly(
    [
      [22, 109],
      [29, 109],
      [28, 123],
      [18, 123],
      [17, 120],
    ],
    skin,
  );
  poly(
    [
      [35, 109],
      [41, 109],
      [43, 120],
      [47, 122],
      [45, 125],
      [35, 124],
    ],
    skin,
  );
  g.fillStyle = dark;
  g.fillRect(17, 122, 12, 4);
  g.fillRect(35, 123, 13, 3);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let citizenAtlas, pavement;
export async function loadArt() {
  const loader = new THREE.TextureLoader();
  [citizenAtlas, pavement] = await Promise.all([
    loader.loadAsync(`${import.meta.env.BASE_URL}assets/roman-citizens.png`),
    loader.loadAsync(`${import.meta.env.BASE_URL}assets/roman-pavement.png`),
  ]);
  pavement.colorSpace = THREE.SRGBColorSpace;
  pavement.wrapS = pavement.wrapT = THREE.RepeatWrapping;
  pavement.magFilter = THREE.NearestFilter;
  pavement.minFilter = THREE.NearestMipmapNearestFilter;
  citizenAtlas.colorSpace = THREE.SRGBColorSpace;
}
export function citizenTexture(role) {
  if (!citizenAtlas) return proceduralCitizenTexture(role);
  const t = citizenAtlas.clone();
  t.repeat.set(1 / 3, 1);
  t.offset.set(({ senator: 0, merchant: 1, soldier: 2 }[role] || 0) / 3, 0);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipmapNearestFilter;
  t.needsUpdate = true;
  return t;
}
