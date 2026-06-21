import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  // When true, DashboardHeader hides the title by default and shows it only
  // when the page's own h2 scrolls behind the bar (scroll-aware title mode).
  scrollAwareTitleEnabled: boolean;
  headerShowPageTitle: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  scrollAwareTitleEnabled: false,
  headerShowPageTitle: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: { payload: boolean }) {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setMobileSidebarOpen(state, action: { payload: boolean }) {
      state.mobileSidebarOpen = action.payload;
    },
    setScrollAwareTitleEnabled(state, action: { payload: boolean }) {
      state.scrollAwareTitleEnabled = action.payload;
    },
    setHeaderShowPageTitle(state, action: { payload: boolean }) {
      state.headerShowPageTitle = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setScrollAwareTitleEnabled,
  setHeaderShowPageTitle,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
