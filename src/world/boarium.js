import { worldKit } from "./kit.js";
import { REGIONS } from "./regions.js";
export function createBoarium(scene) {
  const k = worldKit(scene, "boarium", REGIONS.boarium.bounds),
    { box, cylinder, person, record } = k;
  box(3, -0.2, 0, 51, 0.2, 56, "sand");
  const water = box(-24, -0.12, 0, 12, 0.12, 56, "water", false, true);
  k.colliders.push({ x: -24, z: 0, w: 12, d: 56 });
  box(-17.5, 0, 0, 1, 0.6, 54, "stone", true);
  box(-14.5, 0, -15, 5, 0.2, 14, "wood");
  for (const z of [-25, -16, -7, 2, 11, 20]) {
    cylinder(-17, 0, z, 0.18, 1.3);
    box(-17, 0.9, z, 0.6, 0.1, 0.6, "wood");
  }
  // Open warehouse interior on the east, with a wide opening facing the market.
  box(26, 0, 0, 1, 7, 49, "brick", true);
  box(19, 0, -24, 14, 7, 1, "brick", true);
  box(19, 0, 24, 14, 7, 1, "brick", true);
  box(19, 7, 0, 16, 0.5, 50, "roof");
  for (const z of [-17, -7, 9, 18]) {
    box(21, 0, z, 5, 1.5, 3, "wood", true);
    box(22, 1.5, z, 3, 1.4, 2, "wood");
  }
  for (const [x, z] of [
    [7, 13],
    [-7, 12],
    [8, -9],
  ]) {
    box(x, 0, z, 4, 0.8, 2, "wood", true);
    box(x, 3, z, 5, 0.2, 3, x < 0 ? "red" : "cream");
    for (const side of [-1, 1]) cylinder(x + side * 2, 0, z, 0.08, 3);
  }
  record("manifest", 8, 3, "A raktárjegyzék megvizsgálása");
  record("cargo", -11, -11, "A rakomány jelzésének vizsgálata");
  person("witness", 2, -14, "Doria, a rakodómunkás megszólítása");
  person("boarium-merchant", -8, 8, "A piaci árus megszólítása");
  cylinder(-14, 0, -21, 0.2, 5);
  box(-14, 4.8, -21, 7, 0.25, 0.25, "wood");
  box(-16, 2.8, -21, 0.06, 2, 0.06, "wood");
  const boat = box(-23, 0.1, -8, 3, 1.1, 9, "wood", false, true);
  const load = box(-23, 1.2, -8, 2, 1.4, 4, "cream", false, true);
  const porter = person(
    "porter",
    13,
    -3,
    "A rakodók megfigyelése",
    "merchant",
    false,
  );
  // Republican temple motif and distant riverside roofs give the open market a skyline.
  box(-7, 0, -23, 8, 0.55, 7, "stone", true);
  for (const x of [-10, -4]) for (const z of [-20, -24]) k.column(x, z, 4.5);
  box(-7, 0.55, -25.5, 7, 4, 0.4, "plaster", true);
  box(-7, 4.8, -23, 9, 0.5, 8, "roof");
  for (const [x, h] of [
    [-14, 6],
    [-5, 9],
    [5, 7],
    [14, 10],
    [24, 6],
  ]) {
    box(x, 0, -33, 8, h, 7, "brick");
    box(x, h, -33, 9, 0.4, 8, "roof");
  }
  k.returnSign(3, 22);
  return k.finish({
    update(s, dt, now) {
      const phase = now * 0.00035;
      boat.position.z = -8 + Math.sin(phase) * 5;
      boat.position.y = 0.55 + Math.sin(phase * 4) * 0.08;
      load.position.z = boat.position.z;
      load.position.y = boat.position.y + 1.2;
      water.position.y = -0.07 + Math.sin(phase * 2) * 0.025;
      porter.mesh.position.z = -3 + Math.sin(phase * 2) * 5;
      porter.z = porter.mesh.position.z;
    },
  });
}
