import * as T from "three";
import "./style.css";
import { loadArt } from "./art/textures.js";
import { createRome } from "./world/rome.js";
import { movePlayer, district, canOccupy } from "./game/physics.js";
import { StoryStore, currentQuest, voicesCount } from "./story/state.js";
import { NPCS, TABLET } from "./story/data.js";
import { StoryUI } from "./story/ui.js";
const $ = (id) => document.getElementById(id),
  canvas = $("game");
const renderer = new T.WebGLRenderer({
  canvas,
  antialias: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFShadowMap;
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.setClearColor(0xa8bec8);
const scene = new T.Scene();
scene.background = new T.Color(0xa8bec8);
scene.fog = new T.Fog(0xb8baaa, 35, 110);
scene.add(new T.HemisphereLight(0xf5e6c8, 0x686456, 1.4));
const sun = new T.DirectionalLight(0xffe4b1, 1.9);
sun.position.set(-22, 37, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, {
  left: -38,
  right: 38,
  top: 54,
  bottom: -54,
  near: 1,
  far: 120,
});
sun.shadow.bias = -0.0006;
sun.target.position.set(0, 0, -10);
scene.add(sun.target);
scene.add(sun);
// Low-poly distant clouds.
const cloudmat = new T.MeshBasicMaterial({ color: 0xe6e2ce });
for (let i = 0; i < 17; i++) {
  const cloud = new T.Mesh(
    new T.BoxGeometry(9 + (i % 4) * 3, 1 + (i % 3), 3),
    cloudmat,
  );
  cloud.position.set(Math.sin(i * 4) * 66, 23 + (i % 4), Math.cos(i * 4) * 65);
  scene.add(cloud);
}
await loadArt();
const world = createRome(scene);
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
const camera = new T.PerspectiveCamera(67, 1, 0.08, 130);
camera.position.set(0, 1.7, 33);
let yaw = 0,
  pitch = 0,
  active = false,
  walk = 0,
  total = 0,
  nearest = null,
  timeout;
const keys = new Set(),
  visited = new Set(["VIA SACRA"]);
let storage;
try {
  storage = window.localStorage;
} catch {
  /* Private browsing may block storage. */
}
const story = new StoryStore(storage);
const scrollItems = world.interactables.filter((o) => o.type === "scroll");
let pointerMode = "free",
  resumeAfterPanel = false,
  lastCheckpoint = 0;
canvas.tabIndex = 0;
function checkpoint() {
  return story.checkpoint(
    { x: camera.position.x, z: camera.position.z, yaw, pitch },
    {
      scrolls: scrollItems.flatMap((o, i) => (o.taken ? [i] : [])),
      visited: [...visited],
    },
  );
}
function restoreRuntime() {
  const saved = story.state.player;
  camera.position.set(saved.x, 1.7, saved.z);
  if (!canOccupy(saved.x, saved.z, world.colliders))
    camera.position.set(0, 1.7, 33);
  yaw = saved.yaw;
  pitch = saved.pitch;
  keys.clear();
  visited.clear();
  for (const area of story.state.world.visited) visited.add(area);
  scrollItems.forEach((o, i) => {
    o.taken = story.state.world.scrolls.includes(i);
    if (o.taken) scene.remove(o.mesh);
    else if (!o.mesh.parent) scene.add(o.mesh);
  });
  total = scrollItems.filter((o) => o.taken).length;
  $("scrolls").innerHTML = `${total} <em>/ 3</em>`;
  $("explored").innerHTML = `${visited.size} <em>/ 3</em>`;
  $("area").textContent = district(camera.position.z);
}
function updateStoryHUD() {
  const q = currentQuest(story.state);
  $("questTitle").textContent = q.title;
  $("questProgress").textContent = q.progress;
  document.querySelector(".objective").title = q.task;
  $("saveStatus").textContent = story.notice;
}
function requestMouse() {
  pointerMode = "pending";
  try {
    canvas.requestPointerLock()?.catch(() => {
      pointerMode = "free";
      message(
        "Kattints a játéktérre az egérvezérléshez. A nyilakkal is fordulhatsz.",
      );
    });
  } catch {
    pointerMode = "free";
    message("A nyilakkal is körülnézhetsz.");
  }
}
function releaseMouse() {
  pointerMode = "free";
  if (document.pointerLockElement) document.exitPointerLock();
}

const storyUI = new StoryUI(story, {
  onOpen() {
    resumeAfterPanel = active;
    checkpoint();
    active = false;
    keys.clear();
    $("menu").hidden = true;
    $("map").hidden = true;
    releaseMouse();
  },
  onClose(lock) {
    keys.clear();
    active = resumeAfterPanel;
    $("menu").hidden = active;
    pointerMode = "free";
    if (active) {
      canvas.focus();
      if (lock) requestMouse();
      else message("Kattints a játéktérre az egérvezérléshez.");
    }
    checkpoint();
  },
  onReset() {
    resumeAfterPanel = true;
    story.reset();
    restoreRuntime();
    updateStoryHUD();
  },
});
story.onChange(updateStoryHUD);
restoreRuntime();
updateStoryHUD();
$("journalButton").onclick = () => storyUI.journal();
$("evidenceButton").onclick = () => storyUI.evidence();
$("newChapter").onclick = () => storyUI.resetConfirmation();
$("loadSave").onclick = () => {
  story.load();
  restoreRuntime();
  updateStoryHUD();
};
window.addEventListener("pagehide", checkpoint);
function resize() {
  const r = canvas.getBoundingClientRect();
  renderer.setSize(
    Math.max(1, Math.round(r.width * 0.67)),
    Math.max(1, Math.round(r.height * 0.67)),
    false,
  );
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe($("viewport"));
resize();
function message(s) {
  $("message").textContent = s;
  clearTimeout(timeout);
  timeout = setTimeout(() => ($("message").textContent = ""), 4500);
}
function pause() {
  if (storyUI.isOpen) storyUI.close(false);
  active = false;
  keys.clear();
  checkpoint();
  updateStoryHUD();
  $("menu").hidden = false;
  $("play").innerHTML = "FOLYTATÁS <span>→</span>";
  releaseMouse();
}
function start() {
  active = true;
  keys.clear();
  $("menu").hidden = true;
  $("map").hidden = true;
  requestMouse();
  canvas.focus();
  if (story.notice) message(story.notice);
}
$("play").onclick = start;
$("menuButton").onclick = () => (active || storyUI.isOpen ? pause() : start());
canvas.onclick = () => {
  if (active && !document.pointerLockElement) requestMouse();
};
function toggleMap() {
  if (!active) return;
  $("map").hidden = !$("map").hidden;
  drawMap();
}
$("mapButton").onclick = toggleMap;
document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    if (!active || storyUI.isOpen) {
      releaseMouse();
      return;
    }
    pointerMode = "locked";
    return;
  }
  const unexpected = pointerMode === "locked";
  if (pointerMode !== "pending") pointerMode = "free";
  if (unexpected && active && !storyUI.isOpen) pause();
});
document.addEventListener("mousemove", (e) => {
  if (active && document.pointerLockElement === canvas) {
    yaw -= e.movementX * 0.0025;
    pitch = T.MathUtils.clamp(pitch - e.movementY * 0.002, -1.1, 1.1);
  }
});
window.addEventListener("blur", () => {
  if (active) pause();
});
document.addEventListener("keydown", (e) => {
  if (storyUI.isOpen) return;
  if (
    [
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Space",
    ].includes(e.code)
  )
    e.preventDefault();
  if (e.repeat) return;
  if (e.code === "Escape") {
    pause();
    return;
  }
  if (e.code === "KeyM") {
    toggleMap();
    return;
  }
  if (!active) return;
  if (e.code === "KeyJ") {
    storyUI.journal();
    return;
  }
  if (e.code === "KeyB") {
    storyUI.evidence();
    return;
  }
  keys.add(e.code);
  if (e.code === "KeyE") interact();
});
document.addEventListener("keyup", (e) => keys.delete(e.code));
function interact() {
  if (!nearest) return;
  if (nearest.type === "scroll") {
    scene.remove(nearest.mesh);
    nearest.taken = true;
    total++;
    $("scrolls").innerHTML = `${total} <em>/ 3</em>`;
    message(total === 3 ? "MINDHÁROM TEKERCS MEGTALÁLVA" : "TEKERCS FELVÉVE");
    checkpoint();
  } else if (nearest.type === "tablet") storyUI.tablet();
  else if (nearest.storyId) storyUI.dialogue(nearest.storyId);
  else message(nearest.message);
}
function drawMap() {
  const c = $("mapCanvas"),
    g = c.getContext("2d");
  g.fillStyle = "#b8a77f";
  g.fillRect(0, 0, c.width, c.height);
  const sx = 6,
    sz = 3.6,
    px = (x) => 180 + x * sx,
    pz = (z) => 205 + z * sz;
  g.fillStyle = "#5b5343";
  for (const r of world.colliders) {
    g.fillRect(
      px(r.x - r.w / 2),
      pz(r.z - r.d / 2),
      r.w * sx,
      Math.max(2, r.d * sz),
    );
  }
  g.fillStyle = "#432c1c";
  g.font = "13px Georgia";
  g.textAlign = "center";
  g.fillText("TEMPLUM SATURNI", 180, 20);
  g.fillText("FORUM ROMANUM", 180, 165);
  g.fillText("VIA SACRA", 180, 355);
  for (const o of world.interactables.filter(
    (v) => v.type === "scroll" && !v.taken,
  )) {
    g.fillStyle = "#8d352a";
    g.fillRect(px(o.x) - 3, pz(o.z) - 3, 6, 6);
  }
  for (const [id, n] of Object.entries(NPCS)) {
    g.fillStyle = story.state.deliveryTarget === id ? "#842f29" : "#735d2d";
    g.beginPath();
    g.arc(px(n.x), pz(n.z), 3.5, 0, Math.PI * 2);
    g.fill();
    g.font = "10px Georgia";
    g.textAlign = "left";
    g.fillText(n.name, px(n.x) + 6, pz(n.z) + 3);
  }
  g.fillStyle = story.state.evidence.length ? "#81765e" : "#a12e22";
  g.fillRect(px(TABLET.x) - 4, pz(TABLET.z) - 3, 8, 6);
  g.save();
  g.translate(px(camera.position.x), pz(camera.position.z));
  g.rotate(-yaw);
  g.fillStyle = "#f5e8b7";
  g.beginPath();
  g.moveTo(0, -8);
  g.lineTo(-5, 5);
  g.lineTo(5, 5);
  g.fill();
  g.restore();
}
let last = performance.now();
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (active) {
    if (keys.has("ArrowLeft")) yaw += dt * 1.6;
    if (keys.has("ArrowRight")) yaw -= dt * 1.6;
    const f =
        Number(keys.has("KeyW") || keys.has("ArrowUp")) -
        Number(keys.has("KeyS") || keys.has("ArrowDown")),
      s = Number(keys.has("KeyD")) - Number(keys.has("KeyA"));
    const speed = (dt * 4.2) / Math.max(1, Math.hypot(f, s));
    movePlayer(
      camera.position,
      (-Math.sin(yaw) * f + Math.cos(yaw) * s) * speed,
      (-Math.cos(yaw) * f - Math.sin(yaw) * s) * speed,
      world.colliders,
    );
    walk += (Math.abs(f) + Math.abs(s)) * dt * 8;
    camera.position.y = 1.7 + Math.sin(walk) * (f || s ? 0.035 : 0);
    const area = district(camera.position.z);
    $("area").textContent = area;
    visited.add(area);
    $("explored").innerHTML = `${visited.size} <em>/ 3</em>`;
    if (
      story.state.chapterComplete &&
      !story.state.nextChapterReady &&
      area === "FORUM ROMANUM"
    ) {
      checkpoint();
      story.enterForum();
      message(
        "A Forumon vagy. A köztársaság árnyéka belépési állapota mentve.",
      );
    }
    if (now - lastCheckpoint > 3000) {
      checkpoint();
      lastCheckpoint = now;
      updateStoryHUD();
    }
  }
  camera.rotation.order = "YXZ";
  camera.rotation.set(pitch, yaw, 0);
  nearest = null;
  let near = 3;
  for (const o of world.interactables) {
    if (o.taken) continue;
    const dx = o.x - camera.position.x,
      dz = o.z - camera.position.z,
      d = Math.hypot(dx, dz);
    const ahead =
      (-Math.sin(yaw) * dx - Math.cos(yaw) * dz) / Math.max(0.001, d);
    if (d < near && ahead > 0.25) {
      near = d;
      nearest = o;
    }
  }
  $("prompt").textContent =
    active && nearest
      ? `[ E ] ${(nearest.storyId ? NPCS[nearest.storyId].name + " megszólítása" : nearest.label).toLocaleUpperCase("hu")}`
      : "";
  for (let i = 0; i < world.flames.length; i++) {
    const m = world.flames[i];
    m.scale.y = 1 + Math.sin(now * 0.012 + i) * 0.15;
    m.rotation.y = now * 0.001;
  }
  if (!$("map").hidden) drawMap();
  renderer.render(scene, camera);
}
// Read-only telemetry lets browser tests verify actual movement and district traversal.
Object.defineProperty(window, "caesarState", {
  get: () => ({
    x: camera.position.x,
    z: camera.position.z,
    yaw,
    pitch,
    active,
    district: district(camera.position.z),
    scrolls: total,
    visited: [...visited],
    interaction: nearest?.type,
    renderer: renderer.info.render,
    interactionId: nearest?.storyId || nearest?.type,
    story: {
      ...structuredClone(story.state),
      quest: currentQuest(story.state).id,
      voices: voicesCount(story.state),
    },
    panel: storyUI.isOpen ? storyUI.root.dataset.kind : null,
  }),
});
$("play").disabled = false;
requestAnimationFrame(tick);
