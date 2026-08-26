import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pagesApi } from "../../api/pagesApi";

export const fetchPages = createAsyncThunk(
  "pages/fetchPages",
  async (journeyId, { rejectWithValue }) => {
    try {
      return await pagesApi.getAll(journeyId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPageById = createAsyncThunk(
  "pages/fetchPageById",
  async (id, { rejectWithValue }) => {
    try {
      return await pagesApi.getById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const savePage = createAsyncThunk(
  "pages/savePage",
  async ({ id, pageData }, { rejectWithValue }) => {
    try {
      return await pagesApi.savePage(id, pageData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPage = createAsyncThunk(
  "pages/createPage",
  async (pageData, { rejectWithValue }) => {
    try {
      return await pagesApi.create(pageData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async (id, { rejectWithValue }) => {
    try {
      await pagesApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const pageSlice = createSlice({
  name: "pages",
  initialState: {
    list: [],
    activePageId: "page_home",
    activePage: null,
    status: "idle",
    saveStatus: "idle", // 'idle' | 'saving' | 'saved' | 'error'
    error: null,
  },
  reducers: {
    setActivePageId(state, action) {
      state.activePageId = action.payload;
      state.activePage = state.list.find((p) => p.id === action.payload) || null;
    },
    updateLocalPageSchema(state, action) {
      const { pageId, schema } = action.payload;
      const index = state.list.findIndex((p) => p.id === pageId);
      if (index !== -1) {
        state.list[index].schema = schema;
      }
      if (state.activePage?.id === pageId) {
        state.activePage.schema = schema;
      }
    },
    setSaveStatus(state, action) {
      state.saveStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pages
      .addCase(fetchPages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
        if (!state.activePageId && state.list.length > 0) {
          state.activePageId = state.list[0].id;
          state.activePage = state.list[0];
        } else {
          state.activePage = state.list.find((p) => p.id === state.activePageId) || state.list[0] || null;
        }
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Save Page
      .addCase(savePage.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(savePage.fulfilled, (state, action) => {
        state.saveStatus = "saved";
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.activePage?.id === action.payload.id) {
          state.activePage = action.payload;
        }
      })
      .addCase(savePage.rejected, (state, action) => {
        state.saveStatus = "error";
        state.error = action.payload;
      })
      // Create Page
      .addCase(createPage.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.activePageId = action.payload.id;
        state.activePage = action.payload;
      })
      // Delete Page
      .addCase(deletePage.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.activePageId === action.payload) {
          state.activePageId = state.list[0]?.id || null;
          state.activePage = state.list[0] || null;
        }
      });
  },
});

export const { setActivePageId, updateLocalPageSchema, setSaveStatus } = pageSlice.actions;
export default pageSlice.reducer;
