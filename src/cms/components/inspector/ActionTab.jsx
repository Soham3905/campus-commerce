import React, { useState } from "react";
import { ActionRegistry, SUPPORTED_EVENTS } from "../../../registry/actionRegistry";
import { colors, commonStyles } from "../../theme";

export const ActionTab = ({ node, definition, onUpdate }) => {
  if (!node) return null;

  const supportedEvents = definition?.supportedEvents || ["onTap"];
  const [selectedEventKey, setSelectedEventKey] = useState(supportedEvents[0] || "onTap");

  const actions = node.actions || {};
  const currentAction = actions[selectedEventKey];

  const handleActionTypeChange = (newType) => {
    if (!newType) {
      // Remove action for this event
      const updatedActions = { ...actions };
      delete updatedActions[selectedEventKey];
      onUpdate(node.id, { actions: updatedActions });
      return;
    }

    const actionDef = ActionRegistry[newType];
    const defaultFields = {};
    actionDef?.fields?.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaultFields[f.name] = f.defaultValue;
      }
    });

    onUpdate(node.id, {
      actions: {
        ...actions,
        [selectedEventKey]: {
          type: newType,
          ...defaultFields,
        },
      },
    });
  };

  const handleParamChange = (paramName, value) => {
    if (!currentAction) return;

    onUpdate(node.id, {
      actions: {
        ...actions,
        [selectedEventKey]: {
          ...currentAction,
          [paramName]: value,
        },
      },
    });
  };

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Event Selector */}
      <div>
        <label style={commonStyles.label}>Trigger Event</label>
        <select
          style={commonStyles.input}
          value={selectedEventKey}
          onChange={(e) => setSelectedEventKey(e.target.value)}
        >
          {supportedEvents.map((evtKey) => {
            const evtInfo = SUPPORTED_EVENTS.find((e) => e.key === evtKey) || { label: evtKey };
            const hasBoundAction = Boolean(actions[evtKey]);
            return (
              <option key={evtKey} value={evtKey}>
                {hasBoundAction ? "⚡ " : ""}{evtInfo.label} ({evtKey})
              </option>
            );
          })}
        </select>
      </div>

      {/* Action Type Selector */}
      <div>
        <label style={commonStyles.label}>Action Behavior</label>
        <select
          style={commonStyles.input}
          value={currentAction?.type || ""}
          onChange={(e) => handleActionTypeChange(e.target.value)}
        >
          <option value="">(None / No Action)</option>
          {Object.values(ActionRegistry).map((act) => (
            <option key={act.type} value={act.type}>
              {act.icon} {act.label} ({act.type})
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Action Parameters Form */}
      {currentAction?.type && ActionRegistry[currentAction.type] && (
        <div
          style={{
            background: colors.bgCard,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: "6px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textAccent, marginBottom: "4px" }}>
            Configure {ActionRegistry[currentAction.type].label}
          </div>

          {ActionRegistry[currentAction.type].fields?.map((f) => {
            const val = currentAction[f.name] !== undefined ? currentAction[f.name] : f.defaultValue ?? "";

            return (
              <div key={f.name} style={{ marginBottom: "6px" }}>
                <label style={commonStyles.label}>{f.label}</label>

                {f.type === "select" ? (
                  <select
                    style={commonStyles.input}
                    value={val}
                    onChange={(e) => handleParamChange(f.name, e.target.value)}
                  >
                    {f.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    style={commonStyles.input}
                    value={val}
                    onChange={(e) =>
                      handleParamChange(
                        f.name,
                        f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value
                      )
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
