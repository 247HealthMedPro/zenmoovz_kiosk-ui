import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage";
import authReducer from "../api/authSlice";
import kioskReducer from "../api/kioskSlice";
import recommendationReducer from "../api/recommendationSlice";
import { apiSlice } from "./api/apiSlice";
import "./api/otpApi";
import "./api/recommendationApi";
import "./api/knockingGuideApi";
import "./api/categoriesApi";

function rtkQueryThunkTypes(reducerPath) {
  const p = String(reducerPath || "");
  return [
    `${p}/executeQuery/pending`,
    `${p}/executeQuery/fulfilled`,
    `${p}/executeQuery/rejected`,
    `${p}/executeMutation/pending`,
    `${p}/executeMutation/fulfilled`,
    `${p}/executeMutation/rejected`,
  ];
}

const rootReducer = combineReducers({
  auth: authReducer,
  kiosk: kioskReducer,
  recommendation: recommendationReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "kiosk", "recommendation"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            ...rtkQueryThunkTypes(apiSlice.reducerPath),
          ],
          ignoredPaths: ["api.queries", "api.mutations"],
        },
      }).concat(apiSlice.middleware),
  });
}
