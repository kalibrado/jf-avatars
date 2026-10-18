const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/js/ui-elements.js', 'utf8');
const body = source.match(/export const showRippleLoader = \(\) => \{([\s\S]*?)\n\};/)[1];
for (const modern of [true, false]) {
  const loader = {};
  let children = [{}, {}];
  let replacements = 0;
  let appends = 0;
  const grid = {
    set innerHTML(value) { assert.equal(value, ''); children = []; },
    appendChild(child) { appends++; children.push(child); },
  };
  if (modern) grid.replaceChildren = (child) => { replacements++; children = [child]; };
  const show = vm.runInNewContext(`(function () {${body}})`, {
    createGridContainer: () => grid,
    rippleLoader: () => loader,
    setCssProperties: () => {},
  });
  for (let i = 0; i < 2; i++) {
    assert.equal(show(), loader);
    assert.deepEqual(children, [loader]);
  }
  assert.equal(replacements, modern ? 2 : 0);
  assert.equal(appends, modern ? 0 : 2);
}
assert.doesNotMatch(fs.readFileSync('dist/main.js', 'utf8'), /jf-avatars-diagnostics|Diagnostic build initialized|diagnosticImage/);
console.log('PASS: modern and legacy loader paths, repeated replacement, production bundle without diagnostics');
