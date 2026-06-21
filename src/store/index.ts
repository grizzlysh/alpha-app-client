import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { uiReducer } from "./uiSlice";
import { networkReducer } from "./networkSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    network: networkReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
