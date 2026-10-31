import { worldKit } from "./kit.js";
import { REGIONS } from "./regions.js";
export const COURIER_PATH = [
  { x: 0, z: 16 },
  { x: -3, z: 12 },
  { x: -3, z: 3 },
  { x: 4, z: -2 },
  { x: 4, z: -9 },
  { x: -8, z: -15 },
];
export function createSubura(scene) {
  const k = worldKit(scene, "subura", REGIONS.subura.bounds),
    { box, cylinder, person, record } = k;
  box(0, -0.2, 0, 40, 0.2, 64, "ground");
  box(0, 0, 31, 40, 8, 1, "brick", true);
  box(0, 0, -31, 40, 10, 1, "plaster", true);
  for (const side of [-1, 1])
    for (const z of [-24, -12, 0, 12, 25]) {
      const h = 8 + (z === 12 ? 3 : 0);
      box(side * 16, 0, z, 6, h, 10, side < 0 ? "brick" : "plaster", true);
      box(side * 16, h, z, 6.5, 0.35, 10.5, "roof");
      for (const floor of [2.5, 5.5, 8.5])
        if (floor < h)
          for (const dz of [-2, 2])
            box(side * 12.9, floor, z + dz, 0.12, 1.4, 0.9, "dark");
      box(side * 12.8, 0, z, 0.2, 2.7, 1.6, "wood");
    }
  box(-8, 0, 9, 5, 6, 7, "brick", true);
  box(-8, 6, 9, 6, 0.35, 8, "roof");
  box(12, 0, -5, 9, 8, 10, "plaster", true);
  box(12, 8, -5, 10, 0.3, 11, "roof");
  // Workshop frontage and a small, reachable yard at the end of the winding lane.
  box(-14, 0, -20, 8, 5.5, 12, "brick", true);
  box(-14, 5.5, -20, 9, 0.4, 13, "roof");
  box(-9.7, 2, -20, 0.15, 2, 2.4, "wood");
  record("seal", -8, -18, "A műhely pecsétjének vizsgálata");
  for (const [x, z] of [
    [9, 17],
    [-10, 22],
    [10, -20],
  ]) {
    cylinder(x, 0, z, 0.6, 1.3);
    box(x, 1.3, z, 1.3, 0.08, 1.3, "wood");
  }
  for (const z of [21, 0, -16]) {
    box(0, 7.5, z, 26, 0.04, 0.04, "wood");
    for (const x of [-5, -1, 3])
      box(x, 6.7, z, 1.8, 1.1, 0.03, x === -1 ? "red" : "cream");
  }
  box(9, 0, 9, 4, 0.75, 2, "wood", true);
  box(9, 3, 9, 5, 0.15, 3, "red");
  for (const x of [7, 11]) cylinder(x, 0, 9, 0.08, 3);
  k.banner(-12.7, 16);
  k.returnSign(3, 26);
  const courier = person(
    "courier",
    0,
    16,
    "Faustus, a futár megszólítása",
    "merchant",
    false,
  );
  person("subura-citizen", 9, 11, "A műhely gazdájának megszólítása");
  let localStep = -1,
    localRun = -1;
  return k.finish({
    update(s, dt, now, store) {
      const c = s.city;
      if (localRun !== c.courierRun) {
        localRun = c.courierRun;
        localStep = -1;
      }
      if (!c.courierStarted) {
        localStep = -1;
        courier.mesh.position.set(0, 1.5, 16);
      } else if (c.courierArrived) courier.mesh.position.set(-8, 1.5, -15);
      else {
        const step = Math.min(c.courierStep || 1, COURIER_PATH.length - 1);
        if (localStep !== step) {
          const p = COURIER_PATH[step - 1];
          courier.mesh.position.set(p.x, 1.5, p.z);
          localStep = step;
        }
        const p = COURIER_PATH[step],
          m = courier.mesh,
          d = Math.hypot(p.x - m.position.x, p.z - m.position.z),
          speed = dt * 2;
        if (d <= Math.max(0.04, speed)) {
          m.position.x = p.x;
          m.position.z = p.z;
          if (step === COURIER_PATH.length - 1) store.arriveCourier();
          else store.courierCheckpoint(step + 1);
        } else {
          m.position.x += ((p.x - m.position.x) * speed) / d;
          m.position.z += ((p.z - m.position.z) * speed) / d;
        }
      }
      courier.x = courier.mesh.position.x;
      courier.z = courier.mesh.position.z;
    },
  });
}
