export const PLAYER_RADIUS = 0.3;
export const DEFAULT_BOUNDS = { minX: -21, maxX: 21, minZ: -53, maxZ: 50 };
export function canOccupy(x, z, colliders, bounds = DEFAULT_BOUNDS) {
  return (
    x > bounds.minX &&
    x < bounds.maxX &&
    z > bounds.minZ &&
    z < bounds.maxZ &&
    !colliders.some(
      (c) =>
        !c.disabled &&
        Math.abs(x - c.x) < c.w / 2 + PLAYER_RADIUS &&
        Math.abs(z - c.z) < c.d / 2 + PLAYER_RADIUS,
    )
  );
}
export function movePlayer(
  position,
  dx,
  dz,
  colliders,
  bounds = DEFAULT_BOUNDS,
) {
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.15));
  for (let i = 0; i < n; i++) {
    if (canOccupy(position.x + dx / n, position.z, colliders, bounds))
      position.x += dx / n;
    if (canOccupy(position.x, position.z + dz / n, colliders, bounds))
      position.z += dz / n;
  }
}
export function district(z, region = "rome") {
  if (region === "subura") return "SVBVRA";
  if (region === "boarium") return "FORVM BOARIVM";
  if (region === "domus") return "DOMVS PALATINA";
  if (region === "campus") return z > -20 ? "PORTICVS POMPEI" : "CVRIA POMPEIA";
  return z > 1 ? "VIA SACRA" : z > -24 ? "FORUM ROMANUM" : "TEMPLUM SATURNI";
}
