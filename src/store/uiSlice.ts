import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  // When true, DashboardHeader hides the title by default and shows it only
  // when the page's own h2 scrolls behind the bar (scroll-aware title mode).
  scrollAwareTitleEnabled: boolean;
  headerShowPageTitle: boolean;
  collapsedNavGroups: string[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  scrollAwareTitleEnabled: false,
  headerShowPageTitle: false,
  collapsedNavGroups: [],
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
    toggleNavGroup(state, action: { payload: string }) {
      const label = action.payload;
      const idx = state.collapsedNavGroups.indexOf(label);
      if (idx === -1) {
        state.collapsedNavGroups.push(label);
      } else {
        state.collapsedNavGroups.splice(idx, 1);
      }
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
  toggleNavGroup,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
