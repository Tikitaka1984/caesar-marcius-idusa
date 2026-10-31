import { worldKit } from "./kit.js";
import { REGIONS } from "./regions.js";
export function createDomus(scene) {
  const k = worldKit(scene, "domus", REGIONS.domus.bounds),
    { box, column, person, tree } = k;
  box(0, -0.2, 0, 48, 0.2, 56, "marble");
  for (const side of [-1, 1]) {
    box(side * 23, 0, 0, 1, 6, 55, "plaster", true);
    box(side * 13, 0, 17, 20, 6, 0.7, "brick", true);
    box(side * 13, 0, -4, 20, 5, 0.6, "plaster", true);
  }
  box(0, 0, -27, 47, 6, 1, "plaster", true);
  box(0, 0, 27, 47, 5, 1, "brick", true);
  // Atrium has an off-centre impluvium, clear centre path and an accessible side room.
  box(-4, 0, 6, 5, 0.35, 5, "stone", true);
  box(-4, 0.35, 6, 4.3, 0.04, 4.3, "water");
  for (const x of [-9, 9]) for (const z of [12, 0]) column(x, z, 4.8);
  for (const side of [-1, 1]) {
    box(side * 16, 5, 7, 14, 0.5, 21, "roof");
    box(side * 16, 1.3, 16.5, 10, 1.4, 0.08, "red");
  }
  box(10, 0, 1, 0.4, 5, 8, "plaster", true);
  box(10, 0, 14, 0.4, 5, 6, "plaster", true);
  box(17, 0, 7, 4, 0.7, 2, "wood", true);
  box(19, 0, 2, 2, 0.5, 4, "red", true);
  // Door and collider use the same persistent gate flag.
  const gate = box(0, 0, -4, 6, 4.7, 0.45, "wood", false, true),
    gateCollider = { x: 0, z: -4, w: 6, d: 0.5 };
  k.colliders.push(gateCollider);
  for (const side of [-1, 1]) for (const z of [-11, -21]) tree(side * 16, z);
  for (const x of [-10, 10]) box(x, 0, -16, 3, 0.3, 14, "leaf", true);
  for (const x of [-6, 0, 6]) box(x, 0, -23, 3, 0.3, 2, "flower", true);
  box(0, 0, -12, 3, 0.15, 10, "ground");
  box(0, 0, -16, 18, 0.15, 2, "ground");
  person("doorkeeper", 4, 8, "Felix, a kapuőr megszólítása", "soldier");
  person("host", 5, -15, "Claudia, a közvetítő megszólítása", "senator");
  k.interactables.push({
    id: "garden-gate",
    type: "city",
    x: 0,
    z: -3,
    label: "A kert kapujának vizsgálata",
  });
  k.interactables.push({
    id: "domus-plaque",
    type: "city",
    x: 15,
    z: 8,
    label: "A ház feliratának elolvasása",
  });
  k.returnSign(3, 23);
  k.banner(-5, 16.5);
  return k.finish({
    update(s) {
      gate.visible = !s.city.gateOpen;
      gateCollider.disabled = s.city.gateOpen;
    },
  });
}
