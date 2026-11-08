// Run with: node tests/site-shell.js
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const archive = path.join(root, "archive", "site-design-2026-11-08");
const pageNames = [
  "index.html",
  "getting-started.html",
  "help.html",
  "faq.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "version-history.html",
];
const pages = [
  ...pageNames,
  ...pageNames.map((file) => path.join("es", file)),
];
const styles = fs.readFileSync(
  path.join(root, "assets", "css", "styles.css"),
  "utf8",
);

for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert(
    /<body class="site-shell">/.test(html),
    `${file}: document body is the site shell`,
  );
  assert(
    html.includes("styles.css?v=site-shell-3"),
    `${file}: load the current shared stylesheet`,
  );
  assert(!html.includes("site-background"), `${file}: no separate background`);
  assert(
    !html.includes('<div class="site-shell">'),
    `${file}: no nested shell wrapper`,
  );
  for (const element of ["header", "main", "footer"]) {
    assert(
      html.includes(`<${element}`),
      `${file}: preserve the ${element} content`,
    );
  }
}

const shellStyles = styles.match(/\.site-shell\s*\{([^}]+)\}/);
assert(shellStyles, "shared full-viewport site shell styles exist");
assert(/width:\s*100%;/.test(shellStyles[1]));
assert(/min-height:\s*100vh;/.test(shellStyles[1]));
assert(/margin:\s*0;/.test(shellStyles[1]));
assert(/url\("\.\.\/nrv-background\.png"\)/.test(shellStyles[1]));
assert(/background-size:\s*cover;/.test(shellStyles[1]));

for (const file of pages) {
  const original = fs.readFileSync(path.join(archive, file), "utf8");
  assert(
    original.includes('<div class="site-background"'),
    `${file}: original background markup remains archived`,
  );
  assert(
    original.includes('<div class="site-shell">'),
    `${file}: original shell remains archived`,
  );
}

assert(
  fs.readFileSync(path.join(archive, "assets", "css", "styles.css"), "utf8")
    .includes("width: min(100%, 1024px)"),
  "original centered shell stylesheet remains archived",
);
assert.deepStrictEqual(
  fs.readFileSync(path.join(archive, "assets", "nrv-background.png")),
  fs.readFileSync(path.join(root, "assets", "nrv-background.png")),
  "original NRV background artwork remains unchanged",
);

console.log("PASS  all 16 English and Spanish pages use the full-viewport shell");
console.log("PASS  the original shell, styling, and background artwork are archived");
