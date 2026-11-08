import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.resolve(
  repoRoot,
  process.env.SITE_OUT_DIR ?? "docs/.vitepress/dist",
);

if (!fs.existsSync(distDir)) {
  throw new Error(`Build directory does not exist: ${distDir}`);
}

function walk(dir, base = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = path.join(base, entry.name);
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(absolute, relative));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push({ absolute, relative });
    }
  }
  return files;
}

let count = 0;
for (const file of walk(distDir)) {
  // index.html and 404.html are handled directly by the static host.
  if (file.relative === "index.html" || file.relative === "404.html") {
    continue;
  }

  const alias = path.join(distDir, file.relative.slice(0, -".html".length));
  fs.mkdirSync(path.dirname(alias), { recursive: true });
  fs.copyFileSync(file.absolute, alias);
  count++;
}

console.log(`Created ${count} clean URL aliases.`);
