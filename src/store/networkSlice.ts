import { createSlice } from "@reduxjs/toolkit";

interface NetworkState {
  pendingMutationCount: number;
}

const initialState: NetworkState = {
  pendingMutationCount: 0,
};

const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setPendingMutationCount(state, action: { payload: number }) {
      state.pendingMutationCount = action.payload;
    },
  },
});

export const { setPendingMutationCount } = networkSlice.actions;
export const networkReducer = networkSlice.reducer;
