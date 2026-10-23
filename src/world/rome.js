import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { texture, bannerTexture, citizenTexture } from "../art/textures.js";
export function createRome(scene) {
  const colliders = [],
    interactables = [],
    flames = [];
  const mats = {};
  for (const k of [
    "stone",
    "brick",
    "marble",
    "wood",
    "ground",
    "red",
    "plaster",
  ])
    mats[k] = new T.MeshLambertMaterial({ map: texture(k) });
  mats.dark = new T.MeshLambertMaterial({ color: 0x302b23 });
  mats.roof = new T.MeshLambertMaterial({ color: 0x884936 });
  mats.gold = new T.MeshLambertMaterial({ color: 0xb99750 });
  mats.leaf = new T.MeshLambertMaterial({ color: 0x657047 });
  function box(x, y, z, w, h, d, mat = "stone", solid = false) {
    const geometry = new T.BoxGeometry(w, h, d);
    const uv = geometry.attributes.uv;
    for (let face = 0; face < 6; face++) {
      const [a, b] = face < 2 ? [d, h] : face < 4 ? [w, d] : [w, h];
      for (let v = 0; v < 4; v++) {
        const i = face * 4 + v;
        uv.setXY(i, (uv.getX(i) * a) / 2.5, (uv.getY(i) * b) / 2.5);
      }
    }
    let m = new T.Mesh(geometry, mats[mat] || mat);
    m.position.set(x, y + h / 2, z);
    m.receiveShadow = true;
    m.castShadow = h > 1;
    scene.add(m);
    if (solid) colliders.push({ x, z, w, d });
    return m;
  }
  function cylinder(x, y, z, r1, r2, h, mat = "marble", sides = 12) {
    let m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, sides), mats[mat]);
    m.position.set(x, y + h / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }
  function column(x, z, h = 6, y = 0) {
    box(x, y, z, 1.22, 0.25, 1.22, "marble");
    box(x, y + 0.25, z, 0.99, 0.22, 0.99, "marble");
    cylinder(x, y + 0.47, z, 0.35, 0.46, h - 0.95);
    box(x, y + h - 0.48, z, 0.9, 0.18, 0.9, "marble");
    box(x, y + h - 0.3, z, 1.15, 0.3, 1.15, "marble");
    colliders.push({ x, z, w: 1, d: 1 });
    for (let a = 0; a < 10; a++) {
      const ang = (a * Math.PI) / 5;
      cylinder(
        x + Math.sin(ang) * 0.365,
        y + 0.6,
        z + Math.cos(ang) * 0.365,
        0.025,
        0.035,
        h - 1.25,
        "stone",
        5,
      );
    }
  }
  function banner(x, y, z, w = 1.5, h = 3, rot = 0) {
    const m = new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshLambertMaterial({ map: bannerTexture(), side: T.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.rotation.y = rot;
    scene.add(m);
    const pole = box(x, y + h / 2 + 0.1, z, w + 0.4, 0.09, 0.1, "gold");
    pole.rotation.y = rot;
  }
  function urn(x, z, scale = 1, y = 0) {
    const pts = [
      [0, 0],
      [0.25, 0],
      [0.25, 0.1],
      [0.43, 0.35],
      [0.49, 0.8],
      [0.34, 1.15],
      [0.17, 1.3],
      [0.17, 1.49],
      [0.25, 1.52],
    ].map(([a, b]) => new T.Vector2(a * scale, b * scale));
    let m = new T.Mesh(
      new T.LatheGeometry(pts, 12),
      new T.MeshLambertMaterial({ color: 0x9b6441, map: mats.stone.map }),
    );
    m.position.set(x, y, z);
    scene.add(m);
    for (let side of [-1, 1]) {
      let handle = new T.Mesh(
        new T.TorusGeometry(0.2 * scale, 0.05 * scale, 5, 9),
        mats.roof,
      );
      handle.position.set(x + side * 0.31 * scale, y + 1.17 * scale, z);
      scene.add(handle);
    }
    colliders.push({ x, z, w: scale * 0.8, d: scale * 0.8 });
  }
  function crate(x, z, s = 1, y = 0) {
    box(x, y, z, s, s, s, "wood", true);
    for (let dy of [0.12, s - 0.14])
      box(x, y + dy, z + 0.505 * s, s + 0.04, 0.07, 0.06, "dark");
  }
  function statue(x, z, y = 0) {
    box(x, y, z, 1.9, 0.45, 1.9, "marble", true);
    box(x, y + 0.45, z, 1.35, 1.65, 1.35, "stone", true);
    box(x, y + 2.1, z, 1.6, 0.2, 1.6, "marble");
    const stone = new T.MeshLambertMaterial({
      color: 0xbdb9a0,
      map: mats.marble.map,
    });
    const torso = new T.Mesh(new T.CylinderGeometry(0.39, 0.53, 1.6, 8), stone);
    torso.scale.set(1, 1, 0.65);
    torso.position.set(x, y + 3.35, z);
    scene.add(torso);
    const head = new T.Mesh(new T.IcosahedronGeometry(0.29, 1), stone);
    head.scale.set(0.85, 1.2, 0.87);
    head.position.set(x, y + 4.45, z);
    scene.add(head);
    for (let sign of [-1, 1]) {
      const leg = new T.Mesh(new T.CylinderGeometry(0.13, 0.17, 0.8, 7), stone);
      leg.position.set(x + sign * 0.23, y + 2.7, z);
      scene.add(leg);
      const arm = new T.Mesh(
        new T.CylinderGeometry(0.12, 0.16, 1.25, 7),
        stone,
      );
      arm.position.set(x + sign * 0.55, y + 3.55, z);
      arm.rotation.z = sign * 0.25;
      scene.add(arm);
    }
    box(x, y + 4.07, z, 0.22, 0.25, 0.22, stone);
    // Carved face, hair, sandals and diagonal toga folds distinguish human statues.
    box(x, y + 4.37, z + 0.24, 0.09, 0.15, 0.12, stone);
    box(x, y + 4.25, z + 0.19, 0.16, 0.06, 0.09, stone);
    for (const sign of [-1, 1]) {
      const ear = new T.Mesh(new T.IcosahedronGeometry(0.065, 0), stone);
      ear.position.set(x + sign * 0.25, y + 4.43, z);
      scene.add(ear);
      box(x + sign * 0.1, y + 4.48, z + 0.225, 0.09, 0.035, 0.025, "stone");
      box(x + sign * 0.23, y + 2.3, z + 0.1, 0.26, 0.12, 0.5, stone);
    }
    const hair = new T.Mesh(
      new T.SphereGeometry(0.265, 9, 5, 0, Math.PI * 2, 0, Math.PI * 0.55),
      mats.stone,
    );
    hair.position.set(x, y + 4.58, z);
    scene.add(hair);
    for (let j = 0; j < 7; j++) {
      const points = [
        new T.Vector3(x - 0.33 + j * 0.085, y + 4.02, z + 0.15),
        new T.Vector3(x - 0.42 + j * 0.1, y + 3.45, z + 0.34),
        new T.Vector3(x - 0.35 + j * 0.1, y + 2.7, z + 0.31),
      ];
      const fold = new T.Mesh(
        new T.TubeGeometry(new T.CatmullRomCurve3(points), 8, 0.024, 4, false),
        j % 2 ? mats.marble : mats.stone,
      );
      scene.add(fold);
    }
    const sash = new T.Mesh(
      new T.TubeGeometry(
        new T.CatmullRomCurve3([
          new T.Vector3(x - 0.38, y + 3.93, z + 0.16),
          new T.Vector3(x - 0.12, y + 3.63, z + 0.39),
          new T.Vector3(x + 0.33, y + 3.75, z + 0.2),
        ]),
        12,
        0.1,
        6,
        false,
      ),
      stone,
    );
    scene.add(sash);
  }
  function fire(x, z) {
    cylinder(x, 0, z, 0.22, 0.4, 1.25, "dark", 8);
    cylinder(x, 1.25, z, 0.6, 0.25, 0.35, "dark", 8);
    const flame = new T.Mesh(
      new T.ConeGeometry(0.3, 0.9, 6),
      new T.MeshBasicMaterial({ color: 0xffb847 }),
    );
    flame.position.set(x, 1.95, z);
    scene.add(flame);
    flames.push(flame);
    const light = new T.PointLight(0xffa34d, 5, 7);
    light.position.set(x, 2.1, z);
    scene.add(light);
    colliders.push({ x, z, w: 1, d: 1 });
  }
  function building(x, z, w, d, h, kind = "plaster") {
    box(x, 0, z, w, h, d, kind, true);
    box(x, 0.15, z, w + 0.2, 0.3, d + 0.2, "stone");
    box(x, h - 0.65, z, w + 0.3, 0.3, d + 0.3, "marble");
    box(x, h, z, w + 0.65, 0.35, d + 0.65, "roof");
    box(x, h + 0.35, z, w + 0.8, 0.12, d + 0.8, "roof");
    const face = x < 0 ? x + w / 2 + 0.025 : x - w / 2 - 0.025;
    for (let zz = z - d / 2 + 1; zz < z + d / 2; zz += 2.5) {
      box(face, 1.15, zz, 0.12, 2.65, 1.35, "dark");
      box(face + (x < 0 ? 0.08 : -0.08), 1.1, zz, 0.12, 2.6, 1.1, "wood");
      for (let yy = 4; yy < h - 1; yy += 2.5) {
        box(face, yy, zz, 0.13, 1.3, 0.8, "dark");
        box(face, yy - 0.1, zz, 0.4, 0.12, 1.1, "marble");
      }
    }
    for (let zz = z - d / 2; zz <= z + d / 2; zz += 3) {
      box(face, 0, zz, 0.3, h, 0.3, "stone");
    }
  }
  // Three seamlessly connected districts, with long side porticoes and an open forum.
  box(0, -0.25, 0, 62, 0.25, 114, "ground");
  for (let sign of [-1, 1]) {
    box(sign * 5.4, 0, 18, 1.3, 0.2, 37, "stone");
    for (let z = 4; z <= 34; z += 8)
      building(sign * 10, z, 8, 7.8, 7.8 + (z % 3), "plaster");
    building(sign * 18, -15, 9, 33, 8, "brick");
    box(sign * 22, -0.1, 0, 2, 16, 110, "stone", true);
  }
  box(0, 0, 53, 62, 7, 2, "stone", true);
  box(0, 0, -55, 62, 10, 2, "stone", true);
  // Entrance street cornices, market awnings and inscriptions.
  for (let sign of [-1, 1]) {
    for (let z of [7, 18, 29]) {
      const awning = box(sign * 5.5, 3.55, z, 2.4, 0.13, 3.7, "red");
      awning.rotation.z = sign * 0.15;
      for (let dz of [-1.6, 1.6])
        cylinder(sign * 4.45, 0, z + dz, 0.045, 0.05, 3.5, "wood", 6);
      box(sign * 5.3, 0.5, z, 1.5, 0.85, 3, "wood", true);
      for (let j = 0; j < 6; j++) {
        const fruit = new T.Mesh(
          new T.IcosahedronGeometry(0.13, 0),
          new T.MeshLambertMaterial({ color: j % 2 ? 0xa8873e : 0x7b7736 }),
        );
        fruit.position.set(sign * 5.1, 1.5, z - 1 + j * 0.4);
        scene.add(fruit);
      }
    }
    banner(sign * 5.9, 5.5, 12, 1.7, 3.5, (sign * Math.PI) / 2);
    banner(sign * 5.9, 5.5, 28, 1.7, 3.5, (sign * Math.PI) / 2);
  }
  urn(-4.8, 25, 1.15);
  urn(5, 15, 0.8);
  urn(-4.8, 13, 0.7);
  crate(4.8, 27, 1);
  crate(5, 28.2, 0.8);
  crate(5, 27, 0.7, 1);
  urn(4.7, 4, 0.9);
  // Forum porticoes.
  for (let sign of [-1, 1]) {
    for (let z = 0; z >= -30; z -= 4.5) column(sign * 13, z, 6.5);
    box(sign * 13, 6.5, -15, 2.6, 0.65, 34, "marble");
    box(sign * 14, 7.15, -15, 5, 0.3, 35, "roof");
    box(sign * 16.6, 0, -15, 1, 6.5, 34, "plaster", true);
    for (let z of [-3, -17, -28])
      banner(sign * 12.9, 4.9, z, 1.3, 2.8, Math.PI / 2);
  }
  for (let z of [-4, -22]) for (let sign of [-1, 1]) statue(sign * 8.8, z);
  // Basilica facade, scaled temple of Saturn-inspired Republican sanctuary.
  for (let i = 0; i < 7; i++)
    box(0, i * 0.16, -34 - i * 0.48, 19 - i * 0.5, 0.16, 1.2, "marble");
  const podium = 1.12;
  box(0, 0, -42, 18, podium, 13, "stone", true);
  box(0, podium, -45, 13, 8, 7, "plaster", true);
  box(0, podium, -39.2, 5, 6, 0.15, "dark");
  for (let x of [-7, -4.2, -1.4, 1.4, 4.2, 7]) column(x, -38.1, 7.8, podium);
  for (let sign of [-1, 1])
    for (let z of [-41.4, -44.7, -48]) column(sign * 7, z, 7.8, podium);
  box(0, 8.92, -42.5, 18.5, 0.8, 13.7, "marble");
  box(0, 9.72, -42.5, 19, 0.3, 14, "marble");
  const shape = new T.Shape();
  shape.moveTo(-9.5, 0);
  shape.lineTo(9.5, 0);
  shape.lineTo(0, 3);
  shape.closePath();
  const pediment = new T.Mesh(
    new T.ExtrudeGeometry(shape, { depth: 13.8, bevelEnabled: false }),
    mats.marble,
  );
  pediment.position.set(0, 10.02, -49.4);
  scene.add(pediment);
  box(0, 10.05, -35.5, 18.8, 0.2, 0.3, "stone");
  // Relief medallions and rooftop finials.
  for (let x of [-6, -3, 0, 3, 6]) {
    const disk = new T.Mesh(new T.CircleGeometry(0.38, 10), mats.gold);
    disk.position.set(x, 9.33, -35.64);
    scene.add(disk);
  }
  statue(0, -41, 1.2);
  statue(-11, -33);
  statue(11, -33);
  fire(-10, -29);
  fire(10, -29);
  fire(4.5, 32);
  banner(-8.3, 5.4, -35.4, 1.5, 3.5);
  banner(8.3, 5.4, -35.4, 1.5, 3.5);
  // Low garden walls, Mediterranean cypresses, fountain.
  for (let sign of [-1, 1]) {
    box(sign * 18, 0, -37, 4, 0.6, 4, "marble", true);
    cylinder(sign * 18, 0.6, -37, 0.18, 0.3, 3, "wood");
    for (let i = 0; i < 3; i++) {
      const crown = new T.Mesh(
        new T.ConeGeometry(1.1 - i * 0.2, 3.6, 7),
        mats.leaf,
      );
      crown.position.set(sign * 18, 3 + i * 0.9, -37);
      scene.add(crown);
    }
  }
  cylinder(5.7, 0, -13, 1.9, 1.9, 0.55, "marble", 16);
  cylinder(5.7, 0.55, -13, 1.65, 1.65, 0.05, "dark", 16);
  const water = new T.Mesh(
    new T.CircleGeometry(1.6, 16),
    new T.MeshPhongMaterial({ color: 0x728f8c, shininess: 75 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(5.7, 0.62, -13);
  scene.add(water);
  cylinder(5.7, 0.6, -13, 0.18, 0.3, 1.8);
  cylinder(5.7, 2.3, -13, 0.9, 0.3, 0.25);
  colliders.push({ x: 5.7, z: -13, w: 4, d: 4 });
  // Scrolls and readable objects.
  function scroll(x, z) {
    const group = new T.Group();
    const body = new T.Mesh(
      new T.CylinderGeometry(0.12, 0.12, 0.65, 8),
      new T.MeshLambertMaterial({ color: 0xd8bd85 }),
    );
    body.rotation.z = Math.PI / 2;
    group.add(body);
    const ribbon = new T.Mesh(
      new T.CylinderGeometry(0.125, 0.125, 0.12, 8),
      mats.red,
    );
    ribbon.rotation.z = Math.PI / 2;
    group.add(ribbon);
    group.position.set(x, 0.3, z);
    scene.add(group);
    interactables.push({
      x,
      z,
      type: "scroll",
      label: "Tekercs felvétele",
      mesh: group,
    });
  }
  scroll(0.9, 26);
  scroll(-7, -12);
  scroll(7, -31);
  const citizens = [
    [
      -1,
      19,
      "senator",
      "A szenátor: „A szenátus ma Pompeius kúriájában ülésezik.”",
    ],
    [
      4,
      9,
      "merchant",
      "A kereskedő: „Olaj, bor és friss füge! Nézz körül a Forumon!”",
    ],
    [-3, -8, "soldier", "Az őr: „Tartsd szabadon a szent utat, polgár!”"],
    [-8, -20, "senator", "A polgár: „Különös csend van ma reggel Rómában.”"],
    [
      9,
      -8,
      "merchant",
      "A kereskedő: „A templomnál is találsz egy tekercset.”",
    ],
    [3, 2, "senator", "A polgár: „Salve, amice!”"],
    [-4, 31, "merchant", "A polgár: „Üdvözöllek a Via Sacrán!”"],
  ];
  for (const [x, z, role, message] of citizens) {
    const sprite = new T.Sprite(
      new T.SpriteMaterial({ map: citizenTexture(role), alphaTest: 0.5 }),
    );
    sprite.scale.set(1.5, 3, 1);
    sprite.position.set(x, 1.5, z);
    scene.add(sprite);
    colliders.push({ x, z, w: 0.65, d: 0.65 });
    interactables.push({
      x,
      z,
      type: "npc",
      label: "Megszólítás",
      message,
      mesh: sprite,
    });
  }
  const plaque = box(-3, 1.5, -35.3, 2, 0.8, 0.1, "gold");
  interactables.push({
    x: -3,
    z: -34,
    type: "inscription",
    label: "Felirat megvizsgálása",
    message: "SENATUS POPULUSQUE ROMANUS · A szenátus és a római nép.",
    mesh: plaque,
  });
  // Batch static geometry by material to keep the Roman colonnades affordable.
  const dynamic = new Set(flames);
  for (const o of interactables)
    if (o.type === "scroll") o.mesh.traverse((m) => dynamic.add(m));
  const batches = new Map();
  scene.updateMatrixWorld(true);
  scene.traverse((m) => {
    if (!m.isMesh || dynamic.has(m)) return;
    const key = m.material.uuid + "-" + m.castShadow;
    let b = batches.get(key);
    if (!b) {
      b = {
        material: m.material,
        shadow: m.castShadow,
        geometries: [],
        objects: [],
      };
      batches.set(key, b);
    }
    // Extruded pediments and icosahedra are not indexed; normalize every
    // source before merging them with indexed boxes, cylinders and tubes.
    const geometry = m.geometry.index
      ? m.geometry.toNonIndexed()
      : m.geometry.clone();
    b.geometries.push(geometry.applyMatrix4(m.matrixWorld));
    b.objects.push(m);
  });
  for (const b of batches.values()) {
    const geometry = mergeGeometries(b.geometries, false);
    if (!geometry) continue;
    const m = new T.Mesh(geometry, b.material);
    m.castShadow = b.shadow;
    m.receiveShadow = true;
    scene.add(m);
    for (const o of b.objects) {
      scene.remove(o);
      o.geometry.dispose();
    }
    for (const g of b.geometries) g.dispose();
  }
  return { colliders, interactables, flames };
}
