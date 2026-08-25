import React, { useState, useRef, useEffect } from "react";
import { ComponentMap } from "./ComponentMap";
import { ActionWrapper } from "./actions/ActionWrapper";
import { executeOptionAction } from "./actions/actionExecutor";
import { useSwipe } from "./hooks/useSwipe";
import { useLongPress } from "./hooks/useLongPress";
import { ComponentRegistry } from "../registry/componentRegistry";

/**
 * SDUI Renderer
 * Interprets JSON schemas, attaches responsive grid styles, executes declarative actions,
 * and renders nested component trees.
 *
 * Supports `isEditable` mode for visual drag-and-drop, selection outline, floating action pills,
 * and drop target detection directly on the live CSS Grid layout.
 */
export const SDUIRenderer = ({
  schema,
  deviceType = "desktop",
  openMenu,
  openSheet,
  openImageModal,
  onNavigate,
  selectedId,
  onSelect,
  isEditable = false,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDropAtNode,
  onDragStartNode,
  onDragEndNode,
  isDragging = false,
  dragSource = null,
}) => {
  const debounceTimer = useRef(null);
  const nodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOverHalf, setDragOverHalf] = useState(null); // 'top' | 'bottom' | null

  useEffect(() => {
    if (schema?.actions?.onMount) {
      executeOptionAction({ action: schema.actions.onMount });
    }
    return () => {
      if (schema?.actions?.onUnmount) {
        executeOptionAction({ action: schema.actions.onUnmount });
      }
    };
  }, [schema?.actions?.onMount, schema?.actions?.onUnmount]);

  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) {
    return (
      <div
        style={{
          color: "#ef4444",
          padding: "8px 12px",
          background: "rgba(239, 68, 68, 0.1)",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "monospace",
          border: "1px dashed #ef4444",
        }}
      >
        Unknown Component: {schema.type}
      </div>
    );
  }

  // Handle Long Press
  const longPressHandlers = useLongPress(() => {
    const lp = schema.actions?.onLongPress;
    if (lp?.type === "SHOW_CONTEXT_MENU" && openMenu) {
      openMenu({
        title: lp.data?.title || "Actions",
        options: lp.data?.options || [],
        schema,
      });
    }
  });

  // Handle Tap / Click
  const handleTap = (e) => {
    if (isEditable) {
      e.stopPropagation();
      if (onSelect && schema.id) {
        onSelect(schema.id, e);
      }
      return;
    }

    if (onSelect && schema.id) {
      onSelect(schema.id, e);
    }

    const tapAction = schema.actions?.onTap;
    if (tapAction) {
      e.stopPropagation();
      if (tapAction.type === "OPEN_BOTTOM_SHEET" && openSheet) {
        openSheet({
          title: tapAction.data?.title,
          options: tapAction.data?.options || [],
          schema,
        });
      } else if (
        (tapAction.type === "SHOW_IMAGE_MODAL" ||
          tapAction.type === "SHOW_IMAGE_PREVIEW") &&
        openImageModal
      ) {
        openImageModal({
          imageUrl: tapAction.data?.imageUrl || schema.data?.imageUrl,
        });
      } else if (tapAction.type === "NAVIGATE" && onNavigate) {
        onNavigate(tapAction.route);
      } else {
        executeOptionAction({ action: tapAction });
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isEditable && schema.actions?.onHover) {
      executeOptionAction({ action: schema.actions.onHover });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDragOverHalf(null);
    if (!isEditable && schema.actions?.onHoverOut) {
      executeOptionAction({ action: schema.actions.onHoverOut });
    }
  };

  // Drag & Drop handlers in Edit Mode
  const handleEditableDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", schema.id);
    onDragStartNode?.(schema);
  };

  const handleEditableDragOver = (e) => {
    if (!isEditable || !isDragging) return;
    if (dragSource?.nodeId === schema.id) return;
    if (schema.type === "Home" || schema.type === "Page") return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      const midY = rect.top + rect.height / 2;
      const isTop = e.clientY < midY;
      setDragOverHalf(isTop ? "top" : "bottom");
    }
  };

  const handleEditableDragLeave = (e) => {
    if (!isEditable) return;
    setDragOverHalf(null);
  };

  const handleEditableDrop = (e) => {
    if (!isEditable || !isDragging) return;
    if (dragSource?.nodeId === schema.id) return;

    e.preventDefault();
    e.stopPropagation();

    const position = dragOverHalf === "top" ? "before" : "after";
    setDragOverHalf(null);
    onDropAtNode?.({ targetNode: schema, position });
  };

  // Pure Runtime Action Handlers
  const handleFocus = () => {
    if (!isEditable && schema.actions?.onFocus) {
      executeOptionAction({ action: schema.actions.onFocus });
    }
  };

  const handleBlur = () => {
    if (!isEditable && schema.actions?.onBlur) {
      executeOptionAction({ action: schema.actions.onBlur });
    }
  };

  const handleKeyDown = (e) => {
    if (!isEditable && e.key === "Enter" && schema.actions?.onSubmit) {
      executeOptionAction({ action: schema.actions.onSubmit });
    }
  };

  const handleChange = (e) => {
    if (!isEditable && schema.actions?.onChange) {
      clearTimeout(debounceTimer.current);
      const debounceDuration = schema.actions.onChange.debounceDuration || 500;
      const value = e.target.value;
      debounceTimer.current = setTimeout(() => {
        executeOptionAction({ action: schema.actions.onChange });
      }, debounceDuration);
    }
  };

  const minSwipeDistance =
    schema.actions?.onSwipeLeft?.minSwipeDistance ||
    schema.actions?.onSwipeRight?.minSwipeDistance ||
    schema.actions?.onSwipeUp?.minSwipeDistance ||
    schema.actions?.onSwipeDown?.minSwipeDistance ||
    50;

  const swipeHandlers = useSwipe({
    onSwipeLeft: schema.actions?.onSwipeLeft
      ? () => executeOptionAction({ action: schema.actions.onSwipeLeft })
      : null,
    onSwipeRight: schema.actions?.onSwipeRight
      ? () => executeOptionAction({ action: schema.actions.onSwipeRight })
      : null,
    onSwipeUp: schema.actions?.onSwipeUp
      ? () => executeOptionAction({ action: schema.actions.onSwipeUp })
      : null,
    onSwipeDown: schema.actions?.onSwipeDown
      ? () => executeOptionAction({ action: schema.actions.onSwipeDown })
      : null,
    minSwipeDistance,
  });

  const hasSwipe =
    schema.actions?.onSwipeLeft ||
    schema.actions?.onSwipeRight ||
    schema.actions?.onSwipeUp ||
    schema.actions?.onSwipeDown;

  const interactionProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(schema.actions?.onLongPress && !isEditable ? longPressHandlers : {}),
    ...(schema.actions?.onTap || onSelect || isEditable ? { onClick: handleTap } : {}),
    ...(schema.actions?.onFocus && !isEditable ? { onFocus: handleFocus } : {}),
    ...(schema.actions?.onBlur && !isEditable ? { onBlur: handleBlur } : {}),
    ...(schema.actions?.onSubmit && !isEditable ? { onKeyDown: handleKeyDown } : {}),
    ...(schema.actions?.onChange && !isEditable ? { onChange: handleChange } : {}),
    ...(hasSwipe && !isEditable ? swipeHandlers : {}),
    ...(isEditable
      ? {
          onDragOver: handleEditableDragOver,
          onDragLeave: handleEditableDragLeave,
          onDrop: handleEditableDrop,
        }
      : {}),
  };

  // Compute responsive placement coordinates
  let placementStyle = {};
  if (schema.placement) {
    const coordinates = schema.placement[deviceType];
    if (coordinates) {
      placementStyle = {
        ...placementStyle,
        gridColumn: `${coordinates.colStart} / ${coordinates.colEnd}`,
        gridRow: `${coordinates.rowStart} / ${coordinates.rowEnd}`,
      };
    }
  }

  const stickyStyle =
    schema.containerStyle?.position === "sticky"
      ? {
          position: "sticky",
          top: schema.containerStyle.top,
          bottom: schema.containerStyle.bottom,
          zIndex: schema.containerStyle.zIndex || 10,
        }
      : {};

  const isSelected = isEditable && selectedId && schema.id === selectedId;
  const isBeingDragged = isDragging && dragSource?.nodeId === schema.id;
  const def = isEditable ? ComponentRegistry[schema.type] : null;

  const isRootContainer = schema.type === "Home" || schema.type === "Page";

  return (
    <div
      ref={nodeRef}
      data-sdui-id={schema.id}
      data-sdui-type={schema.type}
      style={{
        ...placementStyle,
        ...stickyStyle,
        position: isEditable
          ? "relative"
          : placementStyle.gridColumn || stickyStyle.position ? undefined : "relative",
        outline: isSelected
          ? "2px solid #4f46e5"
          : isHovered && isEditable && !isRootContainer && !isDragging
          ? "1.5px solid rgba(79, 70, 229, 0.4)"
          : dragOverHalf
          ? "2px dashed #4f46e5"
          : "none",
        outlineOffset: isSelected ? "-1px" : "0",
        opacity: isBeingDragged ? 0.3 : 1,
        transition: "outline 0.1s ease, opacity 0.15s ease",
        cursor: isEditable && !isRootContainer ? "pointer" : undefined,
        zIndex: isSelected ? 30 : dragOverHalf ? 25 : undefined,
      }}
      {...interactionProps}
    >
      {/* ── Insertion Guide Marker on Drag-Over ── */}
      {isEditable && dragOverHalf && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: dragOverHalf === "top" ? "-3px" : "auto",
            bottom: dragOverHalf === "bottom" ? "-3px" : "auto",
            height: "4px",
            backgroundColor: "#4f46e5",
            borderRadius: "2px",
            boxShadow: "0 0 10px rgba(79, 70, 229, 0.8)",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: dragOverHalf === "top" ? "-22px" : "6px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: "700",
              padding: "2px 8px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            {dragOverHalf === "top" ? "↑ Insert Before" : "↓ Insert After"}
          </span>
        </div>
      )}

      {/* ── Selection / Hover Action Floating Pill in Edit Mode ── */}
      {isEditable && !isRootContainer && (isSelected || (isHovered && !isDragging)) && (
        <div
          style={{
            position: "absolute",
            top: "-26px",
            left: "0",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "2px",
            backgroundColor: isSelected ? "#4f46e5" : "rgba(15, 23, 42, 0.9)",
            borderRadius: "6px 6px 0 0",
            padding: "2px 6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Draggable Handle */}
          <div
            draggable
            onDragStart={handleEditableDragStart}
            onDragEnd={() => onDragEndNode?.()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "grab",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              userSelect: "none",
              paddingRight: "4px",
            }}
            title="Drag to reorder"
          >
            <span style={{ fontSize: "12px", opacity: 0.9 }}>⠿</span>
            <span>{def?.icon || "📦"}</span>
            <span>{def?.label || schema.type}</span>
          </div>

          {/* Quick Action Controls */}
          {isSelected && (
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "4px", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "4px" }}>
              {/* Move Up */}
              <button
                onClick={(e) => { e.stopPropagation(); onMoveUp?.(schema.id); }}
                title="Move Up (▲)"
                style={{
                  width: "18px", height: "18px", borderRadius: "3px", border: "none",
                  background: "rgba(255,255,255,0.18)", color: "#ffffff", fontSize: "10px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ▲
              </button>

              {/* Move Down */}
              <button
                onClick={(e) => { e.stopPropagation(); onMoveDown?.(schema.id); }}
                title="Move Down (▼)"
                style={{
                  width: "18px", height: "18px", borderRadius: "3px", border: "none",
                  background: "rgba(255,255,255,0.18)", color: "#ffffff", fontSize: "10px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ▼
              </button>

              {/* Duplicate */}
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate?.(schema.id); }}
                title="Duplicate (⧉)"
                style={{
                  width: "18px", height: "18px", borderRadius: "3px", border: "none",
                  background: "rgba(255,255,255,0.18)", color: "#ffffff", fontSize: "10px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ⧉
              </button>

              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(schema.id); }}
                title="Delete Component"
                style={{
                  width: "18px", height: "18px", borderRadius: "3px", border: "none",
                  background: "#ef4444", color: "#ffffff", fontSize: "10px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      <ActionWrapper actions={schema.actions}>
        <TargetComponent
          data={schema.data}
          style={schema.containerStyle}
          actions={schema.actions}
          isHovered={isHovered}
          onError={() =>
            schema.actions?.onError &&
            executeOptionAction({ action: schema.actions.onError })
          }
          onExpire={() =>
            schema.actions?.onExpire &&
            executeOptionAction({ action: schema.actions.onExpire })
          }
          onCopy={() =>
            schema.actions?.onCopy &&
            executeOptionAction({ action: schema.actions.onCopy })
          }
          onNavigate={onNavigate}
        >
          {Array.isArray(schema.children) &&
            schema.children.map((child, idx) => (
              <SDUIRenderer
                key={child.id || idx}
                schema={child}
                deviceType={deviceType}
                openMenu={openMenu}
                openSheet={openSheet}
                openImageModal={openImageModal}
                onNavigate={onNavigate}
                selectedId={selectedId}
                onSelect={onSelect}
                isEditable={isEditable}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDropAtNode={onDropAtNode}
                onDragStartNode={onDragStartNode}
                onDragEndNode={onDragEndNode}
                isDragging={isDragging}
                dragSource={dragSource}
              />
            ))}
        </TargetComponent>
      </ActionWrapper>
    </div>
  );
};

export default SDUIRenderer;
