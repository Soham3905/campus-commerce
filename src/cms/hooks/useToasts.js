import { useState, useCallback } from "react";

let toastIdCounter = 1;

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = `toast_${Date.now()}_${toastIdCounter++}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addToast({ message, type: "success", duration });
  }, [addToast]);

  const showError = useCallback((message, duration = 4500) => {
    return addToast({ message, type: "error", duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration = 4000) => {
    return addToast({ message, type: "warning", duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast({ message, type: "info", duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
