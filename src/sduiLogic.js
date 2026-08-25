/**
 * SDUI Action & Logic Helpers
 * Centralized declarative action execution utilities.
 */

import { executeOptionAction } from "./sdui/actions/actionExecutor";
import { ActionType } from "./types/sdui.types";

export { executeOptionAction, ActionType };

export const SDUILogic = {
  executeAction: executeOptionAction,
  ActionType,
};

export default SDUILogic;
