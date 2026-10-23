export const PLAYER_RADIUS = 0.3;
export function canOccupy(x, z, colliders) {
  return (
    x > -21 &&
    x < 21 &&
    z > -53 &&
    z < 50 &&
    !colliders.some(
      (c) =>
        Math.abs(x - c.x) < c.w / 2 + PLAYER_RADIUS &&
        Math.abs(z - c.z) < c.d / 2 + PLAYER_RADIUS,
    )
  );
}
export function movePlayer(position, dx, dz, colliders) {
  const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.15));
  for (let i = 0; i < n; i++) {
    if (canOccupy(position.x + dx / n, position.z, colliders))
      position.x += dx / n;
    if (canOccupy(position.x, position.z + dz / n, colliders))
      position.z += dz / n;
  }
}
export function district(z) {
  return z > 1 ? "VIA SACRA" : z > -24 ? "FORUM ROMANUM" : "TEMPLUM SATURNI";
}
