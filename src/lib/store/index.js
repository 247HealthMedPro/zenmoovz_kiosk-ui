import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import "@/lib/store/api/otpApi";
import "@/lib/store/api/recommendationApi";
import "@/lib/store/api/knockingGuideApi";
import "@/lib/store/api/categoriesApi";
import authReducer from "./slices/authSlice";
import kioskReducer from "./slices/kioskSlice";
import recommendationReducer from "./slices/recommendationSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      kiosk: kioskReducer,
      recommendation: recommendationReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}
