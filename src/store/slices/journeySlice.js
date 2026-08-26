import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { journeysApi } from "../../api/journeysApi";

export const fetchJourneys = createAsyncThunk(
  "journeys/fetchJourneys",
  async (_, { rejectWithValue }) => {
    try {
      return await journeysApi.getAll();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createJourney = createAsyncThunk(
  "journeys/createJourney",
  async (journeyData, { rejectWithValue }) => {
    try {
      return await journeysApi.create(journeyData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateJourney = createAsyncThunk(
  "journeys/updateJourney",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await journeysApi.update(id, updates);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const journeySlice = createSlice({
  name: "journeys",
  initialState: {
    list: [],
    activeJourneyId: "journey-campus-commerce",
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setActiveJourneyId(state, action) {
      state.activeJourneyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJourneys.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJourneys.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
        if (!state.activeJourneyId && state.list.length > 0) {
          state.activeJourneyId = state.list[0].id;
        }
      })
      .addCase(fetchJourneys.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createJourney.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.activeJourneyId = action.payload.id;
      })
      .addCase(updateJourney.fulfilled, (state, action) => {
        const index = state.list.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { setActiveJourneyId } = journeySlice.actions;
export default journeySlice.reducer;
