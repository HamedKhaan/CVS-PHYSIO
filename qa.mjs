import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const modulesDir = path.join(root, "src", "modules");
const files = fs.readdirSync(modulesDir).filter((f) => f.endsWith(".jsx")).sort();

const failures = [];

for (const file of files) {
  const p = path.join(modulesDir, file);
  const s = fs.readFileSync(p, "utf8");

  if (s.includes("<ResponsiveContainer") && !s.includes('from "../components/ChartContainer";')) {
    failures.push(`${file}: missing ChartContainer import`);
  }
  if (s.includes("<ResponsiveContainer") && (s.match(/<ChartContainer/g) || []).length === 0) {
    failures.push(`${file}: ResponsiveContainer without ChartContainer`);
  }
}

if (!fs.existsSync(path.join(root, "src", "components", "ChartContainer.jsx"))) {
  failures.push("Missing src/components/ChartContainer.jsx");
}

if (failures.length) {
  console.error("QA FAILED");
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`QA OK: ${files.length} module files checked.`);
