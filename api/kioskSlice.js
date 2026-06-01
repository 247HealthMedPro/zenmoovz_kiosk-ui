import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  mobile: "",
  genderCategory: "",
  age: 18,
  heightCm: 170,
  weightKg: 70,
  playingLevel: "",
  battingPosition: "",
  battingStyle: "",
  willowType: "",
  ballType: "",
  recommendationMode: [],
  wizardCompleted: false,
};

export const kioskSlice = createSlice({
  name: "kiosk",
  initialState,
  reducers: {
    setStep1Data: (state, action) => {
      state.name = action.payload.name;
      state.mobile = action.payload.mobile;
    },
    setStep2Data: (state, action) => {
      state.genderCategory = action.payload.genderCategory;
      state.age = action.payload.age;
      state.heightCm = action.payload.heightCm;
      state.weightKg = action.payload.weightKg;
    },
    setStep3Data: (state, action) => {
      state.playingLevel = action.payload.playingLevel;
      state.battingPosition = action.payload.battingPosition;
      state.battingStyle = action.payload.battingStyle;
      state.willowType = action.payload.willowType;
      state.ballType = action.payload.ballType ?? "";
    },
    setWizardCompleted: (state, action) => {
      state.wizardCompleted = action.payload;
    },
    setRecommendationMode: (state, action) => {
      state.recommendationMode = action.payload;
    },
    resetCricketFlow: () => ({ ...initialState }),
  },
});

export const {
  setStep1Data,
  setStep2Data,
  setStep3Data,
  setWizardCompleted,
  setRecommendationMode,
  resetCricketFlow,
} = kioskSlice.actions;

export const selectKiosk = (state) => state.kiosk;

export default kioskSlice.reducer;
