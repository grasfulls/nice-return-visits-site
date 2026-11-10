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
  const isSpanish = file.split(path.sep)[0] === "es";
  const whatsNewLink = isSpanish
    ? /<a href="version-history\.html"(?: aria-current="page")?>Novedades<\/a>/
    : /<a href="version-history\.html"(?: aria-current="page")?>What's New<\/a>/;
  const expectedTagline = isSpanish
    ? "Recuerda tus revisitas."
    : "Remember Your RVs.";
  assert(
    /<body class="site-shell">/.test(html),
    `${file}: document body is the site shell`,
  );
  assert(
    html.includes(`<span class="brand-tagline">${expectedTagline}</span>`),
    `${file}: current localized NRV tagline`,
  );
  assert(whatsNewLink.test(html), `${file}: discoverable localized What's New navigation`);
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
  for (const [file, title] of [
    ["version-history.html", "<h1>What's New</h1>"],
    [path.join("es", "version-history.html"), "<h1>Novedades</h1>"],
  ]) {
    assert(fs.readFileSync(path.join(root, file), "utf8").includes(title), `${file}: user-facing What’s New title`);
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
  const originalTagline = file.split(path.sep)[0] === "es"
    ? "Nunca olvides un RV."
    : "Never forget an RV.";
  assert(
    original.includes('<div class="site-background"'),
    `${file}: original background markup remains archived`,
  );
  assert(
    original.includes('<div class="site-shell">'),
    `${file}: original shell remains archived`,
  );
  assert(
    original.includes(`<span class="brand-tagline">${originalTagline}</span>`),
    `${file}: original tagline remains preserved in the archive`,
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
