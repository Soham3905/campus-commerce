import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    selectedComponentId: null,
    hoveredComponentId: null,
    activeDevice: "desktop", // 'mobile' | 'tablet' | 'desktop'
    editingContext: null, // null | 'ProductCard' | 'Header' etc.
    isDirty: false,
    saveStatus: "idle", // 'idle' | 'saving' | 'saved' | 'error'
  },
  reducers: {
    setSelectedComponentId(state, action) {
      state.selectedComponentId = action.payload;
    },
    setHoveredComponentId(state, action) {
      state.hoveredComponentId = action.payload;
    },
    setActiveDevice(state, action) {
      state.activeDevice = action.payload;
    },
    setEditingContext(state, action) {
      state.editingContext = action.payload;
    },
    setIsDirty(state, action) {
      state.isDirty = action.payload;
    },
    setSaveStatus(state, action) {
      state.saveStatus = action.payload;
    },
  },
});

export const {
  setSelectedComponentId,
  setHoveredComponentId,
  setActiveDevice,
  setEditingContext,
  setIsDirty,
  setSaveStatus,
} = editorSlice.actions;

export default editorSlice.reducer;
