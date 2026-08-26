import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeModal: null, // null | 'branch' | 'pr' | 'customTheme' | 'jsonEditor'
    activeSheet: null,
    imageModalUrl: null,
    toasts: [],
  },
  reducers: {
    openModal(state, action) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    openSheet(state, action) {
      state.activeSheet = action.payload;
    },
    closeSheet(state) {
      state.activeSheet = null;
    },
    openImageModal(state, action) {
      state.imageModalUrl = action.payload;
    },
    closeImageModal(state) {
      state.imageModalUrl = null;
    },
    addToast(state, action) {
      const toast = {
        id: `toast-${Date.now()}`,
        type: action.payload.type || "info",
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      };
      state.toasts.push(toast);
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  openModal,
  closeModal,
  openSheet,
  closeSheet,
  openImageModal,
  closeImageModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
