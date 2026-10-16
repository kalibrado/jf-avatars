// Run after npm run build. Requires jsdom (temporary test dependency).
const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function test(missingAPI, failImages) {
  const dom = new JSDOM('<body><button id="btnDeleteImage"></button></body>', {
    url: "https://jellyfin.example/web/#/userprofile", runScripts: "outside-only",
  });
  const w = dom.window;
  if (missingAPI) w.Element.prototype.replaceChildren = undefined;
  w.IntersectionObserver = class {
    observe(target) { this.callback([{ target, isIntersecting: true }], this); }
    unobserve() {}
    constructor(callback) { this.callback = callback; }
  };
  w.fetch = async (url) => ({
    ok: true, status: 200,
    json: async () => String(url).includes("folders_names") ? ["Test"] :
      String(url).includes("images_metadata") ? [{ folder: "Test", url: "https://images.example/avatar.png" }] :
      { title: "Avatars", "btn-show": "Show", "default-option": "All" },
  });
  w.Image = class {
    set src(value) { w.setTimeout(() => { const handler = failImages ? this.onerror : this.onload; if (handler) handler(); }, 0); }
  };
  w.eval(fs.readFileSync("dist/main.js", "utf8"));
  await wait(200);
  w.document.getElementById("jf-avatars-btn-show-modal").click();
  await wait(300);
  const report = w.document.querySelector("#jf-avatars-diagnostics textarea").value;
  assert.match(report, /JSON HTTP 200/);
  assert.ok(w.document.getElementById("jf-avatars-modal"));
  if (missingAPI) {
    assert.match(report, /Initial grid: .*replaceChildren/);
    assert.equal(w.document.querySelectorAll("#jf-avatars-grid-container img").length, 0);
  } else if (failImages) {
    assert.match(report, /"failed":1/);
    assert.match(report, /Image failed: https:\/\/images.example\/avatar.png/);
  } else {
    assert.match(report, /"loaded":1/);
    assert.equal(w.document.querySelector("#jf-avatars-grid-container img").src, "https://images.example/avatar.png");
  }
  // Category changes must surface the same failure, rather than lose the report.
  const select = w.document.querySelector("#jf-avatars-dropdown-select-filter");
  select.dispatchEvent(new w.Event("change"));
  await wait(200);
  if (missingAPI) assert.match(w.document.querySelector("textarea").value, /Category change: .*replaceChildren/);
  dom.window.close();
}
(async () => {
  await test(false, false);
  await test(true, false);
  await test(false, true);
  console.log("PASS: normal grid, missing replaceChildren, image failure, category changes");
})().catch((error) => { console.error(error); process.exitCode = 1; });
