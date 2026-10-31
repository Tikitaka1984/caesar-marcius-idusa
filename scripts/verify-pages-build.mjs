import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { StoryStore, SAVE_KEY } from "../src/story/state.js";
import { NPCS } from "../src/story/data.js";
import { RECORDS3 } from "../src/story/chapter3.js";
import { POLITICIANS, DOCUMENTS, CLAIMS } from "../src/story/chapter2.js";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const prefix = "/caesar-marcius-idusa/";
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
// Deliberately reject root-relative requests so a Pages path regression fails.
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(prefix)) {
      res.writeHead(404).end();
      return;
    }
    const target = resolve(dist, pathname.slice(prefix.length) || "index.html");
    if (!target.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(target);
    res
      .writeHead(200, {
        "Content-Type": types[extname(target)] || "application/octet-stream",
      })
      .end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [],
    assets = new Set();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    const path = new URL(r.url()).pathname;
    if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${path}`);
    if (r.ok() && path.endsWith(".png")) assets.add(path);
  });
  await page.goto(`http://127.0.0.1:${server.address().port}${prefix}`);
  await page.waitForFunction(() => window.caesarState?.renderer.calls > 0);
  await page.locator("#play").click();
  await page.waitForFunction(() => window.caesarState.active);
  await page.keyboard.down("KeyW");
  await page.waitForFunction(() => window.caesarState.z < 32);
  await page.keyboard.up("KeyW");
  await page.keyboard.press("KeyM");
  assert.equal(await page.locator("#map").isVisible(), true);
  await page.keyboard.press("KeyM");
  await page.screenshot({ path: "artifacts/04-pages-build.png" });
  for (const file of ["roman-citizens.png", "roman-pavement.png"])
    assert(
      assets.has(`${prefix}assets/${file}`),
      `${file} must load below the project path`,
    );
  // Load every new world from the compiled bundle using the actual travel controls.
  for (const id of ["subura", "boarium", "domus", "rome"]) {
    await page.keyboard.press("KeyV");
    await page.getByTestId("travel-" + id).click();
    await page.waitForFunction(
      (id) =>
        window.caesarState.region === id &&
        window.caesarState.renderer.calls > 0,
      id,
    );
    await page.keyboard.press("KeyM");
    assert.equal(await page.locator("#map").isVisible(), true);
    await page.keyboard.press("KeyM");
  }
  // Production-only UI smoke uses a valid checkpoint assembled through story APIs.
  // The separate Chapter II browser suite completes all three branches by walking.
  let saved;
  const story = new StoryStore({
    getItem: () => null,
    setItem: (_key, value) => {
      saved = value;
    },
  });
  for (const id of ["marcus", "lucius", "quintus"])
    story.ask(id, NPCS[id].questions[0].id);
  story.examineTablet();
  story.conclude("B");
  story.startCourier();
  story.arriveCourier();
  story.inspectSeal("limited");
  story.deliver("titus");
  story.enterForum();
  story.introduce2("courier");
  story.access2();
  for (const [id, npc] of Object.entries(POLITICIANS))
    for (const q of npc.questions) story.ask2(id, q[0]);
  story.politics2("balanced");
  for (const d of DOCUMENTS) story.document2(d.id);
  story.compare2(Object.fromEntries(CLAIMS.map((q) => [q.id, q.category])));
  story.checkpoint(
    { x: 0, z: -23, yaw: 0, pitch: 0 },
    { scrolls: [], visited: ["VIA SACRA", "FORUM ROMANUM"] },
  );
  // Seed after pagehide: the old page checkpoints during unload.
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: SAVE_KEY, value: saved },
  );
  await page.reload();
  await page.locator("#play").click();
  await page.keyboard.press("KeyB");
  assert.equal(
    await page.locator("#storyPanel").getAttribute("data-kind"),
    "evidence2",
  );
  for (const claim of CLAIMS)
    assert.equal(
      await page.getByTestId("classify-" + claim.id).inputValue(),
      claim.category,
    );
  await page.getByTestId("classify-title").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/chapter2-comparison-controls.png" });
  await page.keyboard.press("Escape");
  await page.keyboard.press("KeyJ");
  assert(
    (await page.locator("#storyPanel").textContent()).includes(
      "A köztársaság árnyéka",
    ),
  );
  // A separate valid final checkpoint exercises the compiled Campus world and ending.
  // The full-campaign browser test separately walks all three chapters from an empty save.
  story.distinguish2("limited");
  story.inform2();
  story.dockRecord("manifest");
  story.dockRecord("cargo");
  story.concludeDock("delivery");
  story.openGarden("origin");
  story.deliverGarden();
  story.finish2("warn");
  story.start3();
  story.guide3();
  story.route3();
  for (const r of RECORDS3) story.record3(r.id);
  story.assess3("limited");
  story.act3();
  for (let i = 0; i < 3; i++) story.scene3();
  story.report3("accountable");
  story.finish3();
  await page.close();
  const finalPage = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  finalPage.on("pageerror", (e) => errors.push(e.message));
  finalPage.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  finalPage.on("response", (r) => {
    if (r.status() >= 400)
      errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`);
  });
  await finalPage.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: SAVE_KEY, value: saved },
  );
  await finalPage.goto(`http://127.0.0.1:${server.address().port}${prefix}`);
  await finalPage.waitForFunction(
    () =>
      window.caesarState?.region === "campus" &&
      window.caesarState.renderer.calls > 0,
  );
  await finalPage.locator("#campaignButton").click();
  await finalPage.getByTestId("review-campaign-ending").click();
  assert.equal(
    await finalPage.locator("#storyTitle").textContent(),
    "CAESAR – a történet véget ért",
  );
  await finalPage.getByTestId("campaign-epilogue").click();
  assert(
    (await finalPage.locator("#storyPanel").textContent()).includes(
      "Köszönjük, hogy végigjátszottad",
    ),
  );
  await finalPage.screenshot({
    path: "artifacts/production-campaign-ending.png",
  });
  assert.deepEqual(errors, []);
  console.log(
    "Pages subdirectory smoke passed: all five worlds, WebGL, movement, maps, both textures, Chapter II controls, complete campaign ending and epilogue; 0 console/JavaScript/HTTP errors.",
  );
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
