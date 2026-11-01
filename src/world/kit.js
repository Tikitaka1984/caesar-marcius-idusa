import * as T from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { texture, citizenTexture, bannerTexture } from "../art/textures.js";
let shared;
function materials() {
  if (shared) return shared;
  shared = {};
  for (const name of [
    "stone",
    "brick",
    "wood",
    "marble",
    "ground",
    "red",
    "plaster",
  ])
    shared[name] = new T.MeshLambertMaterial({ map: texture(name) });
  for (const [name, color] of Object.entries({
    roof: 0x914b34,
    leaf: 0x506d39,
    gold: 0xbd9b50,
    dark: 0x302820,
    water: 0x427875,
    sand: 0xb4a77a,
    flower: 0xb97865,
    cream: 0xe3d4ae,
  }))
    shared[name] = new T.MeshLambertMaterial({ color });
  shared.sand.map = texture("stone");
  return shared;
}
export function worldKit(scene, region, bounds) {
  const root = new T.Group();
  root.name = region;
  root.visible = false;
  scene.add(root);
  const colliders = [],
    interactables = [],
    mats = materials();
  function box(
    x,
    y,
    z,
    w,
    h,
    d,
    kind = "stone",
    solid = false,
    dynamic = false,
  ) {
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
    // The shadow map is only refreshed on region change, so moving or toggled
    // meshes would leave a stale shadow behind: they do not cast one.
    m.castShadow = h > 0.8 && !dynamic;
    m.receiveShadow = true;
    m.userData.dynamic = dynamic;
    root.add(m);
    if (solid) colliders.push({ x, z, w, d });
    return m;
  }
  function cylinder(x, y, z, r, h, kind = "wood") {
    const m = new T.Mesh(
      new T.CylinderGeometry(r, r * 1.08, h, 10),
      mats[kind],
    );
    m.position.set(x, y + h / 2, z);
    m.castShadow = true;
    m.receiveShadow = true;
    root.add(m);
    return m;
  }
  function column(x, z, h = 4.8) {
    box(x, 0, z, 1, 0.25, 1, "marble");
    cylinder(x, 0.25, z, 0.3, h - 0.6, "marble");
    box(x, h - 0.35, z, 1, 0.35, 1, "marble");
    colliders.push({ x, z, w: 0.9, d: 0.9 });
  }
  function person(id, x, z, name, role = "merchant", solid = true) {
    const m = new T.Sprite(
      new T.SpriteMaterial({ map: citizenTexture(role), alphaTest: 0.5 }),
    );
    m.scale.set(1.5, 3, 1);
    m.position.set(x, 1.5, z);
    root.add(m);
    if (solid) colliders.push({ x, z, w: 0.65, d: 0.65 });
    const o = { id, x, z, label: name, type: "city", mesh: m };
    interactables.push(o);
    return o;
  }
  function record(id, x, z, label) {
    box(x, 0, z, 1, 0.65, 0.65, "wood", true);
    box(x, 0.65, z, 0.8, 0.07, 0.5, "cream");
    interactables.push({ id, x, z, label, type: "city" });
  }
  function banner(x, z) {
    const m = new T.Mesh(
      new T.PlaneGeometry(1, 2),
      new T.MeshLambertMaterial({ map: bannerTexture(), side: T.DoubleSide }),
    );
    m.position.set(x, 4, z);
    root.add(m);
  }
  function tree(x, z) {
    box(x, 0, z, 2, 0.4, 2, "stone", true);
    cylinder(x, 0.4, z, 0.18, 2.3);
    const m = new T.Mesh(new T.ConeGeometry(1.3, 4.6, 8), mats.leaf);
    m.position.set(x, 4, z);
    root.add(m);
  }
  function returnSign(x, z) {
    box(x, 0, z, 0.9, 1.3, 0.2, "wood");
    interactables.push({
      id: "city-return",
      type: "city-return",
      x,
      z,
      label: "Várostérkép és visszaút",
    });
  }
  function finish(extra = {}) {
    root.updateMatrixWorld(true);
    const groups = new Map();
    root.traverse((m) => {
      if (!m.isMesh || m.userData.dynamic) return;
      const key = m.material.uuid + "-" + m.castShadow;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(m);
    });
    for (const objects of groups.values()) {
      const geometries = objects.map((m) =>
        (m.geometry.index
          ? m.geometry.toNonIndexed()
          : m.geometry.clone()
        ).applyMatrix4(m.matrixWorld),
      );
      const geo = mergeGeometries(geometries, false);
      if (!geo) continue;
      const mesh = new T.Mesh(geo, objects[0].material);
      mesh.castShadow = objects[0].castShadow;
      mesh.receiveShadow = true;
      root.add(mesh);
      for (const m of objects) {
        root.remove(m);
        m.geometry.dispose();
      }
      geometries.forEach((g) => g.dispose());
    }
    return { root, colliders, interactables, flames: [], bounds, ...extra };
  }
  return {
    root,
    colliders,
    interactables,
    mats,
    box,
    cylinder,
    column,
    person,
    record,
    banner,
    tree,
    returnSign,
    finish,
  };
}
