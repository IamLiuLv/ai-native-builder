import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OSS from "ali-oss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const sourceDir = path.resolve(
  repoRoot,
  process.env.OSS_SOURCE_DIR ?? "docs/.vitepress/dist",
);
const prefix = (process.env.OSS_PREFIX ?? "").replace(/^\/+|\/+$/g, "");
const prune = process.argv.includes("--delete") || process.env.OSS_DELETE === "true";
const dryRun = process.argv.includes("--dry-run");

const requiredEnv = [
  "OSS_REGION",
  "OSS_BUCKET",
  "OSS_ACCESS_KEY_ID",
  "OSS_ACCESS_KEY_SECRET",
];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
  throw new Error(`Build directory does not exist: ${sourceDir}`);
}

if (!fs.existsSync(path.join(sourceDir, "index.html"))) {
  throw new Error(`Build directory has no index.html: ${sourceDir}`);
}

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
  [".zip", "application/zip"],
]);

function walk(dir, base = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = path.join(base, entry.name);
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(absolute, relative));
    } else if (entry.isFile()) {
      files.push({ absolute, relative: relative.replaceAll(path.sep, "/") });
    }
  }
  return files;
}

function objectKey(relative) {
  return prefix ? `${prefix}/${relative}` : relative;
}

function isHtmlLikeKey(key) {
  return key.endsWith(".html") || path.extname(key) === "";
}

function cacheControlFor(key) {
  if (isHtmlLikeKey(key) || key.endsWith("hashmap.json")) {
    return "no-cache";
  }
  if (/(^|\/)assets\//.test(key)) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=3600";
}

async function listRemoteKeys(client) {
  const keys = [];
  let marker = "";

  do {
    const result = await client.list({
      prefix: prefix ? `${prefix}/` : "",
      marker,
      "max-keys": 1000,
    });
    for (const object of result.objects ?? []) {
      keys.push(object.name);
    }
    marker = result.nextMarker ?? "";
  } while (marker);

  return keys;
}

async function runPool(items, concurrency, worker) {
  let next = 0;
  const failures = [];

  async function run() {
    while (next < items.length) {
      const item = items[next++];
      try {
        await worker(item);
      } catch (error) {
        failures.push({ item, error });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, run));
  return failures;
}

const files = walk(sourceDir).map((file) => ({
  ...file,
  key: objectKey(file.relative),
}));
const localKeys = new Set(files.map((file) => file.key));

console.log(`Source: ${sourceDir}`);
console.log(`Target: oss://${process.env.OSS_BUCKET}/${prefix || ""}`);
console.log(`Files: ${files.length}`);
console.log(`Delete stale objects: ${prune ? "yes" : "no"}`);

const client = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  secure: true,
});

const remoteKeys = prune ? await listRemoteKeys(client) : [];
const staleKeys = prune
  ? remoteKeys.filter((key) => !localKeys.has(key))
  : [];

if (prune) {
  console.log(`Remote objects before upload: ${remoteKeys.length}`);
  console.log(`Stale objects to delete after upload: ${staleKeys.length}`);
}

if (dryRun) {
  console.log("Dry run complete. Nothing was uploaded.");
  process.exit(0);
}

const failures = await runPool(files, 8, async (file) => {
  const extension = path.extname(file.key).toLowerCase();
  const contentType =
    contentTypes.get(extension) ??
    (isHtmlLikeKey(file.key) ? "text/html; charset=utf-8" : undefined);
  await client.put(file.key, file.absolute, {
    headers: {
      "Cache-Control": cacheControlFor(file.key),
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
  });
});

if (failures.length > 0) {
  for (const { item, error } of failures.slice(0, 20)) {
    console.error(`Failed: ${item.key}: ${error.message}`);
  }
  throw new Error(`${failures.length} upload(s) failed; stale objects were not deleted.`);
}

console.log(`Uploaded ${files.length} files.`);

if (prune && staleKeys.length > 0) {
  for (let index = 0; index < staleKeys.length; index += 1000) {
    const batch = staleKeys.slice(index, index + 1000);
    await client.deleteMulti(batch, { quiet: true });
    console.log(`Deleted ${Math.min(index + batch.length, staleKeys.length)}/${staleKeys.length} stale objects.`);
  }
}

console.log("OSS deployment complete.");
