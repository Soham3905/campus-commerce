import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { branchesApi } from "../../api/branchesApi";

export const fetchBranches = createAsyncThunk(
  "branches/fetchBranches",
  async (journeyId, { rejectWithValue }) => {
    try {
      return await branchesApi.getAll(journeyId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBranch = createAsyncThunk(
  "branches/createBranch",
  async ({ journeyId, sourceBranchId, name, description }, { rejectWithValue }) => {
    try {
      return await branchesApi.createBranch({ journeyId, sourceBranchId, name, description });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveBranchSnapshot = createAsyncThunk(
  "branches/saveBranchSnapshot",
  async ({ branchId, pageId, schema }, { rejectWithValue }) => {
    try {
      return await branchesApi.saveSnapshot(branchId, pageId, schema);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "branches/deleteBranch",
  async (id, { rejectWithValue }) => {
    try {
      await branchesApi.deleteBranch(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const branchSlice = createSlice({
  name: "branches",
  initialState: {
    list: [],
    activeBranchName: "main",
    activeBranchId: "main",
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveBranch(state, action) {
      const branch = state.list.find(
        (b) => b.name === action.payload || b.id === action.payload
      );
      state.activeBranchName = branch?.name || action.payload || "main";
      state.activeBranchId = branch?.id || action.payload || "main";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.activeBranchName = action.payload.name;
        state.activeBranchId = action.payload.id;
      })
      .addCase(saveBranchSnapshot.fulfilled, (state, action) => {
        const index = state.list.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
        if (state.activeBranchId === action.payload) {
          state.activeBranchName = "main";
          state.activeBranchId = "main";
        }
      });
  },
});

export const { setActiveBranch } = branchSlice.actions;
export default branchSlice.reducer;
