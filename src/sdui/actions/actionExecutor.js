/**
 * Core action executor for SDUI events
 * @param {Object} option - Option containing action definition
 * @param {import('../../types/sdui.types').SDUIAction} [option.action]
 */
export async function executeOptionAction(option) {
  const action = option?.action;
  if (!action) return;

  if (action.type === "API_CALL") {
    console.log(`[API_CALL] Action: ${action.actionName || "UNNAMED"} — fetching endpoint:`, action.endpoint);
    if (!action.endpoint) return;
    try {
      const response = await fetch(action.endpoint);
      if (!response.ok) {
        console.warn(`[API_CALL] Request to ${action.endpoint} failed with status: ${response.status}`);
        return;
      }
      const json = await response.json();
      console.log("[API_CALL] Response:", json);
      return json;
    } catch (err) {
      console.error("[API_CALL] Error:", err);
      throw err;
    }
  }

  if (action.type === "COPY_TO_CLIPBOARD") {
    console.log(`[COPY_TO_CLIPBOARD] Copied: ${action.value}`);
    if (navigator?.clipboard?.writeText && action.value) {
      await navigator.clipboard.writeText(action.value);
    }
  }
}
