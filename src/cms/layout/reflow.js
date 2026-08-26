/**
 * Reflow Engine for SDUI Components
 * Deterministically recalculates 2D grid coordinates (column packing & row heights)
 * to support responsive side-by-side multi-column layouts without accidental overlaps.
 */

import { getDefaultRowSpan, getDefaultColSpan, allowsOverlayLayout } from "./layoutRules";

const DEVICES = ["mobile", "tablet", "desktop"];
const DEFAULT_ROW_GAP = 1;
const MAX_GRID_COLUMNS = 100;

/**
 * Reflows an array of children sequentially for a specific device view or all devices.
 * Uses 2D Grid Row Band packing: items whose column spans fit horizontally in the 100-col grid
 * share the same row band with matched row heights.
 *
 * @param {Array<Object>} children - Child component nodes
 * @param {string} [targetDevice='all'] - 'mobile' | 'tablet' | 'desktop' | 'all'
 * @param {Object} [options={}] - Options (gap, parentType)
 * @returns {Array<Object>} Children with clean, non-overlapping 2D grid coordinates
 */
export function reflowChildren(children, targetDevice = "all", options = {}) {
  if (!Array.isArray(children) || children.length === 0) return children || [];

  const { gap = DEFAULT_ROW_GAP, parentType = "Page" } = options;

  // If parent intentionally allows overlays (e.g. HeroBanner), preserve exact coordinates
  if (allowsOverlayLayout(parentType)) {
    return children;
  }

  const devicesToProcess = targetDevice === "all" ? DEVICES : [targetDevice];

  // Deep clone children
  let updatedChildren = children.map((c) => ({
    ...c,
    placement: {
      ...(c.placement || {}),
    },
  }));

  devicesToProcess.forEach((device) => {
    let currentRowStart = 1;
    let currentBand = []; // Array of { index, colStart, colEnd, rowSpan }

    const commitBand = () => {
      if (currentBand.length === 0) return;

      const maxSpanInBand = Math.max(...currentBand.map((item) => item.rowSpan), 1);
      const rowEnd = currentRowStart + maxSpanInBand;

      currentBand.forEach((item) => {
        const child = updatedChildren[item.index];
        updatedChildren[item.index] = {
          ...child,
          placement: {
            ...child.placement,
            [device]: {
              colStart: item.colStart,
              colEnd: item.colEnd,
              rowStart: currentRowStart,
              rowEnd: rowEnd,
            },
          },
        };
      });

      currentRowStart = rowEnd + gap;
      currentBand = [];
    };

    updatedChildren.forEach((child, index) => {
      const existingPlacement = child.placement?.[device] || {};
      let colStart = Number(existingPlacement.colStart);
      let colEnd = Number(existingPlacement.colEnd);

      if (isNaN(colStart) || colStart < 1) colStart = 1;
      if (isNaN(colEnd) || colEnd <= colStart) {
        const defaultColSpan = getDefaultColSpan(child.type);
        colEnd = Math.min(MAX_GRID_COLUMNS + 1, colStart + defaultColSpan);
      }

      // Clamp columns to 1..101 range
      colStart = Math.max(1, Math.min(MAX_GRID_COLUMNS, colStart));
      colEnd = Math.max(colStart + 1, Math.min(MAX_GRID_COLUMNS + 1, colEnd));

      // Calculate rowSpan for this specific device
      const defaultSpan = getDefaultRowSpan(child, device);
      let rowSpan = defaultSpan;
      if (
        typeof existingPlacement.rowStart === "number" &&
        typeof existingPlacement.rowEnd === "number" &&
        existingPlacement.rowEnd > existingPlacement.rowStart
      ) {
        rowSpan = Math.max(defaultSpan, existingPlacement.rowEnd - existingPlacement.rowStart);
      }
      rowSpan = Math.max(1, rowSpan);

      // Check if this child can fit in the current row band without horizontal overlap
      const hasHorizontalOverlap = currentBand.some(
        (bandItem) => colStart < bandItem.colEnd && colEnd > bandItem.colStart
      );

      // On mobile, full-width components (colStart 1, colEnd 100) automatically get their own row
      const isMobileFullWidth = device === "mobile" && colStart === 1 && colEnd >= 100;

      if (currentBand.length > 0 && (hasHorizontalOverlap || isMobileFullWidth)) {
        // Must start a new row band
        commitBand();
      }

      currentBand.push({
        index,
        colStart,
        colEnd,
        rowSpan,
      });
    });

    // Commit any trailing band
    commitBand();
  });

  return updatedChildren;
}

/**
 * Recalculates placement after inserting a new child at a given index.
 * @param {Array<Object>} children - Existing children
 * @param {number} insertIndex - Index to insert at (0-based)
 * @param {Object} newNode - Node being inserted
 * @param {string} [deviceType='all']
 * @param {Object} [options]
 * @returns {Array<Object>} Updated children array with new node inserted and reflowed
 */
export function insertAndReflow(children, insertIndex, newNode, deviceType = "all", options = {}) {
  const currentList = Array.isArray(children) ? [...children] : [];
  const safeIndex = Math.max(0, Math.min(insertIndex, currentList.length));

  currentList.splice(safeIndex, 0, newNode);
  return reflowChildren(currentList, deviceType, options);
}

/**
 * Recalculates placement after removing a child by index or ID.
 * @param {Array<Object>} children - Existing children
 * @param {string|number} target - Node ID or index to remove
 * @param {string} [deviceType='all']
 * @param {Object} [options]
 * @returns {Array<Object>} Updated children array reflowed
 */
export function removeAndReflow(children, target, deviceType = "all", options = {}) {
  if (!Array.isArray(children)) return [];

  let filtered;
  if (typeof target === "number") {
    filtered = children.filter((_, idx) => idx !== target);
  } else {
    filtered = children.filter((c) => c.id !== target);
  }

  return reflowChildren(filtered, deviceType, options);
}

/**
 * Moves a child from one index to another and reflows the entire list.
 * @param {Array<Object>} children - Existing children
 * @param {number} fromIndex - Source index
 * @param {number} toIndex - Target index
 * @param {string} [deviceType='all']
 * @param {Object} [options]
 * @returns {Array<Object>}
 */
export function moveAndReflow(children, fromIndex, toIndex, deviceType = "all", options = {}) {
  if (!Array.isArray(children) || children.length <= 1) return children || [];

  const copy = [...children];
  const safeFrom = Math.max(0, Math.min(fromIndex, copy.length - 1));
  const safeTo = Math.max(0, Math.min(toIndex, copy.length - 1));

  const [moved] = copy.splice(safeFrom, 1);
  copy.splice(safeTo, 0, moved);

  return reflowChildren(copy, deviceType, options);
}
