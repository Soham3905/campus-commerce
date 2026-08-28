/**
 * Foundation Theme Applicator
 * Re-skins an existing schema tree to match the user's currently selected
 * component themes (FoundationRepository.chosenThemes), so static/default
 * pages reflect onboarding theme choices instead of only affecting newly
 * added components.
 *
 * A node is only swapped when the foundation's chosen theme for its type is
 * an explicit customization (different from the standard baseline default)
 * AND the node hasn't already been re-themed to match — so the curated
 * default demo content is left untouched for the common case (user accepts
 * the defaults), while an explicit theme choice actually becomes visible on
 * the main page. When a swap does apply, the node is fully replaced via the
 * same createComponent pipeline used for newly added components (matching
 * the intended "main theme must use selected components" behavior), keeping
 * only its id/placement so layout position is preserved.
 *
 * A page may legitimately contain more than one node of a themeable type
 * (e.g. a top nav bar and a separate search row both registered as
 * `Header`). Only the first occurrence of each type is swapped, so picking
 * a "Header" theme re-skins the primary header instance without producing
 * duplicated full-header blocks where a second same-type node happens to
 * play a different structural role on the page.
 */

import { ThemeRepository } from "../services/themeRepository";
import { DEFAULT_FOUNDATION } from "../services/foundationRepository";
import { createComponent } from "./componentFactory";

function applyFoundationThemeInner(node, foundation, seenTypes, parentType) {
  if (!node || typeof node !== "object") return node;

  const chosenThemes = foundation?.chosenThemes || {};
  const themeId = chosenThemes[node.type];
  const baselineThemeId = DEFAULT_FOUNDATION.chosenThemes[node.type];
  const isCustomized = themeId && themeId !== baselineThemeId;

  // Never swap ProductCard nodes that live inside a ProductList — those are
  // real product data entries and should always render their own content.
  const isProductCardInList = node.type === "ProductCard" && parentType === "ProductList";

  // Claim the first occurrence of a customized type whether or not this
  // particular node ends up needing a swap (it may already match), so a
  // later same-type node on the page is never touched either way.
  if (isCustomized && !seenTypes.has(node.type) && !isProductCardInList) {
    seenTypes.add(node.type);
    if (node.themeId !== themeId && ThemeRepository.getById(themeId)) {
      const replacement = createComponent(node.type, {
        id: node.id,
        themeId,
        placement: node.placement,
      });
      return {
        ...replacement,
        children: Array.isArray(replacement.children) && replacement.children.length > 0
          ? replacement.children.map((child) => applyFoundationThemeInner(child, foundation, seenTypes, replacement.type))
          : Array.isArray(node.children) && node.children.length > 0
          ? node.children.map((child) => applyFoundationThemeInner(child, foundation, seenTypes, node.type))
          : replacement.children,
      };
    }
  }

  const children = Array.isArray(node.children)
    ? node.children.map((child) => applyFoundationThemeInner(child, foundation, seenTypes, node.type))
    : node.children;

  if (children === node.children) return node;
  return { ...node, children };
}

export function applyFoundationTheme(node, foundation) {
  return applyFoundationThemeInner(node, foundation, new Set());
}

export default applyFoundationTheme;
