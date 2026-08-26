/**
 * Atomic JSON Repository
 * Provides safe, non-blocking file-based CRUD operations with atomic write semantics
 * (writing to a temporary file before renaming to prevent corrupted state on failures).
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");

export const JsonRepository = {
  /**
   * Resolves full file path for a JSON dataset.
   * @param {string} fileName - Name of file (e.g. 'pages.json')
   * @returns {string} Absolute path
   */
  getFilePath(fileName) {
    const normalizedName = fileName.endsWith(".json") ? fileName : `${fileName}.json`;
    return path.join(DATA_DIR, normalizedName);
  },

  /**
   * Ensures the data directory exists.
   */
  async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
  },

  /**
   * Reads and parses a JSON dataset. If file doesn't exist, initializes with defaultData.
   * @param {string} fileName - File name
   * @param {Array|Object} [defaultData=[]] - Fallback default content
   * @returns {Promise<Array|Object>} Parsed JSON content
   */
  async read(fileName, defaultData = []) {
    await this.ensureDataDir();
    const filePath = this.getFilePath(fileName);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      if (err.code === "ENOENT") {
        await this.write(fileName, defaultData);
        return defaultData;
      }
      throw new Error(`[JsonRepository] Failed to read ${fileName}: ${err.message}`);
    }
  },

  /**
   * Atomically writes data to JSON file via a temporary file swap.
   * @param {string} fileName - Target file name
   * @param {Array|Object} data - Data to serialize
   * @returns {Promise<boolean>}
   */
  async write(fileName, data) {
    await this.ensureDataDir();
    const filePath = this.getFilePath(fileName);
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;

    try {
      const serialized = JSON.stringify(data, null, 2);
      // 1. Write to temporary file
      await fs.writeFile(tempPath, serialized, "utf-8");
      // 2. Atomic rename / replace
      await fs.rename(tempPath, filePath);
      return true;
    } catch (err) {
      // Clean up orphaned temp file if write/rename failed
      try {
        await fs.unlink(tempPath);
      } catch (_) {}
      throw new Error(`[JsonRepository] Atomic write failed for ${fileName}: ${err.message}`);
    }
  },

  /**
   * Finds records matching a predicate.
   * @param {string} fileName
   * @param {Function} predicate
   * @returns {Promise<Array>}
   */
  async find(fileName, predicate) {
    const list = await this.read(fileName, []);
    return Array.isArray(list) ? list.filter(predicate) : [];
  },

  /**
   * Finds a single record by predicate.
   * @param {string} fileName
   * @param {Function} predicate
   * @returns {Promise<Object|null>}
   */
  async findOne(fileName, predicate) {
    const list = await this.read(fileName, []);
    return Array.isArray(list) ? list.find(predicate) || null : null;
  },

  /**
   * Inserts a record into a collection.
   * @param {string} fileName
   * @param {Object} record
   * @returns {Promise<Object>} Inserted record
   */
  async insert(fileName, record) {
    const list = await this.read(fileName, []);
    if (!Array.isArray(list)) {
      throw new Error(`[JsonRepository] Cannot insert into non-array dataset ${fileName}`);
    }
    const updated = [record, ...list];
    await this.write(fileName, updated);
    return record;
  },

  /**
   * Updates an existing record by ID or predicate.
   * @param {string} fileName
   * @param {string|Function} match - ID string or predicate function
   * @param {Object|Function} updater - Partial update object or updater function
   * @returns {Promise<Object|null>} Updated record or null if not found
   */
  async update(fileName, match, updater) {
    const list = await this.read(fileName, []);
    if (!Array.isArray(list)) {
      throw new Error(`[JsonRepository] Cannot update non-array dataset ${fileName}`);
    }

    const index =
      typeof match === "function"
        ? list.findIndex(match)
        : list.findIndex((item) => item.id === match);

    if (index === -1) return null;

    const existing = list[index];
    const updatedRecord =
      typeof updater === "function"
        ? updater(existing)
        : {
            ...existing,
            ...updater,
            updatedAt: new Date().toISOString(),
          };

    list[index] = updatedRecord;
    await this.write(fileName, list);
    return updatedRecord;
  },

  /**
   * Removes records matching ID or predicate.
   * @param {string} fileName
   * @param {string|Function} match - ID string or predicate function
   * @returns {Promise<boolean>} True if removed
   */
  async remove(fileName, match) {
    const list = await this.read(fileName, []);
    if (!Array.isArray(list)) {
      throw new Error(`[JsonRepository] Cannot remove from non-array dataset ${fileName}`);
    }

    const initialLength = list.length;
    const filtered =
      typeof match === "function"
        ? list.filter((item) => !match(item))
        : list.filter((item) => item.id !== match);

    if (filtered.length !== initialLength) {
      await this.write(fileName, filtered);
      return true;
    }
    return false;
  },
};

export default JsonRepository;
