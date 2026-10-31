import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { texture, citizenTexture, bannerTexture } from "../art/textures.js";
import {
  GUIDE3,
  ROUTES3,
  RECORDS3,
  GATE3,
  DESK3,
  TRAVEL3,
} from "../story/chapter3.js";
export function addCampusTravel(scene, world) {
  const sign = new T.Mesh(
    new T.BoxGeometry(0.8, 1.1, 0.18),
    new T.MeshLambertMaterial({ color: 0xc5ad7d }),
  );
  sign.position.set(TRAVEL3.x, 0.65, TRAVEL3.z);
  scene.add(sign);
  world.interactables.push({
    ...TRAVEL3,
    type: "travel3",
    label: TRAVEL3.name,
    mesh: sign,
  });
}
export function createCampus(scene) {
  const root = new T.Group();
  root.name = "Pompeius porticus and curia";
  scene.add(root);
  const colliders = [],
    interactables = [],
    flames = [],
    crowd = [];
  const mats = {};
  for (const name of [
    "stone",
    "marble",
    "ground",
    "wood",
    "plaster",
    "red",
    "brick",
  ])
    mats[name] = new T.MeshLambertMaterial({ map: texture(name) });
  mats.roof = new T.MeshLambertMaterial({ color: 0x93533b });
  mats.gold = new T.MeshLambertMaterial({ color: 0xb99655 });
  mats.leaf = new T.MeshLambertMaterial({ color: 0x5d7042 });
  mats.dark = new T.MeshLambertMaterial({ color: 0x342c23 });
  function box(x, y, z, w, h, d, kind = "stone", solid = false) {
    const geo = new T.BoxGeometry(w, h, d),
      uv = geo.attributes.uv;
    for (let f = 0; f < 6; f++) {
      const [a, b] = f < 2 ? [d, h] : f < 4 ? [w, d] : [w, h];
      for (let j = 0; j < 4; j++) {
        const i = f * 4 + j;
        uv.setXY(i, (uv.getX(i) * a) / 2.5, (uv.getY(i) * b) / 2.5);
      }
    }
    const m = new T.Mesh(geo, mats[kind]);
    m.position.set(x, y + h / 2, z);
    m.castShadow = h > 1;
    m.receiveShadow = true;
    root.add(m);
    if (solid) colliders.push({ x, z, w, d });
    return m;
  }
  function cylinder(x, y, z, r1, r2, h, kind = "marble") {
    const m = new T.Mesh(new T.CylinderGeometry(r1, r2, h, 12), mats[kind]);
    m.position.set(x, y + h / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    root.add(m);
    return m;
  }
  function column(x, z, h = 6) {
    box(x, 0, z, 1.1, 0.25, 1.1, "marble");
    cylinder(x, 0.25, z, 0.32, 0.43, h - 0.6);
    box(x, h - 0.35, z, 1.1, 0.35, 1.1, "marble");
    colliders.push({ x, z, w: 0.9, d: 0.9 });
  }
  function person(id, n, role = "merchant") {
    const m = new T.Sprite(
      new T.SpriteMaterial({ map: citizenTexture(role), alphaTest: 0.5 }),
    );
    m.scale.set(1.5, 3, 1);
    m.position.set(n.x, 1.5, n.z);
    root.add(m);
    colliders.push({ x: n.x, z: n.z, w: 0.65, d: 0.65 });
    interactables.push({
      ...n,
      id,
      type: id === GUIDE3.id ? "guide3" : "route3",
      label: n.name + " megszólítása",
      mesh: m,
      route: Object.entries(ROUTES3).find(([, r]) => r.id === id)?.[0],
    });
  }
  box(0, -0.2, 0, 44, 0.2, 108, "ground");
  box(-21, 0, 0, 1, 9, 108, "plaster", true);
  box(21, 0, 0, 1, 9, 108, "plaster", true);
  box(0, 0, 49, 44, 6, 2, "brick", true);
  box(0, 0, -52, 44, 9, 2, "stone", true);
  for (const side of [-1, 1]) {
    box(side * 17, 0, 0, 5, 7, 84, "plaster", true);
    box(side * 13, 0, 3, 2, 0.2, 76, "marble");
    for (let z = 37; z >= -27; z -= 5) column(side * 13, z, 6);
    box(side * 14, 6, 4, 5, 0.65, 72, "marble");
    box(side * 14, 6.65, 4, 5.6, 0.35, 73, "roof");
    for (let z of [29, 9, -13]) {
      const banner = new T.Mesh(
        new T.PlaneGeometry(1.4, 2.7),
        new T.MeshLambertMaterial({ map: bannerTexture(), side: T.DoubleSide }),
      );
      banner.position.set(side * 12.8, 4.8, z);
      banner.rotation.y = Math.PI / 2;
      root.add(banner);
    }
    for (let z of [21, -1]) {
      box(side * 9, 0, z, 2, 0.65, 2, "marble", true);
      cylinder(side * 9, 0.65, z, 0.18, 0.25, 2.4, "wood");
      const tree = new T.Mesh(new T.ConeGeometry(0.95, 4.8, 8), mats.leaf);
      tree.position.set(side * 9, 4, z);
      root.add(tree);
    }
  }
  // A Republican meeting hall, with a rectangular facade rather than a temple pediment.
  box(-9.5, 0, -37, 1, 8, 18, "stone", true);
  box(9.5, 0, -37, 1, 8, 18, "stone", true);
  box(0, 0, -45, 20, 8, 1, "plaster", true);
  box(-6, 0, -28, 7, 7.5, 0.7, "plaster", true);
  box(6, 0, -28, 7, 7.5, 0.7, "plaster", true);
  box(0, 7.5, -36.5, 21, 0.7, 19.5, "marble");
  box(0, 8.2, -36.5, 21.6, 0.4, 20, "roof");
  box(0, 6.3, -27.5, 19, 0.6, 0.5, "red");
  for (const x of [-8, -4, 4, 8]) column(x, -26, 6.1);
  box(0, 0, -36, 18, 0.15, 17, "marble");
  for (const side of [-1, 1])
    for (const z of [-32, -36, -40]) {
      box(side * 4.8, 0.15, z, 4.8, 0.5, 0.75, "wood", true);
      box(side * 7.5, 1.3, z, 0.2, 2.5, 3.2, "red");
    }
  box(0, 0.15, -42, 7, 0.35, 2, "marble");
  box(0, 0.5, -42, 2.4, 0.8, 0.8, "wood", true);
  for (const side of [-1, 1])
    for (let i = 0; i < 3; i++) {
      const m = new T.Sprite(
        new T.SpriteMaterial({
          map: citizenTexture("senator"),
          alphaTest: 0.5,
        }),
      );
      m.scale.set(1.2, 2.5, 1);
      m.position.set(side * 5.2, 1.4, -32 - i * 3);
      root.add(m);
      crowd.push(m);
    }
  person(GUIDE3.id, GUIDE3, "senator");
  for (const r of Object.values(ROUTES3))
    person(r.id, r, r.id === "rufus" ? "merchant" : "senator");
  for (const r of RECORDS3) {
    box(r.x, 0, r.z, 1.2, 0.7, 0.65, "stone", true);
    box(r.x, 0.7, r.z, 0.85, 0.06, 0.5, "wood");
    interactables.push({
      ...r,
      type: "record3",
      label: r.title + " megvizsgálása",
    });
  }
  box(DESK3.x, 0, DESK3.z, 1.6, 0.8, 0.7, "wood", true);
  box(DESK3.x, 0.8, DESK3.z, 1.2, 0.025, 0.5, "marble");
  interactables.push({ ...DESK3, type: "account3", label: DESK3.name });
  interactables.push({
    ...GATE3,
    type: "event3",
    label: "Az ülés eseményeinek követése",
  });
  box(0, 0, 40, 0.9, 1.1, 0.2, "stone");
  interactables.push({
    x: 0,
    z: 40,
    id: "return-rome",
    type: "return3",
    label: "Vissza a Forumra",
  });
  // Batch compatible static shapes; sprites remain separate and can react to the scene.
  root.updateMatrixWorld(true);
  const batches = new Map();
  root.traverse((m) => {
    if (!m.isMesh) return;
    const key = m.material.uuid + "-" + m.castShadow;
    if (!batches.has(key))
      batches.set(key, {
        material: m.material,
        shadow: m.castShadow,
        objects: [],
        geometries: [],
      });
    const b = batches.get(key);
    b.objects.push(m);
    b.geometries.push(
      (m.geometry.index
        ? m.geometry.toNonIndexed()
        : m.geometry.clone()
      ).applyMatrix4(m.matrixWorld),
    );
  });
  for (const b of batches.values()) {
    const geo = mergeGeometries(b.geometries, false);
    if (!geo) continue;
    const m = new T.Mesh(geo, b.material);
    m.castShadow = b.shadow;
    m.receiveShadow = true;
    root.add(m);
    for (const o of b.objects) {
      root.remove(o);
      o.geometry.dispose();
    }
    b.geometries.forEach((g) => g.dispose());
  }
  root.visible = false;
  return { root, colliders, interactables, flames, crowd };
}
