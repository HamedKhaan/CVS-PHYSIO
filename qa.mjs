import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const moduleDir = path.join(root, "src", "modules");
const files = fs.readdirSync(moduleDir).filter(f => f.endsWith(".jsx")).sort();

const forbidden = [
  /eval\s*\(/,
  /new\s+Function\s*\(/,
  /https?:\/\/(?!localhost)/i,
  /fetch\s*\(/,
  /XMLHttpRequest/i
];

const problems = [];
for (const file of files) {
  const text = fs.readFileSync(path.join(moduleDir, file), "utf8");
  for (const rx of forbidden) {
    if (rx.test(text)) problems.push(`${file}: ${rx}`);
  }
}

if (files.length !== 5) problems.push(`Expected 5 implemented modules, found ${files.length}.`);

const app = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
for (const id of ["06","07","08"]) {
  if (!app.includes(`id: "${id}"`)) problems.push(`Missing reserved module ${id}.`);
}

if (problems.length) {
  console.error("QA FAILED");
  problems.forEach(p => console.error(" -", p));
  process.exit(1);
}
console.log(`QA PASS — ${files.length} implemented modules; 06–08 reserved.`);
