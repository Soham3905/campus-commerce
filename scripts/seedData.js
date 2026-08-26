import fs from "fs/promises";
import path from "path";
import { defaultPages } from "../src/schema/defaultPages.js";
import { defaultInterfaces } from "../src/schema/defaultInterfaces.js";
import { PredefinedThemes } from "../src/registry/themeRegistry.js";

const DATA_DIR = path.resolve("./server/data");

async function seed() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // 1. Pages
  await fs.writeFile(
    path.join(DATA_DIR, "pages.json"),
    JSON.stringify(defaultPages, null, 2),
    "utf-8"
  );
  console.log("Seeded pages.json with", defaultPages.length, "pages");

  // 2. Interfaces
  await fs.writeFile(
    path.join(DATA_DIR, "interfaces.json"),
    JSON.stringify(defaultInterfaces, null, 2),
    "utf-8"
  );
  console.log("Seeded interfaces.json with", defaultInterfaces.length, "interfaces");

  // 3. Themes
  const themesList = Object.values(PredefinedThemes);
  await fs.writeFile(
    path.join(DATA_DIR, "themes.json"),
    JSON.stringify(themesList, null, 2),
    "utf-8"
  );
  console.log("Seeded themes.json with", themesList.length, "themes");
}

seed().catch((err) => {
  console.error("Failed to seed data:", err);
  process.exit(1);
});
