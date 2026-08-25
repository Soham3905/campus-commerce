/**
 * SDUI Grid Layout Engine
 * Unified engine for deterministic 2D layout calculation, free-cell allocation,
 * collision avoidance, and serialization into SDUI placement schemas.
 */

import { checkOverlap, findCollisions } from "./collision";
import { getDefaultRowSpan, getDefaultColSpan, allowsOverlayLayout } from "./layoutRules";
import { reflowChildren, insertAndReflow, removeAndReflow, moveAndReflow } from "./reflow";

export const GridEngine = {
  checkOverlap,
  findCollisions,
  getDefaultRowSpan,
  getDefaultColSpan,
  allowsOverlayLayout,
  reflowChildren,
  insertAndReflow,
  removeAndReflow,
  moveAndReflow,

  /**
   * Calculates next available row in a container for a new element.
   * @param {Array<Object>} siblings - Existing sibling nodes
   * @param {string} deviceType - 'mobile' | 'tablet' | 'desktop'
   * @param {number} [gap=1]
   * @returns {number} Next starting row coordinate
   */
  findNextAvailableRow(siblings, deviceType = "desktop", gap = 1) {
    if (!Array.isArray(siblings) || siblings.length === 0) return 1;

    let maxRowEnd = 1;
    siblings.forEach((s) => {
      const rowEnd = s.placement?.[deviceType]?.rowEnd;
      if (typeof rowEnd === "number" && rowEnd > maxRowEnd) {
        maxRowEnd = rowEnd;
      }
    });

    return maxRowEnd + gap;
  },

  /**
   * Generates default responsive placement for a component type.
   * @param {string} componentType
   * @param {number} [startRow=1]
   * @returns {Object} { mobile, tablet, desktop } placement object
   */
  generateDefaultPlacement(componentType, startRow = 1) {
    const rowSpan = getDefaultRowSpan(componentType);
    const colSpan = getDefaultColSpan(componentType);

    const calc = (colStart, maxSpan) => ({
      colStart,
      colEnd: Math.min(101, colStart + Math.min(colSpan, maxSpan)),
      rowStart: startRow,
      rowEnd: startRow + rowSpan,
    });

    return {
      mobile: calc(1, 100),
      tablet: calc(1, 100),
      desktop: calc(1, 100),
    };
  },

  /**
   * Serializes and sanitizes placement coordinates into standard SDUI placement object.
   * @param {Object} placement
   * @returns {Object} Sanitized placement object
   */
  serializePlacement(placement) {
    if (!placement || typeof placement !== "object") return {};

    const clean = {};
    ["mobile", "tablet", "desktop"].forEach((device) => {
      const coords = placement[device];
      if (coords && typeof coords === "object") {
        clean[device] = {
          colStart: Math.max(1, Math.min(100, Number(coords.colStart) || 1)),
          colEnd: Math.max(2, Math.min(101, Number(coords.colEnd) || 101)),
          rowStart: Math.max(1, Number(coords.rowStart) || 1),
          rowEnd: Math.max(2, Number(coords.rowEnd) || 10),
        };
      }
    });

    return clean;
  },
};

export default GridEngine;
