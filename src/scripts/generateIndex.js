import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";

const __dirname = import.meta.dirname;

const IMAGE_DIR = join(__dirname, "../../public/img");
const INDEX_PATH = join(__dirname, "../data/imageIndex.json");
const DEFAULT_ELO = 1000;

// 1. Load existing index if present
let existingIndex = [];
if (existsSync(INDEX_PATH)) {
  try {
    existingIndex = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  } catch (e) {
    console.error("Failed to load existing index:", e);
  }
}

// 2. Recursively walk directory
function getAllImages(dir, base = "") {
  const entries = readdirSync(dir, { withFileTypes: true });
  let result = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = join(base, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      result = result.concat(getAllImages(fullPath, relativePath));
    } else {
      const id = relativePath.split("/").at(-1);
      const categories = dirname(relativePath).split("/");

      const existingEntry =
        existingIndex.length > 0 && existingIndex.find((img) => img.id === id);

      const elo = existingEntry ? existingEntry.elo : DEFAULT_ELO;

      result.push({
        id,
        path: `/img/${relativePath}`,
        categories,
        elo,
      });
    }
  }

  return result;
}

// 3. Generate new index
const images = getAllImages(IMAGE_DIR);

// 4. Save to JSON
writeFileSync(INDEX_PATH, JSON.stringify(images, null, 2));
console.log(`Indexed ${images.length} images.`);
