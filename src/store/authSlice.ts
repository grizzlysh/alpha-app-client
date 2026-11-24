import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginResponse,
  MeResponse,
  SelectPharmacyResponse,
} from "@/types/auth";
import { storeToken, clearToken, hasSessionHint } from "@/utils/tokenStore";

const initialState: AuthState = {
  // Never persisted; re-issued from the refresh cookie on startup.
  accessToken: null,
  user: null,
  currentPharmacy: null,
  permissions: {},
  isAuthenticated: hasSessionHint(),
  pharmacySelected: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginCredentials(state, action: PayloadAction<LoginResponse>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.currentPharmacy) {
        state.currentPharmacy = action.payload.currentPharmacy;
        state.permissions = action.payload.currentPharmacy.permissions;
        state.pharmacySelected = true;
      } else {
        state.currentPharmacy = null;
        state.permissions = {};
        state.pharmacySelected = false;
      }
      storeToken(action.payload.accessToken);
    },
    setPharmacy(state, action: PayloadAction<SelectPharmacyResponse>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.currentPharmacy = action.payload.currentPharmacy;
      state.permissions = action.payload.currentPharmacy.permissions;
      state.pharmacySelected = true;
      storeToken(action.payload.accessToken);
    },
    // Used when login + pharmacy-select are combined into one atomic transition,
    // so GuestGuard never sees an intermediate isAuthenticated=true/pharmacySelected=false state.
    setFullAuth(state, action: PayloadAction<SelectPharmacyResponse>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.currentPharmacy = action.payload.currentPharmacy;
      state.permissions = action.payload.currentPharmacy.permissions;
      state.isAuthenticated = true;
      state.pharmacySelected = true;
      storeToken(action.payload.accessToken);
    },
    restoreSession(state, action: PayloadAction<MeResponse>) {
      state.user = action.payload.user;
      if (action.payload.currentPharmacy) {
        state.currentPharmacy = action.payload.currentPharmacy;
        state.permissions = action.payload.currentPharmacy.permissions;
        state.pharmacySelected = true;
      }
    },
    updateUserProfile(state, action: PayloadAction<{ name: string }>) {
      if (state.user) {
        state.user.name = action.payload.name;
      }
    },
    clearPharmacy(state) {
      state.currentPharmacy = null;
      state.permissions = {};
      state.pharmacySelected = false;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.currentPharmacy = null;
      state.permissions = {};
      state.isAuthenticated = false;
      state.pharmacySelected = false;
      clearToken();
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      storeToken(action.payload);
    },
  },
});

export const { setLoginCredentials, setPharmacy, setFullAuth, restoreSession, updateUserProfile, clearPharmacy, logout, setAccessToken } = authSlice.actions;
export const authReducer = authSlice.reducer;
