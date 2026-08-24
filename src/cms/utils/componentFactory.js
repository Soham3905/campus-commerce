import { ComponentRegistry } from "../../registry/componentRegistry";
import { generateId } from "./idUtils";

/**
 * Creates a valid, normalized SDUI component instance using metadata from ComponentRegistry.
 * @param {string} type - Component type name (e.g. 'HeroBanner', 'SearchBar')
 * @param {Object} [overrides={}] - Optional property overrides
 * @returns {Object} A fully valid SDUI component JSON node
 */
export function createComponent(type, overrides = {}) {
  const definition = ComponentRegistry[type];
  if (!definition) {
    console.warn(`[createComponent] Unknown component type "${type}". Using fallback definition.`);
  }

  const id = overrides.id || generateId(type);
  const defaultData = definition?.defaultData ? JSON.parse(JSON.stringify(definition.defaultData)) : {};
  const defaultPlacement = definition?.defaultPlacement ? JSON.parse(JSON.stringify(definition.defaultPlacement)) : {};
  const defaultContainerStyle = definition?.defaultContainerStyle ? JSON.parse(JSON.stringify(definition.defaultContainerStyle)) : {};

  return {
    id,
    type,
    data: {
      ...defaultData,
      ...(overrides.data || {}),
    },
    placement: {
      ...defaultPlacement,
      ...(overrides.placement || {}),
    },
    containerStyle: {
      ...defaultContainerStyle,
      ...(overrides.containerStyle || {}),
    },
    actions: {
      ...(overrides.actions || {}),
    },
    ...(definition?.canHaveChildren || overrides.children ? { children: overrides.children || [] } : {}),
  };
}
