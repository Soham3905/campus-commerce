import { configureStore } from "@reduxjs/toolkit";
import journeyReducer from "./slices/journeySlice";
import pageReducer from "./slices/pageSlice";
import branchReducer from "./slices/branchSlice";
import pullRequestReducer from "./slices/pullRequestSlice";
import themeReducer from "./slices/themeSlice";
import editorReducer from "./slices/editorSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    journeys: journeyReducer,
    pages: pageReducer,
    branches: branchReducer,
    pullRequests: pullRequestReducer,
    themes: themeReducer,
    editor: editorReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;