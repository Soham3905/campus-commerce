import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { themesApi } from "../../api/themesApi";

export const fetchThemes = createAsyncThunk(
  "themes/fetchThemes",
  async (componentType, { rejectWithValue }) => {
    try {
      return await themesApi.getAll(componentType);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveTheme = createAsyncThunk(
  "themes/saveTheme",
  async (themeData, { rejectWithValue }) => {
    try {
      return await themesApi.saveTheme(themeData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTheme = createAsyncThunk(
  "themes/deleteTheme",
  async (id, { rejectWithValue }) => {
    try {
      await themesApi.deleteTheme(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const themeSlice = createSlice({
  name: "themes",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        } else {
          state.list.push(action.payload);
        }
      })
      .addCase(deleteTheme.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default themeSlice.reducer;
