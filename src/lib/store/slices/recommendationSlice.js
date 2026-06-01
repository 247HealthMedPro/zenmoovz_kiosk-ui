import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  /** Spring `response` object: { derivedProfile, brandRecommendations } */
  report: null,
  error: null,
  status: "idle",
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setReport: (state, action) => {
      state.report = action.payload;
      state.error = null;
      state.status = "ready";
    },
    setFailure: (state, action) => {
      state.report = null;
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.message || "Something went wrong";
      state.status = "error";
    },
    resetRecommendations: () => ({ ...initialState }),
  },
});

export const { setLoading, setReport, setFailure, resetRecommendations } =
  recommendationSlice.actions;
export default recommendationSlice.reducer;
