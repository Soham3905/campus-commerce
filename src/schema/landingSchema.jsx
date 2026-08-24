import { fullPageJSON as rawFullPageJSON } from "../landingSchema";
import { ensureStableIds } from "../cms/utils/idUtils";

/**
 * Normalized fullPageJSON with guaranteed unique IDs on every node
 */
export const fullPageJSON = ensureStableIds(rawFullPageJSON);
