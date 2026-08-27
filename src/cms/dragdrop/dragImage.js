/**
 * Suppresses the browser's native HTML5 drag ghost image so the custom,
 * cursor-following <DragOverlay> is the only visible drag indicator instead
 * of two competing ghosts.
 */
let transparentImage = null;

export function suppressNativeDragImage(dataTransfer) {
  if (!transparentImage) {
    transparentImage = new Image();
    transparentImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7";
  }
  try {
    dataTransfer.setDragImage(transparentImage, 0, 0);
  } catch (e) {
    // Some browsers (rare) may throw if called before the image decodes; the
    // native ghost simply falls back to default in that case, non-fatal.
  }
}

export default suppressNativeDragImage;
