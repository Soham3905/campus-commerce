import { useState, useCallback, useRef } from "react";
import { cloneTree } from "../utils/treeUtils";

const MAX_HISTORY = 30;

/**
 * Undo / Redo history management hook
 * @param {Object} initialValue - Initial schema tree
 */
export function useHistory(initialValue) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialValue);
  const [future, setFuture] = useState([]);

  const isUndoRedoAction = useRef(false);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const pushState = useCallback(
    (newPresent) => {
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        return;
      }

      setPast((prevPast) => {
        const nextPast = [...prevPast, cloneTree(present)];
        if (nextPast.length > MAX_HISTORY) {
          nextPast.shift();
        }
        return nextPast;
      });
      setPresent(newPresent);
      setFuture([]);
    },
    [present]
  );

  const undo = useCallback(() => {
    if (!canUndo) return;

    setPast((prevPast) => {
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setFuture((prevFuture) => [cloneTree(present), ...prevFuture]);
      isUndoRedoAction.current = true;
      setPresent(previous);

      return newPast;
    });
  }, [canUndo, present]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setFuture((prevFuture) => {
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setPast((prevPast) => [...prevPast, cloneTree(present)]);
      isUndoRedoAction.current = true;
      setPresent(next);

      return newFuture;
    });
  }, [canRedo, present]);

  const resetHistory = useCallback((newInitial) => {
    setPast([]);
    setPresent(newInitial);
    setFuture([]);
  }, []);

  return {
    state: present,
    setState: pushState,
    setDirectState: setPresent,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    historyLength: past.length,
  };
}
