import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pullRequestsApi } from "../../api/pullRequestsApi";

export const fetchPullRequests = createAsyncThunk(
  "pullRequests/fetchPullRequests",
  async (journeyId, { rejectWithValue }) => {
    try {
      return await pullRequestsApi.getAll(journeyId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPullRequest = createAsyncThunk(
  "pullRequests/createPullRequest",
  async ({ journeyId, sourceBranchId, targetBranchId, title, description }, { rejectWithValue }) => {
    try {
      return await pullRequestsApi.createPullRequest({
        journeyId,
        sourceBranchId,
        targetBranchId,
        title,
        description,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const approvePullRequest = createAsyncThunk(
  "pullRequests/approvePullRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await pullRequestsApi.approve(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rejectPullRequest = createAsyncThunk(
  "pullRequests/rejectPullRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await pullRequestsApi.reject(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const mergePullRequest = createAsyncThunk(
  "pullRequests/mergePullRequest",
  async (id, { rejectWithValue }) => {
    try {
      return await pullRequestsApi.merge(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const pullRequestSlice = createSlice({
  name: "pullRequests",
  initialState: {
    list: [],
    selectedPrId: null,
    status: "idle",
    mergeStatus: "idle", // 'idle' | 'merging' | 'success' | 'failed'
    error: null,
  },
  reducers: {
    setSelectedPrId(state, action) {
      state.selectedPrId = action.payload;
    },
    resetMergeStatus(state) {
      state.mergeStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPullRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPullRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchPullRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createPullRequest.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(approvePullRequest.fulfilled, (state, action) => {
        const index = state.list.findIndex((pr) => pr.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(rejectPullRequest.fulfilled, (state, action) => {
        const index = state.list.findIndex((pr) => pr.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(mergePullRequest.pending, (state) => {
        state.mergeStatus = "merging";
      })
      .addCase(mergePullRequest.fulfilled, (state, action) => {
        state.mergeStatus = "success";
        const pr = action.payload.pullRequest;
        if (pr) {
          const index = state.list.findIndex((item) => item.id === pr.id);
          if (index !== -1) {
            state.list[index] = pr;
          }
        }
      })
      .addCase(mergePullRequest.rejected, (state, action) => {
        state.mergeStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedPrId, resetMergeStatus } = pullRequestSlice.actions;
export default pullRequestSlice.reducer;
