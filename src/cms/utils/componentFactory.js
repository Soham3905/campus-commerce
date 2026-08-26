/**
 * Component Factory — Single unified creation pipeline for all SDUI component instances.
 * Resolves default theme blueprints, deep clones child hierarchies, generates fresh unique IDs,
 * and ensures components are fully populated on creation.
 */

import { ComponentRegistry } from "../../registry/componentRegistry";
import { ThemeRepository } from "../services/themeRepository";
import { FoundationRepository } from "../services/foundationRepository";
import { generateId, ensureStableIds } from "./idUtils";

/**
 * Creates a fully populated SDUI component instance.
 *
 * @param {string} type - Component type (e.g. 'ProductCard', 'Header', 'HeroBanner')
 * @param {Object} [overrides={}] - Optional overrides (data, containerStyle, placement, children, themeId)
 * @returns {Object} A fully valid, populated SDUI component JSON node
 */
export function createComponent(type, overrides = {}) {
  const definition = ComponentRegistry[type];
  if (!definition) {
    console.warn(`[createComponent] Unknown component type "${type}". Using fallback definition.`);
  }

  // 1. Resolve Theme Blueprint
  const themeId =
    overrides.themeId ||
    FoundationRepository.getDefaultThemeId(type) ||
    ThemeRepository.getByComponentType(type)[0]?.id;

  const theme = themeId ? ThemeRepository.getById(themeId) : null;

  // 2. Extract Blueprint Defaults
  const blueprintData = theme?.defaultData
    ? JSON.parse(JSON.stringify(theme.defaultData))
    : definition?.defaultData
    ? JSON.parse(JSON.stringify(definition.defaultData))
    : {};

  const blueprintContainerStyle = theme?.styles || theme?.containerStyle
    ? JSON.parse(JSON.stringify(theme.styles || theme.containerStyle))
    : definition?.defaultContainerStyle
    ? JSON.parse(JSON.stringify(definition.defaultContainerStyle))
    : {};

  const blueprintPlacement = theme?.defaultPlacement
    ? JSON.parse(JSON.stringify(theme.defaultPlacement))
    : definition?.defaultPlacement
    ? JSON.parse(JSON.stringify(definition.defaultPlacement))
    : {};

  const blueprintChildren = Array.isArray(overrides.children)
    ? overrides.children
    : theme?.defaultChildren
    ? JSON.parse(JSON.stringify(theme.defaultChildren))
    : definition?.canHaveChildren
    ? []
    : undefined;

  // 3. Assemble Base Object
  const rootId = overrides.id || generateId(type);

  const baseNode = {
    id: rootId,
    type,
    data: {
      ...blueprintData,
      ...(overrides.data || {}),
    },
    placement: {
      ...blueprintPlacement,
      ...(overrides.placement || {}),
    },
    containerStyle: {
      ...blueprintContainerStyle,
      ...(overrides.containerStyle || {}),
    },
    actions: {
      ...(overrides.actions || {}),
    },
  };

  if (blueprintChildren !== undefined) {
    baseNode.children = blueprintChildren;
  }

  // 4. Deep ID Generation — ensure every child and descendant has a unique, fresh ID
  const populatedInstance = ensureStableIds(baseNode, new Set());
  populatedInstance.id = rootId;

  return populatedInstance;
}

/**
 * Creates a duplicate of an existing component instance with independent fresh IDs.
 * @param {Object} node - Source component node
 * @returns {Object} Deep-cloned duplicate with fresh IDs
 */
export function duplicateComponent(node) {
  if (!node) return null;
  const clone = JSON.parse(JSON.stringify(node));
  const duplicated = ensureStableIds(clone, new Set());

  // Update label / title with copy tag if available
  if (duplicated.data?.title) {
    duplicated.data.title = `${duplicated.data.title} (Copy)`;
  } else if (duplicated.data?.label) {
    duplicated.data.label = `${duplicated.data.label} (Copy)`;
  }

  return duplicated;
}

export default {
  createComponent,
  duplicateComponent,
};
