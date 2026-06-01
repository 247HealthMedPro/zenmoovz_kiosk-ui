import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otpSent: false,
  otpVerified: false,
  lastMobile: "",
  mockSessionId: null,
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetOtpFlow: () => ({ ...initialState }),
    otpSendSuccess: (state, action) => {
      state.otpSent = true;
      state.lastMobile = action.payload;
      state.errorMessage = null;
    },
    otpVerifySuccess: (state, action) => {
      state.otpVerified = true;
      state.mockSessionId = action.payload;
      state.errorMessage = null;
    },
    otpError: (state, action) => {
      const p = action.payload;
      state.errorMessage =
        p == null ? null : typeof p === "string" ? p : "Something went wrong";
    },
    invalidateOtpVerification: (state) => {
      state.otpVerified = false;
      state.mockSessionId = null;
    },
  },
});

export const {
  resetOtpFlow,
  otpSendSuccess,
  otpVerifySuccess,
  otpError,
  invalidateOtpVerification,
} = authSlice.actions;
export default authSlice.reducer;
