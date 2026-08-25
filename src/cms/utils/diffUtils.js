/**
 * Structured Diff Utility for Pull Requests and Version History
 * Compares two SDUI schema trees to produce a human-friendly change summary.
 */

function flattenTree(node, parentPath = "", index = 0, result = {}) {
  if (!node || typeof node !== "object") return result;

  const currentPath = parentPath ? `${parentPath} > ${node.type}` : node.type;
  const key = node.id || `${node.type}_${index}`;

  result[key] = {
    id: node.id,
    type: node.type,
    themeId: node.themeId,
    data: node.data || {},
    containerStyle: node.containerStyle || {},
    placement: node.placement || {},
    actions: node.actions || {},
    path: currentPath,
    index,
  };

  if (Array.isArray(node.children)) {
    node.children.forEach((child, childIndex) => {
      flattenTree(child, currentPath, childIndex, result);
    });
  }

  return result;
}

/**
 * Calculates human-readable structured diff between two schema trees.
 * @param {Object} beforeTree
 * @param {Object} afterTree
 * @returns {Array<{ type: 'ADDED'|'REMOVED'|'MODIFIED'|'MOVED'|'THEME_CHANGE', componentType: string, summary: string, details?: string }>}
 */
export function calculateStructuredDiff(beforeTree, afterTree) {
  const beforeNodes = flattenTree(beforeTree);
  const afterNodes = flattenTree(afterTree);

  const changes = [];

  // Check added nodes
  Object.keys(afterNodes).forEach((key) => {
    if (!beforeNodes[key]) {
      const node = afterNodes[key];
      changes.push({
        type: "ADDED",
        componentType: node.type,
        summary: `Added ${node.type} component`,
        details: `Inserted at ${node.path}`,
      });
    }
  });

  // Check removed nodes
  Object.keys(beforeNodes).forEach((key) => {
    if (!afterNodes[key]) {
      const node = beforeNodes[key];
      changes.push({
        type: "REMOVED",
        componentType: node.type,
        summary: `Removed ${node.type} component`,
        details: `Was located at ${node.path}`,
      });
    }
  });

  // Check modified or moved nodes
  Object.keys(afterNodes).forEach((key) => {
    if (beforeNodes[key]) {
      const b = beforeNodes[key];
      const a = afterNodes[key];

      // Theme Change
      if (b.themeId !== a.themeId) {
        changes.push({
          type: "THEME_CHANGE",
          componentType: a.type,
          summary: `Theme changed for ${a.type}`,
          details: `Changed from "${b.themeId || "Default"}" to "${a.themeId || "Default"}"`,
        });
      }

      // Position / Path change (Moved)
      if (b.path !== a.path || b.index !== a.index) {
        changes.push({
          type: "MOVED",
          componentType: a.type,
          summary: `Moved ${a.type} position`,
          details: `Reordered within ${a.path} (index ${b.index} → ${a.index})`,
        });
      }

      // Data change
      const bDataStr = JSON.stringify(b.data);
      const aDataStr = JSON.stringify(a.data);
      if (bDataStr !== aDataStr) {
        changes.push({
          type: "MODIFIED",
          componentType: a.type,
          summary: `Content updated for ${a.type}`,
          details: Object.keys(a.data || {})
            .filter((k) => a.data[k] !== b.data?.[k])
            .map((k) => `"${k}": "${a.data[k]}"`)
            .join(", "),
        });
      }

      // Placement change
      const bPlacementStr = JSON.stringify(b.placement);
      const aPlacementStr = JSON.stringify(a.placement);
      if (bPlacementStr !== aPlacementStr) {
        changes.push({
          type: "MODIFIED",
          componentType: a.type,
          summary: `Layout coordinates updated for ${a.type}`,
          details: "Responsive grid bounds adjusted",
        });
      }
    }
  });

  return changes;
}

export default {
  calculateStructuredDiff,
};
