/**
 * Reflow Engine for SDUI Components
 * Deterministically recalculates row start/end coordinates to ensure collision-free vertical layout.
 */

import { getDefaultRowSpan, getDefaultColSpan, allowsOverlayLayout } from "./layoutRules";

const DEVICES = ["mobile", "tablet", "desktop"];
const DEFAULT_ROW_GAP = 1;

/**
 * Reflows an array of children sequentially for a specific device view or all devices.
 * Ensures that visual order matches logical order and no accidental overlap occurs.
 *
 * @param {Array<Object>} children - Child component nodes
 * @param {string} [targetDevice] - 'mobile' | 'tablet' | 'desktop' | 'all'
 * @param {Object} [options] - Options (gap, parentType)
 * @returns {Array<Object>} Children with clean, non-overlapping placement coordinates
 */
export function reflowChildren(children, targetDevice = "all", options = {}) {
  if (!Array.isArray(children) || children.length === 0) return children || [];

  const { gap = DEFAULT_ROW_GAP, parentType = "Page" } = options;

  // If parent intentionally allows overlays, don't force vertical stacking
  if (allowsOverlayLayout(parentType)) {
    return children;
  }

  const devicesToProcess = targetDevice === "all" ? DEVICES : [targetDevice];

  // Deep clone children so mutation is isolated
  let updatedChildren = children.map((c) => ({
    ...c,
    placement: {
      ...(c.placement || {}),
    },
  }));

  devicesToProcess.forEach((device) => {
    let currentRow = 1;

    updatedChildren = updatedChildren.map((child) => {
      const existingPlacement = child.placement?.[device] || {};
      const colStart = Number(existingPlacement.colStart) || 1;
      const colEnd =
        Number(existingPlacement.colEnd) ||
        Math.min(101, colStart + getDefaultColSpan(child.type));

      // Calculate existing row height or fallback to default span
      let rowSpan = getDefaultRowSpan(child.type);
      if (
        typeof existingPlacement.rowStart === "number" &&
        typeof existingPlacement.rowEnd === "number" &&
        existingPlacement.rowEnd > existingPlacement.rowStart
      ) {
        rowSpan = existingPlacement.rowEnd - existingPlacement.rowStart;
      }

      const rowStart = currentRow;
      const rowEnd = rowStart + rowSpan;

      // Advance currentRow for next sibling
      currentRow = rowEnd + gap;

      return {
        ...child,
        placement: {
          ...child.placement,
          [device]: {
            colStart,
            colEnd,
            rowStart,
            rowEnd,
          },
        },
      };
    });
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

  // Insert the newNode into the list
  currentList.splice(safeIndex, 0, newNode);

  // Run reflow on all or specified device view
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
