import * as T from "three";
import { citizenTexture } from "../art/textures.js";
import {
  BRANCHES,
  POLITICIANS,
  DOCUMENTS,
  INFORMANT,
  LEDGER,
} from "../story/chapter2.js";
export function addChapter2World(scene, world) {
  // Reuse the two existing Forum citizens rather than duplicate their bodies.
  for (const [id, n, role] of [
    ...Object.values(BRANCHES).map((b) => [b.guide, b, "merchant"]),
    ...Object.entries(POLITICIANS).map(([id, n]) => [
      id,
      n,
      id === "aulus" ? "senator" : "merchant",
    ]),
    [INFORMANT.id, INFORMANT, "merchant"],
  ]) {
    let existing = world.interactables.find(
      (o) => o.x === n.x && o.z === n.z && o.type === "npc",
    );
    const mesh =
      existing?.mesh ||
      new T.Sprite(
        new T.SpriteMaterial({ map: citizenTexture(role), alphaTest: 0.5 }),
      );
    if (!existing) {
      mesh.scale.set(1.5, 3, 1);
      mesh.position.set(n.x, 1.5, n.z);
      scene.add(mesh);
    }
    // Existing NPCs keep their chapter-I interaction; chapter-II overlay wins at equal range.
    if (existing) existing.replacedInChapter2 = true;
    const type =
      id === INFORMANT.id
        ? "informant2"
        : POLITICIANS[id]
          ? "politician2"
          : "guide2";
    world.interactables.unshift({
      x: n.x,
      z: n.z,
      id,
      type,
      label: n.name + " megszólítása",
      chapter2: true,
      mesh: existing ? null : mesh,
    });
  }
  for (const d of [...DOCUMENTS, LEDGER]) {
    const mesh = new T.Mesh(
      new T.BoxGeometry(0.8, 0.12, 0.55),
      new T.MeshLambertMaterial({
        color: d.id === "ledger" ? 0xb99455 : 0x9e4d35,
      }),
    );
    mesh.position.set(d.x, 0.3, d.z);
    scene.add(mesh);
    world.interactables.push({
      x: d.x,
      z: d.z,
      id: d.id,
      type: d.id === "ledger" ? "ledger2" : "document2",
      label: d.title + " megvizsgálása",
      chapter2: true,
      mesh,
    });
  }
}
