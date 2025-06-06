import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferences } from "@/types";

interface UserState {
  preferences: UserPreferences;
  uploadedPodcasts: string[]; // podcast IDs
  isFirstVisit: boolean;
}

const initialState: UserState = {
  preferences: {
    volume: 1,
    playbackRate: 1,
    autoplay: false,
    skipIntro: false,
    skipOutro: false,
    theme: "system",
  },
  uploadedPodcasts: [],
  isFirstVisit: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.preferences.volume = Math.max(0, Math.min(1, action.payload));
    },

    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.preferences.playbackRate = action.payload;
    },

    setAutoplay: (state, action: PayloadAction<boolean>) => {
      state.preferences.autoplay = action.payload;
    },

    setSkipIntro: (state, action: PayloadAction<boolean>) => {
      state.preferences.skipIntro = action.payload;
    },

    setSkipOutro: (state, action: PayloadAction<boolean>) => {
      state.preferences.skipOutro = action.payload;
    },

    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.preferences.theme = action.payload;
    },

    addUploadedPodcast: (state, action: PayloadAction<string>) => {
      if (!state.uploadedPodcasts.includes(action.payload)) {
        state.uploadedPodcasts.push(action.payload);
      }
    },

    removeUploadedPodcast: (state, action: PayloadAction<string>) => {
      state.uploadedPodcasts = state.uploadedPodcasts.filter(
        (id) => id !== action.payload
      );
    },

    setFirstVisit: (state, action: PayloadAction<boolean>) => {
      state.isFirstVisit = action.payload;
    },

    resetUserData: () => initialState,
  },
});

export const {
  setPreferences,
  setVolume,
  setPlaybackRate,
  setAutoplay,
  setSkipIntro,
  setSkipOutro,
  setTheme,
  addUploadedPodcast,
  removeUploadedPodcast,
  setFirstVisit,
  resetUserData,
} = userSlice.actions;

export default userSlice.reducer;
