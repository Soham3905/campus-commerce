import React, { useState, useRef, useEffect } from "react";
import { ComponentMap } from "./ComponentMap";
import { ActionWrapper } from "./actions/ActionWrapper";
import { executeOptionAction } from "./actions/actionExecutor";
import { useSwipe } from "./hooks/useSwipe";
import { useLongPress } from "./hooks/useLongPress";
import { ComponentRegistry } from "../registry/componentRegistry";
import { canAddChild, getDropMode } from "../cms/utils/validation";
import { suppressNativeDragImage } from "../cms/dragdrop/dragImage";

/**
 * SDUI Renderer — Clean, Direct Visual Drag & Drop Grid Renderer
 *
 * Provides:
 *  1. Direct drag-and-drop of any component across the responsive 2D CSS grid
 *  2. Real-time dynamic grid reflow and auto-adjustments
 *  3. Minimalist selection outlines and interactive resize handles
 *  4. Drop target markers for before, after, and inside container insertion
 *  5. Live ghost component rendering with realistic footprints
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
  onApplyWidthPreset,
  onWrapInContainer,
  onResizePlacement,
  onOpenQuickInserter,
  isDragging = false,
  dragSource = null,
  dropSlot = null,
  onUpdateDropSlot,
  onClearDropSlot,
  isDirectGridChild = true,
}) => {
  const nodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragZone, setDragZone] = useState(null); // 'before' | 'inside' | 'after' | null
  const [dragValidation, setDragValidation] = useState({ isValid: true, reason: null });
  const [resizeState, setResizeState] = useState(null);

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

  // Window mouse move / up listener for smooth live on-canvas resizing
  useEffect(() => {
    if (!resizeState) return;

    const handleMouseMove = (e) => {
      const { type, startX, startY, initialCoords } = resizeState;
      const parentWidth = nodeRef.current?.parentElement?.getBoundingClientRect().width || 400;

      if (type === "width") {
        const deltaPx = e.clientX - startX;
        const deltaCol = Math.round((deltaPx / parentWidth) * 100);
        const newColEnd = Math.max(
          initialCoords.colStart + 10,
          Math.min(101, initialCoords.colEnd + deltaCol)
        );
        const colSpan = newColEnd - initialCoords.colStart;
        const percent = Math.min(100, Math.round(colSpan));

        setResizeState((prev) => ({
          ...prev,
          preview: {
            colEnd: newColEnd,
            span: colSpan,
            percent,
            label: `📐 ${percent}% (Col ${initialCoords.colStart}-${newColEnd})`,
          },
        }));
      } else if (type === "height") {
        const deltaPx = e.clientY - startY;
        const deltaRow = Math.round(deltaPx / 10);
        const newRowEnd = Math.max(initialCoords.rowStart + 2, initialCoords.rowEnd + deltaRow);
        const rowSpan = newRowEnd - initialCoords.rowStart;

        setResizeState((prev) => ({
          ...prev,
          preview: {
            rowEnd: newRowEnd,
            span: rowSpan,
            label: `↕ ${rowSpan * 10}px (${rowSpan} rows)`,
          },
        }));
      }
    };

    const handleMouseUp = () => {
      if (resizeState?.preview) {
        const { type, initialCoords, preview } = resizeState;
        if (type === "width" && preview.colEnd !== initialCoords.colEnd) {
          const deltaCol = preview.colEnd - initialCoords.colEnd;
          onResizePlacement?.(schema.id, { deltaCol, deltaRow: 0, activeDevice: deviceType });
        } else if (type === "height" && preview.rowEnd !== initialCoords.rowEnd) {
          const deltaRow = preview.rowEnd - initialCoords.rowEnd;
          onResizePlacement?.(schema.id, { deltaCol: 0, deltaRow, activeDevice: deviceType });
        }
      }
      setResizeState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeState, schema?.id, deviceType, onResizePlacement]);

  if (!schema || !schema.type) return null;

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

  // Tap / Click Handler
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
    setDragZone(null);
    if (!isEditable && schema.actions?.onHoverOut) {
      executeOptionAction({ action: schema.actions.onHoverOut });
    }
  };

  // Direct Drag & Drop handlers on the Component
  const handleDragStart = (e) => {
    if (!isEditable || schema.type === "Home" || schema.type === "Page") return;
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "all";
    e.dataTransfer.setData("application/sdui-type", schema.type);
    e.dataTransfer.setData("application/sdui-id", schema.id);
    e.dataTransfer.setData("text/plain", schema.id);
    suppressNativeDragImage(e.dataTransfer);
    onDragStartNode?.(schema);
  };

  const handleDragEnd = (e) => {
    if (!isEditable) return;
    e.stopPropagation();
    onDragEndNode?.();
  };

  const handleDragOver = (e) => {
    if (!isEditable) return;
    if (dragSource?.nodeId === schema.id) return;
    if (schema.type === "Home" || schema.type === "Page") return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";

    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    const draggedType = dragSource?.type || e.dataTransfer.getData("application/sdui-type");
    if (!draggedType) return;
    const mode = getDropMode(e.clientY, rect, schema.type, draggedType, schema);

    let check = { valid: true };
    if (mode === "inside") {
      check = canAddChild(schema, draggedType, dragSource?.nodeId ? { excludeChildId: dragSource.nodeId } : undefined);
    }

    setDragZone(mode);
    setDragValidation(check);

    onUpdateDropSlot?.({
      targetNode: schema,
      dropMode: mode,
      draggedType,
      rect,
      clientY: e.clientY,
      isValid: check.valid,
      reason: check.reason,
    });
  };

  const handleDragLeave = (e) => {
    if (!isEditable) return;
    setDragZone(null);
    onClearDropSlot?.();
  };

  const handleDrop = (e) => {
    if (!isEditable) return;
    if (dragSource?.nodeId === schema.id) return;

    e.preventDefault();
    e.stopPropagation();

    const draggedType = e.dataTransfer.getData("application/sdui-type") || dragSource?.type;
    const draggedId = e.dataTransfer.getData("application/sdui-id") || dragSource?.nodeId;
    const position = dragZone || "inside";
    setDragZone(null);

    onDropAtNode?.({
      targetNode: schema,
      position,
      draggedType,
      draggedId,
    });
  };

  // Start resize handlers
  const handleStartWidthResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentCoords = schema.placement?.[deviceType] || {
      colStart: 1,
      colEnd: 101,
      rowStart: 1,
      rowEnd: 10,
    };
    setResizeState({
      type: "width",
      startX: e.clientX,
      startY: e.clientY,
      initialCoords: currentCoords,
      preview: null,
    });
  };

  const handleStartHeightResize = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentCoords = schema.placement?.[deviceType] || {
      colStart: 1,
      colEnd: 101,
      rowStart: 1,
      rowEnd: 10,
    };
    setResizeState({
      type: "height",
      startX: e.clientX,
      startY: e.clientY,
      initialCoords: currentCoords,
      preview: null,
    });
  };

  // Compute placement coordinates ONLY for direct grid children
  let placementStyle = {};
  const currentPlacement = schema.placement?.[deviceType];
  const isRootContainer = schema.type === "Home" || schema.type === "Page";

  if (isDirectGridChild && !isRootContainer && currentPlacement) {
    let colEnd = resizeState?.type === "width" && resizeState.preview?.colEnd ? resizeState.preview.colEnd : currentPlacement.colEnd;
    if (colEnd >= 100 && currentPlacement.colStart === 1) {
      colEnd = 101;
    }
    const rowEnd = resizeState?.type === "height" && resizeState.preview?.rowEnd ? resizeState.preview.rowEnd : currentPlacement.rowEnd;

    placementStyle = {
      gridColumn: `${currentPlacement.colStart} / ${colEnd}`,
      gridRow: `${currentPlacement.rowStart} / ${rowEnd}`,
      width: "100%",
      boxSizing: "border-box",
    };
  }

  const isSelected = isEditable && selectedId && schema.id === selectedId;
  const isBeingDragged = isDragging && dragSource?.nodeId === schema.id;
  const isGhost = schema.__isDragGhost === true;
  const def = isEditable ? ComponentRegistry[schema.type] : null;

  const effectiveContainerStyle = schema.containerStyle || {};

  // Decide if child components should be grid children
  const nextIsDirectGridChild = isRootContainer || (schema.type === "Box" && effectiveContainerStyle?.display === "grid");

  // Extract positioning styles from containerStyle
  const isAbsolute = effectiveContainerStyle?.position === "absolute";
  const isFixed = effectiveContainerStyle?.position === "fixed";
  const isSticky = effectiveContainerStyle?.position === "sticky";

  const wrapperPositionStyle = isAbsolute
    ? {
        position: "absolute",
        top: effectiveContainerStyle.top,
        bottom: effectiveContainerStyle.bottom,
        left: effectiveContainerStyle.left,
        right: effectiveContainerStyle.right,
        zIndex: effectiveContainerStyle.zIndex || 10,
        width: effectiveContainerStyle.width,
        height: effectiveContainerStyle.height,
      }
    : isFixed
    ? {
        position: "fixed",
        top: effectiveContainerStyle.top,
        bottom: effectiveContainerStyle.bottom,
        left: effectiveContainerStyle.left,
        right: effectiveContainerStyle.right,
        zIndex: effectiveContainerStyle.zIndex || 100,
      }
    : isSticky
    ? {
        position: "sticky",
        top: effectiveContainerStyle.top,
        bottom: effectiveContainerStyle.bottom,
        zIndex: effectiveContainerStyle.zIndex || 100,
      }
    : {
        position: isEditable || !isDirectGridChild ? "relative" : undefined,
      };

  const sanitizedComponentStyle = effectiveContainerStyle;

  // Forward flex child styles to wrapper div if not a direct grid child and not root container
  const isFlexProductCard = !isDirectGridChild && !isAbsolute && !isRootContainer && schema.type === "ProductCard";
  const flexChildStyle = !isDirectGridChild && !isAbsolute && !isRootContainer
    ? {
        flex: effectiveContainerStyle?.flex ?? (isFlexProductCard ? "0 0 268px" : undefined),
        flexShrink: effectiveContainerStyle?.flexShrink ?? (isFlexProductCard ? 0 : undefined),
        flexGrow: effectiveContainerStyle?.flexGrow,
        alignSelf: effectiveContainerStyle?.alignSelf,
        marginTop: effectiveContainerStyle?.marginTop,
        marginBottom: effectiveContainerStyle?.marginBottom,
        marginLeft: effectiveContainerStyle?.marginLeft,
        marginRight: effectiveContainerStyle?.marginRight,
        width: effectiveContainerStyle?.width ?? (isFlexProductCard ? "268px" : undefined),
        minWidth: effectiveContainerStyle?.minWidth ?? (isFlexProductCard ? "268px" : undefined),
        maxWidth: effectiveContainerStyle?.maxWidth,
        height: effectiveContainerStyle?.height,
        minHeight: effectiveContainerStyle?.minHeight,
        maxHeight: effectiveContainerStyle?.maxHeight,
        display:
          effectiveContainerStyle?.display === "flex" ||
          effectiveContainerStyle?.display === "inline-flex"
            ? "flex"
            : undefined,
      }
    : {};

  return (
    <div
      ref={nodeRef}
      data-sdui-id={schema.id}
      data-sdui-type={schema.type}
      draggable={isEditable && !isRootContainer && !isGhost}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      style={{
        ...placementStyle,
        ...flexChildStyle,
        ...wrapperPositionStyle,
        outline: isGhost
          ? "2px dashed #4f46e5"
          : isSelected
          ? "2px solid #4f46e5"
          : isHovered && isEditable && !isRootContainer && !isDragging
          ? "1.5px dashed rgba(79, 70, 229, 0.6)"
          : dragZone
          ? `2px dashed ${dragValidation.isValid ? "#4f46e5" : "#ef4444"}`
          : "none",
        outlineOffset: isSelected ? "-1px" : "0",
        boxShadow: isGhost
          ? "0 0 0 4px rgba(79, 70, 229, 0.15)"
          : isSelected
          ? "0 0 0 3px rgba(79, 70, 229, 0.2)"
          : undefined,
        backgroundColor: isGhost ? "rgba(79, 70, 229, 0.04)" : undefined,
        opacity: isBeingDragged ? 0.3 : isGhost ? 0.85 : 1,
        transition: resizeState ? "none" : "outline 0.12s ease, opacity 0.15s ease, background-color 0.15s ease",
        cursor: isEditable && !isRootContainer ? (isDragging ? "grabbing" : "grab") : undefined,
        zIndex: isSelected ? 30 : dragZone ? 25 : wrapperPositionStyle.zIndex,
        userSelect: isEditable ? "none" : undefined,
      }}
    >
      {/* ── Insertion Guide Marker on Drag-Over ── */}
      {isEditable && dragZone && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: dragZone === "before" ? "-4px" : dragZone === "inside" ? "0" : "auto",
            bottom: dragZone === "after" ? "-4px" : dragZone === "inside" ? "0" : "auto",
            height: dragZone === "inside" ? "100%" : "4px",
            backgroundColor: dragZone === "inside"
              ? dragValidation.isValid
                ? "rgba(79, 70, 229, 0.12)"
                : "rgba(239, 68, 68, 0.12)"
              : dragValidation.isValid
              ? "#4f46e5"
              : "#ef4444",
            borderRadius: "3px",
            boxShadow: dragZone !== "inside"
              ? `0 0 10px ${dragValidation.isValid ? "rgba(79, 70, 229, 0.8)" : "rgba(239, 68, 68, 0.8)"}`
              : "none",
            zIndex: 100,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: dragZone === "before" ? "-22px" : dragZone === "inside" ? "50%" : "6px",
              marginTop: dragZone === "inside" ? "-10px" : "0",
              backgroundColor: dragValidation.isValid ? "#4f46e5" : "#ef4444",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: "700",
              padding: "3px 9px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            {dragValidation.isValid
              ? dragZone === "before"
                ? `↑ Insert Before ${def?.label || schema.type}`
                : dragZone === "inside"
                ? `↳ Drop Inside ${def?.label || schema.type}`
                : `↓ Insert After ${def?.label || schema.type}`
              : `🚫 ${dragValidation.reason || "Cannot drop here"}`}
          </span>
        </div>
      )}

      {/* ── Ghost Label Badge ── */}
      {isGhost && (
        <div
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: "700",
            padding: "2px 8px",
            borderRadius: "6px",
            zIndex: 50,
            pointerEvents: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          📥 Drop Position
        </div>
      )}

      {/* ── Live Drag-Resize Tooltip Indicator ── */}
      {resizeState?.preview && (
        <div
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#0f172a",
            color: "#38bdf8",
            fontSize: "11px",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 300,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {resizeState.preview.label}
        </div>
      )}

      {/* ── Clean Selection Badge ── */}
      {isEditable && !isRootContainer && isDirectGridChild && !isGhost && (isSelected || (isHovered && !isDragging && !resizeState)) && (
        <div
          style={{
            position: "absolute",
            top: "-22px",
            left: "0",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: isSelected ? "#4f46e5" : "rgba(15, 23, 42, 0.85)",
            borderRadius: "4px 4px 0 0",
            padding: "2px 8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: "700",
            pointerEvents: "none",
          }}
        >
          <span>⠿</span>
          <span>{def?.icon || "📦"}</span>
          <span>{def?.label || schema.type}</span>
        </div>
      )}

      {/* ── Interactive On-Canvas Drag-Resize Handles ── */}
      {isEditable && isSelected && isDirectGridChild && !isRootContainer && !isGhost && (
        <>
          {/* Right Handle (Column Width Adjuster) */}
          <div
            onMouseDown={handleStartWidthResize}
            title="Drag to resize width"
            style={{
              position: "absolute",
              right: "-5px",
              top: "10%",
              bottom: "10%",
              width: "10px",
              cursor: "ew-resize",
              backgroundColor: "transparent",
              zIndex: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "28px",
                backgroundColor: "#4f46e5",
                borderRadius: "2px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Bottom Handle (Row Height Adjuster) */}
          <div
            onMouseDown={handleStartHeightResize}
            title="Drag to resize height"
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "10%",
              right: "10%",
              height: "10px",
              cursor: "ns-resize",
              backgroundColor: "transparent",
              zIndex: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "4px",
                backgroundColor: "#4f46e5",
                borderRadius: "2px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </>
      )}

      {/* ── Component Body ── */}
      <ActionWrapper actions={schema.actions}>
        <TargetComponent
          data={schema.data}
          style={sanitizedComponentStyle}
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
          {Array.isArray(schema.children) && schema.children.length > 0 ? (
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
                onApplyWidthPreset={onApplyWidthPreset}
                onWrapInContainer={onWrapInContainer}
                onResizePlacement={onResizePlacement}
                onOpenQuickInserter={onOpenQuickInserter}
                isDragging={isDragging}
                dragSource={dragSource}
                dropSlot={dropSlot}
                onUpdateDropSlot={onUpdateDropSlot}
                onClearDropSlot={onClearDropSlot}
                isDirectGridChild={nextIsDirectGridChild}
              />
            ))
          ) : isEditable && def?.canHaveChildren && !isRootContainer && !isGhost ? (
            <div
              style={{
                padding: "16px 12px",
                textAlign: "center",
                border: "1.5px dashed #cbd5e1",
                borderRadius: "8px",
                backgroundColor: "rgba(248, 250, 252, 0.7)",
                color: "#64748b",
                fontSize: "11px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                width: "100%",
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
            >
              <span>{def?.icon || "📦"}</span>
              <span>Drop components inside {def?.label || schema.type}</span>
            </div>
          ) : null}
        </TargetComponent>
      </ActionWrapper>
    </div>
  );
};

export default SDUIRenderer;
