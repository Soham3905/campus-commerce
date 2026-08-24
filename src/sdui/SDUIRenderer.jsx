import React, { useState, useRef, useEffect } from "react";
import { ComponentMap } from "./ComponentMap";
import { ActionWrapper } from "./actions/ActionWrapper";
import { executeOptionAction } from "./actions/actionExecutor";
import { useSwipe } from "./hooks/useSwipe";
import { useLongPress } from "./hooks/useLongPress";

/**
 * Pure recursive SDUI Renderer
 * Interprets JSON schemas, attaches responsive grid styles, executes declarative actions,
 * and renders nested component trees.
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
}) => {
  const debounceTimer = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
    if (schema.actions?.onHover) {
      executeOptionAction({ action: schema.actions.onHover });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (schema.actions?.onHoverOut) {
      executeOptionAction({ action: schema.actions.onHoverOut });
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    if (schema.actions?.onDrag) {
      executeOptionAction({ action: schema.actions.onDrag });
    }
  };

  const handleDragOver = (e) => {
    if (schema.actions?.onDrop) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (e) => {
    if (schema.actions?.onDrop) {
      e.preventDefault();
      executeOptionAction({ action: schema.actions.onDrop });
    }
  };

  const handleFocus = () => {
    if (schema.actions?.onFocus) {
      executeOptionAction({ action: schema.actions.onFocus });
    }
  };

  const handleBlur = () => {
    if (schema.actions?.onBlur) {
      executeOptionAction({ action: schema.actions.onBlur });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && schema.actions?.onSubmit) {
      executeOptionAction({ action: schema.actions.onSubmit });
    }
  };

  const handleChange = (e) => {
    if (schema.actions?.onChange) {
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
    ...(schema.actions?.onLongPress ? longPressHandlers : {}),
    ...(schema.actions?.onTap || onSelect ? { onClick: handleTap } : {}),
    ...(schema.actions?.onFocus ? { onFocus: handleFocus } : {}),
    ...(schema.actions?.onBlur ? { onBlur: handleBlur } : {}),
    ...(schema.actions?.onSubmit ? { onKeyDown: handleKeyDown } : {}),
    ...(schema.actions?.onChange ? { onChange: handleChange } : {}),
    ...(schema.actions?.onDrag ? { onDragStart: handleDragStart, draggable: true } : {}),
    ...(schema.actions?.onDrop ? { onDrop: handleDrop, onDragOver: handleDragOver } : {}),
    ...(hasSwipe ? swipeHandlers : {}),
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

  const isSelected = selectedId && schema.id === selectedId;

  return (
    <div
      data-sdui-id={schema.id}
      data-sdui-type={schema.type}
      style={{
        ...placementStyle,
        ...stickyStyle,
        outline: isSelected ? "2px solid #6366f1" : "none",
        outlineOffset: isSelected ? "-2px" : "0",
        position: placementStyle.gridColumn || stickyStyle.position ? undefined : "relative",
      }}
      {...interactionProps}
    >
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
              />
            ))}
        </TargetComponent>
      </ActionWrapper>
    </div>
  );
};

export default SDUIRenderer;
