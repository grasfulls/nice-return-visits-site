// Run with: node tests/app-links.js
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const userFacingPages = [
  "index.html",
  "getting-started.html",
  "help.html",
  "es/index.html",
  "es/getting-started.html",
  "es/help.html",
];
const appUrl = "https://nicereturnvisits.org/app/";

for (const file of userFacingPages) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert(
    !html.includes("grasfulls.github.io/nice-return-visits-app"),
    `${file}: no public app link exposes the GitHub Pages origin`,
  );
  for (const match of html.matchAll(/href="([^"]*\/app\/[^"]*)"/g)) {
    assert(
      match[1].startsWith(appUrl),
      `${file}: app links use the Nice Return Visits domain`,
    );
  }
}

for (const [file, language] of [
  ["index.html", "en"],
  ["getting-started.html", "en"],
  ["help.html", "en"],
  ["es/index.html", "es"],
  ["es/getting-started.html", "es"],
  ["es/help.html", "es"],
]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert(
    html.includes(`${appUrl}?lang=${language}`),
    `${file}: app links select the page language`,
  );
}

const englishGuide = fs.readFileSync(
  path.join(root, "getting-started.html"),
  "utf8",
);
const spanishGuide = fs.readFileSync(
  path.join(root, "es", "getting-started.html"),
  "utf8",
);
assert(englishGuide.includes("create and download a backup"));
assert(englishGuide.includes("Keep the existing app available"));
assert(spanishGuide.includes("cree y descargue una copia de seguridad"));
assert(spanishGuide.includes("Mantenga disponible la aplicación existente"));
assert(englishGuide.includes("Already know how to add a website to your Home Screen or desktop?"));
assert(englishGuide.includes("Tap Install NRV Icon, then use your browser’s usual Add to Home Screen or Install app option"));
assert(englishGuide.includes("NRV is still being tested across different devices and browsers."));
assert(spanishGuide.includes("¿Ya sabe cómo añadir un sitio web a la pantalla de inicio o al escritorio?"));
assert(spanishGuide.includes("Añadir a pantalla de inicio") && spanishGuide.includes("Instalar aplicación"));
assert(spanishGuide.includes("NRV todavía se está probando en distintos dispositivos y navegadores. Si algo no funciona como se espera, háganoslo saber."));
assert(
  !/grasfulls\.github\.io\/nice-return-visits-app/.test(
    userFacingPages
      .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
      .join("\n"),
  ),
  "public app links do not disclose the previous hosting address",
);

console.log("PASS  public app links use /app/ with English/Spanish language handoff");
console.log("PASS  migration guidance protects data from the previous origin");
