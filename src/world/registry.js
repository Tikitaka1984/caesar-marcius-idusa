import * as T from "three";
import { createRome } from "./rome.js";
import { addChapter2World } from "./chapter2.js";
import { createCampus, addCampusTravel } from "./campus.js";
import { createSubura } from "./subura.js";
import { createBoarium } from "./boarium.js";
import { createDomus } from "./domus.js";
import { REGIONS } from "./regions.js";
export function createWorldRegistry(scene) {
  const worlds = new Map();
  const factories = {
    rome() {
      const before = new Set(scene.children),
        world = createRome(scene);
      addChapter2World(scene, world);
      addCampusTravel(scene, world);
      const sign = new T.Mesh(
        new T.BoxGeometry(0.9, 1.4, 0.18),
        new T.MeshLambertMaterial({ color: 0xc6b17b }),
      );
      sign.position.set(6, 0.7, 4);
      scene.add(sign);
      world.interactables.push({
        id: "city-map",
        x: 6,
        z: 4,
        type: "city-map",
        label: "Útjelző: Subura, Tiberis-part, Palatinus",
      });
      const root = new T.Group();
      root.name = "rome";
      for (const o of [...scene.children]) if (!before.has(o)) root.add(o);
      scene.add(root);
      return { ...world, root };
    },
    campus: () => createCampus(scene),
    subura: () => createSubura(scene),
    boarium: () => createBoarium(scene),
    domus: () => createDomus(scene),
  };
  function get(id) {
    if (!REGIONS[id]) id = "rome";
    if (!worlds.has(id)) {
      const w = factories[id]();
      w.bounds = REGIONS[id].bounds;
      w.root.visible = false;
      worlds.set(id, w);
    }
    return worlds.get(id);
  }
  return {
    get,
    show(id) {
      const w = get(id);
      for (const x of worlds.values()) x.root.visible = x === w;
      return w;
    },
    get loaded() {
      return [...worlds.keys()];
    },
  };
}
