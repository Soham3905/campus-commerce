/**
 * Collision Detection Module for SDUI Responsive Grids
 * Checks 2D rectangular overlap in coordinate space (colStart..colEnd, rowStart..rowEnd).
 */

/**
 * Checks if two 2D grid placement boxes overlap.
 * @param {Object} boxA - { colStart, colEnd, rowStart, rowEnd }
 * @param {Object} boxB - { colStart, colEnd, rowStart, rowEnd }
 * @returns {boolean} True if boxes overlap in both column and row space
 */
export function checkOverlap(boxA, boxB) {
  if (!boxA || !boxB) return false;

  const aColStart = Number(boxA.colStart) || 1;
  const aColEnd = Number(boxA.colEnd) || 101;
  const aRowStart = Number(boxA.rowStart) || 1;
  const aRowEnd = Number(boxA.rowEnd) || 10;

  const bColStart = Number(boxB.colStart) || 1;
  const bColEnd = Number(boxB.colEnd) || 101;
  const bRowStart = Number(boxB.rowStart) || 1;
  const bRowEnd = Number(boxB.rowEnd) || 10;

  // Horizontal overlap condition
  const horizontalOverlap = aColStart < bColEnd && aColEnd > bColStart;
  // Vertical overlap condition
  const verticalOverlap = aRowStart < bRowEnd && aRowEnd > bRowStart;

  return horizontalOverlap && verticalOverlap;
}

/**
 * Finds all overlapping sibling nodes for a given candidate placement.
 * @param {Array<Object>} siblings - List of sibling SDUI nodes
 * @param {Object} candidatePlacement - { colStart, colEnd, rowStart, rowEnd }
 * @param {string} deviceType - 'mobile' | 'tablet' | 'desktop'
 * @param {string} [excludeId] - Optional node ID to exclude from collision check (e.g. self)
 * @returns {Array<Object>} Array of colliding sibling nodes
 */
export function findCollisions(siblings, candidatePlacement, deviceType = "desktop", excludeId = null) {
  if (!Array.isArray(siblings) || !candidatePlacement) return [];

  return siblings.filter((sibling) => {
    if (!sibling || sibling.id === excludeId) return false;
    const siblingBox = sibling.placement?.[deviceType];
    if (!siblingBox) return false;
    return checkOverlap(candidatePlacement, siblingBox);
  });
}
